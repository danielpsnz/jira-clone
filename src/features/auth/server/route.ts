import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { loginSchema } from "../schema";

const app = new Hono()
  .post("/login", zValidator("json", loginSchema), (c) => {
    // Handle login logic here
    const { email, password } = c.req.valid("json");
    console.log("Login attempt with:", { email, password });
    
    return c.json({ email, password, message: "Login successful" });
  })
  .post("/auth/signup", async (c) => {
    // Handle signup logic here
    return c.json({ message: "Signup successful" });
  })
  .get("/auth/logout", async (c) => {
    // Handle logout logic here
    return c.json({ message: "Logout successful" });
  });

export default app;
