'use client'

import { useState, type MouseEvent, type ReactNode } from 'react'
import { setClassBookingAction } from '../schedule/actions'

type MyClassBookingCardProps = {
  children: ReactNode
  classId: string
}

export default function MyClassBookingCard({ children, classId }: MyClassBookingCardProps) {
  const [hidden, setHidden] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  async function handleClick(event: MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement
    const button = target.closest('[data-unbook-button]')

    if (!button || isPending) {
      return
    }

    setIsPending(true)
    if (button instanceof HTMLButtonElement) {
      button.disabled = true
    }

    const result = await setClassBookingAction(classId, false)

    if (result.ok) {
      setHidden(true)
    } else {
      setToast(result.message)
      setIsPending(false)
      if (button instanceof HTMLButtonElement) {
        button.disabled = false
      }
      window.setTimeout(() => setToast(null), 2600)
    }
  }

  if (hidden) {
    return <div className="myClassRemoved">Booking canceled.</div>
  }

  return (
    <div className={isPending ? 'myClassPending' : ''} onClick={handleClick}>
      {children}
      {toast ? <div className="bookingToast">{toast}</div> : null}
    </div>
  )
}
