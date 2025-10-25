import React, { useMemo } from "react"

interface AnimatedGradientProps {
  colors: string[]
  speed?: number
  blur?: "light" | "medium" | "heavy"
}

const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const AnimatedGradient: React.FC<AnimatedGradientProps> = ({ colors, speed = 5, blur = "light" }) => {
  const randomValues = useMemo(() => {
    return colors.map(() => ({
      top: Math.random() * 50,
      left: Math.random() * 50,
      tx1: Math.random() - 0.5,
      ty1: Math.random() - 0.5,
      tx2: Math.random() - 0.5,
      ty2: Math.random() - 0.5,
      tx3: Math.random() - 0.5,
      ty3: Math.random() - 0.5,
      tx4: Math.random() - 0.5,
      ty4: Math.random() - 0.5,
      widthMultiplier: randomInt(0.5, 1.5),
      heightMultiplier: randomInt(0.5, 1.5),
    }))
  }, [colors.length])

  const circleSize = 600

  const blurClass = blur === "light" ? "blur-2xl" : blur === "medium" ? "blur-3xl" : "blur-[100px]"

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className={`absolute inset-0 ${blurClass}`}>
        {colors.map((color, index) => {
          const randomValue = randomValues[index]
          if (!randomValue) return null

          return (
            <svg
              key={index}
              className="absolute animate-background-gradient"
              style={
                {
                  top: `${randomValue.top}%`,
                  left: `${randomValue.left}%`,
                  "--background-gradient-speed": `${1 / speed}s`,
                  "--tx-1": randomValue.tx1,
                  "--ty-1": randomValue.ty1,
                  "--tx-2": randomValue.tx2,
                  "--ty-2": randomValue.ty2,
                  "--tx-3": randomValue.tx3,
                  "--ty-3": randomValue.ty3,
                  "--tx-4": randomValue.tx4,
                  "--ty-4": randomValue.ty4,
                } as React.CSSProperties
              }
              width={circleSize * randomValue.widthMultiplier}
              height={circleSize * randomValue.heightMultiplier}
              viewBox="0 0 100 100"
            >
              <circle cx="50" cy="50" r="50" fill={color} className="opacity-30" />
            </svg>
          )
        })}
      </div>
    </div>
  )
}
