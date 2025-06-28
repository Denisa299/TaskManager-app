import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

// Rutele care necesită autentificare
const protectedRoutes = ["/dashboard"]

// Rutele publice
const publicRoutes = ["/", "/login", "/register", "/payment"]

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const { pathname } = request.nextUrl

  // Verificare dacă ruta necesită autentificare
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.some((route) => pathname === route)

  // Dacă nu există token și ruta necesită autentificare, redirecționare către login
  if (!token && isProtectedRoute) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", encodeURI(pathname))
    return NextResponse.redirect(url)
  }

  // Dacă există token, verificare validitate
  if (token) {
    try {
      // Verificare token
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your_jwt_secret")
      const decoded = await jwtVerify(token, secret)
      const payload = decoded.payload as any

      // Verificăm dacă utilizatorul încearcă să acceseze pagina de înregistrare
      // și are mai mult de 3 utilizatori în echipă (limitare plan Free)
      if (pathname === "/register" && payload.teamSize > 3) {
        return NextResponse.redirect(new URL("/payment", request.url))
      }

      // Dacă utilizatorul este autentificat și încearcă să acceseze o rută publică
      // cum ar fi login sau register, redirecționare către dashboard
      if (isPublicRoute && pathname !== "/" && pathname !== "/payment") {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    } catch (error) {
      // Dacă token-ul este invalid și ruta necesită autentificare, redirecționare către login
      if (isProtectedRoute) {
        const url = new URL("/login", request.url)
        url.searchParams.set("callbackUrl", encodeURI(pathname))
        return NextResponse.redirect(url)
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
  
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
