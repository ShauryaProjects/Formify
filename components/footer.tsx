"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!footerRef.current) return
      gsap.fromTo(
        footerRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
            once: true,
          },
        },
      )
    }, footerRef)

    return () => ctx.revert()
  }, [])

  return (
    <footer ref={footerRef} className="bg-primary px-6 py-8 text-primary-foreground md:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-4 sm:gap-6 md:flex-row">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary-foreground" />
            <span className="text-xl font-bold tracking-tight">Formify</span>
          </div>

          {/* Copyright */}
          <p className="text-xs text-primary-foreground/60 sm:text-sm">© 2025 Formify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
