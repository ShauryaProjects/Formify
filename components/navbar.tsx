"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.8,
        ease: "power3.out",
      })
    }, navRef)

    return () => ctx.revert()
  }, [])

  return (
    <nav ref={navRef} className="fixed left-0 right-0 top-0 z-50 bg-primary/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-12">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary-foreground" />
          <span className="text-xl font-bold tracking-tight text-primary-foreground">Formify</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6 text-sm font-medium text-primary-foreground md:gap-8">
          <a href="#" className="transition-colors hover:text-primary-foreground/70">
            Home
          </a>
          <a href="#" className="transition-colors hover:text-primary-foreground/70">
            About
          </a>
          <a href="#" className="transition-colors hover:text-primary-foreground/70">
            Contact
          </a>
          <Link href="/builder">
            <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 transition-all duration-300 hover:scale-105">
              Create Form
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
