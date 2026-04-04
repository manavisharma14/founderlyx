"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Send, Users, Globe, BarChart2, FlameKindling } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"  // Add this if not already (Tailwind cn helper)

const nav = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Campaigns", href: "/dashboard/campaigns", icon: Send },
  { name: "Contacts", href: "/dashboard/contacts", icon: Users },
  { name: "Domain", href: "/dashboard/domain", icon: Globe },
  { name: "Warm Up", href: "/dashboard/warmup", icon: FlameKindling },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)  // For mobile toggle

  return (
    <>
      {/* Mobile toggle button */}
      <Button 
        variant="ghost" 
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        Menu
      </Button>

      <aside 
        className={cn(
          "fixed md:relative w-64 h-screen md:h-auto bg-white px-6 py-8 border-r border-gray-200 overflow-y-auto transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <h1 className="text-xl font-bold mb-10 text-gray-900">Klaro</h1>

        <nav className="space-y-1">
          {nav.map(item => (
            <Link 
              key={item.name} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors",
                pathname === item.href && "bg-gray-100 text-amber-600"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Bottom section for user */}
        <div className="absolute bottom-8 left-6 right-6 border-t pt-6 text-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200" /> {/* User avatar */}
            <div>
              <p className="text-sm font-medium">Your Name</p>
              <p className="text-xs text-gray-500">Logout</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}