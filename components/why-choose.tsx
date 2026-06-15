"use client";
import React from "react";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface WhyChooseItem {
	id: string;
	title: string;
	description: string;
	checklist: string[];
}

const whyChooseData: WhyChooseItem[] = [
	{
		id: "approvals",
		title: "Lightning Fast Approvals",
		description: "No endless paperwork or week-long waits. Our streamlined process means your application is reviewed within hours, and funding hits your account in as little as 24 hours. Built for businesses that can't afford to wait.",
		checklist: [
			"Decision in hours, not weeks",
			"Funds deposited within 24hrs",
			"Minimal documentation required"
		]
	},
	{
		id: "lenders",
		title: "Access to 50+ Lenders",
		description: "We don't work with a single bank — we shop Canada's largest lender network on your behalf. This means better rates, flexible terms, and offers tailored specifically to your business situation.",
		checklist: [
			"Curated lender matching",
			"Best-rate guarantee",
			"One application, multiple offers"
		]
	},
	{
		id: "rates",
		title: "Industry-High Approval Rate",
		description: "Low credit score? Limited history? We evaluate the potential of your business, not just a number. Our 85% approval rate speaks for itself — because we believe every business deserves a shot.",
		checklist: [
			"Credit scores as low as 500",
			"Revenue-based evaluation",
			"85% approval rate"
		]
	},
	{
		id: "transparency",
		title: "Complete Transparency",
		description: "No hidden fees, no fine print, no surprises. We walk you through every detail of your funding agreement before you sign. What you see is exactly what you get — honest, straightforward funding.",
		checklist: [
			"Zero hidden charges",
			"Transparent term sheets",
			"Dedicated advisor support"
		]
	}
];

export function WhyChooseSection() {
	return (
		<section id="why-us" className="relative w-full bg-zinc-950 py-20 sm:py-28 scroll-mt-16 overflow-hidden">
			{/* Background Radial Glow */}
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

			<div className="mx-auto w-full max-w-[1400px] px-4 sm:px-8 lg:px-10">
				{/* Section Header */}
				<div className="flex flex-col items-center text-center gap-5 mb-14">
					<div
						className="group/pill mx-auto flex w-fit items-center gap-3 rounded-full border border-zinc-800 bg-zinc-900/50 px-3.5 py-1 text-xs shadow-md transition-all duration-300 hover:bg-zinc-900 cursor-pointer"
					>
						<Sparkles className="size-3.5 text-sky-400 fill-sky-400/10 animate-pulse" />
						<span className="font-semibold text-white">Why Choose Us</span>
						<span className="block h-4 border-l border-zinc-800" />
						<span className="text-zinc-400 font-medium flex items-center gap-1">
							The Smart Way
							<ArrowRight className="size-3 duration-150 ease-out group-hover/pill:translate-x-0.5 text-zinc-400" />
						</span>
					</div>
					<h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl max-w-2xl leading-tight text-balance mt-2">
						The Smart Way to <br className="sm:hidden" /> Fund Your Growth
					</h2>
				</div>

				{/* Grid Layout */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
					{whyChooseData.map((item) => (
						<div
							key={item.id}
							className={cn(
								"group flex flex-col justify-between bg-linear-to-b from-[#121215] to-[#0a0a0c] border border-zinc-900 rounded-[22px] p-5 sm:p-7 lg:p-8 shadow-2xl hover:shadow-[0_20px_50px_rgba(56,189,248,0.02)] transition-all duration-500 ease-out hover:-translate-y-1 hover:border-zinc-800 w-full relative overflow-hidden"
							)}
						>
							{/* Subtle top border gradient glow */}
							<div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
							
							{/* Spotlight gradient effect */}
							<div className="absolute -inset-x-20 -top-20 -z-10 aspect-square rounded-full bg-sky-500/5 opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-700 pointer-events-none" />

							<div>
								{/* Card Title */}
								<h3 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-tight">
									{item.title}
								</h3>

								{/* Card Description */}
								<p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mt-3 sm:mt-4 font-normal">
									{item.description}
								</p>
							</div>

							{/* Checklist */}
							<div className="mt-5 sm:mt-6 pt-3 flex flex-col gap-2.5">
								{item.checklist.map((check, idx) => (
									<div key={idx} className="flex items-start gap-2.5 group/item">
										<Check className="size-4 text-sky-400 shrink-0 mt-0.5 group-hover/item:text-sky-300 transition-colors duration-200" />
										<span className="text-zinc-300 text-xs sm:text-sm font-medium">
											{check}
										</span>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
