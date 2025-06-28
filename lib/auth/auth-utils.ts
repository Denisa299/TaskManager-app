import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "@/lib/db/mongodb"
import { User, type IUser } from "@/lib/models/user"
import type { NextAuthOptions } from "next-auth"
import { Types } from "mongoose";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"

export async function getUserFromToken(req: NextRequest): Promise<IUser | null> {
  try {
    const token = req.cookies.get("token")?.value

    if (!token) return null

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }

    await connectToDatabase()

    const user = await User.findById(decoded.userId)

    return user || null
  } catch (error) {
    console.error("Eroare la obținerea utilizatorului din token:", error)
    return null
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          await connectToDatabase()

          const user = await User.findOne({ email: credentials.email })

          if (!user) return null

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
          if (!isPasswordValid) return null

          return {
            id: (user._id as Types.ObjectId).toString(),

            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            name: `${user.firstName} ${user.lastName}`,
            avatar: user.avatar,
            role: user.role,
          } 
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const customUser = user as any
        token.id = customUser.id
        token.firstName = customUser.firstName
        token.lastName = customUser.lastName
        token.avatar = customUser.avatar
        token.role = customUser.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          firstName: token.firstName as string,
          lastName: token.lastName as string,
          name: `${token.firstName} ${token.lastName}`,
          avatar: token.avatar as string,
          role: token.role as string,
        } as any
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
