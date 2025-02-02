
"use client";
import { UserTracks as UserTracks } from "@/context/UserTracks";
import "../../globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserTracks>
      <div className="h-screen w-screen" >
        {children}
      </div>
    </UserTracks>

  )
}
