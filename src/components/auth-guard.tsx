"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { getLoggedInUser } from "@/utils/login";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const userEmail = getLoggedInUser();

    if (userEmail) {
      setIsAuthenticated(true);
    } else {
      redirect("/login");
    }
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
