"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";

/* ─────────────────────── Before / After Slider ─────────────────────── */

function BeforeAfterSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(pct);
  }, []);

  const handleMouseDown = useCallback(() => {
    isDragging.current = true;
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging.current) return;
      handleMove(e.clientX);
    },
    [handleMove]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      handleMove(e.touches[0].clientX);
    },
    [handleMove]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      handleMove(e.clientX);
    },
    [handleMove]
  );

  useEffect(() => {
    const up = () => {
      isDragging.current = false;
    };
    window.addEventListener("mouseup", up);
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchend", up);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="before-after-slider relative aspect-[16/10] w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      onTouchMove={handleTouchMove}
      onClick={handleClick}
    >
      {/* After image (full width, behind) */}
      <div className="absolute inset-0">
        <Image
          src="/images/after.png"
          alt="After landscaping"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 896px"
        />
      </div>

      {/* Before image (clipped) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src="/images/before.png"
          alt="Before landscaping"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 896px"
        />
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider z-10">
        Before
      </div>
      <div className="absolute top-4 right-4 bg-primary/80 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider z-10">
        After
      </div>

      {/* Slider handle */}
      <div
        className="absolute top-0 bottom-0 z-20 flex items-center"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
      >
        <div className="w-0.5 h-full bg-white shadow-lg" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center cursor-ew-resize">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="text-primary"
          >
            <path
              d="M8 5L3 12L8 19M16 5L21 12L16 19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── Scroll Animation Observer ─────────────────────── */

function useScrollAnimation() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ─────────────────────── Nav Component ─────────────────────── */

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "#services", label: "Services" },
    { href: "#gallery", label: "Gallery" },
    { href: "#about", label: "About" },
    { href: "#testimonials", label: "Reviews" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-primary shadow-lg py-3"
          : "bg-gradient-to-b from-black/50 to-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 shrink-0">
          <Image
            src="/images/logo.png"
            alt="Garden of Eden Landscaping"
            width={180}
            height={50}
            className="h-10 sm:h-12 w-auto brightness-0 invert"
            priority
          />
        </a>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-white/90 hover:text-accent text-sm font-medium tracking-wide transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="tel:7323642052"
            className="bg-accent hover:bg-accent-light text-primary font-bold text-sm px-6 py-2.5 rounded-full transition-all hover:scale-105"
          >
            (732) 364-2052
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-white p-2"
          aria-label="Toggle menu"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            {mobileOpen ? (
              <path
                d="M6 6L18 18M6 18L18 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 6H20M4 12H20M4 18H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-primary/95 backdrop-blur-sm px-4 pt-2 pb-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-white/90 hover:text-accent text-base font-medium py-1"
            >
              {link.label}
            </a>
          ))}
          <a
            href="tel:7323642052"
            className="bg-accent hover:bg-accent-light text-primary font-bold text-center px-6 py-3 rounded-full mt-2"
          >
            (732) 364-2052
          </a>
        </div>
      </div>
    </nav>
  );
}

/* ─────────────────────── Service Card ─────────────────────── */

