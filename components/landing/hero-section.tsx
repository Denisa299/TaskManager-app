import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="container py-24 sm:py-32">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col gap-4 animate-fade-in">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm bg-green-50 border-green-200 text-green-800 mb-4">
            
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
            Managementul taskurilor simplu și eficient
          </h1>
          <p className="text-lg text-muted-foreground max-w-[600px]">
            TaskManager este soluția completă pentru echipe care doresc să-și organizeze și să-și gestioneze proiectele
            eficient. Planifică, urmărește și finalizează taskuri cu ușurință.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link href="/register">
              <Button size="lg" className="btn-primary">
                Încearcă gratuit
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="border-green-200 text-green-700 hover:bg-green-50">
                Demo
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative h-[400px] w-full rounded-xl overflow-hidden shadow-soft-lg card-hover">
          <Image
            src="/task-management-kanban-dashboard.png"
            alt="TaskManager Dashboard Preview"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  )
}
