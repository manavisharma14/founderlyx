"use client";

import { useState } from "react";
import EmailThread from "./EmailThread";
import { MessageCircle, CheckCircle2, AlertCircle, XCircle, Clock } from "lucide-react";

const columns = [
  { id: "new", label: "New", icon: XCircle, color: "text-gray-400", pulse: false },
  { id: "ready", label: "Ready", icon: Clock, color: "text-blue-500", pulse: false },
  { id: "sending", label: "Sending", icon: MessageCircle, color: "text-purple-500", pulse: false },
  { id: "replied", label: "Replied", icon: CheckCircle2, color: "text-emerald-500", pulse: true },
  { id: "dead", label: "Dead", icon: XCircle, color: "text-red-500", pulse: false },
] as const;

type Contact = {
  id: string;
  name: string;
  email: string;
  status: string;
  sendingAddress: string | null;
  messages: Array<{
    id: string;
    text: string | null;
    direction: string
    createdAt: Date;
  }>;
};

export default function KanbanClient({ contacts }: { contacts: Contact[] }) {
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const selectedContact = contacts.find((c) => c.id === selectedContactId);

  return (
    <>
      {/* KANBAN COLUMNS */}
      <div className="flex gap-8 overflow-x-auto pb-8">
        {columns.map(({ id, label, icon: Icon, color, pulse }) => {
          const items = contacts.filter((c) => c.status === id);

          return (
            <div key={id} className="flex-shrink-0 w-80">
              {/* COLUMN HEADER */}
              <div className="flex items-center gap-3 mb-6">
                <Icon className={`w-6 h-6 ${color} ${pulse ? "animate-pulse" : ""}`} />
                <h2 className="text-lg font-semibold text-gray-900">
                  {label} <span className="text-gray-500 font-normal">({items.length})</span>
                </h2>
              </div>

              {/* CARDS */}
              <div className="space-y-4">
                {items.map((c) => {
                  const latestReply = c.messages?.[c.messages.length - 1];

                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedContactId(c.id)}
                      className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-gray-300 transition-all cursor-pointer group"
                    >
                      {/* Name + Email */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900 text-lg">{c.name}</p>
                          <p className="text-sm text-gray-500">{c.email}</p>
                        </div>
                        {c.status === "replied" && (
                          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                        )}
                      </div>

                      {/* Latest reply preview */}
                      {c.status === "replied" && latestReply && (
                        <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                          <p className="text-xs font-medium text-emerald-700 mb-1">Latest reply</p>
                          <p className="text-sm text-gray-700 italic">
                            "{latestReply.text?.slice(0, 90) || "No text"}..."
                          </p>
                        </div>
                      )}

                      {/* Subtle hover indicator */}
                      <div className="mt-4 pt-4 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition">
                        <p className="text-xs text-gray-500">Click to open thread</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* EMAIL THREAD MODAL */}
      {selectedContact && (
        <EmailThread
          contactId={selectedContact.id}
          contactEmail={selectedContact.email}
          sendingAddress={selectedContact.sendingAddress || ""}
          onClose={() => setSelectedContactId(null)}
        />
      )}
    </>
  );
}