import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    clerk_id: v.string(),
  }).index('by_clerk_id', ['clerk_id']),
});
