import Sidebar from "@/components/Sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 px-10 py-8">{children}</main>
    </div>
  )
}
