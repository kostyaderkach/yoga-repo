'use client'

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { UsersRound } from 'lucide-react'
import { setClassBookingAction } from './actions'

type Participant = {
  id: string
  initials: string
  isCurrentUser?: boolean
  label: string
}

type BookingState = {
  booked: boolean
  bookedCount: number
  isPending: boolean
  participants: Participant[]
  toggleBooking: () => Promise<void>
}

const BookingContext = createContext<BookingState | null>(null)

type BookingStateProviderProps = {
  children: ReactNode
  classId: string
  initialBooked: boolean
  initialBookedCount: number
  initialParticipants?: Participant[]
}

function getInitials(label: string) {
  return label
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function BookingStateProvider({
  children,
  classId,
  initialBooked,
  initialBookedCount,
  initialParticipants = [],
}: BookingStateProviderProps) {
  const [booked, setBooked] = useState(initialBooked)
  const [bookedCount, setBookedCount] = useState(initialBookedCount)
  const [participants, setParticipants] = useState(initialParticipants)
  const [isPending, setIsPending] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  async function toggleBooking() {
    if (isPending) {
      return
    }

    const nextBooked = !booked
    const previousBooked = booked
    const previousCount = bookedCount
    const previousParticipants = participants

    setBooked(nextBooked)
    setBookedCount((count) => Math.max(0, count + (nextBooked ? 1 : -1)))
    setParticipants((current) => {
      if (nextBooked) {
        return current.some((participant) => participant.isCurrentUser)
          ? current
          : [{ id: 'current-user', initials: getInitials('You'), isCurrentUser: true, label: 'You' }, ...current]
      }

      return current.filter((participant) => !participant.isCurrentUser)
    })
    setIsPending(true)

    const result = await setClassBookingAction(classId, nextBooked)

    if (result.ok) {
      setBooked(result.booked)
      setBookedCount(result.bookedCount)
      setParticipants((current) => {
        if (result.booked) {
          return current.some((participant) => participant.isCurrentUser)
            ? current.map((participant) =>
                participant.isCurrentUser ? { ...participant, id: result.bookingId ?? participant.id } : participant,
              )
            : [{ id: result.bookingId ?? 'current-user', initials: getInitials('You'), isCurrentUser: true, label: 'You' }, ...current]
        }

        return current.filter((participant) => !participant.isCurrentUser)
      })
    } else {
      setBooked(previousBooked)
      setBookedCount(previousCount)
      setParticipants(previousParticipants)
    }

    setToast(result.message)
    setIsPending(false)
    window.setTimeout(() => setToast(null), 2600)
  }

  const value = useMemo(
    () => ({ booked, bookedCount, isPending, participants, toggleBooking }),
    [booked, bookedCount, isPending, participants],
  )

  return (
    <BookingContext.Provider value={value}>
      {children}
      {toast ? <div className="bookingToast">{toast}</div> : null}
    </BookingContext.Provider>
  )
}

function useBookingState() {
  const value = useContext(BookingContext)

  if (!value) {
    throw new Error('Booking components must be used inside BookingStateProvider')
  }

  return value
}

export function BookingCount({ iconSize = 13 }: { iconSize?: number }) {
  const { bookedCount } = useBookingState()

  return (
    <span>
      <UsersRound size={iconSize} /> {bookedCount} booked
    </span>
  )
}

export function BookingActionButton({ variant = 'card' }: { variant?: 'card' | 'detail' }) {
  const { booked, isPending, toggleBooking } = useBookingState()
  const className = variant === 'detail'
    ? booked ? 'detailSecondaryButton' : 'detailPrimaryButton'
    : booked ? 'softClassButton' : 'bookClassButton'

  return (
    <button className={className} disabled={isPending} onClick={toggleBooking} type="button">
      {isPending ? <span className="buttonSpinner" aria-label="Saving" /> : booked ? (variant === 'detail' ? 'Unbook practice' : 'Unbook') : (variant === 'detail' ? 'Book practice' : 'Book')}
    </button>
  )
}

export function BookingParticipants() {
  const { participants } = useBookingState()

  if (!participants.length) {
    return <p className="detailMuted">No students booked yet.</p>
  }

  return (
    <div className="participantList">
      {participants.map((participant) => (
        <div className="participantRow" key={participant.id}>
          <span>{participant.initials}</span>
          <strong>{participant.label}</strong>
        </div>
      ))}
    </div>
  )
}
