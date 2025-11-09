import { db } from "$lib/server/db/index";
import { swapGroup, swapGroupMember } from "$lib/server/db/schema.js";
import { error, json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

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

  await db
    .insert(swapGroupMember)
    .values({
      groupId: group.groupId,
      userId: locals.user.id,
      message: "",
    })
    .onConflictDoNothing();

  return json({}, { status: 201 });
}
