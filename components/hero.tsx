"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subheadingRef = useRef<HTMLParagraphElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.from(headingRef.current, {
        opacity: 0,
        y: 60,
        duration: 1,
        delay: 0.3,
        ease: "power3.out",
      })

      // Subheading animation
      gsap.from(subheadingRef.current, {
        opacity: 0,
        y: 40,
        duration: 1,
        delay: 0.5,
        ease: "power3.out",
      })

      // Button animation with scale
      gsap.from(buttonRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        delay: 0.7,
        ease: "back.out(1.7)",
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={heroRef} className="relative flex min-h-screen flex-col bg-primary text-primary-foreground">
      {/* Hero Content */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h1
          ref={headingRef}
          className="max-w-5xl text-balance font-sans text-5xl font-bold leading-[1.1] tracking-tight md:text-7xl lg:text-8xl"
        >
          Create Forms. Share Links. Collect Responses.
        </h1>
        <p
          ref={subheadingRef}
          className="mt-8 max-w-2xl text-pretty text-xl leading-relaxed text-primary-foreground/70 md:text-2xl"
        >
          Build beautiful forms in minutes. Share them instantly and track responses effortlessly — all in one place.
        </p>
        <div ref={buttonRef} className="mt-12">
          <Button
            size="lg"
            className="group h-14 rounded-2xl bg-primary-foreground px-10 text-lg font-semibold text-primary transition-all hover:scale-105 hover:shadow-2xl"
          >
            Start Building Now
            <svg
              className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="h-6 w-6 text-primary-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
