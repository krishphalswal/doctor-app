import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Activity } from 'lucide-react'

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">Krish&apos;s Hospital</span>
          </Link>
          <nav className="ml-6 hidden items-center gap-6 md:flex">
            <Link href="/doctors" className="text-sm font-medium transition-colors hover:text-primary">
              Find Doctors
            </Link>
            <Link href="/appointments/status" className="text-sm font-medium transition-colors hover:text-primary">
              Check Status
            </Link>
            <Link href="/#about" className="text-sm font-medium transition-colors hover:text-primary">
              About
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/admin/login">
            <Button variant="ghost" size="sm">Admin Login</Button>
          </Link>
          <Link href="/doctors">
            <Button size="sm">Book Now</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
