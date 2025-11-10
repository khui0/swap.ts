import { db } from "$lib/server/db/index";
import { swapGroup, swapGroupMember } from "$lib/server/db/schema.js";
import { error, json } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";

// Join user to group
export async function POST({ locals, params }) {
  if (!locals.session || !locals.user) {
    return error(401, "Unauthorized");
  }

  const code = params.code;

  const group = (
    await db
      .select({ groupId: swapGroup.id, ownerId: swapGroup.ownerId, closed: swapGroup.closed })
      .from(swapGroup)
      .where(eq(swapGroup.code, code))
  )[0];

  if (!group) {
    return error(400, "Group does not exist");
  }

  if (group.closed) {
    return error(403, "Group is closed");
  }
  
  await db
    .insert(swapGroupMember)
    .values({
      groupId: group.groupId,
      userId: locals.user.id,
      message: "",
      hiddenMessage: false,
    })
    .onConflictDoNothing();

  return json({}, { status: 201 });
}

// Update message
export async function PATCH({ request, locals, params }) {
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

  const body = await request.json();

  if (!body.message) {
    return error(400, "Invalid parameters");
  }

  if (body.message.length > 250) {
    return error(400, "Message cannot exceed 250 characters");
  }

  try {
    await db
      .update(swapGroupMember)
      .set({
        message: body.message,
        hiddenMessage: body.hidden,
      })
      .where(
        and(eq(swapGroupMember.groupId, group.groupId), eq(swapGroupMember.userId, locals.user.id)),
      );
    return json({}, { status: 201 });
  } catch {
    return error(500);
  }
}

// Delete user
export async function DELETE({ request, locals, params }) {
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

  const body = await request.json();

  if (!body.userId) {
    return error(400, "No user provided");
  }

  // Prevent non owner from deleting other users
  if (group.ownerId !== locals.user.id && body.userId !== locals.user.id) {
    return error(403, "Unauthorized");
  }

  if (group.ownerId === locals.user.id && body.userId === locals.user.id) {
    return error(400, "Cannot delete yourself");
  }

  try {
    await db
      .delete(swapGroupMember)
      .where(
        and(eq(swapGroupMember.groupId, group.groupId), eq(swapGroupMember.userId, body.userId)),
      );
    return json({}, { status: 201 });
  } catch {
    return error(500);
  }
}
