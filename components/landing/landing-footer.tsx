import Link from "next/link"

export function LandingFooter() {
  return (
    <footer className="border-t py-12 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex flex-col gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-green-600 to-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-soft">
              <span className="font-bold">TM</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              TaskManager
            </span>
          </Link>
          <p className="text-sm text-muted-foreground mt-2">
            Soluția completă pentru managementul taskurilor și proiectelor.
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-3 text-green-700">Produs</h3>
          <ul className="flex flex-col gap-2">
            <li>
              <Link href="/#benefits" className="text-sm text-muted-foreground hover:text-green-600 transition-colors">
                Funcționalități
              </Link>
            </li>
            <li>
              <Link href="/#pricing" className="text-sm text-muted-foreground hover:text-green-600 transition-colors">
                Prețuri
              </Link>
            </li>
            <li>
              <Link href="/register" className="text-sm text-muted-foreground hover:text-green-600 transition-colors">
                Înregistrare
              </Link>
            </li>
            <li>
              <Link href="/login" className="text-sm text-muted-foreground hover:text-green-600 transition-colors">
                Autentificare
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-3 text-blue-700">Companie</h3>
          <ul className="flex flex-col gap-2">
            <li>
              <Link href="/#about" className="text-sm text-muted-foreground hover:text-blue-600 transition-colors">
                Despre noi
              </Link>
            </li>
          
            <li>
              <Link href="/blog" className="text-sm text-muted-foreground hover:text-blue-600 transition-colors">
              
              </Link>
            </li>
            <li>
              <Link href="/careers" className="text-sm text-muted-foreground hover:text-blue-600 transition-colors">
                
              </Link>
            </li>
          </ul>
        </div>
        
      </div>
      <div className="container mt-12 border-t pt-6">
        <p className="text-sm text-muted-foreground text-center">
          © {new Date().getFullYear()} TaskManager. Toate drepturile rezervate.
        </p>
      </div>
    </footer>
  )
}
