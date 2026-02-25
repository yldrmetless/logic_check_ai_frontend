import Link from "next/link";
import {
  Boxes,
  Star,
  ArrowRight,
  Database,
  Gauge,
  LineChart,
  FileText,
  Download,
  Zap,
  Github,
} from "lucide-react";

/* ───────────────────────── Navbar ───────────────────────── */
function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Boxes className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">
            LogicCheck AI APP
          </span>
        </Link>

        {/* Center links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="https://github.com/yldrmetless/LogickCheckAI"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5"
          >
            <Github className="w-4 h-4" />
            GitHub
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/yldrmetless/LogickCheckAI"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-full px-3.5 py-1.5 hover:bg-slate-100 transition-colors"
          >
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            Star on GitHub
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-slate-700 border border-slate-200 rounded-full px-5 py-2 hover:bg-slate-50 transition-colors"
          >
            Login
          </Link>
        </div>
      </nav>
    </header>
  );
}

/* ───────────────────────── Hero ───────────────────────── */
function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center text-center pt-24 pb-16 px-4 max-w-4xl mx-auto">
      {/* Badge */}
      <span className="text-blue-600 bg-blue-50 text-xs font-bold px-4 py-1.5 rounded-full mb-6 flex items-center gap-2 uppercase tracking-wide">
        <Zap className="w-3.5 h-3.5" />
        Powered by Llama 3.1
      </span>

      {/* Title */}
      <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.08]">
        <span className="text-slate-900">Validate Your </span>
        <span className="text-blue-500">Startup Idea</span>
        <br />
        <span className="text-slate-900">with AI</span>
      </h1>

      {/* Subtitle */}
      <p className="text-slate-500 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
        Stress-test your business logic with real-time market data, competitor
        scraping, and deep AI reasoning. Stop guessing, start building.
      </p>

      {/* Actions */}
      <div className="flex justify-center items-center">
        <Link
          href="/login"
          className="bg-blue-500 text-white rounded-full px-8 py-3.5 font-medium hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
        >
          Start Analyzing
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

