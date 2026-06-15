import type React from "react";
import { cn } from "@/lib/utils";

export const Logo = ({ className, ...props }: React.ComponentProps<"img">) => (
	<img
		src="/logo.png"
		alt="GTA Funding"
		className={cn("brightness-0 dark:filter-none", className)}
		{...props}
	/>
);

export const LogoIcon = ({ className, ...props }: React.ComponentProps<"img">) => (
	<img
		src="/logo.png"
		alt="GTA Funding"
		className={cn("brightness-0 dark:filter-none", className)}
		{...props}
	/>
);
