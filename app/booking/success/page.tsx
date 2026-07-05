"use client"

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Calendar, ArrowRight, ClipboardCheck, Search, Phone } from 'lucide-react'
import { toast } from 'sonner'
import { Suspense } from 'react'

function BookingSuccessInner() {
  const searchParams = useSearchParams()
  const phone = searchParams.get('phone')
  const email = searchParams.get('email')

  const copyToClipboard = () => {
    if (phone) {
      navigator.clipboard.writeText(phone)
      toast.success("Phone number copied to clipboard")
    }
  }

  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] py-12 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-8">
        <CheckCircle2 className="h-10 w-10 text-green-600" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight mb-4">Booking Confirmed!</h1>
      <p className="text-muted-foreground text-lg max-w-md mb-8">
        Your appointment has been successfully scheduled. You can use your phone number to check your status later.
      </p>

      {phone && (
        <div className="bg-slate-50 border rounded-xl p-6 mb-12 w-full max-w-md flex flex-col items-center gap-3">
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Your Tracking ID (Phone)</div>
          <div className="text-2xl font-mono font-bold text-primary break-all">{phone}</div>
          <Button variant="ghost" size="sm" onClick={copyToClipboard} className="gap-2">
            <ClipboardCheck className="h-4 w-4" /> Copy Number
          </Button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
        <div className="flex flex-col items-center p-6 rounded-xl border bg-slate-50">
          <Search className="h-6 w-6 text-primary mb-3" />
          <h3 className="font-semibold mb-1">Check Status</h3>
          <p className="text-xs text-muted-foreground text-center mb-4">Track if your appointment is accepted or rejected anytime.</p>
          <Link href={`/appointments/status?phone=${phone}&email=${email}`}>
            <Button size="sm" variant="secondary" className="gap-2">
              <Search className="h-4 w-4" /> Check Now
            </Button>
          </Link>
        </div>
        <div className="flex flex-col items-center p-6 rounded-xl border bg-slate-50">
          <Phone className="h-6 w-6 text-primary mb-3" />
          <h3 className="font-semibold mb-1">Stay Notified</h3>
          <p className="text-xs text-muted-foreground text-center">We'll reach out to you at {phone} once the doctor reviews your request.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-12">
        <Link href="/doctors">
          <Button variant="outline">Book Another</Button>
        </Link>
        <Link href="/">
          <Button className="gap-2">
            Back to Home <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={<div className="container flex items-center justify-center min-h-[50vh]">Loading...</div>}>
      <BookingSuccessInner />
    </Suspense>
  )
}
