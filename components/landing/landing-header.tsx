"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

export function LandingHeader() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "/#about", label: "Despre noi" },
    { href: "/#benefits", label: "Beneficii" },
    { href: "/#pricing", label: "Prețuri" },
    { href: "/#testimonials", label: "Testimoniale" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-soft">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-green-600 to-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-soft">
              <span className="font-bold">TM</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline-block bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              TaskManager
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <div className="hidden md:flex gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-green-700 hover:text-green-800 hover:bg-green-50">
                Autentificare
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="btn-primary">
                Înregistrare
              </Button>
            </Link>
          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon" className="border-green-200">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Meniu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-medium hover:text-green-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="flex flex-col gap-2 mt-4">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-50">
                      Autentificare
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    <Button className="w-full btn-primary">Înregistrare</Button>
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
