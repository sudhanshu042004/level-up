"use client";
import { ThemeProvider } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { verifySession } from "@/lib/session";
import { Press_Start_2P } from "next/font/google";
import { Swords, Star, Trophy, Heart, Zap, Crown, Rocket, Target, Flame } from "lucide-react";

const pixel = Press_Start_2P({ weight: "400", subsets: ["latin"], variable: "--font-pixel" });

// Deterministic pixel stars (no Math.random -> no hydration mismatch)
const COLORS = ["#fde047", "#fb923c", "#fdba74", "#ffffff", "#f97316"];
const STARS = Array.from({ length: 40 }, (_, i) => ({
  left: (i * 29 + 7) % 100,
  top: (i * 47 + 13) % 100,
  size: i % 5 === 0 ? 8 : 4,
  color: COLORS[i % COLORS.length],
  delay: (i % 8) * 0.3,
}));

const QUESTS = [
  { icon: Zap, color: "#fde047", title: "EARN XP", desc: "Finish tasks. Fill the bar. Feel the rush." },
  { icon: Swords, color: "#fb923c", title: "SLAY GOALS", desc: "Turn giant goals into bite-size boss fights." },
  { icon: Trophy, color: "#f87171", title: "UNLOCK RANKS", desc: "Climb the ladder. Collect the glory." },
];

const RANKS = [
  { name: "DORMANT", color: "#94a3b8" },
  { name: "AWAKENED", color: "#fdba74" },
  { name: "ASCENDED", color: "#fb923c" },
  { name: "TRANSCENDENT", color: "#fde047" },
];

