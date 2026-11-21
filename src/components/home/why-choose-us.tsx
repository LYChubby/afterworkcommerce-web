import { Gem, Heart, Sparkles } from "lucide-react";

const advantages = [
  {
    number: "01",
    title: "Thoughtful Selection",
    description: "Setiap koleksi dipilih dengan perhatian terhadap karakter, estetika, dan kebutuhan gaya sehari-hari.",
    icon: Gem,
  },
  {
    number: "02",
    title: "Comfort Comes First",
    description: "Kami percaya bahwa penampilan yang baik harus berjalan beriringan dengan kenyamanan.",
    icon: Heart,
  },
  {
    number: "03",
    title: "Everyday Elegance",
    description: "Temukan gaya yang sederhana, timeless, dan tetap merepresentasikan karakter dirimu.",
    icon: Sparkles,
  },
];

export function WhyChooseUs() {
  return (
    <section id="about" className="bg-muted/30 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-medium tracking-[0.2em] text-primary">THE AFTERWORK EXPERIENCE</span>

          <h2 className="mt-5 font-heading text-3xl leading-tight text-foreground sm:text-4xl lg:text-5xl">
            More Than Just
            <span className="block italic text-primary">What You Wear.</span>
          </h2>

          <p className="mt-6 text-sm leading-7 text-muted-foreground sm:text-base">Kami percaya bahwa fashion bukan sekadar tentang apa yang dikenakan, tetapi bagaimana setiap pilihan membuatmu merasa percaya diri dan nyaman.</p>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
          {advantages.map((advantage) => {
            const Icon = advantage.icon;

            return (
              <article key={advantage.number} className="group border-t border-border pt-7">
                <div className="flex items-center justify-between">
                  <span className="text-xs tracking-[0.2em] text-muted-foreground">{advantage.number}</span>

                  <Icon size={23} strokeWidth={1.4} className="text-primary transition-transform duration-300 group-hover:-translate-y-1" aria-hidden="true" />
                </div>

                <h3 className="mt-8 font-heading text-xl text-foreground sm:text-2xl">{advantage.title}</h3>

                <p className="mt-4 text-sm leading-7 text-muted-foreground">{advantage.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
