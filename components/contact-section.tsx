"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MailIcon, MapPin, Clock, PhoneCall, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface ContactInfoItem {
	icon: React.ReactNode;
	label: string;
	value: string;
	description?: string;
}

const contactInfo: ContactInfoItem[] = [
	{
		icon: (
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="size-4.5"
			>
				<rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
				<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
				<line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
			</svg>
		),
		label: "Instagram",
		value: "@gtafunding",
	},
	{
		icon: <MailIcon />,
		label: "Email",
		value: "info@gtafunding.ca",
	},
	{
		icon: <MapPin />,
		label: "Head office",
		value: "Toronto",
		description: "Canada-wide · Remote-first advisors in your time zone.",
	},
	{
		icon: <Clock />,
		label: "Typical reply",
		value: "Under 2 hours",
		description: "During business hours. Urgent? Say so in your subject or voicemail.",
	},
	{
		icon: <PhoneCall />,
		label: "Advisor line",
		value: "905-291-7216",
		description: "Mon–Fri · 9am–7pm ET · No menus — you reach a human.",
	},
];

export function ContactSection() {
	return (
		<div className="relative mx-auto grid h-full w-full max-w-[1400px] rounded-[32px] bg-white dark:bg-zinc-950 md:grid-cols-[1fr_0.9fr] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.04)] dark:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.5)] overflow-hidden border border-zinc-200 dark:border-zinc-800">
			<div className="col-span-1 flex flex-col justify-between p-8 sm:p-10 lg:p-12 bg-linear-to-b from-zinc-50/50 to-zinc-100/30 dark:from-zinc-900/30 dark:to-zinc-950/20">
				<div className="space-y-4">
					<h2 className="font-bold text-2xl tracking-tight text-foreground md:text-3xl">
						Apply for Funding
					</h2>
					<p className="max-w-md text-muted-foreground text-sm leading-relaxed">
						Ready to take your business to the next level? Complete this short application form to secure fast capital for your growth.
					</p>
					<p className="max-w-md text-muted-foreground text-xs leading-relaxed">
						Our financing specialists will review your info and get back to you within 24 hours.
					</p>
				</div>
				<div className="grid gap-3.5 mt-8">
					{contactInfo?.map((info) => (
						<div key={info.label} className="group/item flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 shadow-xs hover:shadow-md transition-all duration-300">
							<div className="rounded-xl border border-zinc-200/60 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-2.5 shadow-xs text-zinc-700 dark:text-zinc-300 group-hover/item:bg-sky-500/10 group-hover/item:text-sky-500 group-hover/item:border-sky-500/20 transition-all duration-300 [&_svg]:size-4.5 shrink-0 mt-0.5">
								{info.icon}
							</div>
							<div className="flex-1">
								<p className="font-bold text-sm text-foreground">{info.label}</p>
								<p className="text-zinc-950 dark:text-zinc-50 font-semibold text-sm mt-0.5 leading-none">{info.value}</p>
								{info.description && (
									<p className="text-muted-foreground text-xs mt-1.5 leading-normal font-normal">{info.description}</p>
								)}
							</div>
						</div>
					))}
				</div>
			</div>
			<div className="col-span-1 flex items-center p-8 sm:p-10 lg:p-12">
				<ContactForm />
			</div>
		</div>
	);
}

