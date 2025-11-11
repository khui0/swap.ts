import { db } from "$lib/server/db/index.js";
import {
  swapGroup,
  swapGroupMatch,
  swapGroupMember,
  swapGroupRestriction,
  user,
} from "$lib/server/db/schema.js";
import { error } from "@sveltejs/kit";
import { and, asc, eq, or } from "drizzle-orm";

export async function load({ locals, params }) {
  const basic = (
    await db
      .select({
        name: swapGroup.name,
        description: swapGroup.description,
        code: swapGroup.code,
        closed: swapGroup.closed,
      })
      .from(swapGroup)
      .where(eq(swapGroup.code, params.code))
  )[0];

  if (locals.user && locals.session) {
    const group = (
      await db
        .select({
          id: swapGroup.id,
          createdAt: swapGroup.createdAt,
          updatedAt: swapGroup.updatedAt,
          name: swapGroup.name,
          description: swapGroup.description,
          code: swapGroup.code,
          closed: swapGroup.closed,
          owner: {
            name: user.name,
            id: user.id,
          },
        })
        .from(swapGroup)
        .leftJoin(swapGroupMember, eq(swapGroupMember.groupId, swapGroup.id))
        .leftJoin(user, eq(swapGroup.ownerId, user.id))
        .where(
          and(
            eq(swapGroup.code, params.code),
            or(eq(swapGroup.ownerId, locals.user.id), eq(swapGroupMember.userId, locals.user.id)),
          ),
        )
    )[0];

    if (!group) {
      return {
        name: basic.name,
        code: basic.code,
        closed: basic.closed,
      };
    }

    const members = await db
      .select({
        id: user.id,
        name: user.name,
        message: swapGroupMember.message,
        hiddenMessage: swapGroupMember.hiddenMessage,
      })
      .from(swapGroupMember)
      .innerJoin(user, eq(swapGroupMember.userId, user.id))
      .where(eq(swapGroupMember.groupId, group.id))
      .orderBy(asc(user.name));

    const self = (
      await db
        .select({
          id: user.id,
          name: user.name,
          message: swapGroupMember.message,
          hiddenMessage: swapGroupMember.hiddenMessage,
        })
        .from(swapGroupMember)
        .innerJoin(user, eq(swapGroupMember.userId, user.id))
        .where(
          and(eq(swapGroupMember.groupId, group.id), eq(swapGroupMember.userId, locals.user.id)),
        )
    )[0];

    const restrictions = new Set(
      (
        await db
          .select()
          .from(swapGroupRestriction)
          .where(eq(swapGroupRestriction.groupId, group.id))
      ).map((item) => `${item.senderId}->${item.recipientId}`),
    );

    const match = (
      await db
        .select({
          id: swapGroupMatch.recipientId,
          name: user.name,
          message: swapGroupMember.message,
          hiddenMessage: swapGroupMember.hiddenMessage,
        })
        .from(swapGroupMatch)
        .innerJoin(user, eq(swapGroupMatch.recipientId, user.id))
        .innerJoin(swapGroupMember, eq(swapGroupMatch.recipientId, swapGroupMember.userId))
        .where(
          and(eq(swapGroupMatch.groupId, group.id), eq(swapGroupMatch.senderId, locals.user.id)),
        )
    )[0];

    return {
      joined: {
        group,
        self,
        members: members.map((user) => ({
          id: user.id,
          name: user.name,
          message: user.hiddenMessage ? "" : user.message,
          hiddenMessage: user.hiddenMessage,
        })),
        restrictions: group.owner?.id === locals.user.id ? restrictions : null,
        isOwner: group.owner?.id === locals.user.id,
        match: match ? match : null,
      },
    };
  } else {
    if (basic) {
      return {
        name: basic.name,
        code: basic.code,
        closed: basic.closed,
      };
    } else {
      throw error(404, "Group not found");
    }
  }
}
