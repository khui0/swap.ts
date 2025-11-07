import { db } from "$lib/server/db";
import { task, user } from "$lib/server/db/schema";
import { error } from "@sveltejs/kit";
import { asc, eq } from "drizzle-orm";

export async function load({ locals }) {
  if (!locals.session) {
    return error(401);
  }
  if (!locals.user) {
    return error(500);
  }

  const userTaskList = await db
    .select()
    .from(task)
    .leftJoin(user, eq(task.userId, user.id))
    .orderBy(asc(task.createdAt));

  return {
    tasks: userTaskList,
  };
}
