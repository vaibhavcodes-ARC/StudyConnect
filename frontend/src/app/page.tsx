"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, BookOpen, Layers, MonitorPlay, Users } from "lucide-react";
import Link from "next/link";
import CurrentYear from "@/components/CurrentYear";
import HeroScene from "@/components/HeroScene";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: "Classroom Collaboration",
    description: "Connect with teachers and peers in isolated virtual classrooms. Share resources and collaborate.",
    icon: Users,
  },
  {
    title: "Resource Sharing",
    description: "Access curated notes, syllabi, and reading materials uploaded directly by your professors.",
    icon: Layers,
  },
  {
    title: "Assignment Management",
    description: "Track deadlines, submit files easily, and receive grades and feedback instantly.",
    icon: BookOpen,
  },
  {
    title: "Exam Preparation",
    description: "An exclusive Exam Portal containing vital study guides and revision materials.",
    icon: MonitorPlay,
  },
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP Scroll Animation for Features
    const ctx = gsap.context(() => {
      // Hero text entrance
      gsap.fromTo(
        heroTextRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.2 }
      );

      // Features stagger scroll
      const cards = gsap.utils.toArray(".feature-card");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 -z-10 h-screen w-full">
        <HeroScene />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center text-center px-4 pt-16">
        <div ref={heroTextRef} className="max-w-4xl mx-auto space-y-8 glass-panel p-10 md:p-16 rounded-3xl">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
              College Resource <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Portal</span>
            </h1>
            <p className="text-lg md:text-2xl text-slate-600 max-w-2xl mx-auto">
              Modern learning infrastructure built for speed. Manage your classrooms, track assignments, and ace your exams all in one beautifully designed workspace.
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 text-lg font-semibold text-slate-700 bg-white border-2 border-slate-200 rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              Login to Account
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="bg-white/80 backdrop-blur-md py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-lg text-slate-600">
              Inspired by standard classroom tools, reimagined for the modern student and educator.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="feature-card bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all group"
                >
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-heading font-bold text-white mb-4">StudyConnect</h2>
          <p>© <CurrentYear /> College Resource Portal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
