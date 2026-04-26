'use client'

import { useRouter } from 'next/navigation'
import type { CSSProperties, MouseEvent, ReactNode } from 'react'

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => { finished: Promise<void> }
}

type ClassDetailLinkProps = {
  children: ReactNode
  classId: string
  className?: string
  href: string
}

export default function ClassDetailLink({ children, classId, className, href }: ClassDetailLinkProps) {
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
    const transitionDocument = document as ViewTransitionDocument

    if (!transitionDocument.startViewTransition) {
      router.push(href)
      return
    }

    document.documentElement.classList.add('detailTransitionActive')
    const transition = transitionDocument.startViewTransition(() => {
      router.push(href)
    })

    transition.finished.finally(() => {
      document.documentElement.classList.remove('detailTransitionActive')
    })
  }

  return (
    <a
      className={className}
      href={href}
      onClick={handleClick}
      style={{ viewTransitionName: `class-card-${classId}` } as CSSProperties}
    >
      {children}
    </a>
  )
}
