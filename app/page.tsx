"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";

/* ───────────── Scroll-reveal hook ───────────── */

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ───────────── Before / After Slider ───────────── */

function BeforeAfterSlider() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);

  const move = useCallback((clientX: number) => {
    if (!ref.current) return;
    const { left, width } = ref.current.getBoundingClientRect();
    setPos(Math.max(2, Math.min(98, ((clientX - left) / width) * 100)));
  }, []);

  useEffect(() => {
    const up = () => { dragging.current = false; };
    window.addEventListener("mouseup", up);
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchend", up);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="ba-slider relative w-full max-w-4xl mx-auto rounded-2xl shadow-2xl"
      style={{ aspectRatio: "16/10" }}
      onMouseDown={() => { dragging.current = true; }}
      onMouseMove={(e) => { if (dragging.current) move(e.clientX); }}
      onTouchStart={() => { dragging.current = true; }}
      onTouchMove={(e) => { move(e.touches[0].clientX); }}
      onClick={(e) => move(e.clientX)}
    >
      {/* AFTER — full background */}
      <Image
        src="/images/after.png"
        alt="After landscaping transformation"
        fill
        className="object-cover select-none pointer-events-none"
        sizes="(max-width:768px) 100vw, 896px"
        draggable={false}
      />

      {/* BEFORE — clipped */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image
          src="/images/before.png"
          alt="Before landscaping"
          fill
          className="object-cover select-none pointer-events-none"
          sizes="(max-width:768px) 100vw, 896px"
          draggable={false}
        />
      </div>

      {/* Labels */}
      <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-black/60 backdrop-blur-sm text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full uppercase tracking-widest z-10 pointer-events-none">
        Before
      </span>
      <span className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-primary/80 backdrop-blur-sm text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full uppercase tracking-widest z-10 pointer-events-none">
        After
      </span>

      {/* Divider + Handle */}
      <div
        className="absolute inset-y-0 z-20 flex items-center pointer-events-none"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
      >
        <div className="w-[2px] h-full bg-white/90 shadow-md" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-xl flex items-center justify-center pointer-events-auto cursor-ew-resize border-2 border-white/80">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-primary">
            <path d="M8 5L3 12L8 19M16 5L21 12L16 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ───────────── Nav ───────────── */

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { href: "#gallery", label: "Gallery" },
    { href: "#services", label: "Services" },
    { href: "#about", label: "About" },
    { href: "#testimonials", label: "Reviews" },
    { href: "#contact", label: "Contact" },
  ];

  const scrollTo = (id: string) => {
    setOpen(false);
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "bg-primary shadow-lg py-2.5" : "bg-gradient-to-b from-black/60 to-transparent py-4"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <button onClick={() => scrollTo("#")} className="shrink-0">
          <Image src="/images/logo.png" alt="Garden of Eden Landscaping" width={180} height={50} className="h-9 sm:h-11 w-auto brightness-0 invert" priority />
        </button>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-7">
          {links.map((l) => (
            <button key={l.href} onClick={() => scrollTo(l.href)} className="text-white/90 hover:text-accent text-sm font-medium tracking-wide transition-colors">
              {l.label}
            </button>
          ))}
          <a href="tel:7323642052" className="bg-accent hover:bg-accent-light text-primary font-bold text-sm px-5 py-2.5 rounded-full transition-all hover:scale-105">
            (732) 364-2052
          </a>
        </div>

        {/* Hamburger */}
        <button onClick={() => setOpen(!open)} className="lg:hidden text-white p-2" aria-label="Menu">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            {open
              ? <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              : <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`lg:hidden transition-all duration-300 overflow-hidden ${open ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="bg-primary/95 backdrop-blur px-6 pt-2 pb-6 flex flex-col gap-3">
          {links.map((l) => (
            <button key={l.href} onClick={() => scrollTo(l.href)} className="text-left text-white/90 hover:text-accent text-base font-medium py-1.5">
              {l.label}
            </button>
          ))}
          <a href="tel:7323642052" className="bg-accent text-primary font-bold text-center px-6 py-3 rounded-full mt-2">
            (732) 364-2052
          </a>
        </div>
      </div>
    </nav>
  );
}

/* ───────────── Service Card ───────────── */

function ServiceCard({ title, desc, img }: { title: string; desc: string; img: string }) {
  return (
    <div className="reveal group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-48 sm:h-52 overflow-hidden">
        <Image src={img} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,25vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-primary mb-2">{title}</h3>
        <p className="text-text-light text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

/* ───────────── Testimonial Card ───────────── */

function TestimonialCard({ name, text }: { name: string; text: string }) {
  return (
    <div className="reveal bg-white rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex gap-0.5 mb-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg key={i} className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-text-light leading-relaxed mb-4 italic">&ldquo;{text}&rdquo;</p>
      <p className="font-bold text-primary text-sm">{name}</p>
    </div>
  );
}

/* ───────────── Stat ───────────── */

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl sm:text-4xl font-bold text-accent mb-1">{value}</div>
      <div className="text-white/80 text-sm font-medium">{label}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════ */

const SERVICES = [
  { title: "Lawn Care & Maintenance", desc: "Weekly mowing, edging, fertilization, and seasonal treatments to keep your lawn lush and green year-round.", img: "/images/services/lawn-care.png" },
  { title: "Landscape Design", desc: "Custom garden plans tailored to your property. From flowering beds to ornamental features that transform curb appeal.", img: "/images/services/garden-design.png" },
  { title: "Hardscaping", desc: "Patios, walkways, retaining walls, and outdoor living spaces built with premium pavers and natural stone.", img: "/images/services/hardscaping.png" },
  { title: "Tree & Shrub Care", desc: "Expert pruning, trimming, and removal. Healthy trees and shrubs are the backbone of a beautiful landscape.", img: "/images/services/tree-care.png" },
  { title: "Irrigation Systems", desc: "Smart sprinkler installation and repair to keep your landscape hydrated efficiently without water waste.", img: "/images/services/lawn-care.png" },
  { title: "Seasonal Cleanup", desc: "Spring and fall cleanup, leaf removal, mulching, and bed preparation to keep your property pristine every season.", img: "/images/services/garden-design.png" },
  { title: "Mulching & Garden Beds", desc: "Fresh mulch, decorative stone, and professionally maintained garden beds that add color and structure to any yard.", img: "/images/services/hardscaping.png" },
  { title: "Outdoor Lighting", desc: "Landscape lighting design and installation that highlights your property's best features and improves safety after dark.", img: "/images/services/tree-care.png" },
];

const TESTIMONIALS = [
  { name: "David R., Lakewood", text: "Garden of Eden completely transformed our backyard. What was once an overgrown mess is now the highlight of our property. The attention to detail is incredible — every stone, every shrub placed with care." },
  { name: "Sarah M., Toms River", text: "We've been using their maintenance service for three years and our lawn has never looked better. Reliable, professional, and always on time. Our neighbors constantly ask who does our yard." },
  { name: "Michael K., Lakewood", text: "The hardscaping work they did for our patio exceeded every expectation. From the design consultation to the final walkthrough, the team was professional and the craftsmanship is top-notch." },
  { name: "Rachel B., Jackson", text: "After getting quotes from five companies, we went with Garden of Eden — best decision we made. Fair pricing, honest communication, and the results speak for themselves. Five stars all day." },
];

export default function Home() {
  useReveal();

  return (
    <main className="overflow-x-hidden">
      <Nav />

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center justify-center">
        <Image src="/images/hero.png" alt="Beautifully landscaped property" fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-primary/60" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-20">
          <p className="text-accent font-semibold text-xs sm:text-sm uppercase tracking-[0.2em] mb-4">
            Lakewood&apos;s Premier Landscaping Company
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6">
            Transform Your<br />
            <span className="text-accent">Outdoor Space</span>
          </h1>
          <p className="text-white/80 text-base sm:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            From overgrown yards to paradise. Over 20 years creating stunning landscapes across Ocean County and beyond.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="tel:7323642052" className="w-full sm:w-auto bg-accent hover:bg-accent-light text-primary font-bold px-8 py-4 rounded-full text-lg transition-all hover:scale-105 shadow-lg text-center">
              Get a Free Estimate
            </a>
            <button onClick={() => document.querySelector("#gallery")?.scrollIntoView({ behavior: "smooth" })} className="w-full sm:w-auto border-2 border-white/40 hover:border-white text-white font-medium px-8 py-4 rounded-full text-lg transition-all hover:bg-white/10 text-center">
              See Our Work
            </button>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        </div>
      </section>

      {/* ═══ BEFORE / AFTER ═══ */}
      <section id="gallery" className="py-16 sm:py-24 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <p className="reveal text-accent font-semibold text-xs sm:text-sm uppercase tracking-[0.15em] mb-2">The Proof Is in the Yard</p>
            <h2 className="reveal text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4">See the Difference</h2>
            <p className="reveal text-text-light text-base sm:text-lg max-w-2xl mx-auto">Drag the slider to reveal the transformation. This is what happens when you let Garden of Eden work their magic.</p>
          </div>
          <div className="reveal">
            <BeforeAfterSlider />
          </div>
          <p className="text-center text-text-light/60 text-sm mt-5 italic">Drag the handle left and right to compare</p>
        </div>
      </section>

      {/* ═══ SERVICES ═══ */}
      <section id="services" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <p className="reveal text-accent font-semibold text-xs sm:text-sm uppercase tracking-[0.15em] mb-2">What We Do</p>
            <h2 className="reveal text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4">Our Services</h2>
            <p className="reveal text-text-light text-base sm:text-lg max-w-2xl mx-auto">From routine maintenance to complete landscape overhauls, we handle every aspect of your outdoor space.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 stagger">
            {SERVICES.map((s) => <ServiceCard key={s.title} {...s} />)}
          </div>
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section id="about" className="py-16 sm:py-24 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Text */}
            <div className="reveal order-2 lg:order-1">
              <p className="text-accent font-semibold text-xs sm:text-sm uppercase tracking-[0.15em] mb-2">Our Story</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6 leading-tight">
                Rooted in Lakewood.<br />Growing for 20+ Years.
              </h2>
              <div className="space-y-4 text-text-light leading-relaxed text-[15px]">
                <p>Garden of Eden Landscaping started with a simple belief: every property deserves to look its best. What began as a small crew with a pickup truck and a passion for the outdoors has grown into one of Lakewood&apos;s most trusted landscaping companies.</p>
                <p>For over two decades, we&apos;ve been transforming yards across Ocean County — from modest residential lawns to expansive commercial properties. Our team combines old-school work ethic with modern design principles to deliver results that consistently exceed expectations.</p>
                <p>We&apos;re not just landscapers — we&apos;re your neighbors. We live and work in this community, and our 5-star reputation is built on treating every property like it&apos;s our own.</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-6">
                <div><div className="text-2xl font-bold text-primary">5.0</div><div className="text-xs text-text-light">Google Rating</div></div>
                <div className="w-px bg-primary/20" />
                <div><div className="text-2xl font-bold text-primary">20+</div><div className="text-xs text-text-light">Years in Business</div></div>
                <div className="w-px bg-primary/20" />
                <div><div className="text-2xl font-bold text-primary">100%</div><div className="text-xs text-text-light">Satisfaction</div></div>
              </div>
            </div>
            {/* Image */}
            <div className="reveal relative order-1 lg:order-2">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <Image src="/images/team.png" alt="Garden of Eden landscaping team" width={800} height={600} className="object-cover w-full" sizes="(max-width:1024px) 100vw,50vw" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-28 h-28 bg-accent/10 rounded-2xl -z-10 hidden sm:block" />
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/10 rounded-2xl -z-10 hidden sm:block" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STAT BAR ═══ */}
      <section className="py-14 sm:py-20 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10">
            <Stat value="20+" label="Years Experience" />
            <Stat value="1,000+" label="Projects Completed" />
            <Stat value="5.0" label="Google Rating" />
            <Stat value="100%" label="Satisfaction Rate" />
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section id="testimonials" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <p className="reveal text-accent font-semibold text-xs sm:text-sm uppercase tracking-[0.15em] mb-2">What Our Clients Say</p>
            <h2 className="reveal text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4">5-Star Reviews</h2>
            <p className="reveal text-text-light text-base sm:text-lg max-w-2xl mx-auto">Don&apos;t just take our word for it — hear from the homeowners who trust us with their properties.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 stagger">
            {TESTIMONIALS.map((t) => <TestimonialCard key={t.name} {...t} />)}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section id="contact" className="py-16 sm:py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <Image src="/images/hero.png" alt="" fill className="object-cover" sizes="100vw" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="reveal">
            <p className="text-accent font-semibold text-xs sm:text-sm uppercase tracking-[0.15em] mb-3">Ready to Get Started?</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
              Transform Your Property<br /><span className="text-accent">Into a Paradise</span>
            </h2>
            <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              Whether it&apos;s a complete landscape makeover or regular maintenance, we&apos;re ready to bring your vision to life. Free estimates — no obligation.
            </p>
            <a href="tel:7323642052" className="inline-flex items-center gap-3 bg-accent hover:bg-accent-light text-primary font-bold px-10 py-4 rounded-full text-lg transition-all hover:scale-105 shadow-lg">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              (732) 364-2052
            </a>
            <p className="text-white/40 text-sm mt-5">Mon–Fri 7 AM – 6 PM &middot; Serving Lakewood, Toms River, Jackson &amp; all of Ocean County</p>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-[#0F2A1E] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div>
              <Image src="/images/logo.png" alt="Garden of Eden Landscaping" width={160} height={45} className="h-9 w-auto brightness-0 invert mb-4" />
              <p className="text-white/40 text-sm leading-relaxed max-w-xs">Lakewood&apos;s trusted landscaping partner for over 20 years. Turning ordinary yards into extraordinary outdoor spaces.</p>
            </div>
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Quick Links</h4>
              <div className="flex flex-col gap-2">
                {["Services", "Gallery", "About Us", "Reviews", "Contact"].map((l) => (
                  <a key={l} href={`#${l.toLowerCase().replace(" us", "").replace(" ", "-")}`} className="text-white/40 hover:text-accent text-sm transition-colors">{l}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Contact Us</h4>
              <div className="flex flex-col gap-3 text-sm text-white/40">
                <a href="tel:7323642052" className="hover:text-accent transition-colors inline-flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  (732) 364-2052
                </a>
                <div className="inline-flex items-start gap-2">
                  <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  1830 New Central Ave, Lakewood, NJ 08701
                </div>
                <div className="inline-flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Mon – Fri: 7:00 AM – 6:00 PM
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/25 text-xs">&copy; {new Date().getFullYear()} Garden of Eden Landscaping Inc. All rights reserved.</p>
            <p className="text-white/15 text-xs">Website by <a href="https://maivenai.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Maiven</a></p>
          </div>
        </div>
      </footer>
    </main>
  );
}
