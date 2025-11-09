import { db } from "$lib/server/db/index";
import { swapGroup, swapGroupMember } from "$lib/server/db/schema.js";
import { error, json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

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
      .where(eq(swapGroupMember.userId, locals.user.id));
    return json({}, { status: 201 });
  } catch {
    return error(500);
  }
}
