import React from 'react'
import { motion } from 'framer-motion'
import { cn } from "@/lib/utils"

export const GridBeam: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <div
    className={cn(
      'relative w-full h-full',
      className
    )}
    style={{
      backgroundColor: "#F8F4EC",
      backgroundImage: `
        linear-gradient(to right, rgba(255,162,57,0.3) 1px, transparent 0.5px),
        linear-gradient(to bottom, rgba(255,162,57,0.3) 1px, transparent 0.5px)
      `,
      backgroundSize: "30px 30px",
    }}
  >
    <Beam />
    {children}
  </div>
)

export const Beam = () => {
  return (
    <svg
      width="156"
      height="63"
      viewBox="0 0 156 63"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute top-0 left-0 ml-24 mt-8 pointer-events-none"
    >
      <path
        d="M31 .5h32M0 .5h32m30 31h32m-1 0h32m-1 31h32M62.5 32V0m62 63V31"
        stroke="url(#grad1)"
        strokeWidth={1.5}
      />
      <defs>
        <motion.linearGradient
          id="grad1"
          variants={{
            initial: {
              x1: '40%',
              x2: '50%',
              y1: '160%',
              y2: '180%',
            },
            animate: {
              x1: '0%',
              x2: '10%',
              y1: '-40%',
              y2: '-20%',
            },
          }}
          animate="animate"
          initial="initial"
          transition={{
            duration: 1.8,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'linear',
            repeatDelay: 2,
          }}
        >
          {/* Warm theme stops */}
          <stop stopColor="#FFA239" stopOpacity="0" />
          <stop stopColor="#FFA239" stopOpacity="0.8" />
          <stop offset="0.5" stopColor="#FFB96B" stopOpacity="0.6" />
          <stop offset="1" stopColor="#FFA239" stopOpacity="0" />
        </motion.linearGradient>
      </defs>
    </svg>
  )
}
