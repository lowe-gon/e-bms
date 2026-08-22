import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const AUTH_ROUTES = ['/sign-in', '/forgot-password'];
const PROTECTED_PREFIXES = ['/', '/api/webhooks(.*)'];

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;
  const { isAuthenticated, redirectToSignIn } = await auth();

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (isAuthenticated && isAuthRoute) {
    const referer = req.headers.get('referer');
    let targetPath = '/';

    if (referer) {
      const refererUrl = new URL(referer);
      // Ensure same-origin and avoid redirecting back to another auth route
      const isRefererAuthRoute = AUTH_ROUTES.some((route) => refererUrl.pathname.startsWith(route));

      if (refererUrl.origin === origin && !isRefererAuthRoute) {
        targetPath = refererUrl.pathname + refererUrl.search;
      }
    }

    return NextResponse.redirect(new URL(targetPath, req.url));
  }

  const isProtectedRoute = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (!isAuthenticated && isProtectedRoute) {
    return redirectToSignIn();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for Clerk's auto-proxy path
    '/__clerk/:path*',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
