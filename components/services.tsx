"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Check, X, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ServiceItem {
	id: string;
	num: string;
	tag: string;
	image: string;
	title: string;
	description: string;
	fullDescription: string;
	checklist: string[];
}

const servicesData: ServiceItem[] = [
	{
		id: "mca",
		num: "01",
		tag: "MERCHANT CASH ADVANCE",
		image: "/Revenue-based%20funding.jpg",
		title: "Revenue-based funding up to $500k",
		description: "Get a lump sum upfront and repay as a percentage of daily sales. No fixed payments,...",
		fullDescription: "Get a lump sum upfront and repay as a percentage of daily sales. No fixed payments, no collateral — just flexible funding that moves with your business.",
		checklist: [
			"Funding from $5,000 – $500,000",
			"Get funded in 24–48 hours",
			"No collateral required",
			"High approval rates"
		]
	},
	{
		id: "women",
		num: "02",
		tag: "WOMEN ENTREPRENEUR FUNDING",
		image: "/Women%20Entrepreneur.jpg",
		title: "Women Entrepreneur Loan Government-backed programs for female founders",
		description: "Designed to support women-owned businesses with access to capital, mentorship, and growt...",
		fullDescription: "Designed to support women-owned businesses with access to capital, mentorship, and growth opportunities through government-backed programs across Canada.",
		checklist: [
			"Lower barrier to entry",
			"Government-backed programs",
			"Flexible repayment options",
			"Mentorship & advisory support"
		]
	},
	{
		id: "grant",
		num: "03",
		tag: "GRANT ADVISORY",
		image: "/money.jpg",
		title: "Government grants are free money support",
		description: "Our grant advisory service provides tailored funding strategies for businesses seeking...",
		fullDescription: "Our grant advisory service provides tailored funding strategies for businesses seeking capital through government programs. Leveraging insights from Government of Canada funding databases, we identify high-probability opportunities and assist in crafting strong, compliant applications.",
		checklist: [
			"Targeted grant opportunity mapping",
			"Government program eligibility review",
			"Application strategy and compliance support",
			"End-to-end submission guidance"
		]
	},
	{
		id: "startup",
		num: "04",
		tag: "STARTUP BUSINESS LOAN",
		image: "/Launch%20your%20vision.jpg",
		title: "Launch your vision with flexible capital",
		description: "Access capital to launch your business, even with limited operational history. We evaluate t...",
		fullDescription: "Access capital to launch your business, even with limited operational history. We evaluate the potential of your business, not just your past credit score, providing the foundation you need to scale.",
		checklist: [
			"Funding up to $100,000",
			"Flexible credit requirements",
			"Build your business credit history",
			"Quick online application process"
		]
	}
];

