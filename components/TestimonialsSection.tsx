import { GlassCard } from "./ui/glass-card";
import { Badge } from "./ui/badge";
import { Star, Quote, Building2, Utensils, Scissors, ShoppingBag } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      businessName: "Bella Cafe",
      category: "Restaurant & Bakery",
      owner: "Sophia Martinez",
      role: "Founder & Manager",
      initials: "SM",
      avatarGradient: "from-amber-500 to-pink-500",
      businessIcon: Utensils,
      rating: 5,
      quote:
        "ReviveAI flagged a recurring complaint about long breakfast wait times. The automated WhatsApp recovery vouchers turned 18 unhappy customers back into regular weekly guests!",
    },
    {
      businessName: "Urban Salon",
      category: "Beauty & Wellness",
      owner: "David Chen",
      role: "Operations Director",
      initials: "DC",
      avatarGradient: "from-purple-500 to-indigo-500",
      businessIcon: Scissors,
      rating: 5,
      quote:
        "We recovered over $4,500 in lost revenue during our first month. The AI generated personalized discount vouchers that felt genuine and respectful.",
    },
    {
      businessName: "FreshMart",
      category: "Retail & Grocery",
      owner: "Elena Rostova",
      role: "Owner",
      initials: "ER",
      avatarGradient: "from-emerald-500 to-teal-500",
      businessIcon: ShoppingBag,
      rating: 5,
      quote:
        "Instead of dreading negative Google reviews, ReviveAI handles the entire response and recovery workflow automatically. Our overall rating jumped from 4.1 to 4.8!",
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-[#09090B]">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-purple-600/10 blur-[160px] rounded-full pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <Badge variant="purple">Customer Success Stories</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Loved by <span className="text-gradient-primary">Local Businesses</span>
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            See how real local business owners use ReviveAI to protect their brand and retain customers.
          </p>
        </div>

        {/* 3 Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => {
            const BizIcon = item.businessIcon;
            return (
              <GlassCard
                key={index}
                className="flex flex-col justify-between p-8 hover:border-purple-500/30 transition-all duration-300 relative group"
              >
                {/* Quote Icon watermark */}
                <Quote className="absolute top-6 right-6 h-8 w-8 text-white/5 group-hover:text-purple-500/10 transition-colors" />

                <div>
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Testimonial Quote */}
                  <p className="text-zinc-200 text-sm leading-relaxed mb-8 italic">
                    "{item.quote}"
                  </p>
                </div>

                {/* Footer: Owner & Business details */}
                <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Owner avatar placeholder */}
                    <div
                      className={`w-11 h-11 rounded-full bg-gradient-to-br ${item.avatarGradient} flex items-center justify-center text-white font-bold text-sm shadow-md`}
                    >
                      {item.initials}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white leading-snug">
                        {item.owner}
                      </div>
                      <div className="text-xs text-zinc-400">{item.role}</div>
                    </div>
                  </div>

                  {/* Business Badge */}
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1 text-xs font-semibold text-purple-300">
                      <BizIcon className="h-3.5 w-3.5" />
                      {item.businessName}
                    </div>
                    <div className="text-[11px] text-zinc-400">{item.category}</div>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
