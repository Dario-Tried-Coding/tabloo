import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en-US', 'it-IT'],
  defaultLocale: 'it-IT',
  localePrefix: "never"
});
