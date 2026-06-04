import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Calendar, ArrowRight } from 'lucide-react'

export default function BookingSuccessPage() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] py-12 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-8">
        <CheckCircle2 className="h-10 w-10 text-green-600" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight mb-4">Booking Confirmed!</h1>
      <p className="text-muted-foreground text-lg max-w-md mb-12">
        Your appointment has been successfully scheduled. We've sent a confirmation email with all the details to your inbox.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
        <div className="flex flex-col items-center p-6 rounded-xl border bg-slate-50">
          <Calendar className="h-6 w-6 text-primary mb-3" />
          <h3 className="font-semibold mb-1">Stay Notified</h3>
          <p className="text-xs text-muted-foreground text-center">We'll send you a reminder 24 hours before your appointment.</p>
        </div>
        <div className="flex flex-col items-center p-6 rounded-xl border bg-slate-50">
          <CheckCircle2 className="h-6 w-6 text-primary mb-3" />
          <h3 className="font-semibold mb-1">Easy Cancel</h3>
          <p className="text-xs text-muted-foreground text-center">Need to reschedule? You can cancel up to 12 hours before.</p>
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
