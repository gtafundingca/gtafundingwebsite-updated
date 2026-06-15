import { cn } from "@/lib/utils";
import { InstagramIcon } from "@/components/icons/instagram-icon";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { FullWidthDivider } from "@/components/full-width-divider";

export function Footer() {
	return (
		<footer className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-8 lg:px-10">
			<div className="grid grid-cols-1 gap-8 py-12 border-t border-zinc-200/60 dark:border-zinc-800/40 sm:grid-cols-3 md:grid-cols-6">
				<div className="flex flex-col gap-4 sm:col-span-3 md:col-span-3">
					<a className="w-fit border-transparent" href="/">
						<Logo className="h-16 w-auto" />
					</a>
					<p className="max-w-sm text-balance text-muted-foreground text-sm">
						Canada's fastest path from application to capital — built for owners who can't wait weeks for an answer.
					</p>
					<div className="flex gap-2">
						{socialLinks.map((item, index) => (
							<Button key={`social-${item.link}-${index}`} size="icon" variant="outline" render={<a href={item.link} target="_blank" />} nativeButton={false}>{item.icon}</Button>
						))}
					</div>
				</div>
				<div className="w-full">
					<span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Navigation</span>
					<div className="mt-2 flex flex-col gap-2">
						{navigation.map(({ href, title }) => (
							<a
								className="w-fit text-sm hover:underline text-muted-foreground hover:text-foreground transition-colors"
								href={href}
								key={title}
							>
								{title}
							</a>
						))}
					</div>
				</div>
				<div className="w-full">
					<span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Services</span>
					<div className="mt-2 flex flex-col gap-2">
						{services.map(({ href, title }) => (
							<a
								className="w-fit text-sm hover:underline text-muted-foreground hover:text-foreground transition-colors"
								href={href}
								key={title}
							>
								{title}
							</a>
						))}
					</div>
				</div>
				<div className="w-full">
					<span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Legal</span>
					<div className="mt-2 flex flex-col gap-2">
						{legal.map(({ href, title }) => (
							<a
								className="w-fit text-sm hover:underline text-muted-foreground hover:text-foreground transition-colors"
								href={href}
								key={title}
							>
								{title}
							</a>
						))}
					</div>
				</div>
			</div>
			<div className="flex items-center justify-center gap-2 py-8 border-t border-zinc-200/40 dark:border-zinc-800/20">
				<p className="text-center font-light text-muted-foreground text-sm">
					&copy; {new Date().getFullYear()} GTA Funding. All rights reserved.
				</p>
			</div>
		</footer>
	);
}

const navigation = [
	{
		title: "Home",
		href: "#",
	},
	{
		title: "Services",
		href: "#services",
	},
	{
		title: "Why GTA Funding",
		href: "#why-us",
	},
	{
		title: "Apply",
		href: "#contact-us",
	},
	{
		title: "Testimonials",
		href: "#testimonials",
	},
	{
		title: "Contact",
		href: "/contact",
	},
	{
		title: "Admin",
		href: "/admin",
	},
];

const services = [
	{
		title: "Merchant Cash Advance",
		href: "#services",
	},
	{
		title: "Women Entrepreneur Funding",
		href: "#services",
	},
	{
		title: "Startup Business Loan",
		href: "#services",
	},
	{
		title: "Lender network",
		href: "#why-us",
	},
	{
		title: "Fast approvals",
		href: "#why-us",
	},
];

const legal = [
	{
		title: "Privacy Policy",
		href: "#",
	},
	{
		title: "Terms of Service",
		href: "#",
	},
	{
		title: "Cookie Policy",
		href: "#",
	},
	{
		title: "Refund Policy",
		href: "#",
	},
];

const socialLinks = [
	{
		icon: <InstagramIcon />,
		link: "https://instagram.com/gtafunding",
	},
];