export default function Home() {
  const route = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const session = await verifySession();
      if (session?.userId != null) route.push("/home");
    };
    checkSession();
  }, [route]);

  return (
    <ThemeProvider>
      <div className={`${pixel.variable} pixel-font relative min-h-screen w-full overflow-hidden bg-[#1a0a05] text-white`}>
        {/* Galaxy backdrop */}
        <div
          className="pixelated fixed inset-0 bg-cover bg-center opacity-90"
          style={{ backgroundImage: "url(/galaxy.png)" }}
          aria-hidden
        />
        <div className="fixed inset-0 bg-gradient-to-b from-[#1a0a05]/60 via-orange-950/20 to-[#1a0a05]/90" aria-hidden />

        {/* Twinkling pixel stars */}
        <div className="pointer-events-none fixed inset-0" aria-hidden>
          {STARS.map((s, i) => (
            <span
              key={i}
              className="pixel-twinkle absolute"
              style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, background: s.color, animationDelay: `${s.delay}s` }}
            />
          ))}
          <span className="pixel-comet absolute top-[12%] left-0 h-1 w-10 bg-cyan-300 shadow-[-24px_0_0_0_rgba(34,211,238,0.5),-48px_0_0_0_rgba(34,211,238,0.25)]" />
        </div>

        {/* HUD nav */}
        <nav className="fixed inset-x-0 top-0 z-50 border-b-4 border-orange-400 bg-[#1f0e08]/90 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:px-6">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-yellow-300">
              <Rocket className="h-5 w-5" /> LEVEL UP
            </div>
            <div className="flex gap-3">
              <button onClick={() => route.push("/login")} className="pixel-btn bg-[#9a3412] px-3 py-2 text-[10px] sm:text-xs">
                LOGIN
              </button>
              <button onClick={() => route.push("/signup")} className="pixel-btn bg-[#f97316] px-3 py-2 text-[10px] sm:text-xs">
                SIGN UP
              </button>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <main className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 pt-32 pb-16 text-center">
          <div className="pixel-float mb-6 flex items-center gap-2 text-[10px] text-orange-300 sm:text-xs">
            <Star className="h-4 w-4 fill-current" /> PLAYER 1 READY <Star className="h-4 w-4 fill-current" />
          </div>

          <h1 className="text-3xl leading-[1.5] sm:text-5xl lg:text-6xl" style={{ textShadow: "4px 4px 0 #ea580c, 8px 8px 0 #000" }}>
            <span className="text-yellow-300">LEVEL UP</span>
            <br />
            YOUR REAL LIFE
          </h1>

          <p className="mt-8 max-w-2xl text-[10px] leading-[2.2] text-orange-100 sm:text-xs">
            Every goal is a quest. Every task is XP. Rise through the ranks and become a legend of the galaxy.
          </p>

          <button
            onClick={() => route.push("/signup")}
            className="pixel-btn mt-10 bg-gradient-to-b from-orange-400 to-red-600 px-6 py-4 text-sm sm:text-base"
          >
            ▶ PRESS START
          </button>
          <p className="pixel-blink mt-5 text-[10px] text-yellow-300">INSERT COIN TO CONTINUE</p>

          {/* Player card */}
          <div className="pixel-box mt-14 w-full max-w-lg p-5 text-left">
            <div className="flex items-center justify-between text-[10px] sm:text-xs">
              <span className="flex items-center gap-2 text-yellow-300"><Crown className="h-4 w-4" /> HERO · LV 07</span>
              <span className="flex gap-1 text-red-400">
                {[0, 1, 2].map((i) => <Heart key={i} className="h-4 w-4 fill-current" />)}
              </span>
            </div>
            <div className="mt-4 border-4 border-white bg-[#1a0a05] p-1">
              <div className="xp-segments h-5 w-[72%] bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500" />
            </div>
            <div className="mt-3 flex justify-between text-[9px] text-orange-200 sm:text-[10px]">
              <span>XP 1440 / 2000</span>
              <span className="text-yellow-300">560 TO NEXT LV</span>
            </div>
          </div>
        </main>

        {/* Quests */}
        <section className="relative z-10 mx-auto max-w-6xl px-4 pb-16">
          <h2 className="mb-8 text-center text-lg text-orange-300 sm:text-2xl" style={{ textShadow: "3px 3px 0 #000" }}>
            ★ CHOOSE YOUR QUEST ★
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {QUESTS.map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="pixel-box p-5 transition-transform duration-100 hover:-translate-y-2">
                <div className="mb-4 grid h-14 w-14 place-items-center border-4 border-white" style={{ background: color }}>
                  <Icon className="h-7 w-7 text-[#1a0a05]" />
                </div>
                <h3 className="mb-3 text-xs sm:text-sm" style={{ color }}>{title}</h3>
                <p className="text-[10px] leading-[2] text-orange-100">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Rank ladder */}
        <section className="relative z-10 mx-auto max-w-5xl px-4 pb-16">
          <h2 className="mb-8 text-center text-lg text-amber-300 sm:text-2xl" style={{ textShadow: "3px 3px 0 #000" }}>
            RANK LADDER
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {RANKS.map((r, i) => (
              <div key={r.name} className="pixel-box p-4 text-center" style={{ borderColor: r.color }}>
                <div className="mb-2 text-[9px] text-orange-300/80">RANK {i + 1}</div>
                <div className="mb-3 flex justify-center gap-1" style={{ color: r.color }}>
                  {Array.from({ length: i + 1 }).map((_, k) => <Star key={k} className="h-4 w-4 fill-current" />)}
                </div>
                <div className="text-[9px] sm:text-[10px]" style={{ color: r.color }}>{r.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* How to play */}
        <section className="relative z-10 mx-auto max-w-4xl px-4 pb-16">
          <div className="pixel-box p-6">
            <h2 className="mb-6 text-center text-sm text-yellow-300 sm:text-lg">HOW TO PLAY</h2>
            <ol className="space-y-5 text-[10px] leading-[2] sm:text-xs">
              <li className="flex gap-3"><Target className="h-5 w-5 shrink-0 text-amber-300" /> 1. CREATE A TRACK FOR ANY GOAL</li>
              <li className="flex gap-3"><Flame className="h-5 w-5 shrink-0 text-orange-400" /> 2. COMPLETE TASKS, EARN XP, KEEP YOUR STREAK</li>
              <li className="flex gap-3"><Trophy className="h-5 w-5 shrink-0 text-red-400" /> 3. LEVEL UP AND CLAIM YOUR RANK</li>
            </ol>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative z-10 px-4 pb-24 text-center">
          <p className="mb-6 text-xs leading-[2] text-yellow-300 sm:text-sm">YOUR ADVENTURE AWAITS, HERO.</p>
          <button onClick={() => route.push("/signup")} className="pixel-btn bg-gradient-to-b from-orange-400 to-red-600 px-6 py-4 text-sm">
            ▶ BEGIN QUEST
          </button>
        </section>
      </div>
    </ThemeProvider>
  );
}
