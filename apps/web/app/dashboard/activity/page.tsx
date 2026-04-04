import ActivityLog from "@/components/ActivityLog"

export default function ActivityPage() {
  return (
    <div className="max-w-5xl mx-auto px-10 py-16">
      <h1 className="text-4xl font-bold mb-8">Activity</h1>
      <ActivityLog logs={[]} />
    </div>
  )
}