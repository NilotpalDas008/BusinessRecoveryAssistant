import { GlassCard } from "./ui/glass-card";
import { Badge } from "./ui/badge";
import {
  BrainCircuit,
  SearchCheck,
  MessageCircle,
  Share2,
  Percent,
  Lightbulb,
} from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: BrainCircuit,
      title: "AI Review Analysis",
      description: "Automatically understand customer sentiment and emotion behind every Google review.",
      gradient: "from-blue-500/20 to-indigo-500/20",
      borderGlow: "hover:border-blue-500/40",
      iconColor: "text-blue-400",
    },
    {
      icon: SearchCheck,
      title: "Complaint Detection",
      description: "Identify recurring operational issues before they escalate and hurt your business reputation.",
      gradient: "from-amber-500/20 to-orange-500/20",
      borderGlow: "hover:border-amber-500/40",
      iconColor: "text-amber-400",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp Recovery",
      description: "Generate personalized, high-converting recovery messages and outreach instantly.",
      gradient: "from-emerald-500/20 to-teal-500/20",
      borderGlow: "hover:border-emerald-500/40",
      iconColor: "text-emerald-400",
    },
    {
      icon: Share2,
      title: "AI Marketing",
      description: "Create engaging Instagram and Facebook social posts automatically from positive reviews.",
      gradient: "from-purple-500/20 to-pink-500/20",
      borderGlow: "hover:border-purple-500/40",
      iconColor: "text-purple-400",
    },
    {
      icon: Percent,
      title: "Smart Discounts",
      description: "Recommend tailored promotional offers that maximize customer retention while preserving margins.",
      gradient: "from-violet-500/20 to-indigo-500/20",
      borderGlow: "hover:border-violet-500/40",
      iconColor: "text-violet-400",
    },
    {
      icon: Lightbulb,
      title: "Business Insights",
      description: "Get actionable, daily AI recommendations to optimize staff, menu, and service quality.",
      gradient: "from-cyan-500/20 to-blue-500/20",
      borderGlow: "hover:border-cyan-500/40",
      iconColor: "text-cyan-400",
    },
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden bg-[#09090B]">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-purple-900/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <Badge variant="purple">Autonomous AI Toolkit</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Everything You Need to <span className="text-gradient-primary">Recover Lost Customers</span>
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            Turn negative feedback into revenue growth with our comprehensive AI suite tailored for local businesses.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <GlassCard
                key={index}
                className={`group relative p-8 transition-all duration-300 ${feat.borderGlow}`}
              >
                {/* Icon box */}
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.gradient} border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`h-6 w-6 ${feat.iconColor}`} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                  {feat.title}
                </h3>

                {/* Short Description */}
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {feat.description}
                </p>

                {/* Subtle corner indicator line */}
                <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-purple-500/0 to-transparent group-hover:via-purple-500/50 transition-all duration-500" />
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
