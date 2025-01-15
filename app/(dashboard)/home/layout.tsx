"use client";
import { UncompleteTracks } from "@/context/IncompleteTracks";
import "../../globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UncompleteTracks>
      <div className="h-screen w-screen" >
        {children}
      </div>
    </UncompleteTracks>

  )
}
