"use client";
import { ThemeProvider } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { verifySession } from "@/lib/session";
import { motion, useAnimationControls } from "framer-motion";
import { Sparkles, Sword, Trophy, Star, Gamepad, ArrowRight } from "lucide-react";

export default function Home() {
  const route = useRouter();
  const controls = useAnimationControls();

  useEffect(() => {
    const checkSession = async () => {
      const session = await verifySession();
      if (session?.userId != null) {
        route.push("/home");
      }
    };
    checkSession();

    // Start the floating animation for the level indicator
    controls.start({
      y: [0, -10, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    });
  }, []);

  return (
    <ThemeProvider>
      <div className="relative min-h-screen w-full bg-gradient-to-br from-red-100 via-orange-100 to-yellow-100 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-2 w-2 rounded-full bg-orange-400/20"
              animate={{
                x: [Math.random() * 100, Math.random() * 100],
                y: [Math.random() * 100, Math.random() * 100],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>

        {/* Navigation Bar */}
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="fixed top-0 left-0 right-0 p-4 z-50"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-end gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium shadow-lg hover:shadow-orange-300/50 transition-shadow"
                onClick={() => route.push("/signup")}
              >
                Sign up
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-white text-orange-600 rounded-lg font-medium shadow-lg hover:shadow-orange-300/50 transition-shadow border border-orange-200"
                onClick={() => route.push("/login")}
              >
                Login
              </motion.button>
            </div>
          </div>
        </motion.nav>

        {/* Main Content */}
        <div className="relative flex flex-col items-center justify-center min-h-screen px-4 py-20">
          {/* Level Indicator */}
          <motion.div
            animate={controls}
            className="mb-8"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl flex items-center gap-2"
            >
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-orange-600 font-semibold">Level Up Your Skills</span>
              <Star className="w-5 h-5 text-yellow-500" />
            </motion.div>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <motion.h1
              className="text-4xl sm:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-red-600 to-orange-600"
              whileHover={{ scale: 1.05 }}
            >
              Learn. Level Up. Lead.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl text-orange-700/80 max-w-2xl mx-auto"
            >
              Transform your learning journey into an epic adventure. Gain experience, unlock achievements, and master new skills.
            </motion.p>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-orange-300/50 transition-shadow flex items-center gap-2 group"
              onClick={() => route.push("/signup")}
            >
              Start Your Journey
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.span>
            </motion.button>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            {[
              { icon: <Trophy className="w-6 h-6" />, title: "Earn XP", desc: "Complete challenges to gain experience" },
              { icon: <Sword className="w-6 h-6" />, title: "Master Skills", desc: "Level up your abilities through practice" },
              { icon: <Sparkles className="w-6 h-6" />, title: "Unlock Achievements", desc: "Collect badges and rewards" }
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-orange-100"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-4"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-bold text-orange-900 mb-2">{feature.title}</h3>
                <p className="text-orange-600/80">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </ThemeProvider>
  );
}
