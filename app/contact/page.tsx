import { Header } from "@/components/header";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";

export default function ContactPage() {
	return (
		<div className="relative flex min-h-screen flex-col bg-background font-sans antialiased">
			<Header />
			<main className="flex-1 flex flex-col justify-center items-center overflow-x-hidden px-4 py-24 sm:px-8 lg:px-10">
				<ContactSection />
			</main>
			<Footer />
		</div>
	);
}
