import { Activity } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t bg-slate-50">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold tracking-tight">Krish&apos;s Hospital</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Connecting patients with the best healthcare professionals. Easy, fast, and reliable doctor appointments at your fingertips.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/doctors" className="hover:text-primary transition-colors">Find Doctors</Link></li>
              <li><Link href="/admin/login" className="hover:text-primary transition-colors">Admin Portal</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Mohammadpur</li>
              <li>Rewari, Haryana 123501</li>
              <li>support@krishhospital.com</li>
              <li>+91 7206363959</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Krish&apos;s Hospital. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
