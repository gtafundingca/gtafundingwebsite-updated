"use client";
import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
	const [theme, setTheme] = useState<"light" | "dark">("light");

	useEffect(() => {
		// Sync local state with document class list
		const isDark = document.documentElement.classList.contains("dark");
		setTheme(isDark ? "dark" : "light");
	}, []);

	const toggleTheme = () => {
		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);
		localStorage.setItem("theme", newTheme);
		
		if (newTheme === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	};

	return (
		<Button
			onClick={toggleTheme}
			variant="ghost"
			size="icon"
			className="rounded-full size-9 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
			aria-label="Toggle theme"
			nativeButton={true}
		>
			{theme === "light" ? (
				<Moon className="size-4.5" />
			) : (
				<Sun className="size-4.5" />
			)}
		</Button>
	);
}
