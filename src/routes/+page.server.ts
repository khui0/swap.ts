import { db } from "$lib/server/db";
import { task, user } from "$lib/server/db/schema";
import { asc, eq } from "drizzle-orm";

export async function load({ locals }) {
  if (locals.user && locals.session) {
    const userTaskList = await db
      .select()
      .from(task)
      .leftJoin(user, eq(task.userId, locals.user.id))
      .orderBy(asc(task.createdAt));

    return {
      tasks: userTaskList,
    };
  }
}
