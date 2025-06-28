import { CheckCircle2 } from "lucide-react"

export function BenefitsSection() {
  const benefits = [
    {
      title: "Organizare Kanban",
      description:
        "Vizualizează-ți taskurile în format Kanban cu coloane To Do, In Progress și Completed pentru o privire de ansamblu clară.",
      color: "green",
    },
    {
      title: "Gestionare pe roluri",
      description:
        "Controlează accesul utilizatorilor în funcție de rolurile lor (Admin, Project Manager, Membru) pentru o structură clară și o securitate sporită în gestionarea proiectelor.",
      color: "blue",
    },
    {
      title: "Atribuire utilizatori",
      description: "Atribuie taskuri membrilor echipei și urmărește cine lucrează la ce pentru o mai bună coordonare.",
      color: "purple",
    },
    {
      title: "Prioritizare",
      description:
        "Stabilește priorități (High, Medium, Low) pentru taskuri pentru a te asigura că cele mai importante sunt abordate primele.",
      color: "orange",
    },
    {
      title: "Deadline-uri",
      description: "Setează și urmărește deadline-uri pentru a te asigura că proiectele sunt finalizate la timp.",
      color: "red",
    },
    {
      title: "Colaborare în echipă",
      description: "Lucrează împreună cu echipa ta în timp real, cu actualizări instantanee și notificări.",
      color: "teal",
    },
  ]

  const getColorClasses = (color: string) => {
    const colorMap = {
      green: "border-green-200 bg-green-50 text-green-600",
      blue: "border-blue-200 bg-blue-50 text-blue-600",
      purple: "border-purple-200 bg-purple-50 text-purple-600",
      orange: "border-orange-200 bg-orange-50 text-orange-600",
      red: "border-red-200 bg-red-50 text-red-600",
      teal: "border-teal-200 bg-teal-50 text-teal-600",
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.green
  }

  return (
    <section id="benefits" className="container py-24 sm:py-32">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          De ce să alegi TaskManager?
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          TaskManager oferă toate instrumentele de care ai nevoie pentru a-ți gestiona proiectele eficient.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex flex-col gap-2 bg-white p-6 rounded-xl shadow-soft card-hover border">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${getColorClasses(benefit.color)}`}>
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold">{benefit.title}</h3>
            </div>
            <p className="text-muted-foreground">{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
