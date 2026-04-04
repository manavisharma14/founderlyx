"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Copy, CheckCircle, Loader2 } from "lucide-react"
import { toast } from "react-hot-toast"

type DNSRecord = {
  type: string
  name: string
  value: string
  status?: "pending" | "verified"
}

export default function DomainSetup() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const [result, setResult] = useState<{
    domain: string
    email: string
    dns: DNSRecord[]
    spf: boolean
    dkim1: boolean
  } | null>(null)

  const [copied, setCopied] = useState("")
  const [polling, setPolling] = useState(false)
  const [verified, setVerified] = useState(false)

  // LOAD EXISTING DOMAIN STATE
  useEffect(() => {
    async function loadExisting() {
      try {
        const res = await fetch("/api/domain/check-verification")
        const data = await res.json()

        if (!data.domain || !data.email) {
          setResult(null)
          setPolling(false)
          setVerified(false)
          return
        }

        setResult({
          domain: data.domain,
          email: data.email,
          dns: data.dns || [],
          spf: data.spf,
          dkim1: data.dkim1,
        })

        setVerified(data.verified === true)
        setPolling(data.verified !== true)
      } catch (err) {
        console.error("Failed loading domain:", err)
      }
    }

    loadExisting()
  }, [])

  //  POLLING ONLY WHEN VERIFYING
  useEffect(() => {
    if (!polling || !result?.domain) return

    const interval = setInterval(async () => {
      try {
        const r = await fetch("/api/domain/check-verification")
        const data = await r.json()

        setResult({
          domain: data.domain,
          email: data.email,
          dns: data.dns || [],
          spf: data.spf,
          dkim1: data.dkim1,
        })

        if (data.verified === true) {
          setVerified(true)
          setPolling(false)
          toast.success("Domain verified!")
          clearInterval(interval)
        }
      } catch (err) {
        console.error("Polling failed:", err)
      }
    }, 15000)

    return () => clearInterval(interval)
  }, [polling, result])

  // SUBMIT EMAIL FOR DOMAIN CREATION
  const handleSubmit = async () => {
    if (!email.trim()) {
      toast.error("Enter a valid email")
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const res = await fetch("/api/domain/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Verification failed")
        return
      }

      setResult({
        domain: data.domain,
        email: data.email,
        dns: data.dns || [],
        spf: false,
        dkim1: false,
      })

      setVerified(false)
      setPolling(true)
      toast.success("Domain created. Add DNS records.")

    } catch (err) {
      console.error(err)
      toast.error("Network error")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(""), 2000)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-12">

      {/*  HEADER */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Connect Your Sending Domain
        </h1>
        <p className="text-gray-600">
          This protects your reputation and ensures inbox delivery.
        </p>
      </div>

      {/*  STEP INDICATOR */}
      <div className="flex justify-center gap-8 mb-12 text-sm font-medium">
        <span className={result ? "text-green-600" : "text-gray-400"}>✓ Enter Email</span>
        <span className={result ? "text-green-600" : "text-gray-400"}>✓ Add DNS</span>
        {result && (
          <span className={verified ? "text-green-600" : "text-yellow-500"}>
            {verified ? "✓ Verified" : "● Verifying"}
          </span>
        )}
        <span className={verified ? "text-green-600" : "text-gray-400"}>
          Ready to Send
        </span>
      </div>

      {/* INPUT */}
      {!result && (
        <Card className="p-6 max-w-xl mx-auto">
          <div className="flex gap-4">
            <Input
              placeholder="founder@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Checking..." : "Verify"}
            </Button>
          </div>
        </Card>
      )}

      {/* VERIFICATION VIEW */}
      {result && (
        <div className="mt-16 space-y-10">

          {/* STATUS ICON */}
          <div className="text-center">
            {verified ? (
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
            ) : (
              <Loader2 className="h-16 w-16 text-yellow-500 animate-spin mx-auto" />
            )}

            <h2 className="text-2xl font-semibold mt-4">
              {verified ? "Domain Verified" : "Waiting for DNS"}
            </h2>
          </div>

          {/* DOMAIN SUMMARY */}
          <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto text-sm">
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="text-gray-500 mb-1">Domain</div>
              <div className="font-medium">{result.domain}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="text-gray-500 mb-1">Sending Address</div>
              <div className="font-medium">{result.email}</div>
            </div>
          </div>

          {/* AUTH STATUS GRID */}
          <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto text-sm">
            <AuthRow label="SPF" value={result.spf} />
            <AuthRow label="DKIM" value={result.dkim1} />
          </div>

          {/* DNS RECORDS */}
          {!verified && result.dns.length > 0 && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <h3 className="text-lg font-semibold text-center mb-6">
                Add These DNS Records
              </h3>

              {result.dns.map((record, i) => (
                <Card key={i} className="p-5 flex justify-between items-center">
                  <div className="text-sm">
                    <div className="text-gray-500 mb-1">{record.type}</div>
                    <div className="font-mono break-all">{record.name}</div>
                  </div>

                  <div className="flex items-center gap-3 max-w-md">
                    <div className="font-mono text-sm break-all text-right">
                      {record.value}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(record.value, `dns${i}`)}
                    >
                      {copied === `dns${i}` ? "Copied" : <Copy size={16} />}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* CTA */}
          {verified && (
            <div className="text-center pt-6">
              <Button size="lg" className="px-12">
                Start Sending Campaigns
              </Button>
            </div>
          )}

        </div>
      )}
    </div>
  )
}

/*  AUTH STATUS ROW */
function AuthRow({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="flex justify-between border p-3 rounded-lg bg-gray-50">
      <span>{label}</span>
      <span>{value ? "✅ Verified" : "❌ Missing"}</span>
    </div>
  )
}