import { Button } from "@components/ui/button";
import { LoginLink, LogoutLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/server";
import { LogOut } from "lucide-react";

type TProps = {
  type: "login" | "logout" | "signup";
};

export default function KindeButton({ type }: TProps) {
  return (
    <Button variant={type === "login" || type === "logout" ? "outline" : "secondary"} asChild>
      {type === "login" ? (
        <LoginLink className="flex items-center justify-center h-11 w-24">Log In</LoginLink>
      ) : type === "signup" ? (
        <RegisterLink className="flex items-center justify-center h-11 w-24">Sign Up</RegisterLink>
      ) : (
        <LogoutLink className="flex items-center justify-center h-11 aspect-square hover:bg-red-500/80">
          <LogOut className="w-4 h-4" />
        </LogoutLink>
      )}
    </Button>
  );
}