/* ───────────────────────── Bento Feature Cards ───────────────────────── */
function BentoGrid() {
  return (
    <section
      id="features"
      className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {/* Card 1 — Real-time Web Scraping (2-col) */}
      <div className="md:col-span-2 bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all duration-300">
        <div>
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-5">
            <Database className="w-5 h-5 text-blue-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Real-time Web Scraping
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            Live crawling of latest market trends, competitor pricing, and
            feature sets via Tavily.
          </p>
        </div>

        {/* Mock terminal */}
        <div className="bg-slate-900 rounded-2xl p-5 font-mono text-xs leading-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="w-3 h-3 rounded-full bg-emerald-400" />
          </div>
          <p className="text-blue-400">TAVILY SEARCH STREAM LOG</p>
          <p className="text-slate-400 mt-1.5">
            <span className="text-emerald-400">GET</span>{" "}
            /v1/search?q=&quot;startup+idea&quot;
          </p>
          <p className="text-slate-500 mt-1">
            SYSTEM&nbsp; Initializing distributed crawler ...
          </p>
        </div>
      </div>

      {/* Card 2 — LogicCheck Scoring (1-col) */}
      <div className="md:col-span-1 bg-blue-500 text-white rounded-[2rem] p-8 shadow-sm flex flex-col justify-between text-center relative overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all duration-300">
        {/* Subtle radial glow */}
        <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-blue-400/30 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-5 mx-auto">
            <Gauge className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2">LogicCheck Scoring</h3>
          <p className="text-blue-100 text-sm leading-relaxed mb-6">
            Proprietary confidence score based on 50+ variables.
          </p>
        </div>

        {/* Circular progress ring */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative w-32 h-32">
            <svg className="score-ring w-32 h-32" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="10"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="white"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${(82 / 100) * 314} ${314}`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black">82</span>
            </div>
          </div>
          <span className="text-blue-100 text-xs font-semibold uppercase tracking-widest mt-2">
            Confidence
          </span>
        </div>
      </div>

      {/* Card 3 — Market Gap Analysis (1-col) */}
      <div className="md:col-span-1 bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all duration-300">
        <div>
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-5">
            <LineChart className="w-5 h-5 text-blue-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Market Gap Analysis
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            Identify untapped white spaces in existing markets with visual trend
            mapping.
          </p>
        </div>

        {/* Mock bar chart */}
        <div className="flex items-end gap-3 h-24">
          {[
            { h: "40%", color: "bg-blue-200" },
            { h: "65%", color: "bg-blue-400" },
            { h: "85%", color: "bg-blue-500" },
            { h: "55%", color: "bg-blue-300" },
          ].map((bar, i) => (
            <div
              key={i}
              className={`flex-1 ${bar.color} rounded-lg`}
              style={{ height: bar.h }}
            />
          ))}
        </div>
      </div>

      {/* Card 4 — Investor-Ready Reports (2-col) */}
      <div className="md:col-span-2 bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm flex flex-col md:flex-row gap-8 items-center justify-between overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all duration-300">
        {/* Left content */}
        <div className="flex-1">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-5">
            <FileText className="w-5 h-5 text-blue-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Investor-Ready Reports
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            Download comprehensive strategy documents, roadmap projections, and
            risk assessments.
          </p>
          <div
            className="inline-flex items-center gap-2 bg-blue-500 text-white text-sm font-medium rounded-full px-6 py-2.5"
          >
            <Download className="w-4 h-4" />
            Download PDF Preview
          </div>
        </div>

        {/* Right — document mock */}
        <div className="w-52 shrink-0">
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 relative">
            {/* Verified badge */}
            <span className="absolute -top-2.5 right-4 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full tracking-wider border border-emerald-100">
              Verified
            </span>
            {/* Document lines mock */}
            <div className="space-y-2 mb-4 mt-2">
              <div className="h-2 bg-slate-200 rounded-full w-full" />
              <div className="h-2 bg-slate-200 rounded-full w-4/5" />
              <div className="h-2 bg-slate-200 rounded-full w-3/5" />
            </div>
            {/* File name row */}
            <div className="flex items-center justify-between bg-white rounded-xl p-3 border border-slate-100">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                  Analysis
                </p>
                <p className="text-xs font-semibold text-slate-700">
                  analysis_v1.pdf
                </p>
              </div>
              <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center">
                <Download className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Bottom CTA ───────────────────────── */
function BottomCTA() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-16 mb-16">
      <div className="bg-slate-900 rounded-[2.5rem] p-12 md:p-20 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />

        <h2 className="text-white text-3xl md:text-5xl font-bold tracking-tight mb-4 relative z-10">
          Ready to test your next big idea?
        </h2>
        <p className="text-slate-300 text-lg mb-8 relative z-10 max-w-xl">
          Join hundreds of founders using AI to build smarter, not harder.
        </p>
        <Link
          href="/login"
          className="bg-blue-500 text-white rounded-full px-8 py-3.5 font-medium hover:bg-blue-600 transition-all relative z-10 shadow-lg shadow-blue-500/20"
        >
          Get Started
        </Link>
      </div>
    </section>
  );
}

/* ───────────────────────── Footer ───────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-slate-100 py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Left */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
            <Boxes className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-slate-900 font-semibold text-sm">
            LogicCheck AI APP
          </span>
        </div>

        <p className="text-slate-400 text-sm text-center md:text-left">
          © {new Date().getFullYear()} LogicCheck AI. Built for serious builders.
        </p>

        {/* Right links */}
        <div>
          <Link
            href="https://metehanyildirim.me"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 text-sm hover:text-slate-600 transition-colors"
          >
            Creator Profile
          </Link>
        </div>
      </div>
    </footer>
  );
}

/* ───────────────────────── Page ───────────────────────── */
export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <BentoGrid />
      <BottomCTA />
      <Footer />
    </div>
  );
}
