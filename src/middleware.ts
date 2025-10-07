import { clerkClient, clerkMiddleware } from '@clerk/nextjs/server';
import { hasLocale } from 'next-intl';
import { NextResponse } from 'next/server';
import { i18nMiddleware } from './lib/i18n/middleware';
import { routing } from './lib/i18n/routing';

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  if (!userId) return i18nMiddleware(req);

  const segments = req.nextUrl.pathname.split('/').filter(Boolean);

  const pathLocale = segments[0] || '';
  const isLocaleInPath = !!pathLocale && hasLocale(routing.locales, pathLocale);

  const cookieLocale = req.cookies.get('NEXT_LOCALE')?.value;
  const isLocaleInCookie = !!cookieLocale && hasLocale(routing.locales, cookieLocale);

  const locale = (isLocaleInPath && pathLocale) || (isLocaleInCookie && cookieLocale) || routing.defaultLocale;
  const path = segments.slice(isLocaleInPath ? 1 : 0);

  const language = hasLocale(routing.locales, sessionClaims.metadata.language) && sessionClaims.metadata.language;
  if (!language) {
    const clerk = await clerkClient();
    await clerk.users.updateUser(userId, { publicMetadata: { language: locale } });

    return i18nMiddleware(req);
  }

  if (locale === language) return i18nMiddleware(req);

  req.nextUrl.pathname = `/${[language, ...path].join('/')}`;
  return NextResponse.redirect(req.nextUrl);
});

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
