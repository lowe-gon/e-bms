import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware(async (auth, req) => {
  const { isAuthenticated, redirectToSignIn } = await auth();
  const { pathname } = req.nextUrl;

  // Always allow Clerk webhooks
  if (pathname.startsWith('/api/webhooks')) {
    return NextResponse.next();
  }

  // Already signed in → don't allow access to sign-in/sign-up
  if (isAuthenticated && (pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up'))) {
    const referer = req.headers.get('referer');

    if (referer) {
      return NextResponse.redirect(referer);
    }

    // Fallback if there is no previous route
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Not authenticated → redirect to sign-in
  if (!isAuthenticated) {
    return redirectToSignIn();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/__clerk/(.*)',
  ],
};
