export default function TopStatusBar({
    domainVerified,
    sendingEnabled,
    sentToday,
  }: {
    domainVerified: boolean
    sendingEnabled: boolean
    sentToday: number
  }) {
    return (
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="bg-white border rounded-xl p-5">
          <p className="text-sm text-gray-500">Domain</p>
          <p className="font-semibold text-lg">
            {domainVerified ? "Verified ✅" : "Not Verified"}
          </p>
        </div>
  
        <div className="bg-white border rounded-xl p-5">
          <p className="text-sm text-gray-500">Sending</p>
          <p className="font-semibold text-lg">
            {sendingEnabled ? "Enabled ✅" : "Disabled"}
          </p>
        </div>
  
        <div className="bg-white border rounded-xl p-5">
          <p className="text-sm text-gray-500">Sent Today</p>
          <p className="font-semibold text-lg">{sentToday}</p>
        </div>
      </div>
    )
  }