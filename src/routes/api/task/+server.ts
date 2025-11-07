import { db } from "$lib/server/db/index";
import { task, user } from "$lib/server/db/schema.js";
import { error, json } from "@sveltejs/kit";
import { asc, eq } from "drizzle-orm";

export async function POST({ request, locals }) {
  if (!locals.session) {
    return error(401);
  }

  if (!locals.user) {
    return error(500);
  }

  const body = await request.json();

  if (!body.content) {
    return error(400, "Invalid task");
  }

  await db.insert(task).values({
    userId: locals.user.id,
    content: body.content,
    completed: false,
  });

  const userTaskList = await db
    .select()
    .from(task)
    .leftJoin(user, eq(task.userId, user.id))
    .orderBy(asc(task.createdAt));

  return json({ tasks: JSON.stringify(userTaskList) }, { status: 201 });
}

export async function PATCH({ request, locals }) {
  if (!locals.session) {
    return error(401);
  }

  if (!locals.user) {
    return error(500);
  }

  const body = await request.json();

  if (!body.id) {
    return error(400, "Invalid task");
  }

  await db
    .update(task)
    .set({
      completed: body.completed,
    })
    .where(eq(task.id, body.id));

  const userTaskList = await db
    .select()
    .from(task)
    .leftJoin(user, eq(task.userId, user.id))
    .orderBy(asc(task.createdAt));

  return json({ tasks: JSON.stringify(userTaskList) }, { status: 201 });
}
