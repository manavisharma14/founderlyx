// components/ActivityLog.tsx
type ActivityLogProps = {
    logs: string[]
  }
  
  export default function ActivityLog({ logs }: ActivityLogProps) {
    return (
      <div className="bg-white border rounded-xl p-6">
        <h2 className="font-semibold mb-4">Activity</h2>
        <ul className="space-y-3 text-sm">
          {logs.map((log, i) => (
            <li key={i} className="text-gray-600">
              {log}
            </li>
          ))}
        </ul>
      </div>
    )
  }