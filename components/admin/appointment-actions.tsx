"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2, XCircle, CheckCircle } from "lucide-react"

interface AppointmentActionsProps {
  appointmentId: string
  currentStatus: string
}

export function AppointmentActions({ appointmentId, currentStatus }: AppointmentActionsProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const router = useRouter()

  const updateStatus = async (status: string) => {
    setIsLoading(status)
    try {
      const response = await fetch("/api/admin/appointments", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: appointmentId,
          status,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update status")
      }

      toast.success(`Appointment ${status.toLowerCase()}ed`)
      router.refresh()
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(null)
    }
  }

  if (currentStatus === "Cancelled") {
    return <span className="text-xs text-muted-foreground italic">Cancelled</span>
  }

  return (
    <div className="flex items-center gap-2">
      {currentStatus === "Pending" && (
        <Button 
          size="sm" 
          variant="outline" 
          className="h-8 text-xs gap-1 border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700"
          onClick={() => updateStatus("Confirmed")}
          disabled={!!isLoading}
        >
          {isLoading === "Confirmed" ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <CheckCircle className="h-3 w-3" />
          )}
          Confirm
        </Button>
      )}
      <Button 
        size="sm" 
        variant="outline" 
        className="h-8 text-xs gap-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
        onClick={() => updateStatus("Cancelled")}
        disabled={!!isLoading}
      >
        {isLoading === "Cancelled" ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <XCircle className="h-3 w-3" />
        )}
        Cancel
      </Button>
    </div>
  )
}
