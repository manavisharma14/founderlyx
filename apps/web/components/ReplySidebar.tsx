"use client"

import { useState } from "react"
import { X } from "lucide-react"

export default function ReplySidebar({
  contact,
  children,
}: {
  contact: any
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* CARD */}
      <div onClick={() => setOpen(true)}>
        {children}
      </div>

      {/* SIDEBAR */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          {/* Background dim */}
          <div 
            className="flex-1 bg-black/40"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div className="w-96 bg-zinc-900 border-l border-zinc-800 p-6 text-white">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {contact.name}
              </h2>
              <button onClick={() => setOpen(false)}>
                <X className="h-5 w-5 text-zinc-400" />
              </button>
            </div>

            <p className="text-zinc-400 mt-1">{contact.email}</p>

            {/* Reply Detection */}
            {contact.status === "replied" && (
              <div className="mt-6 bg-green-900/20 border border-green-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-400">
                  Reply Detected 🎉
                </h3>

                <p className="text-sm text-zinc-300 mt-2">
                  This lead replied to your email.  
                  Open your inbox to continue the conversation.
                </p>

                <a
                  href={`mailto:${contact.sendingAddress || ""}`}
                  className="block text-center mt-4 bg-green-600 hover:bg-green-700 
                    text-white py-2 rounded-lg font-bold transition"
                >
                  
                  Open Inbox
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}