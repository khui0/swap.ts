import { db } from "$lib/server/db/index";
import { swapGroup } from "$lib/server/db/schema.js";
import { error, json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

// Update group info
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

  if (group.ownerId !== locals.user.id) {
    return error(403, "Unauthorized");
  }

  const body = await request.json();

  if (!(body.name && body.description)) {
    return error(400, "Invalid parameters");
  }

  if (body.name.length > 100) {
    return error(400, "Group name cannot exceed 100 characters");
  }

  if (body.description.length > 250) {
    return error(400, "Group description cannot exceed 250 characters");
  }

  try {
    await db
      .update(swapGroup)
      .set({
        name: body.name,
        description: body.description,
      })
      .where(eq(swapGroup.code, code));
    return json({}, { status: 201 });
  } catch {
    return error(500);
  }
}

// Delete group
export async function DELETE({ locals, params }) {
  if (!locals.session || !locals.user) {
    return error(401, "Unauthorized");
  }

  const code = params.code;

  const row = await db
    .select({ groupId: swapGroup.id, ownerId: swapGroup.ownerId })
    .from(swapGroup)
    .where(eq(swapGroup.code, code));

  if (row.length === 0) {
    return error(400, "Group does not exist");
  }

  if (row[0].ownerId !== locals.user.id) {
    return error(403, "Unauthorized");
  }

  try {
    await db.delete(swapGroup).where(eq(swapGroup.code, code));
    return json({}, { status: 201 });
  } catch {
    return error(500);
  }
}
