import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ID } from "node-appwrite";

import { DATABASES_ID, WORKSPACE_ID } from "@/config";
import { sessionMiddleware } from "@/lib/session-middleware";

import { createWorkspaceSchema } from "../schemas";

const app = new Hono().post(
  "/",
  zValidator("json", createWorkspaceSchema),
  sessionMiddleware,
  async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { name } = c.req.valid("json");

    const workspace = await databases.createDocument(
      DATABASES_ID,
      WORKSPACE_ID,
      ID.unique(),
      {
        name,
        userId: user.$id, // link workspace to user
      }
    );

    return c.json(workspace, 201);
  }
);

export default app;
