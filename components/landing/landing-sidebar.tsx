"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Info, Award, Tag, MessageSquareQuote } from "lucide-react"

export function LandingSidebar() {
  const [activeSection, setActiveSection] = useState<string>("hero")

  // Funcție pentru a determina secțiunea activă în funcție de scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["about", "benefits", "pricing", "testimonials"]

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section)
            break
          }
        }
      }

      // Dacă suntem la începutul paginii, setăm hero ca activ
      if (window.scrollY < 100) {
        setActiveSection("hero")
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    {
      id: "about",
      label: "Despre noi",
      icon: Info,
    },
    {
      id: "benefits",
      label: "Beneficii",
      icon: Award,
    },
    {
      id: "pricing",
      label: "Prețuri",
      icon: Tag,
    },
    {
      id: "testimonials",
      label: "Testimoniale",
      icon: MessageSquareQuote,
    },
  ]

  return (
    <div className="hidden md:block w-64 border-r bg-background h-[calc(100vh-4rem)] sticky top-16">
      <div className="flex flex-col gap-2 p-4">
        {navItems.map((item) => (
          <Link key={item.id} href={`/#${item.id}`}>
            <Button
              variant={activeSection === item.id ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-2",
                activeSection === item.id ? "bg-blue-600 hover:bg-blue-600/90" : "",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  )
}
