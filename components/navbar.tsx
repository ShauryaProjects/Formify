"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Only animate on desktop to prevent mobile layout issues
      if (window.innerWidth >= 768) {
        gsap.from(navRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.8,
          ease: "power3.out",
        })
      }
    }, navRef)

    return () => ctx.revert()
  }, [])

  return (
    <nav ref={navRef} className="fixed left-0 right-0 top-0 z-50 bg-primary/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="flex items-center justify-between py-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary-foreground" />
            <span className="text-xl font-bold tracking-tight text-primary-foreground">Formify</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 text-sm font-medium text-primary-foreground md:flex md:gap-8">
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

          {/* Mobile menu button */}
          <button
            aria-label="Toggle menu"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Panel */}
        {mobileOpen && (
          <div className="md:hidden overflow-hidden">
            <div className="flex flex-col gap-4 border-t border-primary-foreground/10 py-4">
              <a href="#" className="px-1 py-2 text-primary-foreground/90 hover:text-primary-foreground">
                Home
              </a>
              <a href="#" className="px-1 py-2 text-primary-foreground/90 hover:text-primary-foreground">
                About
              </a>
              <a href="#" className="px-1 py-2 text-primary-foreground/90 hover:text-primary-foreground">
                Contact
              </a>
              <Link href="/builder" className="pt-2">
                <Button className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                  Create Form
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
