import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = (auth?.user as any)?.role;
      
      const isDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isAdmin = nextUrl.pathname.startsWith('/admin');
      const isEngineer = nextUrl.pathname.startsWith('/engineer');

      if (isAdmin) {
        if (isLoggedIn && role === 'ADMIN') return true;
        return false; // Redirect to login
      }

      if (isEngineer) {
        if (isLoggedIn && (role === 'ENGINEER' || role === 'ADMIN')) return true;
        return false;
      }

      if (isDashboard) {
        if (isLoggedIn) return true;
        return false;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  providers: [],
  session: {
    strategy: "jwt",
  },
} satisfies NextAuthConfig;
