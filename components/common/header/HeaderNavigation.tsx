"use client";

import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserSession } from "@/hooks/hooks";
import KindeButton from "@components/common/KindeButton";
import { ThemeToggleButton } from "@components/common/theme-toggle-button";

export default function HeaderNavigation() {
  const { isLoading, userSession } = useUserSession();

  if (isLoading && !userSession)
    return (
      <div className="flex gap-2">
        <Skeleton className="w-12 h-11 rounded-sm" />
        <Skeleton className="w-24 h-11" />
        <Skeleton className="w-24 h-11" />
      </div>
    );

  return userSession?.isAuthenticated ? (
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
