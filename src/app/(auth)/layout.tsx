"use client";

import { Button } from "@/components/ui/button";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();

  // Determine current page and target
  const isSignIn = pathname === "/sign-in";
  const buttonLabel = isSignIn ? "Sign Up" : "Sign In";
  const targetRoute = isSignIn ? "/sign-up" : "/sign-in";

  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center">
          <Image src="/logo.svg" height={80} width={80} alt="Scrumly logo" />
          <Button variant="secondary" onClick={() => router.push(targetRoute)}>
            {buttonLabel}
          </Button>
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
          {children}
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
