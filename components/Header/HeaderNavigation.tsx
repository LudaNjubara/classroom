"use client";

import { ThemeToggleButton } from "@/components/Elements/button/ThemeToggleButton";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { KindeButton } from "../Elements";

export function HeaderNavigation() {
  const { isAuthenticated, isLoading } = useKindeBrowserClient();

  if (isLoading)
    return (
      <div className="flex gap-2">
        <Skeleton className="w-12 h-11 rounded-sm" />
        <Skeleton className="w-24 h-11" />
        <Skeleton className="w-24 h-11" />
      </div>
    );

  return isAuthenticated ? (
    <NavigationMenu>
      <NavigationMenuList className="flex gap-1">
        <NavigationMenuItem>
          <ThemeToggleButton />
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Button
            variant="ghost"
            className="h-11 hover:bg-slate-100 transition-colors duration-200 dark:hover:bg-slate-900"
          >
            Item One
          </Button>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Button
            variant="ghost"
            className="h-11 hover:bg-slate-100 transition-colors duration-200 dark:hover:bg-slate-900"
          >
            Item Two
          </Button>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <KindeButton type="logout" />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ) : (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <ThemeToggleButton />
        </NavigationMenuItem>

        <NavigationMenuItem>
          <KindeButton type="login" />
        </NavigationMenuItem>

        <NavigationMenuItem>
          <KindeButton type="signup" />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
