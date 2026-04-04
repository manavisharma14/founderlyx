"use client"

import { useState } from "react"
import EmailThread from "./EmailThread"

export default function ContactsTable({ contacts = [] }: { contacts?: any[] }) {
  const [openContact, setOpenContact] = useState<any | null>(null)

  return (
    <>
      {/* TABLE */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="font-semibold mb-4">Recent Contacts</h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 border-b text-left">
              <th className="p-2">Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Last Activity</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {contacts.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-400">
                  No contacts yet
                </td>
              </tr>
            ) : (
              contacts.map((c: any) => (
                <tr
                  key={c.id}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                  onClick={() => setOpenContact(c)}
                >
                  <td className="p-4 font-medium">{c.name}</td>
                  <td className="p-4">{c.email}</td>

                  {/* STATUS */}
                  <td className="p-4">
                    {c.status === "replied" ? (
                      <span className="text-green-600 font-semibold">
                        ✅ Replied
                      </span>
                    ) : c.status === "sending" ? (
                      <span className="text-yellow-600 font-semibold">
                        🟡 Sending
                      </span>
                    ) : (
                      <span className="text-gray-500 capitalize">{c.status}</span>
                    )}
                  </td>

                  {/* LAST ACTIVITY */}
                  <td className="p-4 text-gray-600">
                    {c.repliedAt
                      ? `Replied ${new Date(c.repliedAt).toLocaleDateString()}`
                      : c.sentAt
                      ? `Last sent ${new Date(c.sentAt).toLocaleDateString()}`
                      : "No activity"}
                  </td>

                  {/* VIEW THREAD */}
                  <td className="p-4 text-blue-600 underline">
                    View
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* THREAD MODAL */}
      {openContact && (
        <EmailThread
          contactId={openContact.id}
          contactEmail={openContact.email}
          sendingAddress={openContact.user?.sendingEmail}
          onClose={() => setOpenContact(null)}
        />
      )}
    </>
  )
}