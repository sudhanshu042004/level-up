import React from 'react'
import { motion } from "motion/react"

const LoadingBall = ({ text }: { text: string }) => {
  return (
    <div className="flex h-screen w-full justify-center items-center p-8">
      <div className="flex flex-col items-center gap-4">
        <div className="">
          <motion.div
            animate={{
              translateY: [0, -80, 0],
              scaleY: [1, 0.8, 1],
              rotate: [0, 360]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: ["easeOut", "easeIn"],
            }}
          >
            <motion.div
              className="h-12 w-12 border-b-8 border-white border-t-2 rounded-full"
              animate={{
                backgroundColor: [
                  "#C4CCD4",
                  "#D2E2ED",
                  "#FEC300",
                  "#FDC2CA",
                  "#FD6325",
                  "#FDC2CA",
                  "#FEC300",
                  "#D2E2ED",
                  "#C4CCD4",
                ],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </motion.div>
        </div>
        <p className="text-gray-500 font-medium">{text}</p>
      </div >
    </div >
  );
}

export default LoadingBall
