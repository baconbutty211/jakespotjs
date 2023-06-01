import { defineSchema, defineTable } from "convex/schema";
import { v } from "convex/values";

export default defineSchema({
  players: defineTable({
    access_token: v.string(),
    refresh_token: v.string(),
    game: v.id("games"),
  }),
  games: defineTable({
    id: v.id("games") 
    name: v.string(),
  }).index("by_id", ["id"]),
});