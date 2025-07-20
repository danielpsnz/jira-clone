import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createAdminClient } from "@/lib/appwrite";
import { deleteCookie, setCookie } from "hono/cookie";

import { loginSchema, signUpSchema } from "../schema";
import { ID } from "node-appwrite";
import { AUTH_COOKIE } from "../constants";

const app = new Hono()
  .post("/login", zValidator("json", loginSchema), async (c) => {
    // Handle login logic here
    const { email, password } = c.req.valid("json");
    console.log("Login attempt with:", { email, password });

    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    setCookie(c, AUTH_COOKIE, session.secret, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
    })
    
    return c.json({ success: true, session, message: "Login successful" });
  })
  .post("/register", zValidator("json", signUpSchema), async (c) => {
    // Handle register logic here
    const { name, email, password } = c.req.valid("json");
    console.log("Register attempt with:", { name, email, password });

    const { account } = await createAdminClient();
    const user = await account.create(
      ID.unique(),
      email,
      password,
      name
    );

    const session = await account.createEmailPasswordSession(email, password);

    setCookie(c, AUTH_COOKIE, session.secret, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
    })
    
    return c.json({ success: true, user, message: "Registration successful" });
  })
  .get("/auth/logout", async (c) => {
    deleteCookie(c, AUTH_COOKIE);

    return c.json({ success: true, message: "Logged out successfully" });
  });

export default app;