function ServiceCard({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image: string;
}) {
  return (
    <div className="fade-up group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
      </div>
      <div className="p-5 sm:p-6">
        <h3 className="text-lg font-bold text-primary mb-2">{title}</h3>
        <p className="text-text-light text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

/* ─────────────────────── Testimonial Card ─────────────────────── */

function TestimonialCard({
  name,
  text,
  stars,
}: {
  name: string;
  text: string;
  stars: number;
}) {
  return (
    <div className="fade-up bg-white rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex gap-1 mb-4">
        {Array.from({ length: stars }).map((_, i) => (
          <svg
            key={i}
            className="w-5 h-5 text-accent"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-text-light leading-relaxed mb-4 italic">
        &ldquo;{text}&rdquo;
      </p>
      <p className="font-bold text-primary">{name}</p>
    </div>
  );
}

/* ─────────────────────── Stat Item ─────────────────────── */

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl sm:text-4xl font-bold text-accent mb-1">
        {value}
      </div>
      <div className="text-white/80 text-sm sm:text-base font-medium">
        {label}
      </div>
    </div>
  );
}

/* ─────────────────────── Main Page ─────────────────────── */

const services = [
  {
    title: "Lawn Care & Maintenance",
    description:
      "Weekly mowing, edging, fertilization, and seasonal treatments to keep your lawn lush and green year-round.",
    image: "/images/services/lawn-care.png",
  },
  {
    title: "Landscape Design",
    description:
      "Custom garden plans tailored to your property. From flowering beds to ornamental features that transform your curb appeal.",
    image: "/images/services/garden-design.png",
  },
  {
    title: "Hardscaping",
    description:
      "Patios, walkways, retaining walls, and outdoor living spaces built with premium pavers and natural stone.",
    image: "/images/services/hardscaping.png",
  },
  {
    title: "Tree & Shrub Care",
    description:
      "Expert pruning, trimming, and removal. Healthy trees and shrubs are the backbone of a beautiful landscape.",
    image: "/images/services/tree-care.png",
  },
  {
    title: "Irrigation Systems",
    description:
      "Smart sprinkler installation and repair to keep your landscape hydrated efficiently without water waste.",
    image: "/images/services/lawn-care.png",
  },
  {
    title: "Seasonal Cleanup",
    description:
      "Spring and fall cleanup, leaf removal, mulching, and bed preparation to keep your property pristine every season.",
    image: "/images/services/garden-design.png",
  },
  {
    title: "Mulching & Garden Beds",
    description:
      "Fresh mulch, decorative stone, and professionally maintained garden beds that add color and structure to any yard.",
    image: "/images/services/hardscaping.png",
  },
  {
    title: "Outdoor Lighting",
    description:
      "Landscape lighting design and installation that highlights your property's best features and improves safety after dark.",
    image: "/images/services/tree-care.png",
  },
];

const testimonials = [
  {
    name: "David R., Lakewood",
    text: "Garden of Eden completely transformed our backyard. What was once an overgrown mess is now the highlight of our property. The attention to detail is incredible — every stone, every shrub placed with care.",
    stars: 5,
  },
  {
    name: "Sarah M., Toms River",
    text: "We've been using their maintenance service for three years and our lawn has never looked better. Reliable, professional, and always on time. Our neighbors constantly ask who does our yard.",
    stars: 5,
  },
  {
    name: "Michael K., Lakewood",
    text: "The hardscaping work they did for our patio exceeded every expectation. From the design consultation to the final walkthrough, the team was professional and the craftsmanship is top-notch.",
    stars: 5,
  },
  {
    name: "Rachel B., Jackson",
    text: "After getting quotes from five companies, we went with Garden of Eden — best decision we made. Fair pricing, honest communication, and the results speak for themselves. Five stars all day.",
    stars: 5,
  },
];

export default function Home() {
  useScrollAnimation();

  return (
    <main className="overflow-x-hidden">
      <Nav />

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center">
        <Image
          src="/images/hero.png"
          alt="Beautiful landscaped property"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-primary/60" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="text-accent font-semibold text-sm sm:text-base uppercase tracking-[0.2em] mb-4">
            Lakewood&apos;s Premier Landscaping Company
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Transform Your
            <br />
            <span className="text-accent">Outdoor Space</span>
          </h1>
          <p className="text-white/80 text-lg sm:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            From overgrown yards to paradise. Over 20 years of creating
            stunning landscapes across Ocean County and beyond.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:7323642052"
              className="bg-accent hover:bg-accent-light text-primary font-bold px-8 py-4 rounded-full text-lg transition-all hover:scale-105 shadow-lg"
            >
              Get a Free Estimate
            </a>
            <a
              href="#gallery"
              className="border-2 border-white/40 hover:border-white text-white font-medium px-8 py-4 rounded-full text-lg transition-all hover:bg-white/10"
            >
              See Our Work
            </a>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-white/60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* ═══════════════════ BEFORE / AFTER ═══════════════════ */}
      <section id="gallery" className="py-20 sm:py-28 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <p className="fade-up text-accent font-semibold text-sm uppercase tracking-[0.15em] mb-3">
              The Proof Is in the Yard
            </p>
            <h2 className="fade-up text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4">
              See the Difference
            </h2>
            <p className="fade-up text-text-light text-lg max-w-2xl mx-auto">
              Drag the slider to reveal the transformation. This is what
              happens when you let Garden of Eden work their magic.
            </p>
          </div>
          <div className="fade-up">
            <BeforeAfterSlider />
          </div>
          <p className="text-center text-text-light text-sm mt-6 italic">
            Drag the handle left and right to compare
          </p>
        </div>
      </section>

      {/* ═══════════════════ SERVICES ═══════════════════ */}
      <section id="services" className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <p className="fade-up text-accent font-semibold text-sm uppercase tracking-[0.15em] mb-3">
              What We Do
            </p>
            <h2 className="fade-up text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4">
              Our Services
            </h2>
            <p className="fade-up text-text-light text-lg max-w-2xl mx-auto">
              From routine maintenance to complete landscape overhauls, we
              handle every aspect of your outdoor space.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger">
            {services.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ ABOUT ═══════════════════ */}
      <section id="about" className="py-20 sm:py-28 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="fade-up order-2 lg:order-1">
              <p className="text-accent font-semibold text-sm uppercase tracking-[0.15em] mb-3">
                Our Story
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6 leading-tight">
                Rooted in Lakewood.
                <br />
                Growing for 20+ Years.
              </h2>
              <div className="space-y-4 text-text-light leading-relaxed">
                <p>
                  Garden of Eden Landscaping started with a simple belief: every
                  property deserves to look its best. What began as a small crew
                  with a pickup truck and a passion for the outdoors has grown
                  into one of Lakewood&apos;s most trusted landscaping companies.
                </p>
                <p>
                  For over two decades, we&apos;ve been transforming yards across
                  Ocean County — from modest residential lawns to expansive
                  commercial properties. Our team combines old-school work ethic
                  with modern design principles to deliver results that
                  consistently exceed expectations.
                </p>
                <p>
                  We&apos;re not just landscapers — we&apos;re your neighbors.
                  We live and work in this community, and our 5-star reputation
                  is built on treating every property like it&apos;s our own.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-6">
                <div>
                  <div className="text-2xl font-bold text-primary">5.0</div>
                  <div className="text-sm text-text-light">Google Rating</div>
                </div>
                <div className="w-px bg-primary/20" />
                <div>
                  <div className="text-2xl font-bold text-primary">20+</div>
                  <div className="text-sm text-text-light">Years in Business</div>
                </div>
                <div className="w-px bg-primary/20" />
                <div>
                  <div className="text-2xl font-bold text-primary">100%</div>
                  <div className="text-sm text-text-light">Satisfaction</div>
                </div>
              </div>
            </div>
            <div className="fade-up relative order-1 lg:order-2">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/team.png"
                  alt="Garden of Eden landscaping team"
                  width={800}
                  height={600}
                  className="object-cover w-full h-auto"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              {/* Decorative accent */}
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent/10 rounded-2xl -z-10" />
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ STAT BAR ═══════════════════ */}
      <section className="py-16 sm:py-20 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
            <StatItem value="20+" label="Years Experience" />
            <StatItem value="1,000+" label="Projects Completed" />
            <StatItem value="5.0" label="Google Rating" />
            <StatItem value="100%" label="Satisfaction Rate" />
          </div>
        </div>
      </section>

      {/* ═══════════════════ TESTIMONIALS ═══════════════════ */}
      <section id="testimonials" className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <p className="fade-up text-accent font-semibold text-sm uppercase tracking-[0.15em] mb-3">
              What Our Clients Say
            </p>
            <h2 className="fade-up text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4">
              5-Star Reviews
            </h2>
            <p className="fade-up text-text-light text-lg max-w-2xl mx-auto">
              Don&apos;t just take our word for it — hear from the homeowners
              who trust us with their properties.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger">
            {testimonials.map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section
        id="contact"
        className="py-20 sm:py-28 bg-primary relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-5">
          <Image
            src="/images/hero.png"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="fade-up">
            <p className="text-accent font-semibold text-sm uppercase tracking-[0.15em] mb-4">
              Ready to Get Started?
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Transform Your Property
              <br />
              <span className="text-accent">Into a Paradise</span>
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Whether it&apos;s a complete landscape makeover or regular
              maintenance, we&apos;re ready to bring your vision to life. Free
              estimates — no obligation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="tel:7323642052"
                className="bg-accent hover:bg-accent-light text-primary font-bold px-10 py-4 rounded-full text-lg transition-all hover:scale-105 shadow-lg inline-flex items-center gap-3"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                (732) 364-2052
              </a>
            </div>
            <p className="text-white/50 text-sm mt-6">
              Mon–Fri 7:00 AM – 6:00 PM | Serving Lakewood, Toms River, Jackson
              & all of Ocean County
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="bg-[#0F2A1E] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            {/* Brand */}
            <div>
              <Image
                src="/images/logo.png"
                alt="Garden of Eden Landscaping"
                width={160}
                height={45}
                className="h-10 w-auto brightness-0 invert mb-4"
              />
              <p className="text-white/50 text-sm leading-relaxed max-w-xs">
                Lakewood&apos;s trusted landscaping partner for over 20 years.
                Turning ordinary yards into extraordinary outdoor spaces.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
                Quick Links
              </h4>
              <div className="flex flex-col gap-2">
                {[
                  { href: "#services", label: "Services" },
                  { href: "#gallery", label: "Gallery" },
                  { href: "#about", label: "About Us" },
                  { href: "#testimonials", label: "Reviews" },
                  { href: "#contact", label: "Contact" },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-white/50 hover:text-accent text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
                Contact Us
              </h4>
              <div className="flex flex-col gap-3 text-sm text-white/50">
                <a
                  href="tel:7323642052"
                  className="hover:text-accent transition-colors inline-flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  (732) 364-2052
                </a>
                <div className="inline-flex items-center gap-2">
                  <svg
                    className="w-4 h-4 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  1830 New Central Ave, Lakewood, NJ 08701
                </div>
                <div className="inline-flex items-center gap-2">
                  <svg
                    className="w-4 h-4 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Mon – Fri: 7:00 AM – 6:00 PM
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-xs">
              &copy; {new Date().getFullYear()} Garden of Eden Landscaping Inc.
              All rights reserved.
            </p>
            <p className="text-white/20 text-xs">
              Website by{" "}
              <a
                href="https://maivenai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                Maiven
              </a>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
