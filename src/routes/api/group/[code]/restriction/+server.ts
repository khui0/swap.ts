import { db } from "$lib/server/db/index";
import { swapGroup, swapGroupRestriction } from "$lib/server/db/schema.js";
import { error, json } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";

export async function PUT({ request, locals, params }) {
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

  if (!body.restrictions || !Array.isArray(body.restrictions)) {
    return error(400, "Missing restrictions");
  }

  if (!body.senderId) {
    return error(400, "Missing sender ID");
  }

  const restrictions = (body.restrictions as string[])
    .filter((item) => {
      return item.split("->")[0] === body.senderId;
    })
    .map((item) => {
      return {
        groupId: group.groupId,
        senderId: body.senderId,
        recipientId: item.split("->")[1],
      };
    });

  if (restrictions.length === 0) {
    return json({}, { status: 200 });
  }

  console.log(restrictions);

  try {
    await db.transaction(async (tx) => {
      await tx
        .delete(swapGroupRestriction)
        .where(
          and(
            eq(swapGroupRestriction.groupId, group.groupId),
            eq(swapGroupRestriction.senderId, body.senderId),
          ),
        );

      await tx.insert(swapGroupRestriction).values(restrictions).onConflictDoNothing();
    });
    return json({}, { status: 201 });
  } catch {
    return error(500);
  }
}
