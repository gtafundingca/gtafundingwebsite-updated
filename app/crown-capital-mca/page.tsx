"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { 
	ArrowLeft, 
	ArrowRight, 
	Check, 
	Loader2, 
	Building2, 
	FileText, 
	Phone, 
	Mail, 
	Calendar, 
	Globe, 
	Briefcase, 
	ShieldCheck,
	User
} from "lucide-react";

export default function CrownCapitalMcaPage() {
	const router = useRouter();
	const [step, setStep] = useState(1);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");

	// Form State
	const [formData, setFormData] = useState({
		// Step 1: Business Information
		businessName: "",
		operatingName: "",
		streetAddress: "",
		streetAddressLine2: "",
		city: "",
		state: "",
		postalCode: "",
		businessPhone: "",
		businessEmail: "",
		incorporationDate: "",
		businessNumber: "",
		website: "",
		industry: "",
		entityType: "",
		entityTypeOther: "",
		numberOfEmployees: "",
		propertyType: "",

		// Step 2: Funding & Contact Info
		amountRequested: "$25k - $100k",
		monthlyRevenue: "$20,000 - $50,000",
		useOfFunds: "",
		ownerName: "",
		ownerPhone: "",
		ownerEmail: ""
	});

	// Handle Phone Formatting: (000) 000-0000
	const formatPhoneNumber = (value: string) => {
		if (!value) return value;
		const phoneNumber = value.replace(/[^\d]/g, "");
		const phoneNumberLength = phoneNumber.length;
		if (phoneNumberLength < 4) return phoneNumber;
		if (phoneNumberLength < 7) {
			return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
		}
		return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
	};

	const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: "businessPhone" | "ownerPhone") => {
		const formatted = formatPhoneNumber(e.target.value);
		setFormData(prev => ({ ...prev, [fieldName]: formatted }));
	};

	// Form validation before proceeding to Step 2
	const validateStep1 = () => {
		const requiredFields = [
			"businessName",
			"operatingName",
			"streetAddress",
			"city",
			"state",
			"postalCode",
			"businessPhone",
			"businessEmail",
			"incorporationDate",
			"businessNumber",
			"website",
			"industry",
			"entityType",
			"numberOfEmployees",
			"propertyType"
		] as const;

		for (const field of requiredFields) {
			if (!formData[field]) {
				setError(`Please fill out all required fields.`);
				return false;
			}
		}

		if (formData.entityType === "Other" && !formData.entityTypeOther) {
			setError("Please specify your custom Entity Type.");
			return false;
		}

		// Basic phone length validation: (000) 000-0000 is 14 chars
		if (formData.businessPhone.length < 14) {
			setError("Please enter a valid business phone number in format: (000) 000-0000.");
			return false;
		}

		setError("");
		return true;
	};

	const handleNext = (e: React.MouseEvent) => {
		e.preventDefault();
		if (validateStep1()) {
			setStep(2);
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	const handleBack = (e: React.MouseEvent) => {
		e.preventDefault();
		setStep(1);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.ownerName || !formData.ownerPhone || !formData.ownerEmail || !formData.useOfFunds) {
			setError("Please fill out all owner and funding information fields.");
			return;
		}

		if (formData.ownerPhone.length < 14) {
			setError("Please enter a valid owner phone number in format: (000) 000-0000.");
			return;
		}

		setSubmitting(true);
		setError("");

		try {
			// Structured metadata container
			const metadata = {
				type: "crown-capital-mca",
				businessName: formData.businessName,
				operatingName: formData.operatingName,
				address: {
					street: formData.streetAddress,
					line2: formData.streetAddressLine2,
					city: formData.city,
					state: formData.state,
					zip: formData.postalCode
				},
				businessPhone: formData.businessPhone,
				businessEmail: formData.businessEmail,
				incorporationDate: formData.incorporationDate,
				businessNumber: formData.businessNumber,
				website: formData.website,
				industry: formData.industry,
				entityType: formData.entityType === "Other" ? formData.entityTypeOther : formData.entityType,
				numberOfEmployees: formData.numberOfEmployees,
				propertyType: formData.propertyType,
				ownerName: formData.ownerName,
				ownerPhone: formData.ownerPhone,
				ownerEmail: formData.ownerEmail,
				useOfFunds: formData.useOfFunds
			};

			const { error: insertError } = await supabase
				.from("inquiries")
				.insert([
					{
						name: formData.ownerName,
						email: formData.ownerEmail,
						phone: formData.ownerPhone,
						revenue: formData.monthlyRevenue,
						amount: formData.amountRequested,
						purpose: JSON.stringify(metadata),
						status: "Pending",
						time_in_business: `Incorporated: ${formData.incorporationDate}`
					}
				]);

			if (insertError) throw insertError;

			setStep(3); // Go to success view
			window.scrollTo({ top: 0, behavior: "smooth" });
		} catch (err: any) {
			console.error("Error submitting MCA application:", err);
			setError(err.message || "Something went wrong. Please try again.");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen bg-[#0A0A0A] text-zinc-100 font-sans flex flex-col relative overflow-hidden">
			{/* Drifting Background Glow Blobs */}
			<div className="absolute top-[-25%] left-[-15%] w-[60%] aspect-square rounded-full bg-blue-900/10 blur-[130px] pointer-events-none -z-10" />
			<div className="absolute bottom-[-20%] right-[-10%] w-[55%] aspect-square rounded-full bg-indigo-950/15 blur-[140px] pointer-events-none -z-10" />
			<div className="absolute inset-0 bg-dot-grid opacity-[0.05] pointer-events-none -z-10" />

			{/* Brand Header */}
			<header className="sticky top-0 z-50 w-full border-b border-zinc-900/80 bg-[#0A0A0A]/90 backdrop-blur-md">
				<div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
					<a href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
						<Logo className="h-7 w-auto filter-none brightness-100" />
						<div className="flex items-center gap-1.5 ml-0.5">
							<span className="h-3.5 w-px bg-zinc-800" />
							<span className="text-[9px] bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
								Crown Capital
							</span>
						</div>
					</a>
					<Button
						variant="outline"
						size="sm"
						render={<a href="/" />}
						nativeButton={false}
						className="border-zinc-800 hover:bg-zinc-900 hover:text-white rounded-xl text-xs"
					>
						Back to Website
					</Button>
				</div>
			</header>

			{/* Main Content Form Wrapper */}
			<main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20 z-10">
				<div className="w-full max-w-3xl bg-[#0F0F0F] border border-zinc-900 rounded-[32px] p-6 sm:p-10 lg:p-12 shadow-[0_30px_70px_rgba(0,0,0,0.85)] relative overflow-hidden">
					{/* Blue Accent Border at the top */}
					<div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-blue-500 via-indigo-550 to-blue-550" />

					{step < 3 && (
						<div className="mb-8 border-b border-zinc-900 pb-6">
							<h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
								Crown Capital Merchant Cash Advance Application Form
							</h1>
							<p className="text-xs sm:text-sm text-zinc-400 mt-2 font-medium">
								We ask that you fill out the application below with complete and accurate details.
							</p>

							{/* Progress Tracker */}
							<div className="mt-8">
								<div className="flex justify-between items-center text-[10px] font-bold text-zinc-550 uppercase tracking-widest mb-2">
									<span>Application Progress</span>
									<span>Step {step} of 2</span>
								</div>
								<div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
									<div 
										className="h-full bg-blue-550 rounded-full transition-all duration-300"
										style={{ width: `${(step / 2) * 100}%` }}
									/>
								</div>
							</div>
						</div>
					)}

					{error && (
						<div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-semibold flex items-start gap-2">
							<span className="size-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
							<span>{error}</span>
						</div>
					)}

					<form onSubmit={handleSubmit}>
						{/* STEP 1: BUSINESS INFORMATION */}
						{step === 1 && (
							<div className="space-y-6">
								<div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest pb-2 border-b border-zinc-900/60">
									<Building2 className="size-4 text-blue-400" />
									<span>Business Information</span>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
									{/* Business Name */}
									<div className="flex flex-col gap-1.5">
										<label className="text-xs font-bold text-zinc-350 tracking-wide">
											Business Name (Number company/Name company) <span className="text-red-500">*</span>
										</label>
										<input
											required
											type="text"
											placeholder="e.g. 1234567 Canada Inc."
											className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
											value={formData.businessName}
											onChange={e => setFormData({ ...formData, businessName: e.target.value })}
										/>
									</div>

									{/* Operating Name */}
									<div className="flex flex-col gap-1.5">
										<label className="text-xs font-bold text-zinc-350 tracking-wide">
											Business Operating Name <span className="text-red-500">*</span>
										</label>
										<input
											required
											type="text"
											placeholder="e.g. Jenkins Bakery"
											className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
											value={formData.operatingName}
											onChange={e => setFormData({ ...formData, operatingName: e.target.value })}
										/>
									</div>
								</div>

								{/* Address Section */}
								<div className="space-y-4 pt-2">
									<label className="text-xs font-bold text-zinc-350 tracking-wide block">
										Business's Address <span className="text-red-500">*</span>
									</label>

									{/* Street */}
									<div className="flex flex-col gap-1">
										<input
											required
											type="text"
											placeholder="Street Address"
											className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
											value={formData.streetAddress}
											onChange={e => setFormData({ ...formData, streetAddress: e.target.value })}
										/>
										<span className="text-[9px] text-zinc-550 pl-1 font-semibold">Street Address</span>
									</div>

									{/* Street 2 */}
									<div className="flex flex-col gap-1">
										<input
											type="text"
											placeholder="Street Address Line 2"
											className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
											value={formData.streetAddressLine2}
											onChange={e => setFormData({ ...formData, streetAddressLine2: e.target.value })}
										/>
										<span className="text-[9px] text-zinc-550 pl-1 font-semibold">Street Address Line 2</span>
									</div>

									{/* City / Province */}
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div className="flex flex-col gap-1">
											<input
												required
												type="text"
												placeholder="City"
												className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
												value={formData.city}
												onChange={e => setFormData({ ...formData, city: e.target.value })}
											/>
											<span className="text-[9px] text-zinc-550 pl-1 font-semibold">City</span>
										</div>

										<div className="flex flex-col gap-1">
											<input
												required
												type="text"
												placeholder="State / Province"
												className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
												value={formData.state}
												onChange={e => setFormData({ ...formData, state: e.target.value })}
											/>
											<span className="text-[9px] text-zinc-550 pl-1 font-semibold">State / Province</span>
										</div>
									</div>

									{/* Postal Code */}
									<div className="flex flex-col gap-1">
										<input
											required
											type="text"
											placeholder="Postal / Zip Code"
											className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
											value={formData.postalCode}
											onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
										/>
										<span className="text-[9px] text-zinc-550 pl-1 font-semibold">Postal / Zip Code</span>
									</div>
								</div>

								{/* Phone & Email */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
									<div className="flex flex-col gap-1.5">
										<label className="text-xs font-bold text-zinc-350 tracking-wide">
											Business Phone Number <span className="text-red-500">*</span>
										</label>
										<input
											required
											type="tel"
											placeholder="(000) 000-0000"
											maxLength={14}
											className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
											value={formData.businessPhone}
											onChange={e => handlePhoneChange(e, "businessPhone")}
										/>
										<span className="text-[10px] text-zinc-500 font-semibold pl-1">
											Please enter a valid phone number. Format: (000) 000-0000.
										</span>
									</div>

									<div className="flex flex-col gap-1.5">
										<label className="text-xs font-bold text-zinc-350 tracking-wide">
											Business Email Address <span className="text-red-500">*</span>
										</label>
										<input
											required
											type="email"
											placeholder="example@example.com"
											className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
											value={formData.businessEmail}
											onChange={e => setFormData({ ...formData, businessEmail: e.target.value })}
										/>
										<span className="text-[10px] text-zinc-500 font-semibold pl-1">
											example@example.com
										</span>
									</div>
								</div>

								{/* Incorporation Date & Business Number */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
									<div className="flex flex-col gap-1.5">
										<label className="text-xs font-bold text-zinc-350 tracking-wide">
											When was your business incorporated? <span className="text-red-500">*</span>
										</label>
										<div className="relative">
											<Calendar className="absolute left-3.5 top-3.5 size-4 text-zinc-500 pointer-events-none" />
											<input
												required
												type="date"
												className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300 appearance-none [color-scheme:dark]"
												value={formData.incorporationDate}
												onChange={e => setFormData({ ...formData, incorporationDate: e.target.value })}
											/>
										</div>
									</div>

									<div className="flex flex-col gap-1.5">
										<label className="text-xs font-bold text-zinc-350 tracking-wide">
											Business Number <span className="text-red-500">*</span>
										</label>
										<input
											required
											type="text"
											placeholder="e.g. RC0001 or 9-digit BN"
											className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
											value={formData.businessNumber}
											onChange={e => setFormData({ ...formData, businessNumber: e.target.value })}
										/>
									</div>
								</div>

								{/* Website & Industry */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
									<div className="flex flex-col gap-1.5">
										<label className="text-xs font-bold text-zinc-350 tracking-wide">
											Business Website <span className="text-red-500">*</span>
										</label>
										<div className="relative">
											<Globe className="absolute left-3.5 top-3.5 size-4 text-zinc-500 pointer-events-none" />
											<input
												required
												type="url"
												placeholder="https://example.com"
												className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
												value={formData.website}
												onChange={e => setFormData({ ...formData, website: e.target.value })}
											/>
										</div>
									</div>

									<div className="flex flex-col gap-1.5">
										<label className="text-xs font-bold text-zinc-350 tracking-wide">
											Business Industry <span className="text-red-500">*</span>
										</label>
										<input
											required
											type="text"
											placeholder="e.g. Retail, Construction"
											className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
											value={formData.industry}
											onChange={e => setFormData({ ...formData, industry: e.target.value })}
										/>
									</div>
								</div>

								{/* Entity Type Selector */}
								<div className="flex flex-col gap-2.5 pt-2">
									<label className="text-xs font-bold text-zinc-350 tracking-wide">
										Entity Type <span className="text-red-500">*</span>
									</label>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
										{["Sole Proprietorship", "Partnership", "Corporation", "Other"].map((option) => (
											<label
												key={option}
												className={`flex items-center gap-3 border rounded-xl p-3.5 cursor-pointer transition-all duration-300 ${
													formData.entityType === option
														? "bg-zinc-900 border-blue-500 text-white shadow-[0_2px_10px_rgba(59,130,246,0.1)]"
														: "border-zinc-800 hover:border-zinc-700 bg-transparent text-zinc-400"
												}`}
											>
												<input
													type="radio"
													name="entityType"
													className="size-4 accent-blue-500 cursor-pointer"
													checked={formData.entityType === option}
													onChange={() => setFormData({ ...formData, entityType: option })}
												/>
												<span className="text-xs font-bold">{option}</span>
											</label>
										))}
									</div>

									{formData.entityType === "Other" && (
										<input
											required
											type="text"
											placeholder="Please type another option here"
											className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 mt-2 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300 animate-in slide-in-from-top-1 duration-200"
											value={formData.entityTypeOther}
											onChange={e => setFormData({ ...formData, entityTypeOther: e.target.value })}
										/>
									)}
								</div>

								{/* Employees & Property Type */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
									{/* Number of Employees */}
									<div className="flex flex-col gap-1.5">
										<label className="text-xs font-bold text-zinc-350 tracking-wide">
											Number of Employees <span className="text-red-500">*</span>
										</label>
										<input
											required
											type="number"
											placeholder="e.g. 10"
											min={0}
											className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
											value={formData.numberOfEmployees}
											onChange={e => setFormData({ ...formData, numberOfEmployees: e.target.value })}
										/>
									</div>

									{/* Business Property is */}
									<div className="flex flex-col gap-2">
										<label className="text-xs font-bold text-zinc-350 tracking-wide">
											Business Property is <span className="text-red-500">*</span>
										</label>
										<div className="flex flex-col gap-2">
											{["Rented", "Owned", "Home-based business"].map((option) => (
												<label
													key={option}
													className={`flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer transition-all duration-300 ${
														formData.propertyType === option
															? "bg-zinc-900 border-blue-500 text-white"
															: "border-zinc-800 hover:border-zinc-700 bg-transparent text-zinc-400"
													}`}
												>
													<input
														type="radio"
														name="propertyType"
														className="size-4 accent-blue-500 cursor-pointer"
														checked={formData.propertyType === option}
														onChange={() => setFormData({ ...formData, propertyType: option })}
													/>
													<span className="text-xs font-semibold">{option}</span>
												</label>
											))}
										</div>
									</div>
								</div>

								{/* Bottom border & actions */}
								<div className="flex justify-end pt-8 border-t border-zinc-900 mt-8">
									<Button
										type="button"
										onClick={handleNext}
										className="rounded-xl bg-blue-600 hover:bg-blue-550 text-white font-bold text-xs h-12 px-6 flex items-center gap-1.5 shadow-lg shadow-blue-500/15 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all duration-300"
									>
										Next <ArrowRight className="size-4" />
									</Button>
								</div>
							</div>
						)}

						{/* STEP 2: FUNDING & OWNER INFORMATION */}
						{step === 2 && (
							<div className="space-y-6 animate-in fade-in duration-300">
								<div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest pb-2 border-b border-zinc-900/60">
									<Briefcase className="size-4 text-blue-400" />
									<span>Funding & Owner Details</span>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
									{/* Funding Amount Requested */}
									<div className="flex flex-col gap-1.5">
										<label className="text-xs font-bold text-zinc-350 tracking-wide">
											Funding Amount Requested <span className="text-red-500">*</span>
										</label>
										<select
											required
											className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition-all duration-300"
											value={formData.amountRequested}
											onChange={e => setFormData({ ...formData, amountRequested: e.target.value })}
										>
											<option value="$5k - $25k">$5,000 - $25,000</option>
											<option value="$25k - $100k">$25,000 - $100,000</option>
											<option value="$100k - $250k">$100,000 - $250,000</option>
											<option value="$250k+">$250,000+</option>
										</select>
									</div>

									{/* Average Monthly Revenue */}
									<div className="flex flex-col gap-1.5">
										<label className="text-xs font-bold text-zinc-350 tracking-wide">
											Average Monthly Revenue <span className="text-red-500">*</span>
										</label>
										<select
											required
											className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition-all duration-300"
											value={formData.monthlyRevenue}
											onChange={e => setFormData({ ...formData, monthlyRevenue: e.target.value })}
										>
											<option value="Less than $5,000">Less than $5,000</option>
											<option value="$5,000 - $20,000">$5,000 - $20,000</option>
											<option value="$20,000 - $50,000">$20,000 - $50,000</option>
											<option value="$50,000+">$50,000+</option>
										</select>
									</div>
								</div>

								{/* Use of Funds */}
								<div className="flex flex-col gap-1.5">
									<label className="text-xs font-bold text-zinc-350 tracking-wide">
										Primary Use of Funds <span className="text-red-500">*</span>
									</label>
									<textarea
										required
										rows={3}
										placeholder="e.g. Inventory acquisition, hiring staff, commercial equipment lease..."
										className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
										value={formData.useOfFunds}
										onChange={e => setFormData({ ...formData, useOfFunds: e.target.value })}
									/>
								</div>

								{/* Owner Info header */}
								<div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest pt-4 pb-2 border-b border-zinc-900/60">
									<User className="size-4 text-blue-400" />
									<span>Owner / Personal Details</span>
								</div>

								{/* Owner Name */}
								<div className="flex flex-col gap-1.5">
									<label className="text-xs font-bold text-zinc-350 tracking-wide">
										Full Name of Owner / Signing Officer <span className="text-red-500">*</span>
									</label>
									<input
										required
										type="text"
										placeholder="John Doe"
										className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
										value={formData.ownerName}
										onChange={e => setFormData({ ...formData, ownerName: e.target.value })}
									/>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
									{/* Owner Phone */}
									<div className="flex flex-col gap-1.5">
										<label className="text-xs font-bold text-zinc-350 tracking-wide">
											Personal Phone Number <span className="text-red-500">*</span>
										</label>
										<input
											required
											type="tel"
											placeholder="(000) 000-0000"
											maxLength={14}
											className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
											value={formData.ownerPhone}
											onChange={e => handlePhoneChange(e, "ownerPhone")}
										/>
									</div>

									{/* Owner Email */}
									<div className="flex flex-col gap-1.5">
										<label className="text-xs font-bold text-zinc-350 tracking-wide">
											Personal Email Address <span className="text-red-500">*</span>
										</label>
										<input
											required
											type="email"
											placeholder="john@example.com"
											className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
											value={formData.ownerEmail}
											onChange={e => setFormData({ ...formData, ownerEmail: e.target.value })}
										/>
									</div>
								</div>

								{/* Step 2 Actions */}
								<div className="flex items-center justify-between pt-8 border-t border-zinc-900 mt-8">
									<button
										type="button"
										className="text-zinc-400 hover:text-white font-bold text-xs flex items-center gap-1.5 h-12 px-5 cursor-pointer transition-colors"
										disabled={submitting}
										onClick={handleBack}
									>
										<ArrowLeft className="size-4" /> Back
									</button>
									<Button
										type="submit"
										disabled={submitting}
										className="rounded-xl bg-blue-600 hover:bg-blue-550 text-white font-bold text-xs h-12 px-6 flex items-center gap-1.5 shadow-lg shadow-blue-500/15 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all duration-300"
									>
										{submitting ? (
											<>
												<Loader2 className="size-4 animate-spin" /> Submitting...
											</>
										) : (
											<>
												Submit Application <Check className="size-4" />
											</>
										)}
									</Button>
								</div>
							</div>
						)}

						{/* STEP 3: SUCCESS STATE */}
						{step === 3 && (
							<div className="flex flex-col items-center text-center py-10 animate-in zoom-in-95 duration-300">
								<div className="size-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/5">
									<ShieldCheck className="size-9" />
								</div>
								<h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
									Application Received!
								</h2>
								<p className="text-sm text-zinc-400 mt-3 leading-relaxed max-w-md">
									Thank you, <span className="font-bold text-white">{formData.ownerName}</span>! Your Crown Capital Merchant Cash Advance application for <span className="font-bold text-white">{formData.businessName}</span> has been securely submitted.
								</p>

								<div className="mt-8 bg-[#121212] border border-zinc-900 rounded-2xl p-6 w-full max-w-md text-left space-y-4 text-xs font-medium">
									<div className="border-b border-zinc-900/60 pb-3">
										<span className="text-zinc-550 font-bold uppercase tracking-wider block">Submission ID</span>
										<span className="text-[10px] text-zinc-400 font-mono mt-1 block">CC-MCA-{Math.floor(100000 + Math.random() * 900000)}</span>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<span className="text-zinc-550 font-bold uppercase tracking-wider block">Business</span>
											<span className="text-white mt-1 block truncate">{formData.businessName}</span>
										</div>
										<div>
											<span className="text-zinc-550 font-bold uppercase tracking-wider block">Operating As</span>
											<span className="text-white mt-1 block truncate">{formData.operatingName}</span>
										</div>
									</div>
									<div className="grid grid-cols-2 gap-4 border-t border-zinc-900/60 pt-3">
										<div>
											<span className="text-zinc-550 font-bold uppercase tracking-wider block">Requested Amount</span>
											<span className="text-white mt-1 block">{formData.amountRequested}</span>
										</div>
										<div>
											<span className="text-zinc-550 font-bold uppercase tracking-wider block">Est. Revenue</span>
											<span className="text-white mt-1 block">{formData.monthlyRevenue}</span>
										</div>
									</div>
								</div>

								<p className="text-xs text-zinc-500 mt-6 max-w-xs leading-normal">
									Our lending specialists will review your application parameters and connect with you within 24 hours.
								</p>

								<Button
									type="button"
									className="mt-8 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-bold text-xs h-11 px-8 cursor-pointer shadow-md"
									onClick={() => router.push("/")}
								>
									Return to Home
								</Button>
							</div>
						)}
					</form>
				</div>
			</main>

			{/* Footer Block */}
			<footer className="py-8 border-t border-zinc-900 bg-transparent text-center mt-auto">
				<p className="text-[10px] text-zinc-550 font-medium px-4">
					&copy; {new Date().getFullYear()} Crown Capital. Powered by GTA Funding. All rights reserved.
				</p>
			</footer>
		</div>
	);
}
