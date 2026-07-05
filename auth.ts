import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          credentials?.username === "admin" &&
          credentials?.password === process.env.ADMIN_PASSWORD
        ) {
          return { id: "1", name: "Admin", email: "admin@krishhospital.com" }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
})
