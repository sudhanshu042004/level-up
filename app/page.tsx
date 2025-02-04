"use client";
import { ThemeProvider } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { verifySession } from "@/lib/session";
import { motion } from "motion/react";

export default function Home() {
  useEffect(() => {
    const checkSession = async () => {
      const session = await verifySession();
      if (session?.userId != null) {
        route.push("/home");
      }
    };
    checkSession();
  }, []);
  const route = useRouter();
  return (
    <>
      <ThemeProvider>
        <div className="relative bg-gradient-to-r from-red-100 via-orange-100 to-yellow-100 flex flex-col justify-center items-center h-screen w-screen">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="shadow-lg border-opacity-25 bg-white dark:border-opacity-100 border-[#1c1c2c] border dark:shadow-[#0c0c24] flex absolute py-2 px-4 rounded-xl top-4 justify-center gap-2 flex-row "
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="m-2 cursor-pointer hover:font-semibold bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg"
              onClick={() => route.push("/signup")}
            >
              Sign up
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="m-2 cursor-pointer hover:font-semibold bg-orange-600 hover:bg-orange-700 transition-colors duration-300 hover:shadow-lg text-white px-4 py-2 rounded-lg"
              onClick={() => route.push("/login")}
            >
              Login
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-semibold text-sm text-orange-600 sm:text-xl"
          >
            Turning Learning into Game
          </motion.div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex font-extrabold text-red-600 text-2xl sm:text-5xl lg:text-6xl"
          >
            Unlock Skills
            <motion.div
              whileHover={{ rotate: 5, scale: 1.1 }}
              className="ml-2"
              whileTap={{ rotate: 5, scale: 1.1 }}
            >
              Levelup
            </motion.div>
          </motion.div>
        </div>
      </ThemeProvider>
    </>
  );
}
