'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import type { MouseEvent } from 'react'

type AnimatedBackLinkProps = {
  href: string
}

export default function AnimatedBackLink({ href }: AnimatedBackLinkProps) {
  const router = useRouter()

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return
    }

    event.preventDefault()
    document.documentElement.classList.add('detailLeaving')
    window.setTimeout(() => {
      router.push(href)
      document.documentElement.classList.remove('detailLeaving')
    }, 180)
  }

  return (
    <Link className="topBackLink" href={href} onClick={handleClick} aria-label="Back to schedule">
      <ChevronLeft size={28} strokeWidth={2.2} />
      Back
    </Link>
  )
}
