"use client";
import ToggleThemeButton from "@/components/ToggleThemeButton";
import { ThemeProvider } from "@/context/ThemeContext";
import TrickyDiv from "@/components/TrickyDiv";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { verifySession } from "@/lib/session";

export default function Home() {
  useEffect(() => {
    const checkSession = async () => {
      const session = await verifySession();
      if (session?.userId != null) {
        route.push("/home")

      }
    }
    checkSession();
  }, [])
  const route = useRouter();
  return (
    <>
      <ThemeProvider>
        <div className=" relative flex flex-col justify-center items-center h-screen w-screen">
          <div className="shadow-md rounded-full absolute top-4 right-4" >
            <ToggleThemeButton />
          </div>
          <div className="shadow-lg border-opacity-25 dark:border-opacity-100 border-[#1c1c2c] border dark:shadow-[#0c0c24] h-14 w-44  flex absolute py-2 px-4 rounded-xl  top-4 justify-center" >
            <div className="m-2 cursor-pointer hover:font-semibold " onClick={() => route.push("/signup")} >
              Sign up
            </div>
            <div className="m-2 cursor-pointer hover:font-semibold " onClick={() => route.push("/login")} >
              Login
            </div>
          </div>
          <div className="font-thin text-lg " >Turning Learning into Game</div>
          <div className="flex font-bold text-2xl" >
            Unlock Skills
            {/* <div> <TrickyDiv /> </div> */}
            <div>Levelup</div>
          </div>
        </div>
      </ThemeProvider>
    </>
  );
}
