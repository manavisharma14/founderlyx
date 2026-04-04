"use client";
import { useEffect, useState } from 'react';
import { X, Send } from 'lucide-react';

interface Message {
  id: string;
  direction: 'inbound' | 'outbound';
  from: string;
  to: string;
  subject: string;
  text: string | null;
  html: string | null;
  createdAt: string;
}

export default function EmailThread({ 
  contactId, 
  onClose,
  contactEmail,
  sendingAddress
}: { 
  contactId: string; 
  onClose: () => void;
  contactEmail: string;
  sendingAddress: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch(`/api/messages/${contactId}`);
      const data = await res.json();
      setMessages(data);
      setLoading(false);
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 8000);
    return () => clearInterval(interval);
  }, [contactId]);

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    
    setSending(true);
    await fetch('/api/send-reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contactId,
        text: replyText,
        sendingAddress,
        to: contactEmail,
      }),
    });

    setReplyText('');
    setSending(false);

    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        direction: 'outbound',
        from: sendingAddress,
        to: contactEmail,
        subject: messages[0]?.subject || 'Re: your email',
        text: replyText,
        html: replyText.replace(/\n/g, '<br>'),
        createdAt: new Date().toISOString(),
      }
    ]);
  };

  if (loading) return (
    <div className="p-8 text-center text-gray-700">Loading thread...</div>
  );

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex">
      <div className="bg-white w-full max-w-2xl ml-auto h-full overflow-y-auto relative flex flex-col border-l border-gray-200">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-semibold text-gray-900">Email Thread</h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 space-y-8 overflow-y-auto">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-lg rounded-2xl px-6 py-4 shadow-sm border ${
                  msg.direction === 'outbound'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-gray-100 text-gray-900 border-gray-200'
                }`}
              >
                <p className="text-xs opacity-70 mb-2">{msg.from}</p>

                {msg.html ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: msg.html }}
                    className="prose prose-sm"
                  />
                ) : (
                  <p className="whitespace-pre-wrap text-sm">
                    {msg.text || "(No content)"}
                  </p>
                )}

                <p className={`text-xs mt-3 opacity-60`}>
                  {new Date(msg.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Reply Box */}
        <div className="border-t border-gray-200 p-6 bg-white">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your reply..."
            className="w-full bg-gray-100 text-gray-900 p-4 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200"
            rows={4}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.metaKey) {
                handleSendReply();
              }
            }}
          />
          <div className="flex justify-between items-center mt-3">
            <p className="text-xs text-gray-500">⌘ + Enter to send</p>
            <button
              onClick={handleSendReply}
              disabled={sending || !replyText.trim()}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition font-medium text-white"
            >
              {sending ? "Sending..." : "Send Reply"}
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}