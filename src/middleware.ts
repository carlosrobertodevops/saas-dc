import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import {locales, defaultLocale} from '@/src/i18n/locales.ts';

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;
  if (
    PUBLIC_FILE.test(pathname) ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next')
  ) return;

  const hasLocale = locales.some((loc) => pathname.startsWith(`/${loc}`));
  if (!hasLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/((?!_next|.*\..*|api).*)']
};
