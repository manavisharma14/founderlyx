"use client"

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { signIn, signOut, useSession } from 'next-auth/react'

export default function Navbar(){

  const { data : session } = useSession();
  const name = session?.user?.name;
  const image = session?.user?.image ?? "/default-avatar.png";

  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link 
          href="/" 
          className="text-2xl font-bold text-gray-900 hover:opacity-80 transition"
        >
          klaro
        </Link>

        {/* Right side */}
        {
          session ? (
            <div className="flex items-center gap-4">
              <Image 
                src={image} 
                alt="userimage" 
                height={40} 
                width={40} 
                className="rounded-full border border-gray-200"
              />

              <span className="text-gray-700">{name}</span>

              <Button className="bg-gray-900 text-white hover:bg-gray-800">
                <Link href="/dashboard">Dashboard</Link>
              </Button>

              <Button variant="outline" onClick={() => signOut()}>
                Sign Out
              </Button>
            </div>
          ) : (
            <Button className="bg-gray-900 text-white hover:bg-gray-800" onClick={() => signIn()}>
              Sign In
            </Button>
          )
        }
      </div>
    </nav>
  );
}