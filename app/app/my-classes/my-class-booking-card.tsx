'use client'

import { useRouter } from 'next/navigation'
import { useState, type MouseEvent, type ReactNode } from 'react'
import { cancelMyClassBookingAction } from './actions'

type MyClassBookingCardProps = {
  bookingId: string
  children: ReactNode
  classId: string
}

export default function MyClassBookingCard({ bookingId, children, classId }: MyClassBookingCardProps) {
  const router = useRouter()
  const [hidden, setHidden] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  async function handleClick(event: MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement
    const button = target.closest<HTMLButtonElement>('[data-unbook-button]')

    if (!button || isPending) {
      return
    }

    setIsPending(true)
    button.disabled = true

    const result = await cancelMyClassBookingAction(bookingId, classId)

    if (result.ok) {
      setToast(result.message)
      setHidden(true)
      router.refresh()
      window.setTimeout(() => setToast(null), 2600)
    } else {
      setToast(result.message)
      setIsPending(false)
      button.disabled = false
      window.setTimeout(() => setToast(null), 2600)
    }
  }

  if (hidden) {
    return (
      <>
        <div className="myClassRemoved">Booking canceled.</div>
        {toast ? <div className="bookingToast">{toast}</div> : null}
      </>
    )
  }

  return (
    <div className={isPending ? 'myClassPending' : ''} onClick={handleClick}>
      {children}
      {toast ? <div className="bookingToast">{toast}</div> : null}
    </div>
  )
}
