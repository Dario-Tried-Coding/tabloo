import { ClerkProvider } from '@clerk/nextjs';
import { PropsWithChildren } from 'react';
import ClientProviders from './Providers.client';

export default function Providers({ children }: PropsWithChildren) {
  return (
    <ClerkProvider>
      <ClientProviders>{children}</ClientProviders>
    </ClerkProvider>
  );
}
