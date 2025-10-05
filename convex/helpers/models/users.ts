import { QueryCtx } from '../../_generated/server';

export async function getUserByClerkID(ctx: QueryCtx, clerk_id: string) {
  return await ctx.db
    .query('users')
    .withIndex('by_clerk_id', (q) => q.eq('clerk_id', clerk_id))
    .unique();
}
