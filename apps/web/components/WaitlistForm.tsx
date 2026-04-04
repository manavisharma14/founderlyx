"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter an email.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("You're in! We'll email you on launch.");
        setEmail("");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-10"
    >
      <Input
        type="email"
        placeholder="you@startup.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
        className="h-12 w-72 text-base"
      />

      <Button
        type="submit"
        disabled={loading}
        className="h-12 px-8 text-white text-base flex items-center gap-2"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? "Submitting..." : "Get Early Access"}
      </Button>
    </form>
  );
}