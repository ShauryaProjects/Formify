"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import { Button } from "@/components/ui/button"

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image slides in from left
      gsap.from(imageRef.current, {
        opacity: 0,
        x: -100,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: imageRef.current,
          start: "top 75%",
        },
      })

      // Content slides in from right
      gsap.from(contentRef.current, {
        opacity: 0,
        x: 100,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 75%",
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-secondary px-6 py-24 md:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-10 md:gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Image */}
          <div ref={imageRef} className="relative overflow-hidden rounded-2xl">
            <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-primary/5">
              <Image
                src="https://res.cloudinary.com/ddf4mvmbe/image/upload/v1759263624/office_rm35pi.jpg"
                alt="About our company"
                width={800}
                height={600}
                className="h-full w-full object-cover grayscale transition-all duration-500 hover:grayscale-0"
              />
            </div>
          </div>

          {/* Content */}
          <div ref={contentRef} className="space-y-5 md:space-y-6">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
              Why Formify?
            </h2>
            <p className="text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              Formify helps you collect feedback, run surveys, and manage registrations with ease. Whether you&apos;re a
              business, educator, or creator, Formify gives you the tools to connect with your audience seamlessly.
            </p>
            <p className="text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              With years of expertise and a passion for innovation, we&apos;ve helped countless businesses transform
              their digital presence and achieve remarkable results.
            </p>
            <div className="pt-4">
              <Button
                variant="outline"
                size="lg"
                className="group h-11 rounded-xl border-2 border-primary bg-transparent px-6 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-lg md:h-12 md:px-8 md:text-base"
              >
                Learn more about us
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
        </div>
      </div>
    </section>
  )
}
