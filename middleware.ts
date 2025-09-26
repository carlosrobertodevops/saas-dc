import {NextResponse} from 'next/server';
import createMiddleware from 'next-intl/middleware';
import {clerkMiddleware} from '@clerk/nextjs/server';
import {locales, defaultLocale} from './src/i18n/locales';

// Internationalization middleware (next-intl)
const intlMiddleware = createMiddleware({
  locales: Array.from(locales),
  defaultLocale
});

// Combine Clerk and next-intl middleware
export default clerkMiddleware((auth, req) => {
  // You can add route-based auth logic here if needed, then fall through to i18n
  // Example: protect specific paths
  // if (req.nextUrl.pathname.startsWith('/admin')) auth().protect();

  return intlMiddleware(req) ?? NextResponse.next();
});

// Ensure middleware runs on all non-static, non-API routes
export const config = {
  matcher: ['/((?!_next|.*\\..*|api).*)']
};


