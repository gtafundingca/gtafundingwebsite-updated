"use client";
import React from "react";
import { Marquee } from "@/components/ui/marquee";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestimonialItem {
	name: string;
	role: string;
	text: string;
	avatar: string;
}

const testimonialsData: TestimonialItem[] = [
	{
		name: "Sarah Jenkins",
		role: "Founder, Bloom Florals",
		text: "GTA Funding got us $45k within 24 hours. The application took 5 minutes, and we were able to stock inventory for our busiest season.",
		avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
	},
	{
		name: "Marcus Chen",
		role: "Owner, Chen Logistics",
		text: "With their access to 50+ lenders, we secured a low-rate expansion loan that other banks denied. Complete transparency throughout.",
		avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
	},
	{
		name: "David Kovacs",
		role: "MD, Apex Construction",
		text: "The revenue-based repayment plan is perfect for our seasonal cash flow. They look at the business potential, not just credit scores.",
		avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
	},
	{
		name: "Elena Rostova",
		role: "CEO, TechSpark Solutions",
		text: "Stellar support from start to finish. Our advisor walked us through term sheets with zero hidden charges. Highly recommended!",
		avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face"
	},
	{
		name: "Amira Patel",
		role: "Owner, Artisan Bakery",
		text: "Extremely fast approval. Low barrier to entry and absolute transparency. GTA Funding is the smart partner for small business growth.",
		avatar: "https://images.unsplash.com/photo-1534751516642-a131ffd107fd?w=150&h=150&fit=crop&crop=face"
	},
	{
		name: "Robert Vance",
		role: "Director, Vance Manufacturing",
		text: "85% approval rate is real. Our revenue was evaluated fairly, and funds were deposited in our account the next day.",
		avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
	}
];

// Split testimonials into two sets for the two rows
const firstRow = testimonialsData.slice(0, 3);
const secondRow = testimonialsData.slice(3, 6);

function TestimonialCard({ name, role, text, avatar }: TestimonialItem) {
	return (
		<figure
			className={cn(
				"relative w-[340px] cursor-pointer overflow-hidden rounded-2xl border p-6 flex flex-col justify-between",
				// light styles
				"border-zinc-200/60 bg-white hover:bg-zinc-50/50 shadow-xs hover:shadow-md transition-all duration-300",
				// dark styles
				"dark:border-zinc-800/40 dark:bg-zinc-950 dark:hover:bg-zinc-900/50"
			)}
		>
			<blockquote className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed mb-6 font-normal">
				"{text}"
			</blockquote>
			
			<div className="flex items-center gap-3">
				<img
					src={avatar}
					alt={name}
					className="size-9 rounded-full object-cover border border-zinc-200/50 dark:border-zinc-800"
					loading="lazy"
				/>
				<div className="flex flex-col">
					<figcaption className="text-sm font-bold text-foreground leading-none">
						{name}
					</figcaption>
					<span className="text-xs text-muted-foreground mt-1">
						{role}
					</span>
				</div>
			</div>
		</figure>
	);
}

export function TestimonialsSection() {
	return (
		<section id="testimonials" className="relative w-full pt-24 pb-12 sm:pt-32 sm:pb-16 overflow-hidden bg-background">
			<div className="mx-auto w-full max-w-[1400px] px-4 sm:px-8 lg:px-10">
				
				{/* Section Header */}
				<div className="flex flex-col items-center text-center gap-5 mb-16">
					<div
						className="group/pill mx-auto flex w-fit items-center gap-3 rounded-full border bg-card px-4 py-1 text-xs shadow-xs transition-all duration-300 hover:bg-muted cursor-pointer"
					>
						<span className="font-semibold text-foreground">Testimonials</span>
						<span className="block h-4 border-l border-border" />
						<span className="text-muted-foreground font-medium flex items-center gap-1">
							Client Success
							<ArrowRight className="size-3 duration-150 ease-out group-hover/pill:translate-x-0.5" />
						</span>
					</div>
					<h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl max-w-2xl leading-tight text-balance">
						What Our Clients Say
					</h2>
					<p className="max-w-xl text-base text-muted-foreground leading-relaxed">
						Discover how we've helped hundreds of businesses across Canada secure fast capital and scale their operations.
					</p>
				</div>

				{/* Marquees Container */}
				<div className="relative flex flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl py-4 w-full">
					{/* Left fade edge */}
					<div className="absolute inset-y-0 left-0 w-1/12 sm:w-1/6 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
					
					{/* Right fade edge */}
					<div className="absolute inset-y-0 right-0 w-1/12 sm:w-1/6 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

					{/* First Row Marquee (Left to Right) */}
					<Marquee pauseOnHover className="[--duration:25s] gap-4">
						{firstRow.map((t, idx) => (
							<TestimonialCard key={idx} {...t} />
						))}
					</Marquee>

					{/* Second Row Marquee (Right to Left / Reverse) */}
					<Marquee reverse pauseOnHover className="[--duration:25s] gap-4">
						{secondRow.map((t, idx) => (
							<TestimonialCard key={idx} {...t} />
						))}
					</Marquee>
				</div>

			</div>
		</section>
	);
}
