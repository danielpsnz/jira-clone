import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { loginSchema, signUpSchema } from "../schema";

const app = new Hono()
  .post("/login", zValidator("json", loginSchema), (c) => {
    // Handle login logic here
    const { email, password } = c.req.valid("json");
    console.log("Login attempt with:", { email, password });
    
    return c.json({ email, password, message: "Login successful" });
  })
  .post("/register", zValidator("json", signUpSchema), (c) => {
    // Handle register logic here
    const { name, email, password } = c.req.valid("json");
    console.log("Register attempt with:", { name, email, password });
    
    return c.json({ name, email, password, message: "Register successful" });
  })
  .get("/auth/logout", async (c) => {
    // Handle logout logic here
    return c.json({ message: "Logout successful" });
  });

export default app;
