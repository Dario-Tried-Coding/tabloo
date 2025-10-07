import { routing } from '@/lib/i18n/routing';
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export const metadataValidator = v.object({
  language: v.optional(v.union(...routing.locales.map((l) => v.literal(l)))),
});

export const settingsValidator = v.object({ ...metadataValidator.fields });

export const userValidator = v.object({
  clerk_id: v.string(),
  settings: settingsValidator,
});

export default defineSchema({
  users: defineTable(userValidator).index('by_clerk_id', ['clerk_id']),
});
