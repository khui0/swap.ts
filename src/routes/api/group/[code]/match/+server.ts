import { db } from "$lib/server/db/index";
import {
  swapGroup,
  swapGroupMatch,
  swapGroupMember,
  swapGroupRestriction,
  user,
} from "$lib/server/db/schema.js";
import { error, json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { swap } from "./swap.js";

export async function POST({ locals, params }) {
  if (!locals.session || !locals.user) {
    return error(401, "Unauthorized");
  }

  const code = params.code;

  const group = (
    await db
      .select({ groupId: swapGroup.id, ownerId: swapGroup.ownerId })
      .from(swapGroup)
      .where(eq(swapGroup.code, code))
  )[0];

  if (!group) {
    return error(400, "Group does not exist");
  }

  if (group.ownerId !== locals.user.id) {
    return error(403, "Unauthorized");
  }

  // const body = await request.json();

  const members = await db
    .select({
      id: user.id,
      name: user.name,
      message: swapGroupMember.message,
      hiddenMessage: swapGroupMember.hiddenMessage,
    })
    .from(swapGroupMember)
    .innerJoin(user, eq(swapGroupMember.userId, user.id))
    .where(eq(swapGroupMember.groupId, group.groupId));

  const restrictions = new Set(
    (
      await db
        .select()
        .from(swapGroupRestriction)
        .where(eq(swapGroupRestriction.groupId, group.groupId))
    ).map((item) => `${item.senderId}->${item.recipientId}`),
  );

  const pairs = swap(
    members.map((user) => user.id),
    restrictions,
  );

  if (pairs === null) {
    return error(400, "Unable to generate, check restrictions");
  }

  const values = Object.entries(pairs).map(([senderId, recipientId]) => ({
    groupId: group.groupId,
    senderId,
    recipientId,
  }));

  try {
    await db.transaction(async (tx) => {
      await tx.delete(swapGroupMatch).where(eq(swapGroupMatch.groupId, group.groupId));
      await tx.insert(swapGroupMatch).values(values).onConflictDoNothing();
      await tx
        .update(swapGroup)
        .set({
          closed: true,
        })
        .where(eq(swapGroup.id, group.groupId));
    });
    return json({}, { status: 201 });
  } catch {
    return error(500);
  }
}
