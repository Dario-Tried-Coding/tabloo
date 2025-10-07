import { UserJSON } from '@clerk/nextjs/server';
import { validate } from 'convex-helpers/validators';
import { WithoutSystemFields } from 'convex/server';
import { v, Validator } from 'convex/values';
import { Doc } from '../../../_generated/dataModel';
import { internalMutation } from '../../../_generated/server';
import { getUserByClerkID } from '../../../helpers/models/users';
import { metadataValidator } from '../../../schema';

export const upsertFromClerk = internalMutation({
  args: { clerkUser: v.any() as Validator<UserJSON> },
  async handler(ctx, { clerkUser }) {
    const metadata = validate(metadataValidator, clerkUser.public_metadata)
      ? clerkUser.public_metadata
      : undefined;

    const user = {
      clerk_id: clerkUser.id,
      settings: { ...metadata },
    } satisfies WithoutSystemFields<Doc<'users'>>;

    let _id = (await getUserByClerkID(ctx, clerkUser.id))?._id;
    if (!_id) _id = await ctx.db.insert('users', user);
    else await ctx.db.patch(_id, user);
  },
});

export const deleteFromClerk = internalMutation({
  args: { clerk_id: v.string() },
  async handler(ctx, { clerk_id }) {
    const _id = (await getUserByClerkID(ctx, clerk_id))?._id;
    if (_id) await ctx.db.delete(_id);
    else console.warn(`Can't delete user, there is none for Clerk user ID: ${clerk_id}`);
  },
});
