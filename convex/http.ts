import { WebhookEvent } from '@clerk/nextjs/server';
import { httpRouter } from 'convex/server';
import { Webhook } from 'svix';
import { internal } from './_generated/api';
import { httpAction } from './_generated/server';

const http = httpRouter();

http.route({
  path: '/wh/clerk/users',
  method: 'POST',
  handler: httpAction(async (ctx, req) => {
    const event = await validateRequest(req);
    if (!event) return new Response('Error occured', { status: 400 });

    // prettier-ignore
    switch (event.type) {
      case "user.created":
      case "user.updated": await ctx.runMutation(internal.models.users.mutations.internal.upsertFromClerk, { clerkUser: event.data }); break;
      case "user.deleted": await ctx.runMutation(internal.models.users.mutations.internal.deleteFromClerk, { clerk_id: event.data.id! }); break;
      default: console.log('Ignored Clerk webhook event', event.type);
    }

    return new Response(null, { status: 200 });
  }),
});

export default http;

async function validateRequest(req: Request): Promise<WebhookEvent | null> {
  const payloadString = await req.text();
  const svixHeaders = {
    'svix-id': req.headers.get('svix-id')!,
    'svix-timestamp': req.headers.get('svix-timestamp')!,
    'svix-signature': req.headers.get('svix-signature')!,
  };
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  try {
    return wh.verify(payloadString, svixHeaders) as unknown as WebhookEvent;
  } catch (error) {
    console.error('Error verifying webhook event', error);
    return null;
  }
}
