"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
	LayoutDashboard,
	Inbox,
	BarChart3,
	LogOut,
	Search,
	CheckCircle2,
	XCircle,
	Clock,
	Trash2,
	Eye,
	TrendingUp,
	DollarSign,
	Users,
	Sparkles,
	ShieldAlert,
	Mail,
	Lock,
	ArrowRight,
	Calendar,
	ChevronDown,
	ChevronUp,
	Plus,
	Activity,
	Briefcase,
	Building,
	FileText,
	User,
	ShieldCheck,
	Menu,
	X,
	Phone
} from "lucide-react";

// Types
interface Inquiry {
	id: string;
	name: string;
	email: string;
	phone: string;
	revenue: string;
	amount: string;
	purpose: string;
	status: "Pending" | "Approved" | "Declined";
	date: string;
	timeInBusiness: string;
	isCrownCapitalMca?: boolean;
	mcaDetails?: any;
}

// Mock Inquiries Database
const initialInquiries: Inquiry[] = [];

export default function AdminPage() {
	// Authentication state
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [authError, setAuthError] = useState("");
	const [authLoading, setAuthLoading] = useState(false);

	// Dashboard state
	const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries);
	const [activeTab, setActiveTab] = useState<"overview" | "inquiries">("overview");
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Approved" | "Declined">("All");
	const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
	const [expandedRow, setExpandedRow] = useState<string | null>(null);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [dataLoading, setDataLoading] = useState(false);

	// Fetch inquiries from Supabase
	const fetchInquiries = async () => {
		setDataLoading(true);
		try {
			const { data, error } = await supabase
				.from("inquiries")
				.select("*")
				.order("created_at", { ascending: false });

			if (error) throw error;

			const mapped: Inquiry[] = (data || []).map((item: any) => {
				let parsedPurpose = item.purpose || "";
				let isCrownCapitalMca = false;
				let mcaDetails = null;

				try {
					if (item.purpose && item.purpose.trim().startsWith("{")) {
						const parsed = JSON.parse(item.purpose);
						if (parsed.type === "crown-capital-mca" || parsed.type === "gta-funding-mca") {
							isCrownCapitalMca = true;
							mcaDetails = parsed;
							parsedPurpose = `GTA Funding MCA Application - ${parsed.businessName}`;
						}
					}
				} catch (e) {
					// Ignore JSON parsing errors
				}

				return {
					id: item.id,
					name: item.name,
					email: item.email,
					phone: item.phone,
					revenue: item.revenue,
					amount: item.amount,
					purpose: parsedPurpose,
					status: item.status,
					date: item.created_at ? new Date(item.created_at).toISOString().split("T")[0] : "",
					timeInBusiness: item.time_in_business || "N/A",
					isCrownCapitalMca,
					mcaDetails
				};
			});
			setInquiries(mapped);
		} catch (err) {
			console.error("Error fetching inquiries:", err);
		} finally {
			setDataLoading(false);
		}
	};

	// Client-side session and auth state listener check
	useEffect(() => {
		// Get initial session
		supabase.auth.getSession().then(({ data: { session } }) => {
			setIsLoggedIn(!!session);
		});

		// Listen for auth changes
		const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
			setIsLoggedIn(!!session);
		});

		return () => {
			subscription.unsubscribe();
		};
	}, []);

	// Load inquiries when logged in
	useEffect(() => {
		if (isLoggedIn) {
			fetchInquiries();
		} else {
			setInquiries([]);
		}
	}, [isLoggedIn]);

	// Handle Login with Supabase Auth
	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setAuthError("");
		setAuthLoading(true);

		try {
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password
			});

			if (error) {
				setAuthError(error.message);
			} else {
				setIsLoggedIn(true);
			}
		} catch (err: any) {
			setAuthError(err.message || "An unexpected error occurred.");
		} finally {
			setAuthLoading(false);
		}
	};

	// Handle Logout with Supabase Auth
	const handleLogout = async () => {
		try {
			await supabase.auth.signOut();
			setIsLoggedIn(false);
			setEmail("");
			setPassword("");
			setIsMobileMenuOpen(false);
		} catch (err) {
			console.error("Error logging out:", err);
			// Fallback local clear
			setIsLoggedIn(false);
			setIsMobileMenuOpen(false);
		}
	};

	// Update inquiry status in Supabase
	const handleUpdateStatus = async (id: string, status: "Pending" | "Approved" | "Declined") => {
		try {
			const { error } = await supabase
				.from("inquiries")
				.update({ status })
				.eq("id", id);

			if (error) throw error;

			const updated = inquiries.map((item) =>
				item.id === id ? { ...item, status } : item
			);
			setInquiries(updated);
			if (selectedInquiry?.id === id) {
				setSelectedInquiry({ ...selectedInquiry, status });
			}
		} catch (err: any) {
			alert(err.message || "Failed to update status.");
		}
	};

	// Delete inquiry in Supabase
	const handleDeleteInquiry = async (id: string) => {
		if (confirm("Are you sure you want to delete this inquiry?")) {
			try {
				const { error } = await supabase
					.from("inquiries")
					.delete()
					.eq("id", id);

				if (error) throw error;

				setInquiries(inquiries.filter((item) => item.id !== id));
				if (selectedInquiry?.id === id) {
					setSelectedInquiry(null);
				}
				if (expandedRow === id) {
					setExpandedRow(null);
				}
			} catch (err: any) {
				alert(err.message || "Failed to delete inquiry.");
			}
		}
	};

	// Filter & Search Inquiries
	const filteredInquiries = inquiries.filter((item) => {
		const matchesSearch =
			item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.purpose.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesStatus = statusFilter === "All" || item.status === statusFilter;
		return matchesSearch && matchesStatus;
	});

	// Helper to parse amount strings into numbers (handles ranges, k, m, currency symbols, and commas)
	const parseAmountVal = (val: string): number => {
		if (!val) return 0;
		const clean = val.replace(/[$,\s]/g, "").toLowerCase();
		const parseSingle = (str: string): number => {
			let multiplier = 1;
			if (str.includes("m")) {
				multiplier = 1000000;
				str = str.replace("m", "");
			} else if (str.includes("k")) {
				multiplier = 1000;
				str = str.replace("k", "");
			}
			const parsed = parseFloat(str);
			return isNaN(parsed) ? 0 : parsed * multiplier;
		};

		if (clean.includes("-")) {
			const parts = clean.split("-");
			return (parseSingle(parts[0]) + parseSingle(parts[1])) / 2;
		}
		if (clean.includes("+")) {
			return parseSingle(clean.replace("+", ""));
		}
		return parseSingle(clean);
	};

	// Metric calculations
	const totalInquiries = inquiries.length;
	const pendingInquiries = inquiries.filter((i) => i.status === "Pending").length;
	const approvedInquiries = inquiries.filter((i) => i.status === "Approved").length;
	const approvalRate = totalInquiries > 0 ? Math.round((approvedInquiries / totalInquiries) * 100) : 0;

	const totalEstAmount = inquiries.reduce((sum, item) => sum + parseAmountVal(item.amount), 0);

	// Format amount
	const formatAmount = (num: number): string => {
		if (num >= 1000000) {
			return `$${(num / 1000000).toFixed(2)}M`;
		}
		if (num >= 1000) {
			return `$${(num / 1000).toFixed(1)}K`;
		}
		return `$${num.toLocaleString()}`;
	};

	const formattedEstRequested = formatAmount(totalEstAmount);

	return (
		<div className="h-screen bg-[#0A0A0A] text-zinc-100 font-sans flex flex-col relative overflow-hidden selection:bg-cyan-500/30 transition-colors duration-500">
			{/* Drifting Fintech Colored Mesh Glow Background Blobs */}
			<div className="absolute top-[-25%] left-[-15%] w-[60%] aspect-square rounded-full bg-cyan-900/10 dark:bg-cyan-500/5 blur-[130px] pointer-events-none -z-10 animate-float-slow" />
			<div className="absolute bottom-[-20%] right-[-10%] w-[55%] aspect-square rounded-full bg-purple-950/15 dark:bg-purple-500/4 blur-[140px] pointer-events-none -z-10 animate-float-reverse" />
			<div className="absolute top-[30%] left-[25%] w-[400px] aspect-square rounded-full bg-indigo-950/10 dark:bg-indigo-500/3 blur-[100px] pointer-events-none -z-10 animate-float-slow" />

			{/* Faint Grid Overlay & Skyline Background */}
			<div className="absolute inset-0 bg-dot-grid opacity-[0.08] pointer-events-none -z-10" />
			<div className="absolute inset-0 -z-20 h-full w-full overflow-hidden pointer-events-none">
				<img
					src="/herobg.jpg"
					alt="GTA Funding background"
					className="size-full object-cover object-[center_35%] opacity-[0.02] pointer-events-none"
				/>
			</div>

			{/* Sticky Top Header (Mobile only, hidden on desktop md) */}
			<header className="md:hidden h-16 shrink-0 w-full border-b border-[#1C1C1C] bg-[#0D0D0D]/90 backdrop-blur-lg z-45 flex items-center">
				<div className="mx-auto flex w-full items-center justify-between px-4 sm:px-6">
					<Link className="rounded-xl p-1 border-transparent flex items-center gap-2 transition-all hover:opacity-90 animate-fade-in" href="/">
						<Logo className="h-6 w-auto filter-none brightness-100 dark:filter-none" />
						<div className="flex items-center gap-1">
							<span className="h-3.5 w-px bg-zinc-800" />
							<span className="text-[8px] bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
								Console
							</span>
						</div>
					</Link>
					<div className="flex items-center gap-2.5">
						{isLoggedIn && (
							<button
								onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
								className="p-2 border border-zinc-800 bg-[#0E0E0E] rounded-xl text-zinc-450 hover:text-white transition-colors cursor-pointer"
							>
								{isMobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
							</button>
						)}
					</div>
				</div>
			</header>

			{/* Mobile Menu Dropdown Drawer */}
			{isLoggedIn && isMobileMenuOpen && (
				<div className="md:hidden fixed top-16 inset-x-0 bg-[#0A0A0A]/95 border-b border-[#1C1C1C] p-5 backdrop-blur-2xl z-40 animate-in slide-in-from-top duration-300 shadow-[0_25px_50px_rgba(0,0,0,0.9)]">
					<div className="flex flex-col gap-4">
						<nav className="flex flex-col gap-1.5">
							<button
								onClick={() => { setActiveTab("overview"); setIsMobileMenuOpen(false); }}
								className={cn(
									"flex items-center gap-3 rounded-xl h-11 px-4 text-xs font-bold transition-all",
									activeTab === "overview" ? "bg-[#161616] text-white border border-[#262626]" : "text-zinc-400"
								)}
							>
								<LayoutDashboard className="size-4" />
								Overview
							</button>
							<button
								onClick={() => { setActiveTab("inquiries"); setIsMobileMenuOpen(false); }}
								className={cn(
									"flex items-center justify-between rounded-xl h-11 px-4 text-xs font-bold transition-all",
									activeTab === "inquiries" ? "bg-[#161616] text-white border border-[#262626]" : "text-zinc-400"
								)}
							>
								<span className="flex items-center gap-3">
									<Inbox className="size-4" />
									Inquiries
								</span>
								{pendingInquiries > 0 && (
									<span className="text-[9px] font-black bg-purple-500 text-white rounded-full px-2 py-0.5">
										{pendingInquiries}
									</span>
								)}
							</button>
						</nav>

						<div className="border-t border-[#1C1C1C] pt-4 flex items-center justify-between">
							<div className="flex items-center gap-2">
								<div className="relative size-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 overflow-hidden">
									<img
										src="https://api.dicebear.com/7.x/notionists/svg?seed=ConsoleAdmin"
										alt="Console Admin Avatar"
										className="size-full object-cover bg-zinc-800"
									/>
								</div>
								<div className="flex flex-col text-left">
									<span className="text-xs font-bold text-white leading-none">Console Admin</span>
									<span className="text-[9px] text-zinc-500 font-semibold mt-0.5">Systems Officer</span>
								</div>
							</div>
							<button
								onClick={handleLogout}
								className="text-xs text-red-400 hover:text-red-350 font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/5 cursor-pointer"
							>
								<LogOut className="size-3.5" />
								Logout
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Main Content Area (Locks height with min-h-0) */}
			<main className="flex-1 flex flex-col min-h-0 w-full overflow-hidden z-10">
				{!isLoggedIn ? (
					/* LOGIN VIEW */
					<div className="flex-1 flex items-center justify-center px-4 py-20 relative overflow-y-auto">
						<div className="w-full max-w-md bg-[#0D0D0D]/80 border border-zinc-800/80 p-6 sm:p-10 rounded-[28px] shadow-[0_30px_70px_rgba(0,0,0,0.8)] backdrop-blur-xl relative overflow-hidden transition-all duration-300">
							<div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-cyan-500/40 to-transparent" />
							
							<div className="flex flex-col items-center text-center gap-2 mb-8">
								<div className="size-13 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-cyan-400 shadow-md mb-2">
									<Lock className="size-5" />
								</div>
								<h1 className="text-2xl font-extrabold tracking-tight text-white">GTA Funding</h1>
								<p className="text-xs text-zinc-400 font-medium">Console Access Portal</p>
							</div>

							<form onSubmit={handleLogin} className="space-y-4.5">
								{authError && (
									<div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2">
										<ShieldAlert className="size-4 shrink-0" />
										<span>{authError}</span>
									</div>
								)}

								<div className="space-y-1.5">
									<label htmlFor="email" className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">
										Email Address
									</label>
									<div className="relative flex items-center">
										<Mail className="absolute left-3.5 size-4 text-zinc-500 pointer-events-none" />
										<input
											required
											id="email"
											type="email"
											placeholder="admin@gtafunding.ca"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											className="w-full bg-[#121212]/60 focus:bg-[#151515] border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none text-zinc-200 transition-all duration-300"
										/>
									</div>
								</div>

								<div className="space-y-1.5">
									<label htmlFor="password" className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">
										Password
									</label>
									<div className="relative flex items-center">
										<Lock className="absolute left-3.5 size-4 text-zinc-500 pointer-events-none" />
										<input
											required
											id="password"
											type="password"
											placeholder="••••••••"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											className="w-full bg-[#121212]/60 focus:bg-[#151515] border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none text-zinc-200 transition-all duration-300"
										/>
									</div>
								</div>

								<Button
									type="submit"
									disabled={authLoading}
									className="w-full rounded-xl py-6 font-bold text-xs cursor-pointer shadow-lg bg-linear-to-r from-zinc-900 to-zinc-800 hover:from-cyan-500 hover:to-indigo-650 text-white mt-3 hover:scale-[1.01] transition-all duration-300"
								>
									{authLoading ? (
										<span className="flex items-center justify-center gap-2">
											<Activity className="size-4 animate-pulse text-cyan-400" />
											Entering Console...
										</span>
									) : (
										<span className="flex items-center justify-center gap-2 w-full">
											Authorize Access
											<ArrowRight className="size-4" />
										</span>
									)}
								</Button>
							</form>


						</div>
					</div>
				) : (
					/* DASHBOARD VIEW - Viewport locked h-full layout */
					<div className="flex-1 flex min-h-0 w-full max-w-[1440px] mx-auto relative overflow-hidden">
						{/* Desktop Left Sidebar Navigation (Always visible on md+, fixed h-full) */}
						<aside className="hidden md:flex w-64 shrink-0 bg-[#0D0D0D] border-r border-[#1C1C1C] flex-col justify-between p-6 h-full">
							<div className="space-y-8">
								{/* Logo GTA */}
								<Link href="/" className="flex items-center gap-2 px-2 py-1 transition-all hover:opacity-90">
									<Logo className="h-7 w-auto filter-none brightness-100 dark:filter-none" />
									<div className="flex items-center gap-1.5 ml-0.5">
										<span className="h-3.5 w-px bg-zinc-800" />
										<span className="text-[8px] bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
											Console
										</span>
									</div>
								</Link>

								{/* Sidebar Menu Items */}
								<nav className="flex flex-col gap-1.5">
									<button
										onClick={() => setActiveTab("overview")}
										className={cn(
											"flex items-center gap-3 rounded-xl h-11 px-4 cursor-pointer w-full text-xs font-bold transition-all relative",
											activeTab === "overview"
												? "bg-[#161616] border border-[#262626] text-white before:absolute before:left-0 before:top-3 before:bottom-3 before:w-1 before:bg-cyan-400 before:rounded-r-full"
												: "text-zinc-400 hover:text-white hover:bg-zinc-900/40"
										)}
									>
										<LayoutDashboard className="size-4" />
										<span>Overview</span>
									</button>
									<button
										onClick={() => setActiveTab("inquiries")}
										className={cn(
											"flex items-center gap-3 rounded-xl h-11 px-4 cursor-pointer w-full text-xs font-bold transition-all relative",
											activeTab === "inquiries"
												? "bg-[#161616] border border-[#262626] text-white before:absolute before:left-0 before:top-3 before:bottom-3 before:w-1 before:bg-cyan-400 before:rounded-r-full"
												: "text-zinc-400 hover:text-white hover:bg-zinc-900/40"
										)}
									>
										<Inbox className="size-4" />
										<div className="flex-1 flex justify-between items-center">
											<span>Inquiries</span>
											{pendingInquiries > 0 && (
												<span className="text-[9px] font-black bg-purple-500 text-white rounded-full px-2 py-0.5 shrink-0 ml-2 shadow-[0_2px_8px_rgba(168,85,247,0.4)]">
													{pendingInquiries}
												</span>
											)}
										</div>
									</button>
								</nav>
							</div>

							{/* Console Admin User Profile & Settings block */}
							<div className="pt-4 border-t border-[#1C1C1C] flex items-center justify-between gap-2">
								<div className="flex items-center gap-2 min-w-0">
									<div className="relative size-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 overflow-hidden">
										<img
											src="https://api.dicebear.com/7.x/notionists/svg?seed=ConsoleAdmin"
											alt="Console Admin Avatar"
											className="size-full object-cover bg-zinc-800"
										/>
										<span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 border border-[#0D0D0D] animate-pulse" />
									</div>
									<div className="flex flex-col text-left min-w-0">
										<span className="text-xs font-bold text-white truncate leading-none">Console Admin</span>
										<span className="text-[9px] text-zinc-550 truncate mt-1">Systems Officer</span>
									</div>
								</div>
								
								<div className="flex items-center gap-1 shrink-0">
									<button
										onClick={handleLogout}
										className="p-1.5 rounded-xl border border-zinc-800 bg-[#121212] hover:bg-[#1C1C1C] text-zinc-400 hover:text-white transition-colors cursor-pointer"
										title="Logout"
									>
										<LogOut className="size-3.5" />
									</button>
								</div>
							</div>
						</aside>

						{/* Right Main Panel - Content scrolls vertically inside, locked h-full */}
						<div className="flex-1 min-w-0 h-full overflow-y-auto p-4 sm:p-6 md:p-8 flex flex-col justify-between gap-6">
							<div className="space-y-6">
								{/* Header Block (Unified for Mobile & Desktop) */}
								<div className="border-b border-[#1C1C1C]/40 pb-5">
									<span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Welcome back,</span>
									<h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">Administrator</h2>
								</div>

								{/* Overview Tab Content */}
								{activeTab === "overview" && (
									<div className="space-y-6 animate-in fade-in duration-300">
										{/* Four Stat Cards Grid */}
										<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
											<div className="relative bg-[#0D0D0D]/65 border border-[#1A1A1A] hover:border-cyan-500/30 p-5 rounded-2xl shadow-xl flex flex-col justify-between gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(6,182,212,0.06)] group/card">
												<div className="flex justify-between items-start">
													<div className="space-y-1">
														<span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Total Inquiries</span>
														<div className="text-2xl font-black text-white mt-1">{totalInquiries}</div>
													</div>
													<span className="text-[9px] font-black bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2.5 py-0.5 rounded-full">
														Requested
													</span>
												</div>
												<div className="flex items-center justify-between pt-1">
													<span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
														<TrendingUp className="size-3" />
														<span>+12% volume</span>
													</span>
													<svg className="w-16 h-6 text-cyan-400 shrink-0" viewBox="0 0 100 30" preserveAspectRatio="none">
														<path d="M0,25 Q15,10 30,22 T60,5 T90,20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
														<path d="M0,25 Q15,10 30,22 T60,5 T90,20 L100,30 L0,30 Z" fill="currentColor" className="opacity-5" />
													</svg>
												</div>
											</div>

											<div className="relative bg-[#0D0D0D]/65 border border-[#1A1A1A] hover:border-purple-500/30 p-5 rounded-2xl shadow-xl flex flex-col justify-between gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(168,85,247,0.06)] group/card">
												<div className="flex justify-between items-start">
													<div className="space-y-1">
														<span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Est. Requested</span>
														<div className="text-2xl font-black text-white mt-1">{formattedEstRequested}</div>
													</div>
													<span className="text-[9px] font-black bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
														Requested
													</span>
												</div>
												<div className="flex items-center justify-between pt-1">
													<span className="text-[10px] text-zinc-500 font-bold">Accumulated CAD</span>
													<svg className="w-16 h-6 text-purple-400 shrink-0" viewBox="0 0 100 30" preserveAspectRatio="none">
														<path d="M0,20 Q20,25 40,8 T70,18 T90,2" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
														<path d="M0,20 Q20,25 40,8 T70,18 T90,2 L100,30 L0,30 Z" fill="currentColor" className="opacity-5" />
													</svg>
												</div>
											</div>

											<div className="relative bg-[#0D0D0D]/65 border border-[#1A1A1A] hover:border-indigo-500/35 p-5 rounded-2xl shadow-xl flex items-center justify-between gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(99,102,241,0.06)]">
												<div className="space-y-2 flex-1">
													<span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Approved Rate</span>
													<div className="text-2xl font-black text-white mt-1">{approvalRate}%</div>
													<div className="h-1 w-full bg-[#1C1C1C] border border-[#262626]/30 rounded-full overflow-hidden">
														<div className="h-full bg-cyan-400 rounded-full" style={{ width: `${approvalRate}%` }} />
													</div>
												</div>
												<div className="relative size-12 shrink-0 flex items-center justify-center mr-1">
													<svg className="size-full text-cyan-400 -rotate-90" viewBox="0 0 36 36">
														<circle cx="18" cy="18" r="15.915" fill="none" className="text-zinc-800" strokeWidth="3" stroke="currentColor" />
														<circle cx="18" cy="18" r="15.915" fill="none" className="text-cyan-400" strokeWidth="3" strokeDasharray={`${approvalRate}, 100`} strokeLinecap="round" stroke="currentColor" />
													</svg>
													<span className="absolute text-[9px] font-black text-white">{approvalRate}%</span>
												</div>
											</div>

											<div className="relative bg-[#0D0D0D]/65 border border-[#1A1A1A] hover:border-zinc-700 p-5 rounded-2xl shadow-xl flex flex-col justify-between gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(255,255,255,0.02)] group/card">
												<div className="flex justify-between items-start">
													<div className="space-y-1">
														<span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Pending Reviews</span>
														<div className="text-2xl font-black text-white mt-1">{pendingInquiries}</div>
													</div>
													<span className="text-[9px] font-black bg-zinc-800 text-zinc-400 border border-zinc-750 px-2.5 py-0.5 rounded-full">
														Review now
													</span>
												</div>
												<div className="flex items-center justify-between pt-1">
													<span className="text-[10px] text-amber-500 font-bold flex items-center gap-1">
														<span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
														Needs check
													</span>
													<svg className="w-16 h-6 text-zinc-500 shrink-0" viewBox="0 0 100 30" preserveAspectRatio="none">
														<path d="M0,25 Q20,10 40,25 T80,10 T90,15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
													</svg>
												</div>
											</div>
										</div>

										{/* Incoming Inquiries Queue */}
										<div className="bg-[#0D0D0D]/80 border border-[#1C1C1C] rounded-[24px] p-5 sm:p-6 space-y-5 shadow-2xl relative">
											<div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-[#2C2C2C] to-transparent" />
											<div className="flex items-center justify-between pb-3 border-b border-[#1C1C1C]">
												<div>
													<h3 className="font-extrabold text-base text-white">Incoming Inquiries Queue</h3>
													<p className="text-xs text-zinc-400 mt-0.5">Showing latest applications queued for review</p>
												</div>
												<button
													onClick={() => { setActiveTab("inquiries"); setStatusFilter("All"); }}
													className="text-xs text-cyan-400 hover:text-cyan-300 font-bold transition-all cursor-pointer hover:underline"
												>
													Show all
												</button>
											</div>

											<div className="space-y-3.5">
												{inquiries.slice(0, 4).map((item, index) => {
													return (
														<div
															key={item.id}
															className="bg-[#0E0E0E] hover:bg-[#121212] border border-[#1C1C1C] hover:border-[#2C2C2C] p-4.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 group/card shadow-xs"
														>
															<div className="flex items-start gap-3.5 min-w-0">
																<img
																	src={`https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(item.name)}`}
																	alt={item.name}
																	className="size-9.5 rounded-full bg-zinc-900 border border-zinc-850 shrink-0 object-cover"
																/>
																<div className="space-y-1 min-w-0">
																	<div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
																		<span className="font-bold text-sm text-white group-hover/card:text-cyan-400 transition-colors">
																			{item.name}
																		</span>
																		{item.isCrownCapitalMca && (
																			<span className="text-[8px] bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black px-1.5 py-0.25 rounded-md uppercase tracking-wider shrink-0 animate-pulse">
																				GTA Funding MCA
																			</span>
																		)}
																		<span className="text-[10px] text-zinc-500 font-bold flex items-center gap-1">
																			<span className="size-1 bg-zinc-800 rounded-full" />
																			{item.date}
																		</span>
																	</div>
																	<p className="text-xs text-zinc-400 leading-relaxed font-medium line-clamp-2">
																		{item.purpose}
																	</p>
																</div>
															</div>
															
															<div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 mt-2 sm:mt-0 pt-2 sm:pt-0 border-t border-zinc-900 sm:border-0">
																<span className={cn(
																	"text-[9px] px-3.5 py-0.5 rounded-full font-bold uppercase tracking-wider border shadow-sm",
																	{
																		"bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_2px_10px_rgba(245,158,11,0.08)]": item.status === "Pending",
																		"bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_2px_10px_rgba(16,185,129,0.08)]": item.status === "Approved",
																		"bg-red-500/10 text-red-400 border-red-500/20": item.status === "Declined"
																	}
																)}>
																	{item.status}
																</span>
																<Button
																	variant="outline"
																	size="icon"
																	className="size-8 cursor-pointer border-[#222222] bg-[#121212] hover:bg-[#1C1C1C] rounded-xl shadow-xs"
																	onClick={() => {
																		setSelectedInquiry(item);
																		setActiveTab("inquiries");
																	}}
																>
																	<Eye className="size-3.5 text-zinc-400" />
																</Button>
															</div>
														</div>
													);
												})}
											</div>
										</div>
									</div>
								)}

								{/* Inquiries Tab Content */}
								{activeTab === "inquiries" && (
									<div className="space-y-6 animate-in fade-in duration-300">
										<div>
											<h2 className="text-xl font-bold tracking-tight text-white">Console inquiries Queue</h2>
											<p className="text-xs text-zinc-400 mt-0.5">Filter, review details, and change validation state</p>
										</div>

										{/* Filters */}
										<div className="flex flex-col sm:flex-row items-center gap-3 w-full bg-[#0D0D0D]/65 border border-[#1C1C1C] p-3 rounded-2xl shadow-md">
											<div className="relative flex items-center w-full sm:flex-1">
												<Search className="absolute left-3.5 size-4 text-zinc-505 pointer-events-none" />
												<input
													type="text"
													placeholder="Search applicant name, email, or usage..."
													value={searchQuery}
													onChange={(e) => setSearchQuery(e.target.value)}
													className="w-full bg-[#121212]/50 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none text-zinc-200 transition-all duration-300"
												/>
											</div>

											<div className="flex items-center gap-1 bg-[#121212] p-1 border border-zinc-800 rounded-xl w-full sm:w-auto overflow-x-auto">
												{(["All", "Pending", "Approved", "Declined"] as const).map((status) => (
													<button
														key={status}
														onClick={() => setStatusFilter(status)}
														className={cn(
															"h-8 rounded-lg text-xs cursor-pointer px-3.5 font-bold transition-all shrink-0",
															statusFilter === status
																? "bg-[#1E1E1E] text-white border border-[#2D2D2D] shadow-xs"
																: "text-zinc-400 hover:text-white"
														)}
													>
														{status}
													</button>
												))}
											</div>
										</div>

										{/* Desktop Table View (lg+) */}
										<div className="hidden lg:block bg-[#0D0D0D]/80 border border-[#1C1C1C] rounded-[24px] overflow-hidden shadow-2xl relative">
											<div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-[#2C2C2C] to-transparent" />
											<div className="overflow-x-auto w-full">
												<table className="w-full text-left border-collapse">
													<thead>
														<tr className="border-b border-[#1C1C1C] bg-[#121212]/30 text-xs font-bold uppercase tracking-wider text-zinc-500">
															<th className="p-4 pl-6 w-8"></th>
															<th className="p-4">Applicant</th>
															<th className="p-4">Funding Requested</th>
															<th className="p-4">Revenue</th>
															<th className="p-4">Date</th>
															<th className="p-4">Status</th>
															<th className="p-4 pr-6 text-right">Actions</th>
														</tr>
													</thead>
													<tbody className="divide-y divide-[#1C1C1C]/60 text-sm">
														{filteredInquiries.map((item) => {
															const isExpanded = expandedRow === item.id;
															return (
																<React.Fragment key={item.id}>
																	<tr className={cn(
																		"hover:bg-[#121212]/40 transition-colors group/row",
																		isExpanded && "bg-cyan-500/[0.01]"
																	)}>
																		<td className="p-4 pl-6 text-center">
																			<button
																				onClick={() => setExpandedRow(isExpanded ? null : item.id)}
																				className="p-1 rounded text-zinc-500 hover:bg-zinc-800 hover:text-white transition-all cursor-pointer"
																			>
																				{isExpanded ? <ChevronDown className="size-4" /> : <ArrowRight className="size-4" />}
																			</button>
																		</td>
																		<td className="p-4">
																			<div className="flex items-center gap-3">
																				<img
																					src={`https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(item.name)}`}
																					alt={item.name}
																					className="size-9 rounded-full bg-zinc-900 border border-zinc-850 shrink-0 object-cover"
																				/>
																				<div className="min-w-0">
																					<div className="flex items-center gap-2">
																						<span className="font-bold text-white group-hover/row:text-cyan-400 transition-colors truncate">{item.name}</span>
																						{item.isCrownCapitalMca && (
																							<span className="text-[8px] bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black px-1.5 py-0.25 rounded-md uppercase tracking-wider shrink-0">
																								GTA Funding MCA
																							</span>
																						)}
																					</div>
																					<div className="text-xs text-zinc-500 font-semibold mt-0.5 truncate max-w-[180px]">
																						{item.isCrownCapitalMca && item.mcaDetails ? `${item.mcaDetails.operatingName} · ${item.email}` : item.email}
																					</div>
																				</div>
																			</div>
																		</td>
																		<td className="p-4">
																			<div className="font-extrabold text-white">{item.amount}</div>
																			<div className="text-xs text-zinc-500 font-medium truncate max-w-[160px]">{item.timeInBusiness} in business</div>
																		</td>
																		<td className="p-4 text-xs font-bold text-zinc-300">{item.revenue}</td>
																		<td className="p-4 text-xs text-zinc-400 font-medium">{item.date}</td>
																		<td className="p-4">
																			<span className={cn(
																				"text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border shadow-3xs",
																				{
																					"bg-amber-500/10 text-amber-400 border-amber-500/20": item.status === "Pending",
																					"bg-emerald-500/10 text-emerald-400 border-emerald-500/20": item.status === "Approved",
																					"bg-red-500/10 text-red-400 border-red-500/20": item.status === "Declined"
																				}
																			)}>
																				{item.status}
																			</span>
																		</td>
																		<td className="p-4 pr-6 text-right">
																			<div className="flex items-center justify-end gap-1.5">
																				<Button
																					variant="outline"
																					size="icon"
																					className="size-8 cursor-pointer border-[#222222] bg-[#121212] hover:bg-[#1C1C1C] rounded-xl"
																					onClick={() => setSelectedInquiry(item)}
																				>
																					<Eye className="size-3.5 text-zinc-400" />
																				</Button>
																				<Button
																					variant="outline"
																					size="icon"
																					className="size-8 cursor-pointer border-[#222222] bg-[#121212] hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/20 rounded-xl"
																					onClick={() => handleUpdateStatus(item.id, "Approved")}
																					disabled={item.status === "Approved"}
																				>
																					<CheckCircle2 className="size-3.5" />
																				</Button>
																				<Button
																					variant="outline"
																					size="icon"
																					className="size-8 cursor-pointer border-[#222222] bg-[#121212] hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 rounded-xl"
																					onClick={() => handleUpdateStatus(item.id, "Declined")}
																					disabled={item.status === "Declined"}
																				>
																					<XCircle className="size-3.5" />
																				</Button>
																				<Button
																					variant="ghost"
																					size="icon"
																					className="size-8 cursor-pointer hover:bg-red-500/15 hover:text-red-400 rounded-xl"
																					onClick={() => handleDeleteInquiry(item.id)}
																				>
																					<Trash2 className="size-3.5" />
																				</Button>
																			</div>
																		</td>
																	</tr>
																	{isExpanded && (
																		<tr className="bg-zinc-950/20">
																			<td colSpan={7} className="p-0 border-b border-[#1C1C1C]">
																				{item.isCrownCapitalMca && item.mcaDetails ? (
																					/* Rich GTA Funding MCA Details Display */
																					<div className="px-6 py-5 border-t border-dashed border-[#1C1C1C] space-y-5 text-xs">
																						<div className="flex items-center gap-2 text-blue-400 font-bold uppercase tracking-wider border-b border-zinc-900 pb-2">
																							<Building className="size-4" />
																							<span>GTA Funding MCA Business Information</span>
																						</div>
																						
																						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
																							<div className="bg-[#111] border border-[#1C1C1C] p-3.5 rounded-xl">
																								<span className="text-[9px] font-bold text-zinc-550 uppercase tracking-wider block">Legal Business Name</span>
																								<span className="font-bold text-white block mt-1.5">{item.mcaDetails.businessName}</span>
																							</div>
																							<div className="bg-[#111] border border-[#1C1C1C] p-3.5 rounded-xl">
																								<span className="text-[9px] font-bold text-zinc-550 uppercase tracking-wider block">Operating Name</span>
																								<span className="font-bold text-white block mt-1.5">{item.mcaDetails.operatingName}</span>
																							</div>
																							<div className="bg-[#111] border border-[#1C1C1C] p-3.5 rounded-xl">
																								<span className="text-[9px] font-bold text-zinc-550 uppercase tracking-wider block">Business Address</span>
																								<span className="font-bold text-white block mt-1.5">
																									{item.mcaDetails.address.street}
																									{item.mcaDetails.address.line2 ? `, ${item.mcaDetails.address.line2}` : ""}, <br />
																									{item.mcaDetails.address.city}, {item.mcaDetails.address.state} {item.mcaDetails.address.zip}
																								</span>
																							</div>
																						</div>

																						<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
																							<div className="bg-[#111] border border-[#1C1C1C] p-3.5 rounded-xl">
																								<span className="text-[9px] font-bold text-zinc-550 uppercase tracking-wider block">Business Phone & Email</span>
																								<a href={`tel:${item.mcaDetails.businessPhone}`} className="font-bold text-zinc-200 hover:underline block mt-1.5">{item.mcaDetails.businessPhone}</a>
																								<a href={`mailto:${item.mcaDetails.businessEmail}`} className="font-bold text-cyan-400 hover:underline block mt-1 truncate">{item.mcaDetails.businessEmail}</a>
																							</div>
																							<div className="bg-[#111] border border-[#1C1C1C] p-3.5 rounded-xl">
																								<span className="text-[9px] font-bold text-zinc-550 uppercase tracking-wider block">Inc. Date & BN</span>
																								<span className="font-bold text-white block mt-1.5">{item.mcaDetails.incorporationDate}</span>
																								<span className="font-mono text-zinc-400 block mt-1">{item.mcaDetails.businessNumber}</span>
																							</div>
																							<div className="bg-[#111] border border-[#1C1C1C] p-3.5 rounded-xl">
																								<span className="text-[9px] font-bold text-zinc-550 uppercase tracking-wider block">Website & Industry</span>
																								<a href={item.mcaDetails.website} target="_blank" rel="noopener noreferrer" className="font-bold text-cyan-400 hover:underline block mt-1.5 truncate">{item.mcaDetails.website}</a>
																								<span className="font-bold text-zinc-300 block mt-1">{item.mcaDetails.industry}</span>
																							</div>
																							<div className="bg-[#111] border border-[#1C1C1C] p-3.5 rounded-xl">
																								<span className="text-[9px] font-bold text-zinc-550 uppercase tracking-wider block">Entity & Employees</span>
																								<span className="font-bold text-white block mt-1.5">{item.mcaDetails.entityType}</span>
																								<span className="font-bold text-zinc-400 block mt-1">{item.mcaDetails.numberOfEmployees} employees · {item.mcaDetails.propertyType}</span>
																							</div>
																						</div>

																						<div className="bg-[#111] border border-[#1C1C1C] p-3.5 rounded-xl">
																							<span className="text-[9px] font-bold text-zinc-550 uppercase tracking-wider block mb-1">Primary Use of Funds</span>
																							<p className="text-zinc-300 leading-relaxed font-medium">&ldquo;{item.mcaDetails.useOfFunds}&rdquo;</p>
																						</div>
																					</div>
																				) : (
																					<div className="px-6 py-5 border-t border-dashed border-[#1C1C1C] flex flex-col md:flex-row gap-6 text-xs">
																						<div className="flex-1 space-y-3">
																							<div>
																								<span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Applicant usage plan</span>
																								<p className="text-zinc-300 leading-relaxed font-medium bg-[#111] border border-[#1C1C1C] p-3.5 rounded-xl">
																									&ldquo;{item.purpose}&rdquo;
																								</p>
																							</div>
																						</div>
																						<div className="md:w-72 shrink-0 grid grid-cols-2 gap-4 h-fit self-end">
																							<div className="bg-[#111] border border-[#1C1C1C] p-3 rounded-xl">
																								<span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">Phone Contacts</span>
																								<a href={`tel:${item.phone}`} className="font-bold text-zinc-200 hover:underline block mt-1">{item.phone}</a>
																							</div>
																							<div className="bg-[#111] border border-[#1C1C1C] p-3 rounded-xl">
																								<span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">Est. Revenue</span>
																								<span className="font-bold text-zinc-200 block mt-1">{item.revenue}</span>
																							</div>
																						</div>
																					</div>
																				)}
																			</td>
																		</tr>
																	)}
																</React.Fragment>
															);
														})}
													</tbody>
												</table>
											</div>
										</div>

										{/* Mobile Cards View (<lg) */}
										<div className="lg:hidden space-y-4">
											{filteredInquiries.length === 0 ? (
												<div className="p-12 text-center text-zinc-500 bg-[#0D0D0D] border border-[#1C1C1C] rounded-2xl">
													<Inbox className="size-8 mx-auto text-zinc-700 mb-2" />
													<p className="text-sm font-semibold">No inquiries found</p>
												</div>
											) : (
												filteredInquiries.map((item) => {
													const isExpanded = expandedRow === item.id;
													return (
														<div
															key={item.id}
															className={cn(
																"bg-[#0D0D0D] border border-[#1C1C1C] rounded-2xl p-4.5 space-y-3.5 transition-all shadow-xs relative overflow-hidden",
																isExpanded && "border-cyan-500/25"
															)}
														>
															<div className="flex justify-between items-start">
																<div className="flex items-center gap-3 min-w-0">
																	<img
																		src={`https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(item.name)}`}
																		alt={item.name}
																		className="size-9 rounded-full bg-zinc-900 border border-zinc-850 shrink-0 object-cover"
																	/>
																	<div className="min-w-0">
																		<div className="flex items-center gap-1.5">
																			<span className="text-xs font-bold text-white block truncate">{item.name}</span>
																			{item.isCrownCapitalMca && (
																				<span className="text-[7px] bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black px-1 py-0.25 rounded uppercase tracking-wider shrink-0">
																					MCA
																				</span>
																			)}
																		</div>
																		<span className="text-[10px] text-zinc-500 block truncate mt-0.5">
																			{item.isCrownCapitalMca && item.mcaDetails ? `${item.mcaDetails.operatingName} · ${item.email}` : item.email}
																		</span>
																	</div>
																</div>
																<span className={cn(
																	"text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border",
																	{
																		"bg-amber-500/10 text-amber-400 border-amber-500/20": item.status === "Pending",
																		"bg-emerald-500/10 text-emerald-400 border-emerald-500/20": item.status === "Approved",
																		"bg-red-500/10 text-red-400 border-red-500/20": item.status === "Declined"
																	}
																)}>
																	{item.status}
																</span>
															</div>

															<div className="grid grid-cols-2 gap-3 text-[10px] pt-3.5 border-t border-zinc-900 font-semibold">
																<div>
																	<span className="text-zinc-500 block text-[9px] uppercase tracking-wider">Amount</span>
																	<span className="text-white font-extrabold mt-0.5 block">{item.amount}</span>
																</div>
																<div>
																	<span className="text-zinc-500 block text-[9px] uppercase tracking-wider">Business Age</span>
																	<span className="text-white mt-0.5 block">{item.timeInBusiness}</span>
																</div>
															</div>

															{isExpanded && (
																<div className="pt-3.5 border-t border-[#1C1C1C] border-dashed space-y-2 animate-in slide-in-from-top-1 duration-200">
																	<div className="bg-[#111] p-3 rounded-xl border border-[#1C1C1C]">
																		<span className="text-[8px] font-bold text-zinc-555 uppercase tracking-wider block">Use of Funds</span>
																		<p className="text-[11px] text-zinc-350 mt-1 leading-relaxed font-medium">&ldquo;{item.purpose}&rdquo;</p>
																	</div>
																	<div className="grid grid-cols-2 gap-3 text-[10px]">
																		<div className="bg-[#111] p-2.5 rounded-xl border border-[#1C1C1C]">
																			<span className="text-[8px] text-zinc-550 block uppercase tracking-wider">Phone</span>
																			<Link href={`tel:${item.phone}`} className="font-bold text-white hover:underline mt-0.5 block">{item.phone}</Link>
																		</div>
																		<div className="bg-[#111] p-2.5 rounded-xl border border-[#1C1C1C]">
																			<span className="text-[8px] text-zinc-550 block uppercase tracking-wider">Revenue</span>
																			<span className="font-bold text-white mt-0.5 block">{item.revenue}</span>
																		</div>
																	</div>
																</div>
															)}

															<div className="flex justify-between items-center pt-3.5 border-t border-zinc-900 gap-2">
																<button
																	onClick={() => setExpandedRow(isExpanded ? null : item.id)}
																	className="text-[10px] font-bold text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
																>
																	{isExpanded ? (
																		<>Hide details <ChevronUp className="size-3" /></>
																	) : (
																		<>Show details <ChevronDown className="size-3" /></>
																	)}
																</button>
																
																<div className="flex items-center gap-1.5">
																	<Button
																		variant="outline"
																		size="icon"
																		className="size-7 cursor-pointer border-[#222222] bg-[#121212] rounded-lg"
																		onClick={() => setSelectedInquiry(item)}
																	>
																		<Eye className="size-3 text-zinc-400" />
																	</Button>
																	<Button
																		variant="outline"
																		size="icon"
																		className="size-7 cursor-pointer border-[#222222] bg-[#121212] hover:bg-emerald-500/10 hover:text-emerald-400 rounded-lg"
																		onClick={() => handleUpdateStatus(item.id, "Approved")}
																		disabled={item.status === "Approved"}
																	>
																		<CheckCircle2 className="size-3" />
																	</Button>
																	<Button
																		variant="outline"
																		size="icon"
																		className="size-7 cursor-pointer border-[#222222] bg-[#121212] hover:bg-red-500/10 hover:text-red-400 rounded-lg"
																		onClick={() => handleUpdateStatus(item.id, "Declined")}
																		disabled={item.status === "Declined"}
																	>
																		<XCircle className="size-3" />
																	</Button>
																	<Button
																		variant="ghost"
																		size="icon"
																		className="size-7 cursor-pointer hover:bg-red-500/15 hover:text-red-400 rounded-lg"
																		onClick={() => handleDeleteInquiry(item.id)}
																	>
																		<Trash2 className="size-3" />
																	</Button>
																</div>
															</div>
														</div>
													);
												})
											)}
										</div>
									</div>
								)}
							</div>

							{/* Footer positioned inside the scroll wrapper so it flows at the end */}
							<footer className="py-6 border-t border-[#1C1C1C] bg-transparent text-center mt-auto pt-6">
								<p className="text-center text-xs text-zinc-500 font-medium px-4">
									&copy; {new Date().getFullYear()} GTA Funding Admin Console. Confidential.
								</p>
							</footer>
						</div>
					</div>
				)}
			</main>

			{/* Details Modal */}
			{selectedInquiry && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					<div
						className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer transition-opacity duration-300"
						onClick={() => setSelectedInquiry(null)}
					/>
					
					<div className="relative bg-[#0D0D0D] border border-zinc-800 rounded-[28px] max-w-xl w-full overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.8)] z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
						<div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-cyan-500/30 to-transparent" />
						
						{/* Header */}
						<div className="p-5 sm:p-6 border-b border-[#1C1C1C] flex items-center justify-between gap-4">
							<div className="space-y-0.5">
								<h3 className="text-base sm:text-lg font-extrabold text-white">Application Parameters</h3>
								<div className="flex items-center gap-1 text-[11px] text-zinc-500 font-semibold">
									<Calendar className="size-3.5" />
									<span>Submitted on {selectedInquiry.date}</span>
								</div>
							</div>
							<span className={cn(
								"text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border shadow-3xs shrink-0",
								{
									"bg-amber-500/10 text-amber-400 border-amber-500/20": selectedInquiry.status === "Pending",
									"bg-emerald-500/10 text-emerald-400 border-emerald-500/20": selectedInquiry.status === "Approved",
									"bg-red-500/10 text-red-400 border-red-500/20": selectedInquiry.status === "Declined"
								}
							)}>
								{selectedInquiry.status}
							</span>
						</div>

						{/* Scrollable details */}
						<div className="p-5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 flex-1 text-xs">
							{selectedInquiry.isCrownCapitalMca && selectedInquiry.mcaDetails ? (
								/* GTA Funding MCA details display inside Modal */
								<>
									{/* Profile Card */}
									<div className="bg-[#121212]/50 border border-zinc-800/60 rounded-2xl p-4 sm:p-4.5 space-y-4">
										<div className="flex items-center gap-3.5 pb-3 border-b border-[#1C1C1C]">
											<img
												src={`https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(selectedInquiry.name)}`}
												alt={selectedInquiry.name}
												className="size-11 rounded-xl bg-zinc-900 border border-zinc-800 shrink-0 object-cover"
											/>
											<div>
												<span className="text-zinc-550 text-[9px] font-bold uppercase tracking-wider block">Owner & Officer</span>
												<h4 className="text-sm font-bold text-white">{selectedInquiry.name}</h4>
											</div>
										</div>

										<div className="grid grid-cols-2 gap-4">
											<div>
												<span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Owner Phone</span>
												<a href={`tel:${selectedInquiry.mcaDetails.ownerPhone}`} className="font-extrabold text-white mt-1.5 flex items-center gap-1.5 text-xs">
													<Phone className="size-3.5 text-zinc-505" />
													{selectedInquiry.mcaDetails.ownerPhone}
												</a>
											</div>
											<div>
												<span className="text-[10px] font-bold text-zinc-505 uppercase tracking-widest block">Owner Email</span>
												<a href={`mailto:${selectedInquiry.mcaDetails.ownerEmail}`} className="text-cyan-400 font-bold hover:underline mt-1.5 flex items-center gap-1.5 text-xs truncate">
													<Mail className="size-3.5 text-cyan-500" />
													{selectedInquiry.mcaDetails.ownerEmail}
												</a>
											</div>
										</div>
									</div>

									{/* Business Information Card */}
									<div className="bg-[#121212]/50 border border-zinc-800/60 rounded-2xl p-4 sm:p-4.5 space-y-4">
										<div className="flex items-center gap-2 text-blue-400 font-bold uppercase tracking-wider border-b border-zinc-900/60 pb-2">
											<Building className="size-4" />
											<span>Business Parameters</span>
										</div>

										<div className="grid grid-cols-2 gap-4">
											<div>
												<span className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest block">Legal Business Name</span>
												<span className="font-extrabold text-white mt-1.5 block">{selectedInquiry.mcaDetails.businessName}</span>
											</div>
											<div>
												<span className="text-[10px] font-bold text-zinc-555 uppercase tracking-widest block">Operating Name</span>
												<span className="font-extrabold text-white mt-1.5 block">{selectedInquiry.mcaDetails.operatingName}</span>
											</div>
										</div>

										<div className="border-t border-[#1C1C1C] pt-3">
											<span className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest block">Street Address</span>
											<span className="font-bold text-white mt-1 block">
												{selectedInquiry.mcaDetails.address.street}
												{selectedInquiry.mcaDetails.address.line2 ? `, ${selectedInquiry.mcaDetails.address.line2}` : ""}
											</span>
											<span className="font-bold text-zinc-400 block mt-0.5">
												{selectedInquiry.mcaDetails.address.city}, {selectedInquiry.mcaDetails.address.state} {selectedInquiry.mcaDetails.address.zip}
											</span>
										</div>

										<div className="grid grid-cols-2 gap-4 border-t border-[#1C1C1C] pt-3">
											<div>
												<span className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest block">Business Phone</span>
												<a href={`tel:${selectedInquiry.mcaDetails.businessPhone}`} className="font-bold text-white hover:underline mt-1 block">{selectedInquiry.mcaDetails.businessPhone}</a>
											</div>
											<div>
												<span className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest block">Business Email</span>
												<a href={`mailto:${selectedInquiry.mcaDetails.businessEmail}`} className="font-bold text-cyan-400 hover:underline mt-1 block truncate">{selectedInquiry.mcaDetails.businessEmail}</a>
											</div>
										</div>

										<div className="grid grid-cols-2 gap-4 border-t border-[#1C1C1C] pt-3">
											<div>
												<span className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest block">Incorporation Date</span>
												<span className="font-bold text-white mt-1 block">{selectedInquiry.mcaDetails.incorporationDate}</span>
											</div>
											<div>
												<span className="text-[10px] font-bold text-zinc-555 uppercase tracking-widest block">Business Number</span>
												<span className="font-mono text-zinc-400 mt-1 block">{selectedInquiry.mcaDetails.businessNumber}</span>
											</div>
										</div>

										<div className="grid grid-cols-2 gap-4 border-t border-[#1C1C1C] pt-3">
											<div>
												<span className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest block">Website</span>
												<a href={selectedInquiry.mcaDetails.website} target="_blank" rel="noopener noreferrer" className="font-bold text-cyan-400 hover:underline mt-1 block truncate">{selectedInquiry.mcaDetails.website}</a>
											</div>
											<div>
												<span className="text-[10px] font-bold text-zinc-555 uppercase tracking-widest block">Industry</span>
												<span className="font-bold text-white mt-1 block">{selectedInquiry.mcaDetails.industry}</span>
											</div>
										</div>

										<div className="grid grid-cols-2 gap-4 border-t border-[#1C1C1C] pt-3">
											<div>
												<span className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest block">Entity Type</span>
												<span className="font-bold text-white mt-1 block">{selectedInquiry.mcaDetails.entityType}</span>
											</div>
											<div>
												<span className="text-[10px] font-bold text-zinc-555 uppercase tracking-widest block">Employees / Property</span>
												<span className="font-bold text-zinc-350 mt-1 block">{selectedInquiry.mcaDetails.numberOfEmployees} employees · {selectedInquiry.mcaDetails.propertyType}</span>
											</div>
										</div>
									</div>

									{/* Funding details card */}
									<div className="border border-zinc-800 rounded-2xl p-4 sm:p-4.5 space-y-4 bg-zinc-950/20">
										<div className="grid grid-cols-2 gap-4">
											<div>
												<span className="text-[10px] font-bold text-zinc-555 uppercase tracking-widest block">Amount Requested</span>
												<span className="font-black text-sm text-white mt-1 block">{selectedInquiry.amount}</span>
											</div>
											<div>
												<span className="text-[10px] font-bold text-zinc-555 uppercase tracking-widest block">Avg Monthly Revenue</span>
												<span className="font-black text-sm text-white mt-1 block">{selectedInquiry.revenue}</span>
											</div>
										</div>
										<div className="grid grid-cols-3 gap-4 border-t border-[#1C1C1C] pt-3">
											<div>
												<span className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest block">Overdraft Protection</span>
												<span className="font-extrabold text-white mt-1 block text-xs">{selectedInquiry.mcaDetails.overdraftProtection || "N/A"}</span>
											</div>
											<div>
												<span className="text-[10px] font-bold text-zinc-555 uppercase tracking-widest block">Bank Accounts</span>
												<span className="font-extrabold text-white mt-1 block text-xs">{selectedInquiry.mcaDetails.numberOfBankAccounts || "N/A"}</span>
											</div>
											<div>
												<span className="text-[10px] font-bold text-zinc-555 uppercase tracking-widest block">Unsecured Debt</span>
												<span className="font-extrabold text-white mt-1 block text-xs">{selectedInquiry.mcaDetails.hasUnsecuredDebt || "N/A"}</span>
											</div>
										</div>
										{selectedInquiry.mcaDetails.hasUnsecuredDebt === "Yes" && (
											<div className="grid grid-cols-2 gap-4 border-t border-[#1C1C1C] pt-3 animate-in slide-in-from-top-1 duration-200">
												<div>
													<span className="text-[10px] font-bold text-zinc-555 uppercase tracking-widest block">Unsecured Lenders</span>
													<span className="font-extrabold text-white mt-1 block text-xs truncate" title={selectedInquiry.mcaDetails.unsecuredDebtLenders}>{selectedInquiry.mcaDetails.unsecuredDebtLenders || "N/A"}</span>
												</div>
												<div>
													<span className="text-[10px] font-bold text-zinc-555 uppercase tracking-widest block">Total Unsecured Owing</span>
													<span className="font-extrabold text-white mt-1 block text-xs">{selectedInquiry.mcaDetails.unsecuredDebtAmount || "N/A"}</span>
												</div>
											</div>
										)}
										<div className="border-t border-[#1C1C1C] pt-3">
											<span className="text-[10px] font-bold text-zinc-555 uppercase tracking-widest block mb-1">Primary Use of Funds</span>
											<p className="text-zinc-300 leading-relaxed font-medium mt-2 flex items-start gap-2.5 bg-[#121212]/50 border border-zinc-800/60 p-3 rounded-xl">
												<FileText className="size-4 text-zinc-555 shrink-0 mt-0.5" />
												{selectedInquiry.mcaDetails.useOfFunds}
											</p>
										</div>
										{selectedInquiry.mcaDetails.signatureFile && (
											<div className="border-t border-[#1C1C1C] pt-3">
												<span className="text-[10px] font-bold text-zinc-555 uppercase tracking-widest block mb-1">Owner's Signature</span>
												<div className="bg-[#121212]/50 border border-zinc-800/60 p-3 rounded-xl flex flex-col gap-2 mt-2">
													<div className="flex items-center gap-2 text-xs text-zinc-400">
														<FileText className="size-4 text-blue-500" />
														<span className="font-semibold text-white truncate text-xs">{selectedInquiry.mcaDetails.signatureFileName || "signature.png"}</span>
													</div>
													{selectedInquiry.mcaDetails.signatureFile.startsWith("data:image/") ? (
														<div className="bg-white rounded-lg p-3 border border-zinc-200 flex justify-center items-center max-h-[100px] overflow-hidden w-fit max-w-[200px]">
															<img
																src={selectedInquiry.mcaDetails.signatureFile}
																alt="Owner Signature"
																className="max-h-[80px] object-contain"
															/>
														</div>
													) : (
														<span className="text-[10px] text-zinc-500 font-mono">PDF Signature (Cannot preview)</span>
													)}
												</div>
											</div>
										)}
										{selectedInquiry.mcaDetails.bankStatements && selectedInquiry.mcaDetails.bankStatements.length > 0 && (
											<div className="border-t border-[#1C1C1C] pt-3">
												<span className="text-[10px] font-bold text-zinc-555 uppercase tracking-widest block mb-1">Uploaded Bank Statements</span>
												<div className="space-y-2 mt-2">
													{selectedInquiry.mcaDetails.bankStatements.map((stmt: any, idx: number) => (
														<div key={idx} className="bg-[#121212]/50 border border-zinc-800/60 p-3 rounded-xl flex items-center justify-between gap-3">
															<div className="flex items-center gap-2 text-xs text-zinc-400 min-w-0 flex-1">
																<FileText className="size-4 text-blue-500 shrink-0" />
																<span className="font-semibold text-white truncate text-xs" title={stmt.fileName}>{stmt.fileName}</span>
															</div>
															<a
																href={stmt.fileData}
																download={stmt.fileName}
																className="text-[10px] bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-3 py-1.5 rounded-lg border border-zinc-700 transition-colors shrink-0"
															>
																Download
															</a>
														</div>
													))}
												</div>
											</div>
										)}
									</div>
								</>
							) : (
								/* Standard details display */
								<>
									<div className="bg-[#121212]/50 border border-zinc-800/60 rounded-2xl p-4 sm:p-4.5 space-y-4">
										<div className="flex items-center gap-3.5 pb-3 border-b border-[#1C1C1C]">
											<img
												src={`https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(selectedInquiry.name)}`}
												alt={selectedInquiry.name}
												className="size-11 rounded-xl bg-zinc-900 border border-zinc-800 shrink-0 object-cover"
											/>
											<div>
												<span className="text-zinc-550 text-[9px] font-bold uppercase tracking-wider block">Applicant Profile</span>
												<h4 className="text-sm font-bold text-white">{selectedInquiry.name}</h4>
											</div>
										</div>

										<div className="grid grid-cols-2 gap-4">
											<div>
												<span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Full Name</span>
												<span className="font-extrabold text-white mt-1.5 flex items-center gap-1.5 text-xs sm:text-sm">
													<Users className="size-4 text-zinc-505" />
													{selectedInquiry.name}
												</span>
											</div>
											<div>
												<span className="text-[10px] font-bold text-zinc-555 uppercase tracking-widest block">Time in Business</span>
												<span className="font-bold text-white mt-1.5 flex items-center gap-1.5 text-xs sm:text-sm">
													<Building className="size-4 text-zinc-555" />
													{selectedInquiry.timeInBusiness}
												</span>
											</div>
										</div>
										
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#1C1C1C] pt-4">
											<div>
												<span className="text-[10px] font-bold text-zinc-505 uppercase tracking-widest block">Business Email</span>
												<a href={`mailto:${selectedInquiry.email}`} className="text-cyan-400 font-bold hover:underline mt-1.5 flex items-center gap-1.5 truncate text-xs">
													<Mail className="size-4 text-cyan-500" />
													{selectedInquiry.email}
												</a>
											</div>
											<div>
												<span className="text-[10px] font-bold text-zinc-555 uppercase tracking-widest block">Phone Number</span>
												<a href={`tel:${selectedInquiry.phone}`} className="font-bold text-white hover:underline mt-1.5 block text-xs">
													{selectedInquiry.phone}
												</a>
											</div>
										</div>
									</div>

									<div className="border border-zinc-800 rounded-2xl p-4 sm:p-4.5 space-y-4 bg-zinc-950/20">
										<div className="grid grid-cols-2 gap-4">
											<div>
												<span className="text-[10px] font-bold text-zinc-505 uppercase tracking-widest block">Funding Requested</span>
												<span className="font-black text-sm sm:text-base text-white mt-1.5 block">{selectedInquiry.amount}</span>
											</div>
											<div>
												<span className="text-[10px] font-bold text-zinc-505 uppercase tracking-widest block">Monthly Revenue</span>
												<span className="font-extrabold text-sm sm:text-base text-white mt-1.5 block">{selectedInquiry.revenue}</span>
											</div>
										</div>

										<div className="border-t border-[#1C1C1C] pt-4">
											<span className="text-[10px] font-bold text-zinc-505 uppercase tracking-widest block mb-1">What is the funding for?</span>
											<p className="text-zinc-350 leading-relaxed font-medium mt-2 flex items-start gap-2.5 bg-[#121212]/50 border border-zinc-800/60 p-3 rounded-xl">
												<FileText className="size-4 text-zinc-555 shrink-0 mt-0.5" />
												{selectedInquiry.purpose}
											</p>
										</div>
									</div>
								</>
							)}
						</div>

						{/* Footer Actions */}
						<div className="p-5 sm:p-6 border-t border-[#1C1C1C] flex items-center justify-between gap-3 bg-[#0E0E0E]">
							<Button
								variant="ghost"
								onClick={() => setSelectedInquiry(null)}
								className="rounded-xl font-bold text-xs cursor-pointer text-zinc-400 hover:text-white"
							>
								Close view
							</Button>
							
							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									onClick={() => handleUpdateStatus(selectedInquiry.id, "Declined")}
									className="rounded-xl border-zinc-800 bg-[#121212] hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 font-bold text-xs cursor-pointer h-9 px-3 sm:px-3.5"
									disabled={selectedInquiry.status === "Declined"}
								>
									Decline
								</Button>
								<Button
									onClick={() => handleUpdateStatus(selectedInquiry.id, "Approved")}
									className="rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs cursor-pointer h-9 px-3 sm:px-3.5"
									disabled={selectedInquiry.status === "Approved"}
								>
									Approve
								</Button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
