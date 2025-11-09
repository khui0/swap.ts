import { db } from "$lib/server/db/index";
import { swapGroup, swapGroupMember } from "$lib/server/db/schema.js";
import { error, json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export async function POST({ locals, params }) {
  if (!locals.session || !locals.user) {
    return error(401, "Unauthorized");
  }

  const code = params.code;

  const row = await db
    .select({ groupId: swapGroup.id })
    .from(swapGroup)
    .where(eq(swapGroup.code, code));

  if (row.length === 0) {
    return error(400, "Group does not exist");
  }

  await db
    .insert(swapGroupMember)
    .values({
      groupId: row[0].groupId,
      userId: locals.user.id,
      message: "",
    })
    .onConflictDoNothing();

  return json({}, { status: 201 });
}