function ContactForm() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [revenue, setRevenue] = useState("");
	const [amount, setAmount] = useState("");
	const [purpose, setPurpose] = useState("");
	
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name || !email || !phone || !revenue || !amount || !purpose) {
			setError("Please fill out all fields.");
			return;
		}
		setLoading(true);
		setError("");

		try {
			const { error: insertError } = await supabase
				.from("inquiries")
				.insert([
					{
						name,
						email,
						phone,
						revenue,
						amount,
						purpose,
						status: "Pending"
					}
				]);

			if (insertError) throw insertError;

			setSuccess(true);
			setName("");
			setEmail("");
			setPhone("");
			setRevenue("");
			setAmount("");
			setPurpose("");
		} catch (err: any) {
			console.error("Error submitting inquiry:", err);
			setError(err.message || "Something went wrong. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	if (success) {
		return (
			<div className="w-full flex flex-col items-center justify-center text-center p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl animate-in fade-in duration-500">
				<CheckCircle2 className="size-12 text-emerald-500 mb-4 animate-bounce" />
				<h3 className="text-lg font-bold text-zinc-900 dark:text-white">Application Submitted!</h3>
				<p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-sm">
					Thank you for applying. One of our GTA Funding specialists will review your application and contact you within 24 hours.
				</p>
				<Button 
					className="mt-6 rounded-full bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 px-6 cursor-pointer"
					onClick={() => setSuccess(false)}
				>
					Submit Another
				</Button>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="w-full">
			{error && (
				<div className="p-3.5 mb-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-semibold">
					{error}
				</div>
			)}
			<FieldGroup className="gap-y-4">
				<Field>
					<FieldLabel className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5" htmlFor="full-name">Full Name</FieldLabel>
					<Input 
						className="rounded-xl bg-zinc-50/40 border-zinc-200 focus:bg-background dark:bg-zinc-900/30 dark:border-zinc-800 h-10 px-3.5" 
						autoComplete="off" 
						id="full-name" 
						placeholder="John Doe" 
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</Field>
				<Field>
					<FieldLabel className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5" htmlFor="business-email">Business Email</FieldLabel>
					<Input
						className="rounded-xl bg-zinc-50/40 border-zinc-200 focus:bg-background dark:bg-zinc-900/30 dark:border-zinc-800 h-10 px-3.5"
						autoComplete="off"
						id="business-email"
						placeholder="john@company.com"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</Field>
				<Field>
					<FieldLabel className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5" htmlFor="phone">Phone Number</FieldLabel>
					<Input
						className="rounded-xl bg-zinc-50/40 border-zinc-200 focus:bg-background dark:bg-zinc-900/30 dark:border-zinc-800 h-10 px-3.5"
						autoComplete="off"
						id="phone"
						placeholder="+1 (555) 123-4567"
						type="tel"
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
						required
					/>
				</Field>
				<Field>
					<FieldLabel className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5" htmlFor="monthly-revenue">Monthly Revenue</FieldLabel>
					<Input
						className="rounded-xl bg-zinc-50/40 border-zinc-200 focus:bg-background dark:bg-zinc-900/30 dark:border-zinc-800 h-10 px-3.5"
						autoComplete="off"
						id="monthly-revenue"
						placeholder="e.g. $50,000"
						value={revenue}
						onChange={(e) => setRevenue(e.target.value)}
						required
					/>
				</Field>
				<Field>
					<FieldLabel className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5" htmlFor="funding-needed">Funding Amount Needed</FieldLabel>
					<Input
						className="rounded-xl bg-zinc-50/40 border-zinc-200 focus:bg-background dark:bg-zinc-900/30 dark:border-zinc-800 h-10 px-3.5"
						autoComplete="off"
						id="funding-needed"
						placeholder="e.g. $100,000"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						required
					/>
				</Field>
				<Field>
					<FieldLabel className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5" htmlFor="funding-use">What is the funding for?</FieldLabel>
					<Textarea
						className="rounded-xl bg-zinc-50/40 border-zinc-200 focus:bg-background dark:bg-zinc-900/30 dark:border-zinc-800 min-h-[90px] p-3"
						autoComplete="off"
						id="funding-use"
						placeholder="e.g. Inventory, expansion, payroll..."
						value={purpose}
						onChange={(e) => setPurpose(e.target.value)}
						required
					/>
				</Field>
			</FieldGroup>
			<Button 
				className="mt-8 w-full group cursor-pointer rounded-full bg-zinc-950 hover:bg-zinc-900 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 py-5 font-bold shadow-xs hover:shadow-md transition-all text-sm flex items-center justify-center gap-2" 
				type="submit"
				disabled={loading}
			>
				{loading ? (
					<>
						<Loader2 className="size-4 animate-spin" />
						Submitting...
					</>
				) : (
					<>
						Submit Application <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
					</>
				)}
			</Button>
		</form>
	);
}
