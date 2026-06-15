"use client";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { RocketIcon, ArrowRightIcon } from "lucide-react";

export function HeroSection() {
	return (
		<section className="relative w-full overflow-hidden z-0">
			{/* Background Image with Overlay */}
			<div className="absolute inset-x-0 top-0 -z-10 h-full w-full overflow-hidden">
				<img
					src="/herobg.jpg"
					alt="Toronto skyline growth background"
					className="size-full object-cover object-[center_35%] opacity-100 pointer-events-none"
				/>
				<div className="absolute inset-0 bg-background/45 dark:bg-background/80" />
			</div>

			<div className="mx-auto w-full max-w-5xl px-4 sm:px-8 lg:px-10">
				{/* Top Shades */}
				<div
					aria-hidden="true"
					className="absolute inset-0 isolate hidden overflow-hidden contain-strict lg:block"
				>
					<div className="absolute inset-0 -top-14 isolate -z-10 bg-[radial-gradient(35%_80%_at_49%_0%,--theme(--color-foreground/.05),transparent)] contain-strict" />
				</div>

				{/* main content */}

				<div className="relative flex flex-col items-center justify-center gap-5 pt-32 pb-28 sm:pb-36 md:pb-44">



				<a
					className={cn(
						"group mx-auto flex w-fit items-center gap-3 rounded-full border bg-card px-3 py-1 shadow",
						"fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards transition-all delay-500 duration-500 ease-out"
					)}
					href="#link"
				>
					<RocketIcon className="size-3 text-muted-foreground" />
					<span className="text-xs">Canada's Fastest Business Funding</span>
					<span className="block h-5 border-l" />

					<ArrowRightIcon className="size-3 duration-150 ease-out group-hover:translate-x-1" />
				</a>

				<h1
					className={cn(
						"fade-in slide-in-from-bottom-10 animate-in text-balance fill-mode-backwards text-center text-4xl tracking-tight delay-100 duration-500 ease-out md:text-5xl lg:text-6xl",
						"text-shadow-[0_0px_50px_theme(--color-foreground/.2)]"
					)}
				>
					Get Funded <br /> No Waiting.
				</h1>

				<p className="fade-in slide-in-from-bottom-10 mx-auto max-w-xl animate-in fill-mode-backwards text-center text-base text-foreground/95 font-medium tracking-wider delay-200 duration-500 ease-out sm:text-lg md:text-xl">
					Access flexible capital in as little as 24 hours. No red tape, no hassle — just straightforward funding that grows with your business.
				</p>

				<div className="fade-in slide-in-from-bottom-10 flex animate-in flex-row flex-wrap items-center justify-center gap-3 fill-mode-backwards pt-2 delay-300 duration-500 ease-out">
					<ShimmerButton
						className="rounded-full px-6 py-2.5 h-auto text-sm font-semibold cursor-pointer group inline-flex items-center justify-center gap-2 shadow-2xl transition-all duration-300 hover:scale-[1.03]"
						onClick={(e) => {
							e.preventDefault();
							document.getElementById("contact-us")?.scrollIntoView({ behavior: "smooth" });
						}}
					>
						<span>Apply Now</span>
						<ArrowRightIcon className="size-4 duration-150 ease-out group-hover:translate-x-1" />
					</ShimmerButton>
				</div>

				{/* Stats Section */}
				<div className="fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards delay-400 duration-500 ease-out mt-16 grid grid-cols-2 gap-8 md:grid-cols-4 pt-10 w-full max-w-4xl">
					<div className="flex flex-col items-center text-center">
						<span className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
							$500K
						</span>
						<span className="text-sm font-medium text-muted-foreground mt-1">
							Funded
						</span>
					</div>
					<div className="flex flex-col items-center text-center">
						<span className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
							1,500+
						</span>
						<span className="text-sm font-medium text-muted-foreground mt-1">
							Businesses Served
						</span>
					</div>
					<div className="flex flex-col items-center text-center">
						<span className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
							50+
						</span>
						<span className="text-sm font-medium text-muted-foreground mt-1">
							Lender Network
						</span>
					</div>
					<div className="flex flex-col items-center text-center">
						<span className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
							24 hrs
						</span>
						<span className="text-sm font-medium text-muted-foreground mt-1">
							Avg. Approval
						</span>
					</div>
				</div>

				{/* Services Section Header (Moved here for continuous background and wave transition) */}
				<div id="services" className="scroll-mt-20 flex flex-col items-center text-center gap-4 mt-24 w-full z-10 fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards delay-500 duration-500 ease-out">
					<h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
						Funding Solutions for Every Business
					</h2>
					<p className="max-w-2xl text-base text-foreground/85 font-medium sm:text-lg leading-relaxed">
						From day-one startups to scaling enterprises, GTA Funding has a funding product that fits your journey.
					</p>
				</div>
			</div>
			</div>

			{/* Wave Divider */}
			<div className="absolute bottom-0 left-0 w-full overflow-hidden line-height-0 translate-y-px z-10">
				<svg
					viewBox="0 0 1440 120"
					preserveAspectRatio="none"
					className="relative block w-full h-[40px] sm:h-[60px] md:h-[80px] text-background fill-current"
				>
					<path
						d="M0,64 C288,160 576,0 864,64 C1152,128 1320,32 1440,64 L1440,120 L0,120 Z"
					></path>
				</svg>
			</div>
		</section>
	);
}