export function ServicesSection() {
	const [activeOverview, setActiveOverview] = useState<ServiceItem | null>(null);
	const [activeApply, setActiveApply] = useState<ServiceItem | null>(null);

	// Form States
	const [formStep, setFormStep] = useState(1);
	const [formData, setFormData] = useState({
		productId: "",
		amount: "$25k - $100k",
		businessName: "",
		timeInBusiness: "1 - 3 years",
		revenue: "$20,000 - $50,000",
		fullName: "",
		email: "",
		phone: ""
	});
	const [submitting, setSubmitting] = useState(false);

	const handleOpenApply = (service: ServiceItem) => {
		setFormData(prev => ({ ...prev, productId: service.id }));
		setFormStep(1);
		setActiveApply(service);
		setActiveOverview(null); // Close overview if open
	};

	const handleFormSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (formStep < 3) {
			setFormStep(prev => prev + 1);
		} else {
			setSubmitting(true);
			try {
				const { error } = await supabase
					.from("inquiries")
					.insert([
						{
							name: formData.fullName,
							email: formData.email,
							phone: formData.phone,
							revenue: formData.revenue,
							amount: formData.amount,
							purpose: `Applied for ${
								formData.productId === "mca"
									? "Merchant Cash Advance"
									: formData.productId === "women"
									? "Women Entrepreneur Loan"
									: formData.productId === "grant"
									? "Grant Advisory Service"
									: "Startup Business Loan"
							}. Business Name: ${formData.businessName}`,
							status: "Pending",
							time_in_business: formData.timeInBusiness
						}
					]);

				if (error) throw error;
				
				setFormStep(4); // Success step
			} catch (err: any) {
				alert(err.message || "Something went wrong. Please try again.");
			} finally {
				setSubmitting(false);
			}
		}
	};

	const resetForm = () => {
		setActiveApply(null);
		setFormStep(1);
		setFormData({
			productId: "",
			amount: "$25k - $100k",
			businessName: "",
			timeInBusiness: "1 - 3 years",
			revenue: "$20,000 - $50,000",
			fullName: "",
			email: "",
			phone: ""
		});
	};

	return (
		<section className="mx-auto w-full max-w-[1400px] pt-12 pb-24 px-4 sm:px-8 lg:px-10">
			{/* Grid Layout */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto">
				{servicesData.map((service, index) => {
					const isHighlighted = index === 0; // Highlight the Merchant Cash Advance as popular
					
					let bigText = "";
					let smallText = "";
					let subtext = "";
					let description = "";

					if (service.id === "mca") {
						bigText = "$500k";
						smallText = "limit";
						subtext = "flexible repayment options";
						description = "For businesses seeking fast capital";
					} else if (service.id === "women") {
						bigText = "Female";
						smallText = "founder";
						subtext = "specialized advisory support";
						description = "For female-founded businesses";
					} else if (service.id === "grant") {
						bigText = "Grants";
						smallText = "advisory";
						subtext = "non-repayable capital mapping";
						description = "For free government funding search";
					} else {
						bigText = "$100k";
						smallText = "limit";
						subtext = "no past credit requirements";
						description = "For newly launched businesses";
					}

					return (
						<div
							key={service.id}
							className={cn(
								"group/card relative flex flex-col rounded-[32px] overflow-hidden border transition-all duration-500 ease-out hover:-translate-y-2 w-full",
								isHighlighted
									? "bg-zinc-950 border-zinc-800 text-white shadow-2xl hover:border-zinc-700"
									: "bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 text-foreground shadow-xs hover:shadow-[0_24px_50px_-12px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_24px_50px_-12px_rgba(0,0,0,0.4)] hover:border-zinc-300 dark:hover:border-zinc-700"
							)}
						>
							{/* Bleeding Image Container */}
							<div className="relative h-56 sm:h-64 w-full overflow-hidden">
								<img
									src={service.image}
									alt={service.title}
									className="size-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.03]"
									loading="lazy"
								/>
								<div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-70" />
								
								{/* Tag Badge */}
								<div className="absolute bottom-3 left-4 bg-black/45 backdrop-blur-md border border-white/10 text-white rounded-full px-3 py-1.5 text-[9px] tracking-wider uppercase font-semibold flex items-center gap-1.5 shadow-sm">
									<span className="bg-emerald-400 size-1.5 rounded-full animate-pulse" />
									{service.tag}
								</div>
							</div>

							{/* Card Body - Paddings applied here */}
							<div className="flex flex-col flex-1 p-6 sm:p-8">
								<div className="flex flex-col gap-1">
									<div className="flex items-start justify-between gap-2">
										<h3 className="font-bold text-lg leading-snug">
											{service.id === "mca" ? "Merchant Cash Advance" : service.id === "women" ? "Women Entrepreneur Loan" : service.id === "grant" ? "Grant Advisory Service" : "Startup Business Loan"}
										</h3>
										{isHighlighted && (
											<span className="bg-zinc-900 text-zinc-300 text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border border-zinc-800 flex items-center gap-1 shrink-0">
												★ Popular
											</span>
										)}
									</div>
									<p className={cn("text-xs leading-relaxed mt-1", isHighlighted ? "text-zinc-400" : "text-muted-foreground")}>
										{description}
									</p>
								</div>

								<div className="mt-6 flex flex-col gap-1">
									<div className="flex items-baseline gap-1.5">
										<span className="text-4xl font-extrabold tracking-tight">{bigText}</span>
										<span className={cn("text-sm font-medium", isHighlighted ? "text-zinc-400" : "text-muted-foreground")}>{smallText}</span>
									</div>
									<p className={cn("text-[10px] font-semibold uppercase tracking-wider mt-1", isHighlighted ? "text-zinc-500" : "text-zinc-400")}>
										{subtext}
									</p>
								</div>

								<hr className={cn("my-6 border-0 h-px", isHighlighted ? "bg-zinc-800/80" : "bg-zinc-200/60 dark:bg-zinc-800/40")} />

								<ul className="space-y-4 flex-1">
									{service.checklist.map((item, idx) => (
										<li key={idx} className="flex items-start gap-3">
											<div className={cn(
												"size-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5",
												isHighlighted 
													? "bg-zinc-900 border-zinc-800 text-white" 
													: "bg-zinc-50 dark:bg-zinc-950 border-zinc-200/60 dark:border-zinc-800/60 text-zinc-900 dark:text-zinc-100"
											)}>
												<Check className="size-3 stroke-[2.5]" />
											</div>
											<span className={cn("text-sm leading-snug", isHighlighted ? "text-zinc-300" : "text-muted-foreground")}>
												{item}
											</span>
										</li>
									))}
								</ul>

								<div className="mt-8 pt-4 flex flex-col gap-3">
									<Button
										className={cn(
											"w-full rounded-2xl py-6 font-bold shadow-xs hover:shadow-md transition-all text-sm cursor-pointer",
											isHighlighted
												? "bg-white hover:bg-zinc-100 text-zinc-950"
												: "bg-zinc-950 hover:bg-zinc-900 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-950"
										)}
										onClick={() => {
											if (service.id === "mca") {
												window.location.href = "/gta-funding-mca";
											} else {
												handleOpenApply(service);
											}
										}}
									>
										Apply Now
									</Button>
									<button
										className={cn(
											"w-full text-center text-xs font-semibold transition-colors cursor-pointer hover:underline py-1.5",
											isHighlighted
												? "text-zinc-400 hover:text-white"
												: "text-muted-foreground hover:text-foreground"
											)}
											onClick={() => setActiveOverview(service)}
										>
											View program details
										</button>
									</div>
								</div>
							</div>
					);
				})}
			</div>

			{/* 1. VIEW OVERVIEW MODAL */}
			{activeOverview && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					{/* Backdrop */}
					<div 
						className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" 
						onClick={() => setActiveOverview(null)}
					/>
					
					{/* Content Card */}
					<div className="relative bg-white dark:bg-zinc-950 rounded-[28px] max-w-xl w-full overflow-hidden shadow-2xl z-10 border border-border animate-in fade-in zoom-in-95 duration-200">
						{/* Close button */}
						<button
							className="absolute top-4 right-4 bg-white/90 dark:bg-zinc-900/90 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-muted-foreground hover:text-foreground rounded-full size-8 flex items-center justify-center border border-border/80 shadow-xs z-20 transition-colors cursor-pointer"
							onClick={() => setActiveOverview(null)}
						>
							<X className="size-4" />
						</button>

						{/* Top Image Banner */}
						<div className="relative h-48 w-full overflow-hidden">
							<img
								src={activeOverview.image}
								alt={activeOverview.title}
								className="size-full object-cover"
							/>
							<div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
							<div className="absolute bottom-4 left-6 flex items-center gap-2">
								<span className="bg-emerald-400 size-2 rounded-full" />
								<span className="text-[10px] text-white/90 font-bold uppercase tracking-wider bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-xs">
									{activeOverview.tag}
								</span>
							</div>
						</div>

						{/* Details Body */}
						<div className="p-6 md:p-8">
							<h3 className="text-2xl font-bold tracking-tight text-foreground">
								{activeOverview.id === "women" ? "Women Entrepreneur Funding" : activeOverview.id === "grant" ? "Grant Advisory Service" : activeOverview.id === "mca" ? "Merchant Cash Advance" : "Startup Business Loan"}
							</h3>
							<p className="text-sm text-muted-foreground mt-3 leading-relaxed">
								{activeOverview.fullDescription}
							</p>

							{/* Checklist Grid */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-6 border-t border-b border-border/40 py-6">
								{activeOverview.checklist.map((item, idx) => (
									<div key={idx} className="flex items-center gap-2.5 text-sm text-foreground/80 font-medium">
										<div className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-full p-1 shrink-0 border border-border/60">
											<Check className="size-3.5 stroke-[3]" />
										</div>
										<span>{item}</span>
									</div>
								))}
							</div>

							{/* Footer Actions */}
							<div className="flex flex-col sm:flex-row items-center justify-end gap-3 mt-6">
								<button
									className="w-full sm:w-auto text-muted-foreground hover:text-foreground font-semibold text-sm px-5 py-2.5 text-center transition-colors cursor-pointer"
									onClick={() => setActiveOverview(null)}
								>
									Close
								</button>
								<Button
									className="w-full sm:w-auto rounded-full bg-zinc-950 hover:bg-zinc-900 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 px-6 py-3 text-sm font-semibold shadow-xs cursor-pointer"
									onClick={() => {
										if (activeOverview.id === "mca") {
											window.location.href = "/gta-funding-mca";
										} else {
											handleOpenApply(activeOverview);
										}
									}}
								>
									Apply for funding
								</Button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* 2. MULTI-STEP APPLY FORM MODAL */}
			{activeApply && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					{/* Backdrop */}
					<div 
						className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" 
						onClick={resetForm}
					/>

					{/* Form Container */}
					<div className="relative bg-white dark:bg-zinc-950 rounded-[28px] max-w-xl w-full overflow-hidden shadow-2xl z-10 border border-border animate-in fade-in zoom-in-95 duration-200">
						{/* Close */}
						<button
							className="absolute top-5 right-5 text-muted-foreground hover:text-foreground rounded-full size-8 flex items-center justify-center hover:bg-muted transition-colors z-20 cursor-pointer"
							onClick={resetForm}
						>
							<X className="size-4" />
						</button>

						{/* Form Content */}
						<div className="p-6 md:p-8">
							{/* Step Indicator Header */}
							{formStep < 4 && (
								<div className="mb-6">
									<div className="flex justify-between items-center text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">
										<span>Apply for {servicesData.find(s => s.id === formData.productId)?.tag.toLowerCase().replace(/_/g, ' ')}</span>
										<span>Step {formStep} of 3</span>
									</div>
									<div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
										<div 
											className="h-full bg-zinc-950 dark:bg-zinc-50 rounded-full transition-all duration-300"
											style={{ width: `${(formStep / 3) * 100}%` }}
										/>
									</div>
								</div>
							)}

							<form onSubmit={handleFormSubmit}>
								{/* STEP 1: Funding Needs */}
								{formStep === 1 && (
									<div className="space-y-5">
										<div>
											<h3 className="text-xl font-bold text-foreground">How much capital do you need?</h3>
											<p className="text-xs text-muted-foreground mt-1">Select the funding product and range that fits your requirements.</p>
										</div>

										<div className="space-y-4 pt-2">
											<div className="flex flex-col gap-2">
												<label className="text-xs font-bold uppercase text-foreground/80 tracking-wider">Select Product</label>
												<select
													className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-sm focus:border-zinc-950 dark:focus:border-zinc-50 outline-none text-foreground"
													value={formData.productId}
													onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
													required
												>
													{servicesData.map(s => (
														<option key={s.id} value={s.id} className="text-foreground bg-white dark:bg-zinc-900">
															{s.id === "mca" ? "Merchant Cash Advance" : s.id === "women" ? "Women Entrepreneur Loan" : s.id === "grant" ? "Government Grant Advisory" : "Startup Business Loan"}
														</option>
													))}
												</select>
											</div>

											<div className="flex flex-col gap-2">
												<label className="text-xs font-bold uppercase text-foreground/80 tracking-wider">Funding Amount Needed</label>
												<div className="grid grid-cols-2 gap-2">
													{["$5k - $25k", "$25k - $100k", "$100k - $250k", "$250k+"].map((option) => (
														<button
															type="button"
															key={option}
															className={cn(
																"border text-sm font-semibold rounded-xl py-3 text-center transition-all cursor-pointer",
																formData.amount === option
																	? "bg-zinc-50 dark:bg-zinc-900 border-zinc-950 dark:border-zinc-50 text-zinc-950 dark:text-zinc-50 shadow-xs"
																	: "border-border hover:border-foreground/45 text-foreground/80"
															)}
															onClick={() => setFormData({ ...formData, amount: option })}
														>
															{option}
														</button>
													))}
												</div>
											</div>
										</div>
									</div>
								)}

								{/* STEP 2: Business details */}
								{formStep === 2 && (
									<div className="space-y-5">
										<div>
											<h3 className="text-xl font-bold text-foreground">Tell us about your business</h3>
											<p className="text-xs text-muted-foreground mt-1">We analyze your current operations to match the best lending parameters.</p>
										</div>

										<div className="space-y-4 pt-2">
											<div className="flex flex-col gap-2">
												<label className="text-xs font-bold uppercase text-foreground/80 tracking-wider">Legal Business Name</label>
												<input
													type="text"
													placeholder="Enter registered business name"
													className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-sm focus:border-zinc-950 dark:focus:border-zinc-50 outline-none text-foreground"
													value={formData.businessName}
													onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
													required
												/>
											</div>

											<div className="flex flex-col gap-2">
												<label className="text-xs font-bold uppercase text-foreground/80 tracking-wider">Time in Business</label>
												<select
													className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-sm focus:border-zinc-950 dark:focus:border-zinc-50 outline-none text-foreground"
													value={formData.timeInBusiness}
													onChange={(e) => setFormData({ ...formData, timeInBusiness: e.target.value })}
													required
												>
													<option value="Less than 6 months" className="text-foreground bg-white dark:bg-zinc-900">Less than 6 months</option>
													<option value="6 months - 1 year" className="text-foreground bg-white dark:bg-zinc-900">6 months - 1 year</option>
													<option value="1 - 3 years" className="text-foreground bg-white dark:bg-zinc-900">1 - 3 years</option>
													<option value="3+ years" className="text-foreground bg-white dark:bg-zinc-900">3+ years</option>
												</select>
											</div>

											<div className="flex flex-col gap-2">
												<label className="text-xs font-bold uppercase text-foreground/80 tracking-wider">Average Monthly Revenue</label>
												<select
													className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-sm focus:border-zinc-950 dark:focus:border-zinc-50 outline-none text-foreground"
													value={formData.revenue}
													onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
													required
												>
													<option value="Less than $5,000" className="text-foreground bg-white dark:bg-zinc-900">Less than $5,000</option>
													<option value="$5,000 - $20,000" className="text-foreground bg-white dark:bg-zinc-900">$5,000 - $20,000</option>
													<option value="$20,000 - $50,000" className="text-foreground bg-white dark:bg-zinc-900">$20,000 - $50,000</option>
													<option value="$50,000+" className="text-foreground bg-white dark:bg-zinc-900">$50,000+</option>
												</select>
											</div>
										</div>
									</div>
								)}

								{/* STEP 3: Contact details */}
								{formStep === 3 && (
									<div className="space-y-5">
										<div>
											<h3 className="text-xl font-bold text-foreground">Who should we contact?</h3>
											<p className="text-xs text-muted-foreground mt-1">Our financing specialists will reach out via email or phone within 24 hours.</p>
										</div>

										<div className="space-y-4 pt-2">
											<div className="flex flex-col gap-2">
												<label className="text-xs font-bold uppercase text-foreground/80 tracking-wider">Full Name</label>
												<input
													type="text"
													placeholder="Your full name"
													className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-sm focus:border-zinc-950 dark:focus:border-zinc-50 outline-none text-foreground"
													value={formData.fullName}
													onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
													required
												/>
											</div>

											<div className="flex flex-col gap-2">
												<label className="text-xs font-bold uppercase text-foreground/80 tracking-wider">Email Address</label>
												<input
													type="email"
													placeholder="name@company.com"
													className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-sm focus:border-zinc-950 dark:focus:border-zinc-50 outline-none text-foreground"
													value={formData.email}
													onChange={(e) => setFormData({ ...formData, email: e.target.value })}
													required
												/>
											</div>

											<div className="flex flex-col gap-2">
												<label className="text-xs font-bold uppercase text-foreground/80 tracking-wider">Phone Number</label>
												<input
													type="tel"
													placeholder="(647) 555-0199"
													className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-sm focus:border-zinc-950 dark:focus:border-zinc-50 outline-none text-foreground"
													value={formData.phone}
													onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
													required
												/>
											</div>
										</div>
									</div>
								)}

								{/* STEP 4: Success View */}
								{formStep === 4 && (
									<div className="flex flex-col items-center text-center py-6">
										<div className="size-16 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 rounded-full flex items-center justify-center mb-6 border border-emerald-100">
											<Check className="size-8 stroke-[3]" />
										</div>
										<h3 className="text-2xl font-bold text-foreground">Application Submitted!</h3>
										<p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-sm">
											Thank you, <span className="font-semibold text-foreground">{formData.fullName}</span>! We have received your request for <span className="font-semibold text-zinc-950 dark:text-zinc-50">{formData.amount}</span> in funding for <span className="font-semibold text-foreground">{formData.businessName}</span>.
										</p>
										<div className="mt-6 p-4 bg-muted/40 rounded-2xl w-full max-w-sm text-center text-xs text-muted-foreground">
											<span>A GTA Funding specialist will review your information and reach out within 24 hours.</span>
										</div>

										<Button
											type="button"
											className="mt-8 rounded-full bg-zinc-950 hover:bg-zinc-900 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 px-8 py-3 font-semibold w-full max-w-xs shadow-xs cursor-pointer"
											onClick={resetForm}
										>
											Done
										</Button>
									</div>
								)}

								{/* Footer Buttons for Forms */}
								{formStep < 4 && (
									<div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-border/40">
										{formStep > 1 && (
											<button
												type="button"
												className="text-muted-foreground hover:text-foreground font-semibold text-sm px-5 py-2.5 cursor-pointer"
												disabled={submitting}
												onClick={() => setFormStep(prev => prev - 1)}
											>
												Back
											</button>
										)}
										<Button
											type="submit"
											disabled={submitting}
											className="rounded-full bg-zinc-950 hover:bg-zinc-900 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 px-6 py-2.5 text-sm font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
										>
											{submitting ? (
												<>
													<Loader2 className="size-4 animate-spin" /> Submitting...
												</>
											) : formStep === 3 ? (
												"Submit Application"
											) : (
												<>
													Next <ArrowRight className="size-4" />
												</>
											)}
										</Button>
									</div>
								)}
							</form>
						</div>
					</div>
				</div>
			)}
		</section>
	);
}
