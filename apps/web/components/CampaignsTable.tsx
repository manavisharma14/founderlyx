export default function CampaignsTable({ campaigns = [] }: { campaigns?: any[] }) {
  return (
    <div className="bg-white border rounded-xl p-6">
      <h2 className="font-semibold mb-4">Campaigns</h2>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="p-3">Name</th>
            <th>Leads</th>
            <th>Sent</th>
            <th>Replies</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {campaigns.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center text-gray-400 p-6">
                No campaigns yet
              </td>
            </tr>
          )}

          {campaigns.map((c: any) => (
            <tr key={c.id} className="border-t text-center">
              <td className="p-4 text-left font-medium">{c.name}</td>
              <td>{c.leads}</td>
              <td>{c.sent}</td>
              <td>{c.replies}</td>
              <td>{c.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}