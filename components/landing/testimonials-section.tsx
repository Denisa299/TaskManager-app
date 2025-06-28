import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { StarIcon } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Maria Popescu",
      role: "Project Manager",
      company: "TechSolutions",
      image: "/professional-woman-short-hair.png",
      content:
        "TaskManager a revoluționat modul în care echipa noastră gestionează proiectele. Interfața Kanban este intuitivă, iar posibilitatea de a atribui taskuri și de a seta priorități ne-a crescut productivitatea cu peste 30%.",
      stars: 5,
    },
    {
      name: "Alexandru Ionescu",
      role: "CTO",
      company: "WebDev Agency",
      image: "/professional-man-glasses.png",
      content:
        "După ce am încercat numeroase soluții de management al taskurilor, TaskManager este de departe cea mai bună. Echipa noastră a adoptat-o imediat datorită simplității și eficienței sale.",
      stars: 5,
    },
    {
      name: "Elena Dumitrescu",
      role: "Team Lead",
      company: "CreativeStudio",
      image: "/professional-woman-long-hair.png",
      content:
        "Funcționalitățile de subtaskuri și deadline-uri din TaskManager ne-au ajutat să ne organizăm mai bine și să livrăm proiectele la timp. Recomand cu încredere oricărei echipe care dorește să-și îmbunătățească fluxul de lucru.",
      stars: 4,
    },
  ]

  return (
    <section id="testimonials" className="container py-24 sm:py-32">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Ce spun clienții noștri
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Descoperă cum TaskManager a ajutat echipe din diverse industrii să-și îmbunătățească productivitatea.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="bg-white shadow-soft card-hover border-0">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <div className="flex gap-1">
                  {Array(testimonial.stars)
                    .fill(0)
                    .map((_, i) => (
                      <StarIcon key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  {Array(5 - testimonial.stars)
                    .fill(0)
                    .map((_, i) => (
                      <StarIcon key={i} className="h-5 w-5 text-muted-foreground/30" />
                    ))}
                </div>
                <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden ring-2 ring-green-100">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
