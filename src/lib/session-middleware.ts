import "server-only";

import {
  Client,
  Account,
  Databases,
  Models,
  Storage,
  type Account as AccountType,
  type Databases as DatabasesType,
  type Storage as StorageType,
  type Users as UsersType,
} from "node-appwrite";

import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";

import { AUTH_COOKIE } from "@/features/auth/constants";

type AppwriteClient = {
  Variables: {
    account: AccountType;
    databases: DatabasesType;
    storage: StorageType;
    users: UsersType;
    user: Models.User<Models.Preferences>;
  };
};

export const sessionMiddleware = createMiddleware<AppwriteClient>(async (c, next) => {
  const sessionToken = getCookie(c, AUTH_COOKIE);
  if (!sessionToken) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  client.setSession(sessionToken);

  const account = new Account(client);
  const databases = new Databases(client);
  const storage = new Storage(client);

  const user = await account.get();

  c.set("account", account);
  c.set("databases", databases);
  c.set("storage", storage);
  c.set("user", user);

  await next();
});
