"use client";
import React, { useState, useRef, useEffect } from "react";
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
	const [errors, setErrors] = useState<Record<string, string>>({});
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

		// Property Details
		monthlyRent: "",
		landlordFirstName: "",
		landlordLastName: "",
		landlordPhone: "",
		timeLeftOnLease: "",
		propertyValue: "",
		mortgageBalance: "",

		// Step 2: Business Owner's Information
		ownerFirstName: "",
		ownerLastName: "",
		ownerDob: "",
		ownerStreetAddress: "",
		ownerStreetAddressLine2: "",
		ownerCity: "",
		ownerState: "",
		ownerPostalCode: "",
		ownerSsn: "",
		ownerCreditScore: "",
		ownerHomeStatus: "",
		ownerOwnsVehicle: "",
		ownerBankruptBefore: "",
		ownerShareholderCount: "",
		ownerSharePercentage: "",
		sh2FirstName: "",
		sh2LastName: "",
		sh2Dob: "",
		sh2Email: "",
		sh2Share: "",
		sh3FirstName: "",
		sh3LastName: "",
		sh3Dob: "",
		sh3Email: "",
		sh3Share: "",
		sh4FirstName: "",
		sh4LastName: "",
		sh4Dob: "",
		sh4Email: "",
		sh4Share: "",

		// Step 3: Funding Details
		amountRequested: "",
		monthlyRevenue: "",
		useOfFunds: "",
		overdraftProtection: "",
		numberOfBankAccounts: "",
		hasUnsecuredDebt: "",
		unsecuredDebtLenders: "",
		unsecuredDebtAmount: "",
		signatureFile: "",
		signatureFileName: "",
		bankStatements: [] as Array<{ fileData: string; fileName: string }>,
		ownerName: "",
		ownerPhone: "",
		ownerEmail: ""
	});

	// Signature Pad State & Refs
	const [sigMode, setSigMode] = useState<"draw" | "upload">("draw");
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [isDrawing, setIsDrawing] = useState(false);

	// Initialize and draw back signature if present
	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas && step === 4 && sigMode === "draw") {
			const rect = canvas.getBoundingClientRect();
			canvas.width = rect.width || 600;
			canvas.height = rect.height || 200;

			// Re-draw signature if stored in form state
			if (formData.signatureFile && formData.signatureFile.startsWith("data:image/")) {
				const img = new Image();
				img.onload = () => {
					const ctx = canvas.getContext("2d");
					if (ctx) {
						ctx.drawImage(img, 0, 0);
					}
				};
				img.src = formData.signatureFile;
			}
		}
	}, [step, sigMode, formData.signatureFile]);

	const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
		e.preventDefault();
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		ctx.strokeStyle = "#1A1A1A"; // Dark signature ink
		ctx.lineWidth = 3;
		ctx.lineCap = "round";
		ctx.lineJoin = "round";

		const pos = getDrawingPos(e);
		ctx.beginPath();
		ctx.moveTo(pos.x, pos.y);
		setIsDrawing(true);
	};

	const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
		if (!isDrawing) return;
		e.preventDefault();
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const pos = getDrawingPos(e);
		ctx.lineTo(pos.x, pos.y);
		ctx.stroke();
	};

	const stopDrawing = () => {
		if (!isDrawing) return;
		setIsDrawing(false);
		
		const canvas = canvasRef.current;
		if (canvas) {
			const dataUrl = canvas.toDataURL("image/png");
			setFormData(prev => ({
				...prev,
				signatureFile: dataUrl,
				signatureFileName: "drawn_signature.png"
			}));
			if (errors.signatureFile) {
				setErrors(prev => ({ ...prev, signatureFile: "" }));
			}
		}
	};

	const getDrawingPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
		const canvas = canvasRef.current;
		if (!canvas) return { x: 0, y: 0 };
		const rect = canvas.getBoundingClientRect();
		
		if ("touches" in e) {
			if (e.touches.length === 0) return { x: 0, y: 0 };
			return {
				x: e.touches[0].clientX - rect.left,
				y: e.touches[0].clientY - rect.top
			};
		} else {
			return {
				x: e.clientX - rect.left,
				y: e.clientY - rect.top
			};
		}
	};

	const clearSignature = () => {
		const canvas = canvasRef.current;
		if (canvas) {
			const ctx = canvas.getContext("2d");
			if (ctx) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
			}
		}
		setFormData(prev => ({
			...prev,
			signatureFile: "",
			signatureFileName: ""
		}));
	};

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

	const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: "businessPhone" | "ownerPhone" | "landlordPhone") => {
		const formatted = formatPhoneNumber(e.target.value);
		setFormData(prev => ({ ...prev, [fieldName]: formatted }));
	};

	const handleSignatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setFormData(prev => ({
					...prev,
					signatureFile: reader.result as string,
					signatureFileName: file.name
				}));
				if (errors.signatureFile) {
					setErrors(prev => ({ ...prev, signatureFile: "" }));
				}
			};
			reader.readAsDataURL(file);
		}
	};

	const handleBankStatementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			const loadedFiles: Array<{ fileData: string; fileName: string }> = [];
			let loadedCount = 0;

			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				const reader = new FileReader();
				reader.onload = () => {
					loadedFiles.push({
						fileData: reader.result as string,
						fileName: file.name
					});
					loadedCount++;
					if (loadedCount === files.length) {
						setFormData(prev => ({
							...prev,
							bankStatements: [...prev.bankStatements, ...loadedFiles]
						}));
						if (errors.bankStatements) {
							setErrors(prev => ({ ...prev, bankStatements: "" }));
						}
					}
				};
				reader.readAsDataURL(file);
			}
		}
	};

	// Form validation before proceeding to Step 2
	const validateStep1 = () => {
		type Step1Field = 
			| "businessName"
			| "operatingName"
			| "businessPhone"
			| "businessEmail"
			| "incorporationDate"
			| "businessNumber"
			| "website"
			| "industry"
			| "entityType"
			| "numberOfEmployees"
			| "propertyType";

		const fieldLabels: Record<Step1Field, string> = {
			businessName: "Business Name",
			operatingName: "Business Operating Name",
			businessPhone: "Business Phone Number",
			businessEmail: "Business Email Address",
			incorporationDate: "Incorporation Date",
			businessNumber: "Business Number",
			website: "Business Website",
			industry: "Business Industry",
			entityType: "Entity Type",
			numberOfEmployees: "Number of Employees",
			propertyType: "Business Property Status"
		};

		const requiredFields = Object.keys(fieldLabels) as Step1Field[];

		for (const field of requiredFields) {
			if (!formData[field]) {
				setError(`Please fill out the required field: ${fieldLabels[field]}.`);
				return false;
			}
		}

		if (formData.entityType === "Other" && !formData.entityTypeOther) {
			setError("Please specify your custom Entity Type.");
			return false;
		}

		// Validate property conditional fields
		if (formData.propertyType === "Rented") {
			if (!formData.monthlyRent) {
				setError("Please fill out the required field: Monthly Rent.");
				return false;
			}
			if (!formData.landlordFirstName) {
				setError("Please fill out the required field: Landlord's First Name.");
				return false;
			}
			if (!formData.landlordLastName) {
				setError("Please fill out the required field: Landlord's Last Name.");
				return false;
			}
			if (!formData.landlordPhone) {
				setError("Please fill out the required field: Landlord's Phone Number.");
				return false;
			}
			if (formData.landlordPhone.length < 14) {
				setError("Please enter a valid landlord phone number in format: (000) 000-0000.");
				return false;
			}
			if (!formData.timeLeftOnLease) {
				setError("Please fill out the required field: Time left on lease.");
				return false;
			}
		} else if (formData.propertyType === "Owned") {
			if (!formData.propertyValue) {
				setError("Please fill out the required field: Property Value.");
				return false;
			}
			if (!formData.mortgageBalance) {
				setError("Please fill out the required field: Mortgage Balance.");
				return false;
			}
		}

		// Basic phone length validation: (000) 000-0000 is 14 chars
		if (formData.businessPhone.length < 14) {
			setError("Please enter a valid business phone number in format: (000) 000-0000.");
			return false;
		}

		setError("");
		return true;
	};

	// Form validation before proceeding to Step 3
	const validateStep2 = () => {
		type Step2Field =
			| "ownerFirstName"
			| "ownerLastName"
			| "ownerDob"
			| "ownerEmail"
			| "ownerPhone"
			| "ownerSsn"
			| "ownerCreditScore"
			| "ownerHomeStatus"
			| "ownerOwnsVehicle"
			| "ownerBankruptBefore";

		const fieldLabels: Record<Step2Field, string> = {
			ownerFirstName: "First Name",
			ownerLastName: "Last Name",
			ownerDob: "Date of Birth",
			ownerEmail: "Email Address",
			ownerPhone: "Phone Number",
			ownerSsn: "Social Number",
			ownerCreditScore: "Personal Credit Score",
			ownerHomeStatus: "Home Status",
			ownerOwnsVehicle: "Vehicle Ownership Status",
			ownerBankruptBefore: "Bankruptcy Status"
		};

		const requiredFields = Object.keys(fieldLabels) as Step2Field[];

		for (const field of requiredFields) {
			if (!formData[field]) {
				setError(`Please fill out the required field: ${fieldLabels[field]}.`);
				return false;
			}
		}

		if (formData.ownerPhone.length < 14) {
			setError("Please enter a valid owner phone number in format: (000) 000-0000.");
			return false;
		}

		setError("");
		return true;
	};

	const validateStep3 = () => {
		// Validate Step 3 fields
		const step3Errors: Record<string, string> = {};
		if (!formData.amountRequested) {
			step3Errors.amountRequested = "This field is required.";
		}
		if (!formData.useOfFunds) {
			step3Errors.useOfFunds = "This field is required.";
		}
		if (!formData.monthlyRevenue) {
			step3Errors.monthlyRevenue = "This field is required.";
		}
		if (!formData.overdraftProtection) {
			step3Errors.overdraftProtection = "This field is required.";
		}
		if (!formData.numberOfBankAccounts) {
			step3Errors.numberOfBankAccounts = "This field is required.";
		}
		if (!formData.hasUnsecuredDebt) {
			step3Errors.hasUnsecuredDebt = "This field is required.";
		} else if (formData.hasUnsecuredDebt === "Yes") {
			if (!formData.unsecuredDebtLenders) {
				step3Errors.unsecuredDebtLenders = "This field is required.";
			}
			if (!formData.unsecuredDebtAmount) {
				step3Errors.unsecuredDebtAmount = "This field is required.";
			}
		}

		if (Object.keys(step3Errors).length > 0) {
			setErrors(step3Errors);
			setError("Please fill out all required fields.");
			return false;
		}

		setErrors({});
		setError("");
		return true;
	};

	const validateStep4 = () => {
		// Validate Step 4 signature file
		if (!formData.signatureFile) {
			setErrors({ signatureFile: "This field is required." });
			setError("Please upload your signature.");
			return false;
		}
		setErrors({});
		setError("");
		return true;
	};

	const handleNext = (e: React.MouseEvent) => {
		e.preventDefault();
		if (step === 1) {
			if (validateStep1()) {
				setStep(2);
				window.scrollTo({ top: 0, behavior: "smooth" });
			}
		} else if (step === 2) {
			if (validateStep2()) {
				setStep(3);
				window.scrollTo({ top: 0, behavior: "smooth" });
			}
		} else if (step === 3) {
			if (validateStep3()) {
				setStep(4);
				window.scrollTo({ top: 0, behavior: "smooth" });
			}
		} else if (step === 4) {
			if (validateStep4()) {
				setStep(5);
				window.scrollTo({ top: 0, behavior: "smooth" });
			}
		}
	};

	const handleBack = (e: React.MouseEvent) => {
		e.preventDefault();
		if (step === 2) {
			setStep(1);
			window.scrollTo({ top: 0, behavior: "smooth" });
		} else if (step === 3) {
			setStep(2);
			window.scrollTo({ top: 0, behavior: "smooth" });
		} else if (step === 4) {
			setStep(3);
			window.scrollTo({ top: 0, behavior: "smooth" });
		} else if (step === 5) {
			setStep(4);
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		// Validate Step 5 bank statements
		if (formData.bankStatements.length === 0) {
			setErrors({ bankStatements: "This field is required." });
			setError("Please upload your bank statements.");
			return;
		}

		setErrors({});
		setSubmitting(true);
		setError("");

		try {
			const fullName = `${formData.ownerFirstName} ${formData.ownerLastName}`;
			
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
				propertyDetails: formData.propertyType === "Rented" ? {
					monthlyRent: formData.monthlyRent,
					landlordFirstName: formData.landlordFirstName,
					landlordLastName: formData.landlordLastName,
					landlordPhone: formData.landlordPhone,
					timeLeftOnLease: formData.timeLeftOnLease
				} : formData.propertyType === "Owned" ? {
					propertyValue: formData.propertyValue,
					mortgageBalance: formData.mortgageBalance
				} : null,
				ownerInfo: {
					firstName: formData.ownerFirstName,
					lastName: formData.ownerLastName,
					dob: formData.ownerDob,
					email: formData.ownerEmail,
					phone: formData.ownerPhone,
					address: {
						street: formData.ownerStreetAddress,
						line2: formData.ownerStreetAddressLine2,
						city: formData.ownerCity,
						state: formData.ownerState,
						zip: formData.ownerPostalCode
					},
					ssn: formData.ownerSsn,
					creditScore: formData.ownerCreditScore,
					homeStatus: formData.ownerHomeStatus,
					ownsVehicle: formData.ownerOwnsVehicle,
					bankruptBefore: formData.ownerBankruptBefore,
					shareholderCount: formData.ownerShareholderCount
				},
				amountRequested: formData.amountRequested,
				monthlyRevenue: formData.monthlyRevenue,
				useOfFunds: formData.useOfFunds,
				overdraftProtection: formData.overdraftProtection,
				numberOfBankAccounts: formData.numberOfBankAccounts,
				hasUnsecuredDebt: formData.hasUnsecuredDebt,
				unsecuredDebtLenders: formData.hasUnsecuredDebt === "Yes" ? formData.unsecuredDebtLenders : "",
				unsecuredDebtAmount: formData.hasUnsecuredDebt === "Yes" ? formData.unsecuredDebtAmount : "",
				signatureFile: formData.signatureFile,
				signatureFileName: formData.signatureFileName,
				bankStatements: formData.bankStatements
			};

			const { error: insertError } = await supabase
				.from("inquiries")
				.insert([
					{
						name: fullName,
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

			// Store the final full name in ownerName for displaying on Step 6 success view
			setFormData(prev => ({ ...prev, ownerName: fullName }));
			setStep(6); // Go to success view (Step 6)
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
								GTA Funding
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

					{step < 6 && (
						<div className="mb-8 border-b border-zinc-900 pb-6">
							<h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
								GTA Funding Merchant Cash Advance Application Form
							</h1>
							<p className="text-xs sm:text-sm text-zinc-400 mt-2 font-medium">
								We ask that you fill out the application below with complete and accurate details.
							</p>

							{/* Progress Tracker */}
							<div className="mt-8">
								<div className="flex justify-between items-center text-[10px] font-bold text-zinc-555 uppercase tracking-widest mb-2">
									<span>Application Progress</span>
									<span>Step {step} of 5</span>
								</div>
								<div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
									<div 
										className="h-full bg-blue-550 rounded-full transition-all duration-300"
										style={{ width: `${(step / 5) * 100}%` }}
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
										Business's Address
									</label>

									{/* Street */}
									<div className="flex flex-col gap-1">
										<input
											type="text"
											placeholder="Street Address"
											className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
											value={formData.streetAddress}
											onChange={e => setFormData({ ...formData, streetAddress: e.target.value })}
										/>
										<span className="text-[9px] text-zinc-555 pl-1 font-semibold">Street Address</span>
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
										<span className="text-[9px] text-zinc-555 pl-1 font-semibold">Street Address Line 2</span>
									</div>

									{/* City / Province */}
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div className="flex flex-col gap-1">
											<input
												type="text"
												placeholder="City"
												className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
												value={formData.city}
												onChange={e => setFormData({ ...formData, city: e.target.value })}
											/>
											<span className="text-[9px] text-zinc-555 pl-1 font-semibold">City</span>
										</div>

										<div className="flex flex-col gap-1">
											<input
												type="text"
												placeholder="State / Province"
												className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
												value={formData.state}
												onChange={e => setFormData({ ...formData, state: e.target.value })}
											/>
											<span className="text-[9px] text-zinc-555 pl-1 font-semibold">State / Province</span>
										</div>
									</div>

									{/* Postal Code */}
									<div className="flex flex-col gap-1">
										<input
											type="text"
											placeholder="Postal / Zip Code"
											className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
											value={formData.postalCode}
											onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
										/>
										<span className="text-[9px] text-zinc-555 pl-1 font-semibold">Postal / Zip Code</span>
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

										{/* Rented Conditional Fields */}
										{formData.propertyType === "Rented" && (
											<div className="space-y-4 mt-2">
												<div className="flex flex-col gap-1.5 animate-in slide-in-from-top-2 duration-300">
													<label className="text-xs font-bold text-zinc-350 tracking-wide">
														Monthly Rent <span className="text-red-500">*</span>
													</label>
													<input
														type="text"
														placeholder="e.g. $2,500"
														className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
														value={formData.monthlyRent}
														onChange={e => setFormData({ ...formData, monthlyRent: e.target.value })}
													/>
												</div>

												<div className="flex flex-col gap-1.5 animate-in slide-in-from-top-2 duration-300">
													<label className="text-xs font-bold text-zinc-355 tracking-wide">
														Landlord's Name <span className="text-red-500">*</span>
													</label>
													<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
														<div className="flex flex-col gap-1">
															<input
																type="text"
																placeholder="First Name"
																className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
																value={formData.landlordFirstName}
																onChange={e => setFormData({ ...formData, landlordFirstName: e.target.value })}
															/>
															<span className="text-[9px] text-zinc-555 pl-1 font-semibold">First Name</span>
														</div>
														<div className="flex flex-col gap-1">
															<input
																type="text"
																placeholder="Last Name"
																className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
																value={formData.landlordLastName}
																onChange={e => setFormData({ ...formData, landlordLastName: e.target.value })}
															/>
															<span className="text-[9px] text-zinc-555 pl-1 font-semibold">Last Name</span>
														</div>
													</div>
												</div>

												<div className="flex flex-col gap-1.5 animate-in slide-in-from-top-2 duration-300">
													<label className="text-xs font-bold text-zinc-350 tracking-wide">
														Landlord's Phone Number <span className="text-red-500">*</span>
													</label>
													<input
														type="tel"
														placeholder="(000) 000-0000"
														maxLength={14}
														className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
														value={formData.landlordPhone}
														onChange={e => handlePhoneChange(e, "landlordPhone")}
													/>
													<span className="text-[10px] text-zinc-555 font-semibold pl-1">
														Please enter a valid phone number.
													</span>
												</div>

												<div className="flex flex-col gap-1.5 animate-in slide-in-from-top-2 duration-300">
													<label className="text-xs font-bold text-zinc-350 tracking-wide">
														Time left on lease <span className="text-red-500">*</span>
													</label>
													<input
														type="text"
														placeholder="e.g. 2 years remaining"
														className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
														value={formData.timeLeftOnLease}
														onChange={e => setFormData({ ...formData, timeLeftOnLease: e.target.value })}
													/>
												</div>
											</div>
										)}

										{/* Owned Conditional Fields */}
										{formData.propertyType === "Owned" && (
											<div className="space-y-4 mt-2">
												<div className="flex flex-col gap-1.5 animate-in slide-in-from-top-2 duration-300">
													<label className="text-xs font-bold text-zinc-350 tracking-wide">
														Property Value <span className="text-red-500">*</span>
													</label>
													<input
														type="text"
														placeholder="e.g. $1,200,000"
														className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
														value={formData.propertyValue}
														onChange={e => setFormData({ ...formData, propertyValue: e.target.value })}
													/>
												</div>

												<div className="flex flex-col gap-1.5 animate-in slide-in-from-top-2 duration-300">
													<label className="text-xs font-bold text-zinc-350 tracking-wide">
														Mortgage Balance <span className="text-red-500">*</span>
													</label>
													<input
														type="text"
														placeholder="e.g. $450,000"
														className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
														value={formData.mortgageBalance}
														onChange={e => setFormData({ ...formData, mortgageBalance: e.target.value })}
													/>
												</div>
											</div>
										)}
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

					{/* STEP 2: BUSINESS OWNER'S INFORMATION */}
					{step === 2 && (
						<div className="space-y-6 animate-in fade-in duration-300">
							<div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest pb-2 border-b border-zinc-900/60">
								<User className="size-4 text-blue-400" />
								<span>Business Owner's Information</span>
							</div>

							{/* Full Name */}
							<div className="flex flex-col gap-1.5">
								<label className="text-xs font-bold text-zinc-355 tracking-wide">
									Full Name <span className="text-red-500">*</span>
								</label>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div className="flex flex-col gap-1">
										<input
											required
											type="text"
											placeholder="First Name"
											className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
											value={formData.ownerFirstName}
											onChange={e => setFormData({ ...formData, ownerFirstName: e.target.value })}
										/>
										<span className="text-[9px] text-zinc-555 pl-1 font-semibold">First Name</span>
									</div>
									<div className="flex flex-col gap-1">
										<input
											required
											type="text"
											placeholder="Last Name"
											className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
											value={formData.ownerLastName}
											onChange={e => setFormData({ ...formData, ownerLastName: e.target.value })}
										/>
										<span className="text-[9px] text-zinc-555 pl-1 font-semibold">Last Name</span>
									</div>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
								{/* Date of Birth */}
								<div className="flex flex-col gap-1.5">
									<label className="text-xs font-bold text-zinc-350 tracking-wide">
										Date of Birth <span className="text-red-500">*</span>
									</label>
									<div className="relative">
										<Calendar className="absolute left-3.5 top-3.5 size-4 text-zinc-500 pointer-events-none" />
										<input
											required
											type="date"
											className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300 appearance-none [color-scheme:dark]"
											value={formData.ownerDob}
											onChange={e => setFormData({ ...formData, ownerDob: e.target.value })}
										/>
									</div>
									<span className="text-[9px] text-zinc-555 pl-1 font-semibold">Date</span>
								</div>

								{/* Email Address */}
								<div className="flex flex-col gap-1.5">
									<label className="text-xs font-bold text-zinc-350 tracking-wide">
										Email Address <span className="text-red-500">*</span>
									</label>
									<div className="relative">
										<Mail className="absolute left-3.5 top-3.5 size-4 text-zinc-500 pointer-events-none" />
										<input
											required
											type="email"
											placeholder="example@example.com"
											className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
											value={formData.ownerEmail}
											onChange={e => setFormData({ ...formData, ownerEmail: e.target.value })}
										/>
									</div>
									<span className="text-[9px] text-zinc-555 pl-1 font-semibold">example@example.com</span>
								</div>
							</div>

							{/* Phone Number */}
							<div className="flex flex-col gap-1.5 pt-2">
								<label className="text-xs font-bold text-zinc-350 tracking-wide">
									Phone Number <span className="text-red-500">*</span>
								</label>
								<div className="relative">
									<Phone className="absolute left-3.5 top-3.5 size-4 text-zinc-500 pointer-events-none" />
									<input
										required
										type="tel"
										placeholder="(000) 000-0000"
										maxLength={14}
										className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
										value={formData.ownerPhone}
										onChange={e => handlePhoneChange(e, "ownerPhone")}
									/>
								</div>
								<span className="text-[10px] text-zinc-550 font-semibold pl-1">
									Please enter a valid phone number.
								</span>
							</div>

							{/* Home Address Section */}
							<div className="space-y-4 pt-4 border-t border-zinc-900/60">
								<label className="text-xs font-bold text-zinc-355 tracking-wide block">
									Home Address
								</label>

								{/* Street */}
								<div className="flex flex-col gap-1">
									<input
										type="text"
										placeholder="Street Address"
										className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
										value={formData.ownerStreetAddress}
										onChange={e => setFormData({ ...formData, ownerStreetAddress: e.target.value })}
									/>
									<span className="text-[9px] text-zinc-555 pl-1 font-semibold">Street Address</span>
								</div>

								{/* Street 2 */}
								<div className="flex flex-col gap-1">
									<input
										type="text"
										placeholder="Street Address Line 2"
										className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
										value={formData.ownerStreetAddressLine2}
										onChange={e => setFormData({ ...formData, ownerStreetAddressLine2: e.target.value })}
									/>
									<span className="text-[9px] text-zinc-555 pl-1 font-semibold">Street Address Line 2</span>
								</div>

								{/* City / Province */}
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div className="flex flex-col gap-1">
										<input
											type="text"
											placeholder="City"
											className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
											value={formData.ownerCity}
											onChange={e => setFormData({ ...formData, ownerCity: e.target.value })}
										/>
										<span className="text-[9px] text-zinc-555 pl-1 font-semibold">City</span>
									</div>

									<div className="flex flex-col gap-1">
										<input
											type="text"
											placeholder="State / Province"
											className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
											value={formData.ownerState}
											onChange={e => setFormData({ ...formData, ownerState: e.target.value })}
										/>
										<span className="text-[9px] text-zinc-555 pl-1 font-semibold">State / Province</span>
									</div>
								</div>

								{/* Postal Code */}
								<div className="flex flex-col gap-1">
									<input
										type="text"
										placeholder="Postal / Zip Code"
										className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
										value={formData.ownerPostalCode}
										onChange={e => setFormData({ ...formData, ownerPostalCode: e.target.value })}
									/>
									<span className="text-[9px] text-zinc-555 pl-1 font-semibold">Postal / Zip Code</span>
								</div>
							</div>

							{/* Social Number & Credit Score */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
								<div className="flex flex-col gap-1.5">
									<label className="text-xs font-bold text-zinc-350 tracking-wide">
										Social Number ( Social Insurance or Security ) <span className="text-red-500">*</span>
									</label>
									<input
										required
										type="text"
										placeholder="e.g. 123-456-789"
										className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
										value={formData.ownerSsn}
										onChange={e => setFormData({ ...formData, ownerSsn: e.target.value })}
									/>
								</div>

								<div className="flex flex-col gap-1.5">
									<label className="text-xs font-bold text-zinc-350 tracking-wide">
										Personal Credit Score (FICO) <span className="text-red-500">*</span>
									</label>
									<input
										required
										type="text"
										placeholder="e.g., 720"
										className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
										value={formData.ownerCreditScore}
										onChange={e => setFormData({ ...formData, ownerCreditScore: e.target.value })}
									/>
								</div>
							</div>

							{/* Own/Rent property radio */}
							<div className="flex flex-col gap-2 pt-2">
								<label className="text-xs font-bold text-zinc-350 tracking-wide">
									Do you own or rent your home property? <span className="text-red-500">*</span>
								</label>
								<div className="flex gap-4">
									{["Own", "Rent"].map((option) => (
										<label
											key={option}
											className={`flex items-center gap-3 border rounded-xl px-6 py-3 cursor-pointer transition-all duration-300 flex-1 ${
												formData.ownerHomeStatus === option
													? "bg-zinc-900 border-blue-500 text-white"
													: "border-zinc-800 hover:border-zinc-700 bg-transparent text-zinc-400"
											}`}
										>
											<input
												type="radio"
												name="ownerHomeStatus"
												className="size-4 accent-blue-500 cursor-pointer"
												checked={formData.ownerHomeStatus === option}
												onChange={() => setFormData({ ...formData, ownerHomeStatus: option })}
											/>
											<span className="text-xs font-semibold">{option}</span>
										</label>
									))}
								</div>
							</div>

							{/* Own vehicle radio */}
							<div className="flex flex-col gap-2 pt-2">
								<label className="text-xs font-bold text-zinc-350 tracking-wide">
									Do you own a vehicle? <span className="text-red-500">*</span>
								</label>
								<div className="flex gap-4">
									{["Yes", "No"].map((option) => (
										<label
											key={option}
											className={`flex items-center gap-3 border rounded-xl px-6 py-3 cursor-pointer transition-all duration-300 flex-1 ${
												formData.ownerOwnsVehicle === option
													? "bg-zinc-900 border-blue-500 text-white"
													: "border-zinc-800 hover:border-zinc-700 bg-transparent text-zinc-400"
											}`}
										>
											<input
												type="radio"
												name="ownerOwnsVehicle"
												className="size-4 accent-blue-500 cursor-pointer"
												checked={formData.ownerOwnsVehicle === option}
												onChange={() => setFormData({ ...formData, ownerOwnsVehicle: option })}
											/>
											<span className="text-xs font-semibold">{option}</span>
										</label>
									))}
								</div>
							</div>

							{/* Bankrupt before radio */}
							<div className="flex flex-col gap-2 pt-2">
								<label className="text-xs font-bold text-zinc-350 tracking-wide">
									Have you been bankrupt before? <span className="text-red-500">*</span>
								</label>
								<div className="flex gap-4">
									{["Yes", "No"].map((option) => (
										<label
											key={option}
											className={`flex items-center gap-3 border rounded-xl px-6 py-3 cursor-pointer transition-all duration-300 flex-1 ${
												formData.ownerBankruptBefore === option
													? "bg-zinc-900 border-blue-500 text-white"
													: "border-zinc-800 hover:border-zinc-700 bg-transparent text-zinc-400"
											}`}
										>
											<input
												type="radio"
												name="ownerBankruptBefore"
												className="size-4 accent-blue-500 cursor-pointer"
												checked={formData.ownerBankruptBefore === option}
												onChange={() => setFormData({ ...formData, ownerBankruptBefore: option })}
											/>
											<span className="text-xs font-semibold">{option}</span>
										</label>
									))}
								</div>
							</div>

							{/* Shareholder dropdown */}
							<div className="flex flex-col gap-1.5 pt-2">
								<label className="text-xs font-bold text-zinc-350 tracking-wide">
									How many shareholders does your company have?
								</label>
								<select
									className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition-all duration-300"
									value={formData.ownerShareholderCount}
									onChange={e => setFormData({ ...formData, ownerShareholderCount: e.target.value })}
								>
									<option value="">Please Select</option>
									<option value="1">1</option>
									<option value="2">2</option>
									<option value="3">3</option>
									<option value="4">4</option>
									<option value="5+">5+</option>
								</select>
							</div>

							{/* Your Share (%) - Shows if any shareholder option is selected */}
							{formData.ownerShareholderCount && (
								<div className="flex flex-col gap-1.5 pt-2 animate-in slide-in-from-top-2 duration-300">
									<label className="text-xs font-bold text-zinc-350 tracking-wide">
										Your Share (%)
									</label>
									<input
										type="text"
										placeholder="e.g. 50%"
										className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
										value={formData.ownerSharePercentage}
										onChange={e => setFormData({ ...formData, ownerSharePercentage: e.target.value })}
									/>
								</div>
							)}

							{/* Second Shareholder Information */}
							{(formData.ownerShareholderCount === "2" || formData.ownerShareholderCount === "3" || formData.ownerShareholderCount === "4" || formData.ownerShareholderCount === "5+") && (
								<div className="space-y-4 pt-4 border-t border-zinc-900/60 mt-4 animate-in slide-in-from-top-2 duration-300">
									<span className="text-xs font-black text-white uppercase tracking-wider block">Second Business Shareholder's Information</span>
									
									<div className="flex flex-col gap-1.5">
										<label className="text-xs font-bold text-zinc-350 tracking-wide">
											Full Name
										</label>
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
											<div className="flex flex-col gap-1">
												<input
													type="text"
													placeholder="First Name"
													className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
													value={formData.sh2FirstName}
													onChange={e => setFormData({ ...formData, sh2FirstName: e.target.value })}
												/>
												<span className="text-[9px] text-zinc-555 pl-1 font-semibold">First Name</span>
											</div>
											<div className="flex flex-col gap-1">
												<input
													type="text"
													placeholder="Last Name"
													className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
													value={formData.sh2LastName}
													onChange={e => setFormData({ ...formData, sh2LastName: e.target.value })}
												/>
												<span className="text-[9px] text-zinc-555 pl-1 font-semibold">Last Name</span>
											</div>
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
										<div className="flex flex-col gap-1.5">
											<label className="text-xs font-bold text-zinc-350 tracking-wide">
												Date of Birth
											</label>
											<div className="relative">
												<Calendar className="absolute left-3.5 top-3.5 size-4 text-zinc-500 pointer-events-none" />
												<input
													type="date"
													className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300 appearance-none [color-scheme:dark]"
													value={formData.sh2Dob}
													onChange={e => setFormData({ ...formData, sh2Dob: e.target.value })}
												/>
											</div>
											<span className="text-[9px] text-zinc-555 pl-1 font-semibold">Date</span>
										</div>

										<div className="flex flex-col gap-1.5">
											<label className="text-xs font-bold text-zinc-350 tracking-wide">
												Email Address
											</label>
											<div className="relative">
												<Mail className="absolute left-3.5 top-3.5 size-4 text-zinc-500 pointer-events-none" />
												<input
													type="email"
													placeholder="example@example.com"
													className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
													value={formData.sh2Email}
													onChange={e => setFormData({ ...formData, sh2Email: e.target.value })}
												/>
											</div>
											<span className="text-[9px] text-zinc-555 pl-1 font-semibold">example@example.com</span>
										</div>
									</div>

									<div className="flex flex-col gap-1.5 pt-2">
										<label className="text-xs font-bold text-zinc-350 tracking-wide">
											Owner's Share (%)
										</label>
										<input
											type="text"
											placeholder="e.g. 25%"
											className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
											value={formData.sh2Share}
											onChange={e => setFormData({ ...formData, sh2Share: e.target.value })}
										/>
									</div>
								</div>
							)}

							{/* Third Shareholder Information */}
							{(formData.ownerShareholderCount === "3" || formData.ownerShareholderCount === "4" || formData.ownerShareholderCount === "5+") && (
								<div className="space-y-4 pt-4 border-t border-zinc-900/60 mt-4 animate-in slide-in-from-top-2 duration-300">
									<span className="text-xs font-black text-white uppercase tracking-wider block">Third Business Shareholder's Information</span>
									
									<div className="flex flex-col gap-1.5">
										<label className="text-xs font-bold text-zinc-350 tracking-wide">
											Full Name
										</label>
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
											<div className="flex flex-col gap-1">
												<input
													type="text"
													placeholder="First Name"
													className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
													value={formData.sh3FirstName}
													onChange={e => setFormData({ ...formData, sh3FirstName: e.target.value })}
												/>
												<span className="text-[9px] text-zinc-555 pl-1 font-semibold">First Name</span>
											</div>
											<div className="flex flex-col gap-1">
												<input
													type="text"
													placeholder="Last Name"
													className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
													value={formData.sh3LastName}
													onChange={e => setFormData({ ...formData, sh3LastName: e.target.value })}
												/>
												<span className="text-[9px] text-zinc-555 pl-1 font-semibold">Last Name</span>
											</div>
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
										<div className="flex flex-col gap-1.5">
											<label className="text-xs font-bold text-zinc-350 tracking-wide">
												Date of Birth
											</label>
											<div className="relative">
												<Calendar className="absolute left-3.5 top-3.5 size-4 text-zinc-500 pointer-events-none" />
												<input
													type="date"
													className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300 appearance-none [color-scheme:dark]"
													value={formData.sh3Dob}
													onChange={e => setFormData({ ...formData, sh3Dob: e.target.value })}
												/>
											</div>
											<span className="text-[9px] text-zinc-555 pl-1 font-semibold">Date</span>
										</div>

										<div className="flex flex-col gap-1.5">
											<label className="text-xs font-bold text-zinc-350 tracking-wide">
												Email Address
											</label>
											<div className="relative">
												<Mail className="absolute left-3.5 top-3.5 size-4 text-zinc-500 pointer-events-none" />
												<input
													type="email"
													placeholder="example@example.com"
													className="w-full bg-[#0E0E0E] border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
													value={formData.sh3Email}
													onChange={e => setFormData({ ...formData, sh3Email: e.target.value })}
												/>
											</div>
											<span className="text-[9px] text-zinc-555 pl-1 font-semibold">example@example.com</span>
										</div>
									</div>

									<div className="flex flex-col gap-1.5 pt-2">
										<label className="text-xs font-bold text-zinc-350 tracking-wide">
											Owner's Share (%)
										</label>
										<input
											type="text"
											placeholder="e.g. 15%"
											className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
											value={formData.sh3Share}
											onChange={e => setFormData({ ...formData, sh3Share: e.target.value })}
										/>
									</div>
								</div>
							)}

							{/* Fourth Shareholder Information */}
							{(formData.ownerShareholderCount === "4" || formData.ownerShareholderCount === "5+") && (
								<div className="space-y-4 pt-4 border-t border-zinc-900/60 mt-4 animate-in slide-in-from-top-2 duration-300">
									<span className="text-xs font-black text-white uppercase tracking-wider block">Fourth Business Shareholder's Information</span>
									
									<div className="flex flex-col gap-1.5">
										<label className="text-xs font-bold text-zinc-350 tracking-wide">
											Full Name
										</label>
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
											<div className="flex flex-col gap-1">
												<input
													type="text"
													placeholder="First Name"
													className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
													value={formData.sh4FirstName}
													onChange={e => setFormData({ ...formData, sh4FirstName: e.target.value })}
												/>
												<span className="text-[9px] text-zinc-555 pl-1 font-semibold">First Name</span>
											</div>
											<div className="flex flex-col gap-1">
												<input
													type="text"
													placeholder="Last Name"
													className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
													value={formData.sh4LastName}
													onChange={e => setFormData({ ...formData, sh4LastName: e.target.value })}
												/>
												<span className="text-[9px] text-zinc-555 pl-1 font-semibold">Last Name</span>
											</div>
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
										<div className="flex flex-col gap-1.5">
											<label className="text-xs font-bold text-zinc-350 tracking-wide">
												Date of Birth
											</label>
											<div className="relative">
												<Calendar className="absolute left-3.5 top-3.5 size-4 text-zinc-500 pointer-events-none" />
												<input
													type="date"
													className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300 appearance-none [color-scheme:dark]"
													value={formData.sh4Dob}
													onChange={e => setFormData({ ...formData, sh4Dob: e.target.value })}
												/>
											</div>
											<span className="text-[9px] text-zinc-555 pl-1 font-semibold">Date</span>
										</div>

										<div className="flex flex-col gap-1.5">
											<label className="text-xs font-bold text-zinc-350 tracking-wide">
												Email Address
											</label>
											<div className="relative">
												<Mail className="absolute left-3.5 top-3.5 size-4 text-zinc-500 pointer-events-none" />
												<input
													type="email"
													placeholder="example@example.com"
													className="w-full bg-[#0E0E0E] border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
													value={formData.sh4Email}
													onChange={e => setFormData({ ...formData, sh4Email: e.target.value })}
												/>
											</div>
											<span className="text-[9px] text-zinc-555 pl-1 font-semibold">example@example.com</span>
										</div>
									</div>

									<div className="flex flex-col gap-1.5 pt-2">
										<label className="text-xs font-bold text-zinc-350 tracking-wide">
											Owner's Share (%)
										</label>
										<input
											type="text"
											placeholder="e.g. 10%"
											className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
											value={formData.sh4Share}
											onChange={e => setFormData({ ...formData, sh4Share: e.target.value })}
										/>
									</div>
								</div>
							)}

							{/* Step 2 Actions */}
							<div className="flex items-center justify-between pt-8 border-t border-zinc-900 mt-8">
								<button
									type="button"
									className="text-zinc-400 hover:text-white font-bold text-xs flex items-center gap-1.5 h-12 px-5 cursor-pointer transition-colors"
									onClick={handleBack}
								>
									<ArrowLeft className="size-4" /> Back
								</button>
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

					{/* STEP 3: FUNDING DETAILS */}
					{step === 3 && (
						<div className="space-y-6 animate-in fade-in duration-300">
							<div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest pb-2 border-b border-zinc-900/60">
								<Briefcase className="size-4 text-blue-400" />
								<span>Funding Request</span>
							</div>

							<div className="space-y-5">
								{/* Requested Funding Amount */}
								<div className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col gap-2 bg-[#0F0F0F] ${errors.amountRequested ? "border-red-500/40 bg-red-500/[0.02]" : "border-zinc-900 bg-zinc-900/10"}`}>
									<label className="text-xs font-bold text-zinc-350 tracking-wide">
										Requested Funding Amount <span className="text-red-500">*</span>
									</label>
									<select
										className={`w-full bg-zinc-950 border rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition-all duration-300 ${errors.amountRequested ? "border-red-500" : "border-zinc-800"}`}
										value={formData.amountRequested}
										onChange={e => {
											setFormData({ ...formData, amountRequested: e.target.value });
											if (errors.amountRequested) {
												setErrors(prev => ({ ...prev, amountRequested: "" }));
											}
										}}
									>
										<option value="">Please Select</option>
										<option value="$5k - $25k">$5,000 - $25,000</option>
										<option value="$25k - $100k">$25,000 - $100,000</option>
										<option value="$100k - $250k">$100,000 - $250,000</option>
										<option value="$250k+">$250,000+</option>
									</select>
									{errors.amountRequested && (
										<div className="bg-red-600/95 text-white text-[11px] font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 mt-1 animate-in slide-in-from-top-1 duration-200">
											<span className="text-xs">⚠️</span>
											<span>This field is required.</span>
										</div>
									)}
								</div>

								{/* Purpose of Funding */}
								<div className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col gap-2 bg-[#0F0F0F] ${errors.useOfFunds ? "border-red-500/40 bg-red-500/[0.02]" : "border-zinc-900 bg-zinc-900/10"}`}>
									<label className="text-xs font-bold text-zinc-350 tracking-wide">
										Purpose of Funding <span className="text-red-500">*</span>
									</label>
									<textarea
										rows={4}
										placeholder="e.g. Inventory acquisition, hiring staff, commercial equipment lease..."
										className={`w-full bg-zinc-950 border rounded-xl p-4 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300 ${errors.useOfFunds ? "border-red-500" : "border-zinc-800"}`}
										value={formData.useOfFunds}
										onChange={e => {
											setFormData({ ...formData, useOfFunds: e.target.value });
											if (errors.useOfFunds) {
												setErrors(prev => ({ ...prev, useOfFunds: "" }));
											}
										}}
									/>
									{errors.useOfFunds && (
										<div className="bg-red-600/95 text-white text-[11px] font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 mt-1 animate-in slide-in-from-top-1 duration-200">
											<span className="text-xs">⚠️</span>
											<span>This field is required.</span>
										</div>
									)}
								</div>

								{/* Monthly Business Sales */}
								<div className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col gap-2 bg-[#0F0F0F] ${errors.monthlyRevenue ? "border-red-500/40 bg-red-500/[0.02]" : "border-zinc-900 bg-zinc-900/10"}`}>
									<label className="text-xs font-bold text-zinc-350 tracking-wide">
										Monthly Business Sales <span className="text-red-500">*</span>
									</label>
									<select
										className={`w-full bg-zinc-950 border rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition-all duration-300 ${errors.monthlyRevenue ? "border-red-500" : "border-zinc-800"}`}
										value={formData.monthlyRevenue}
										onChange={e => {
											setFormData({ ...formData, monthlyRevenue: e.target.value });
											if (errors.monthlyRevenue) {
												setErrors(prev => ({ ...prev, monthlyRevenue: "" }));
											}
										}}
									>
										<option value="">Please Select</option>
										<option value="Less than $5,000">Less than $5,000</option>
										<option value="$5,000 - $20,000">$5,000 - $20,000</option>
										<option value="$20,000 - $50,000">$20,000 - $50,000</option>
										<option value="$50,000+">$50,000+</option>
									</select>
									{errors.monthlyRevenue && (
										<div className="bg-red-600/95 text-white text-[11px] font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 mt-1 animate-in slide-in-from-top-1 duration-200">
											<span className="text-xs">⚠️</span>
											<span>This field is required.</span>
										</div>
									)}
								</div>

								{/* Overdraft Protection */}
								<div className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col gap-2 bg-[#0F0F0F] ${errors.overdraftProtection ? "border-red-500/40 bg-red-500/[0.02]" : "border-zinc-900 bg-zinc-900/10"}`}>
									<label className="text-xs font-bold text-zinc-350 tracking-wide">
										Do you have overdraft protection? If yes, how much? <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										placeholder="e.g. No, or Yes, $5,000"
										className={`w-full bg-zinc-950 border rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300 ${errors.overdraftProtection ? "border-red-500" : "border-zinc-800"}`}
										value={formData.overdraftProtection}
										onChange={e => {
											setFormData({ ...formData, overdraftProtection: e.target.value });
											if (errors.overdraftProtection) {
												setErrors(prev => ({ ...prev, overdraftProtection: "" }));
											}
										}}
									/>
									{errors.overdraftProtection && (
										<div className="bg-red-600/95 text-white text-[11px] font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 mt-1 animate-in slide-in-from-top-1 duration-200">
											<span className="text-xs">⚠️</span>
											<span>This field is required.</span>
										</div>
									)}
								</div>

								{/* Number of Business Bank Accounts */}
								<div className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col gap-2 bg-[#0F0F0F] ${errors.numberOfBankAccounts ? "border-red-500/40 bg-red-500/[0.02]" : "border-zinc-900 bg-zinc-900/10"}`}>
									<label className="text-xs font-bold text-zinc-350 tracking-wide">
										Number of Business Bank Accounts <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										placeholder="e.g. 1"
										className={`w-full bg-zinc-950 border rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300 ${errors.numberOfBankAccounts ? "border-red-500" : "border-zinc-800"}`}
										value={formData.numberOfBankAccounts}
										onChange={e => {
											setFormData({ ...formData, numberOfBankAccounts: e.target.value });
											if (errors.numberOfBankAccounts) {
												setErrors(prev => ({ ...prev, numberOfBankAccounts: "" }));
											}
										}}
									/>
									{errors.numberOfBankAccounts && (
										<div className="bg-red-600/95 text-white text-[11px] font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 mt-1 animate-in slide-in-from-top-1 duration-200">
											<span className="text-xs">⚠️</span>
											<span>This field is required.</span>
										</div>
									)}
								</div>

								{/* Unsecured Debt */}
								<div className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col gap-3 bg-[#0F0F0F] ${errors.hasUnsecuredDebt || errors.unsecuredDebtLenders || errors.unsecuredDebtAmount ? "border-red-500/40 bg-red-500/[0.02]" : "border-zinc-900 bg-zinc-900/10"}`}>
									<label className="text-xs font-bold text-zinc-350 tracking-wide">
										Do you currently have any unsecured debt? <span className="text-red-500">*</span>
									</label>
									<div className="flex gap-4">
										{["Yes", "No"].map((option) => (
											<label
												key={option}
												className={`flex items-center gap-3 border rounded-xl px-6 py-3 cursor-pointer transition-all duration-300 flex-1 ${
													formData.hasUnsecuredDebt === option
														? "bg-zinc-900 border-blue-500 text-white"
														: errors.hasUnsecuredDebt
															? "border-red-500/30 hover:border-red-500/50 bg-transparent text-zinc-400"
															: "border-zinc-800 hover:border-zinc-700 bg-transparent text-zinc-400"
												}`}
											>
												<input
													type="radio"
													name="hasUnsecuredDebt"
													className="size-4 accent-blue-500 cursor-pointer"
													checked={formData.hasUnsecuredDebt === option}
													onChange={() => {
														setFormData({ ...formData, hasUnsecuredDebt: option });
														if (errors.hasUnsecuredDebt) {
															setErrors(prev => ({ ...prev, hasUnsecuredDebt: "" }));
														}
													}}
												/>
												<span className="text-xs font-semibold">{option}</span>
											</label>
										))}
									</div>
									{errors.hasUnsecuredDebt && (
										<div className="bg-red-600/95 text-white text-[11px] font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 mt-1 animate-in slide-in-from-top-1 duration-200">
											<span className="text-xs">⚠️</span>
											<span>This field is required.</span>
										</div>
									)}

									{formData.hasUnsecuredDebt === "Yes" && (
										<div className="space-y-4 mt-3 pt-3 border-t border-zinc-900/60 animate-in slide-in-from-top-2 duration-300">
											<div className="flex flex-col gap-1.5">
												<label className="text-xs font-bold text-zinc-350 tracking-wide">
													With which lender(s) do you hold unsecured debt? <span className="text-red-500">*</span>
												</label>
												<input
													type="text"
													placeholder="e.g. Lender A, Lender B"
													className={`w-full bg-zinc-950 border rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300 ${errors.unsecuredDebtLenders ? "border-red-500" : "border-zinc-800"}`}
													value={formData.unsecuredDebtLenders}
													onChange={e => {
														setFormData({ ...formData, unsecuredDebtLenders: e.target.value });
														if (errors.unsecuredDebtLenders) {
															setErrors(prev => ({ ...prev, unsecuredDebtLenders: "" }));
														}
													}}
												/>
												{errors.unsecuredDebtLenders && (
													<div className="bg-red-600/95 text-white text-[11px] font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 mt-1 animate-in slide-in-from-top-1 duration-200">
														<span className="text-xs">⚠️</span>
														<span>This field is required.</span>
													</div>
												)}
											</div>

											<div className="flex flex-col gap-1.5">
												<label className="text-xs font-bold text-zinc-350 tracking-wide">
													What is the total owing balance? <span className="text-red-500">*</span>
												</label>
												<input
													type="text"
													placeholder="e.g. $15,000"
													className={`w-full bg-zinc-950 border rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300 ${errors.unsecuredDebtAmount ? "border-red-500" : "border-zinc-800"}`}
													value={formData.unsecuredDebtAmount}
													onChange={e => {
														setFormData({ ...formData, unsecuredDebtAmount: e.target.value });
														if (errors.unsecuredDebtAmount) {
															setErrors(prev => ({ ...prev, unsecuredDebtAmount: "" }));
														}
													}}
												/>
												{errors.unsecuredDebtAmount && (
													<div className="bg-red-600/95 text-white text-[11px] font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 mt-1 animate-in slide-in-from-top-1 duration-200">
														<span className="text-xs">⚠️</span>
														<span>This field is required.</span>
													</div>
												)}
											</div>
										</div>
									)}
								</div>
							</div>

							{/* Step 3 Actions */}
							<div className="flex items-center justify-between pt-8 border-t border-zinc-900 mt-8">
								<button
									type="button"
									className="text-zinc-400 hover:text-white font-bold text-xs flex items-center gap-1.5 h-12 px-5 cursor-pointer transition-colors"
									onClick={handleBack}
								>
									<ArrowLeft className="size-4" /> Back
								</button>
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

					{/* STEP 4: SIGNATURE */}
					{step === 4 && (
						<div className="space-y-6 animate-in fade-in duration-300">
							<div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest pb-2 border-b border-zinc-900/60">
								<FileText className="size-4 text-blue-400" />
								<span>Signature</span>
							</div>

							<div className="text-zinc-400 text-[11px] leading-relaxed space-y-4 bg-zinc-950/40 p-5 rounded-2xl border border-zinc-900 font-medium">
								<p className="font-bold text-white uppercase tracking-wider text-[10px]">SIGNATURES – ALL OWNERS MUST SIGN</p>
								<p className="italic">
									By signing below, the Client and its owner(s) certify that all information and documents submitted in connection with this Application are true, correct and complete. Additionally, the owner(s) authorize GTA Funding or any of its agents, partners, and affiliates to contact the above landlord, supplier, and emergency contacts, as well as obtain and use business and non-business consumer credit reports from credit reporting agencies and any other information regarding the Client and its owner(s) from third parties, both at the time of the initial funding application and at any time after the Client has received funding as long as the Merchant remains a client of GTA Funding. At all times, GTA Funding will comply with the personal information collection, protection, use, sharing, and retention practices set out in the Privacy Policy *
								</p>
							</div>

							<div className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col gap-3 bg-[#0F0F0F] ${errors.signatureFile ? "border-red-500/40 bg-red-500/[0.02]" : "border-zinc-900 bg-zinc-900/10"}`}>
								<div className="flex items-center justify-between pb-1">
									<label className="text-xs font-bold text-zinc-355 tracking-wide">
										Owner's Signature <span className="text-red-500">*</span>
									</label>
									
									{/* Signature Mode Selector */}
									<div className="flex bg-zinc-950 p-0.5 rounded-lg border border-zinc-800">
										<button
											type="button"
											className={`text-[9px] font-bold px-2.5 py-1 rounded-md cursor-pointer transition-all ${sigMode === "draw" ? "bg-blue-600 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
											onClick={() => {
												setSigMode("draw");
												clearSignature();
											}}
										>
											Draw
										</button>
										<button
											type="button"
											className={`text-[9px] font-bold px-2.5 py-1 rounded-md cursor-pointer transition-all ${sigMode === "upload" ? "bg-blue-600 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
											onClick={() => {
												setSigMode("upload");
												clearSignature();
											}}
										>
											Upload File
										</button>
									</div>
								</div>
								
								{sigMode === "draw" ? (
									<div className="relative bg-white rounded-2xl border border-zinc-200 overflow-hidden min-h-[192px] flex flex-col">
										<canvas
											ref={canvasRef}
											onMouseDown={startDrawing}
											onMouseMove={draw}
											onMouseUp={stopDrawing}
											onMouseLeave={stopDrawing}
											onTouchStart={startDrawing}
											onTouchMove={draw}
											onTouchEnd={stopDrawing}
											className="w-full h-48 cursor-crosshair bg-white touch-none"
										/>
										
										{!formData.signatureFile && (
											<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-zinc-300 select-none">
												<span className="text-xs font-semibold tracking-wider uppercase">Sign Here</span>
												<span className="text-[9px] mt-1 text-zinc-400">Use mouse, trackpad, or touch screen</span>
											</div>
										)}
										
										{formData.signatureFile && (
											<button
												type="button"
												className="absolute bottom-3 right-3 text-zinc-500 hover:text-red-600 bg-zinc-100 hover:bg-zinc-200 transition-colors font-bold text-[9px] px-2.5 py-1.5 rounded-lg border border-zinc-300 cursor-pointer shadow-sm"
												onClick={clearSignature}
											>
												Clear Signature
											</button>
										)}
									</div>
								) : (
									<>
										<input
											type="file"
											accept="image/*,application/pdf"
											className="hidden"
											id="signature-upload"
											onChange={handleSignatureChange}
										/>
										
										{!formData.signatureFile ? (
											<label
												htmlFor="signature-upload"
												className="border border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-950/20 hover:bg-zinc-950/40 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group"
											>
												<svg className="size-8 text-zinc-500 group-hover:text-blue-500 transition-colors mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
													<path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5h10.5a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0016.5 4.5H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25z" />
												</svg>
												<span className="text-xs font-bold text-zinc-350 group-hover:text-white transition-colors">Upload Signature File</span>
												<span className="text-[10px] text-zinc-500 mt-1">Drag and drop or click to browse (Image or PDF)</span>
											</label>
										) : (
											<div className="border border-zinc-800 bg-zinc-950/40 rounded-2xl p-4 flex flex-col items-center justify-between gap-4">
												<div className="flex items-center gap-3 w-full">
													<div className="size-10 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center shrink-0">
														<FileText className="size-5" />
													</div>
													<div className="flex-1 min-w-0">
														<p className="text-xs font-bold text-white truncate">{formData.signatureFileName}</p>
														<p className="text-[10px] text-zinc-500 mt-0.5">Signature Uploaded</p>
													</div>
													<button
														type="button"
														className="text-zinc-500 hover:text-red-400 font-bold text-[10px] px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-red-500/20 transition-all cursor-pointer"
														onClick={clearSignature}
													>
														Clear
													</button>
												</div>
												
												{formData.signatureFile.startsWith("data:image/") && (
													<div className="w-full bg-white rounded-xl p-4 border border-zinc-200 flex justify-center items-center max-h-[140px] overflow-hidden">
														<img
															src={formData.signatureFile}
															alt="Signature Preview"
															className="max-h-[100px] object-contain"
														/>
													</div>
												)}
											</div>
										)}
									</>
								)}
								
								{errors.signatureFile && (
									<div className="bg-red-600/95 text-white text-[11px] font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 mt-1 animate-in slide-in-from-top-1 duration-200">
										<span className="text-xs">⚠️</span>
										<span>This field is required.</span>
									</div>
								)}
							</div>

							{/* Step 4 Actions */}
							<div className="flex items-center justify-between pt-8 border-t border-zinc-900 mt-8">
								<button
									type="button"
									className="text-zinc-400 hover:text-white font-bold text-xs flex items-center gap-1.5 h-12 px-5 cursor-pointer transition-colors"
									onClick={handleBack}
								>
									<ArrowLeft className="size-4" /> Back
								</button>
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

					{/* STEP 5: UPLOAD BANK STATEMENTS */}
					{step === 5 && (
						<div className="space-y-6 animate-in fade-in duration-300">
							<div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest pb-2 border-b border-zinc-900/60">
								<Briefcase className="size-4 text-blue-400" />
								<span>UPLOAD YOUR BANK STATEMENTS</span>
							</div>

							<div className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col gap-3 bg-[#0F0F0F] ${errors.bankStatements ? "border-red-500/40 bg-red-500/[0.02]" : "border-zinc-900 bg-zinc-900/10"}`}>
								<label className="text-xs font-bold text-zinc-350 tracking-wide">
									Kindly upload the bank statements for the last three months. <span className="text-red-500">*</span>
								</label>
								
								<input
									type="file"
									multiple
									accept="image/*,application/pdf"
									className="hidden"
									id="bank-statements-upload"
									onChange={handleBankStatementChange}
								/>
								
								<label
									htmlFor="bank-statements-upload"
									className="bg-white rounded-2xl border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/50 p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group"
								>
									<svg className="size-11 text-zinc-400 group-hover:text-blue-500 transition-colors mb-2" viewBox="0 0 24 24" fill="currentColor">
										<path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
									</svg>
									<span className="text-sm font-bold text-zinc-800 transition-colors">Browse Files</span>
									<span className="text-[10px] text-zinc-400 mt-1">Drag and drop files here</span>
								</label>

								{formData.bankStatements.length > 0 && (
									<div className="space-y-2 mt-2">
										<span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block pl-1">Uploaded Files ({formData.bankStatements.length})</span>
										{formData.bankStatements.map((file, idx) => (
											<div key={idx} className="flex items-center justify-between p-3.5 bg-zinc-955 border border-zinc-800 rounded-xl text-xs gap-3 animate-in slide-in-from-top-1 duration-200">
												<div className="flex items-center gap-2.5 min-w-0">
													<FileText className="size-4.5 text-blue-400 shrink-0" />
													<span className="font-semibold text-white truncate">{file.fileName}</span>
												</div>
												<button
													type="button"
													className="text-zinc-500 hover:text-red-400 font-bold px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-red-500/20 transition-all cursor-pointer text-[10px]"
													onClick={() => {
														const updated = formData.bankStatements.filter((_, i) => i !== idx);
														setFormData({ ...formData, bankStatements: updated });
													}}
												>
													Remove
												</button>
											</div>
										))}
									</div>
								)}
								
								{errors.bankStatements && (
									<div className="bg-red-600/95 text-white text-[11px] font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 mt-1 animate-in slide-in-from-top-1 duration-200">
										<span className="text-xs">⚠️</span>
										<span>This field is required.</span>
									</div>
								)}
							</div>

							{/* Step 5 Actions */}
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

					{/* STEP 6: SUCCESS STATE */}
					{step === 6 && (
						<div className="flex flex-col items-center text-center py-10 animate-in zoom-in-95 duration-300">
							<div className="size-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/5">
								<ShieldCheck className="size-9" />
							</div>
							<h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
								Application Received!
							</h2>
							<p className="text-sm text-zinc-400 mt-3 leading-relaxed max-w-md">
								Thank you, <span className="font-bold text-white">{formData.ownerName}</span>! Your GTA Funding Merchant Cash Advance application for <span className="font-bold text-white">{formData.businessName}</span> has been securely submitted.
							</p>

							<div className="mt-8 bg-[#121212] border border-zinc-900 rounded-2xl p-6 w-full max-w-md text-left space-y-4 text-xs font-medium">
								<div className="border-b border-zinc-900/60 pb-3">
									<span className="text-zinc-555 font-bold uppercase tracking-wider block">Submission ID</span>
									<span className="text-[10px] text-zinc-400 font-mono mt-1 block">GTA-MCA-{Math.floor(100000 + Math.random() * 900000)}</span>
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
				&copy; {new Date().getFullYear()} GTA Funding. All rights reserved.
			</p>
		</footer>
	</div>
);
}
