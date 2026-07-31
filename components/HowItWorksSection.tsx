import { Badge } from "./ui/badge";
import { Link2, Database, AlertCircle, HeartHandshake } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Connect Your Business",
      desc: "Link your Google Business Profile and social review channels in less than 2 minutes.",
      icon: Link2,
    },
    {
      num: "02",
      title: "AI Collects Reviews",
      desc: "ReviveAI automatically ingests and categorizes all customer feedback in real-time.",
      icon: Database,
    },
    {
      num: "03",
      title: "AI Finds Problems",
      desc: "Advanced NLP identifies recurring complaint clusters like wait time or order accuracy.",
      icon: AlertCircle,
    },
    {
      num: "04",
      title: "Recover Customers Automatically",
      desc: "Dispatches personalized WhatsApp recovery offers that win back unhappy customers.",
      icon: HeartHandshake,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden bg-grid-pattern">
      {/* Glow background */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-blue-600/10 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <Badge variant="emerald">Simple 4-Step Process</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How <span className="text-gradient-primary">ReviveAI Works</span>
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            From setup to automated customer recovery, see how ReviveAI protects your revenue around the clock.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="relative">
          {/* Connecting glowing line for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/50 to-emerald-500/20 -translate-y-1/2 -z-10" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="relative group rounded-2xl border border-white/10 bg-[#121216]/80 p-6 backdrop-blur-xl hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-2 shadow-xl"
                >
                  {/* Step Number Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black font-mono text-purple-400/70 group-hover:text-purple-300 transition-colors">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white mb-2 leading-snug group-hover:text-purple-200">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
