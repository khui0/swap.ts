import { db } from "$lib/server/db/index";
import { swapGroup, swapGroupMember } from "$lib/server/db/schema.js";
import { error, json } from "@sveltejs/kit";
import { count, eq } from "drizzle-orm";

// Create new group
export async function POST({ request, locals }) {
  if (!locals.session || !locals.user) {
    return error(401, "Unauthorized");
  }

  if ((await userGroupOwnedCount(locals.user.id)) >= 5) {
    return error(403, "Maximum number of groups exceeded (5)");
  }

  const body = await request.json();

  if (!body.name || !body.description) {
    return error(400, "Missing parameters");
  }

  if (body.name.length > 100) {
    return error(400, "Group name cannot exceed 100 characters");
  }

  if (body.description.length > 250) {
    return error(400, "Group description cannot exceed 250 characters");
  }

  const code = generateCode(7);

  const row = await db
    .insert(swapGroup)
    .values({
      ownerId: locals.user.id,
      name: body.name,
      description: body.description,
      code,
      closed: false,
    })
    .returning({ insertedId: swapGroup.id });

  const groupId = row[0].insertedId;

  await db.insert(swapGroupMember).values({
    groupId,
    userId: locals.user.id,
    message: "",
    hiddenMessage: false,
  });

  return json({ code }, { status: 201 });
}

// Source - https://stackoverflow.com/a/1349426
// Posted by csharptest.net, modified by community. See post 'Timeline' for change history
// Retrieved 2025-11-09, License - CC BY-SA 4.0

function generateCode(length: number): string {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function userGroupOwnedCount(id: string): Promise<number> {
  return (await db.select({ count: count() }).from(swapGroup).where(eq(swapGroup.ownerId, id)))[0]
    .count;
}
