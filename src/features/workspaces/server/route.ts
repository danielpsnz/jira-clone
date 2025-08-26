import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ID } from "node-appwrite";

import { DATABASES_ID, IMAGES_BUCKET_ID, WORKSPACE_ID } from "@/config";
import { sessionMiddleware } from "@/lib/session-middleware";

import { createWorkspaceSchema } from "../schemas";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const databases = c.get("databases");

    const workspaces = await databases.listDocuments(
      DATABASES_ID,
      WORKSPACE_ID
    );

    return c.json({ data: workspaces });
  })
  .post(
    "/",
    zValidator("form", createWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { name, image } = c.req.valid("form");

      let uploadedImageUrl: string | undefined;

      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        );

        const filePreview = await storage.getFilePreview(
          IMAGES_BUCKET_ID,
          file.$id
        );

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(
          filePreview
        ).toString("base64")}`;
      }

      const workspace = await databases.createDocument(
        DATABASES_ID,
        WORKSPACE_ID,
        ID.unique(),
        {
          name,
          userId: user.$id,
          imageUrl: uploadedImageUrl,
        }
      );

      return c.json(workspace, 201);
    }
  );

export default app;
