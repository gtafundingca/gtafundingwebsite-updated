"use client";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";

export const navLinks = [
	{
		label: "Services",
		href: "#services",
	},
	{
		label: "Why us",
		href: "#why-us",
	},
	{
		label: "Stories",
		href: "#testimonials",
	},
];

export function Header() {
	const scrolled = useScroll(10);

	return (
		<header
			className={cn("sticky top-0 z-50 w-full border-transparent border-b", {
				"border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50":
					scrolled,
			})}
		>
			<nav className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4">
				<a
					className="rounded-md p-2 hover:bg-muted dark:hover:bg-muted/50 border-transparent"
					href="/"
				>
					<Logo className="h-8 w-auto" />
				</a>
				<div className="hidden items-center gap-2 md:flex">
					{navLinks.map((link) => (
						<Button key={link.label} size="sm" variant="ghost" render={<a href={link.href} />} nativeButton={false}>{link.label}</Button>
					))}
					<ThemeToggle />
					<Button size="sm" render={<a href="/contact" />} nativeButton={false}>Contact</Button>
				</div>
				<div className="flex items-center gap-2 md:hidden">
					<ThemeToggle />
					<MobileNav />
				</div>
			</nav>
		</header>
	);
}
