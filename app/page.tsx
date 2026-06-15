import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero";
import { ServicesSection } from "@/components/services";
import { WhyChooseSection } from "@/components/why-choose";
import { TestimonialsSection } from "@/components/testimonials";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background font-sans antialiased">
      <Header />
      <main className="flex-1 flex flex-col justify-center overflow-x-hidden">
        <HeroSection />
        <ServicesSection />
        <WhyChooseSection />
        <TestimonialsSection />
        <section id="contact-us" className="mx-auto w-full max-w-[1400px] pt-12 pb-24 px-4 sm:px-8 lg:px-10 scroll-mt-16">
          <ContactSection />
        </section>
      </main>
      <Footer />
    </div>
  );
}

