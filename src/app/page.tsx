import { SignInButton, SignOutButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';

export default async function Home() {
  const user = await currentUser();

  if (!user) return <SignInButton />;

  return (
    <div>
      <pre>{JSON.stringify(user.publicMetadata, null, 2)}</pre>
      <SignOutButton />
    </div>
  );
}
