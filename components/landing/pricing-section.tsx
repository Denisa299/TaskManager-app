import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function PricingSection() {
  const plans = [
    {
      name: "Free",
      price: "0",
      description: "Pentru utilizatori individuali și echipe mici.",
      features: [
        "Până la 10 taskuri",
        "Până la 3 utilizatori",
        "Vizualizare Kanban",
        "Prioritizare taskuri",
        "Deadline-uri",
        "1 proiect",
      ],
      cta: "Înregistrează-te gratuit",
      ctaLink: "/register",
      popular: false,
      color: "border-gray-200",
    },
    {
      name: "Pro",
      price: "9.99",
      description: "Pentru echipe în creștere și proiecte multiple.",
      features: [
        "Taskuri nelimitate",
        "Până la 10 utilizatori",
        "Vizualizare Kanban și Calendar",
        "Prioritizare taskuri",
        "Deadline-uri",
        "Până la 10 proiecte",
        "Incarcare documente",
        "Notificări email",
      ],
      cta: "Începe cu Pro",
      ctaLink: "/payment",
      popular: true,
      color: "border-green-200 bg-green-50",
    },
  ]

  return (
    <section id="pricing" className="container py-24 sm:py-32 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          Planuri simple și transparente
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Alege planul care se potrivește cel mai bine nevoilor tale.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-5xl mx-auto">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`flex flex-col p-6 bg-white rounded-xl shadow-soft border ${plan.color} relative card-hover`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-0 right-0 mx-auto w-fit px-3 py-1 bg-gradient-to-r from-green-600 to-green-500 text-white text-xs font-medium rounded-full">
                Popular
              </div>
            )}
            <div className="flex flex-col gap-4">
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  {plan.price} €
                </span>
                <span className="text-muted-foreground">/lună</span>
              </div>
              <p className="text-muted-foreground">{plan.description}</p>
            </div>
            <div className="flex flex-col gap-3 mt-6 mb-6">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="p-1 rounded-full bg-green-100">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
            <div className="mt-auto">
              <Link href={plan.ctaLink} className="w-full">
                <Button
                  variant={plan.popular ? "default" : "outline"}
                  className={`w-full ${plan.popular ? "btn-primary" : "border-green-200 text-green-700 hover:bg-green-50"}`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
