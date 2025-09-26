import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import {locales, defaultLocale} from './src/i18n/locales';
import createMiddleware from 'next-intl/middleware';
import { clerkMiddleware } from '@clerk/nextjs/server';
const PUBLIC_FILE = /\.(.*)$/;

const intlMiddleware = createMiddleware({
  locales: ['pt-br', 'en-us', 'es-es'],
  defaultLocale: 'pt-br' // ✅ Define um valor fixo ou remove a linha problemática
})

export default clerkMiddleware();

export function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;
  const hasLocale = locales.some((loc) => pathname.startsWith(`/${loc}`));

  if (PUBLIC_FILE.test(pathname) || pathname.startsWith('/api') || pathname.startsWith('/_next')) return;

  if (!hasLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(url);
  };

  if (request.nextUrl.pathname.startsWith('/api') ||
      request.nextUrl.pathname.includes('.') ||
      request.nextUrl.pathname.startsWith('/_next')) {
    return NextResponse.next()
  }

  if (
    PUBLIC_FILE.test(pathname) ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next')
  ) return;

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!_next|.*\\..*|api).*)']
};
