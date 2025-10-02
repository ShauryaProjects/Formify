"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import Navbar from "@/components/navbar"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const shapes = gsap.utils.toArray<HTMLElement>(".auth-shape")
      shapes.forEach((el, i) => {
        const floatY = 8 + (i % 3) * 4
        const floatX = 6 + ((i + 1) % 3) * 3
        const dur = 8 + (i % 4)
        const rot = (i % 2 === 0 ? 1 : -1) * (2 + i)
        gsap.to(el, {
          y: `+=${floatY}`,
          x: `+=${floatX}`,
          rotation: rot,
          duration: dur,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        })
        gsap.to(el, {
          scale: 1.03,
          duration: dur + 2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 0.3 * i,
        })
      })
    }, pageRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={pageRef} className="relative min-h-screen bg-gradient-to-br from-white to-neutral-100 text-black">
      <Navbar />
      <div aria-hidden className="h-16 md:h-20" />
      {/* Animated background shapes (persistent within auth layout) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="auth-shape absolute left-1/2 top-16 h-40 w-[120%] -translate-x-1/2 rounded-[100px] rotate-[-6deg] bg-gradient-to-r from-black/10 to-transparent opacity-70" />
        <div className="auth-shape absolute -left-8 top-28 h-44 w-44 rounded-full border border-black/20 bg-black/10 opacity-80 blur-[1px] sm:h-52 sm:w-52" />
        <div className="auth-shape absolute right-6 top-64 h-28 w-28 rotate-12 rounded-2xl border border-black/20 bg-white/70 opacity-80 backdrop-blur-sm sm:h-36 sm:w-36" />
        <div className="auth-shape absolute -right-20 bottom-20 hidden h-64 w-64 rounded-full border border-black/20 bg-black/5 opacity-80 sm:block" />
        <div
          className="auth-shape absolute left-1/2 top-1/2 hidden h-20 w-[140%] -translate-x-1/2 -rotate-3 opacity-60 sm:block"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(0,0,0,0.08) 0, rgba(0,0,0,0.08) 2px, transparent 2px, transparent 10px)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] w-full max-w-md items-center justify-center px-6 py-12">
        {children}
      </div>
    </div>
  )
}


