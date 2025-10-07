import { ClerkProvider } from '@clerk/nextjs';
import { PropsWithChildren } from 'react';
import ClientProviders from './Providers.client';
import { NextIntlClientProvider } from 'next-intl';

export default function Providers({ children }: PropsWithChildren) {
  return (
    <NextIntlClientProvider>
      <ClerkProvider>
        <ClientProviders>{children}</ClientProviders>
      </ClerkProvider>
    </NextIntlClientProvider>
  );
}
