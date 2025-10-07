import { SignInButton, SignOutButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import { Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function Home({ params }: PageProps<'/[locale]'>) {
  const {locale} = await params as { locale: Locale}
  setRequestLocale(locale)

  const t = await getTranslations()

  const user = await currentUser();

  if (!user) return <>
    <div>{t("logged-out")}</div>
    <SignInButton />
  </>;

  return (
    <div>
      <div>{t("logged-in")}</div>
      <pre>{JSON.stringify(user.publicMetadata, null, 2)}</pre>
      <SignOutButton />
    </div>
  );
}
