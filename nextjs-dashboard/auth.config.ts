import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
    // routes users to custom login i/o default Next.js auth page
    pages: {
        signIn: '/login',
    },
    // protect routes - prevent unauthorized access to dash
    callbacks: {
        // this callback uses Next.js Proxy and is called before request is completed
        // receives 'auth' (user session) and 'request' (incoming request) properties
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
            if (isOnDashboard) {
                if (isLoggedIn) return true
                return false // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/dashboard', nextUrl))
            }
            return true
        },
    },
    // list different login options such as Google or GitHub
    providers: [], // Add providers with an empty array for now (required field)
} satisfies NextAuthConfig
