import { Button } from "@components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@components/ui/tooltip";
import { LoginLink, LogoutLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/server";
import { LogOut } from "lucide-react";

export type TKindeButtonProps = {
  type: "login" | "logout" | "signup";
};

export function KindeButton({ type }: TKindeButtonProps) {
  return type === "login" || type === "signup" ? (
    <Button variant={type === "login" ? "outline" : "secondary"} asChild>
      {type === "login" ? (
        <LoginLink className="flex items-center justify-center h-11 w-24">Log In</LoginLink>
      ) : (
        <RegisterLink className="flex items-center justify-center h-11 w-24">Sign Up</RegisterLink>
      )}
    </Button>
  ) : (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button className="w-fit h-fit" variant="outline" size="icon" tabIndex={-1}>
            <LogoutLink className="flex items-center justify-center rounded h-11 aspect-square hover:bg-red-500/80 transition-colors duration-300">
              <LogOut className="w-4 h-4" />
            </LogoutLink>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Logout</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
