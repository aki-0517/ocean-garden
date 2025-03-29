"use client"

import { useDrag } from "react-dnd"
import { motion } from "framer-motion"
import type { ThemeAnimal } from "@/lib/types"

interface DraggableAnimalProps {
  animal: ThemeAnimal
  accentColor: string
}

export default function DraggableAnimal({ animal, accentColor }: DraggableAnimalProps) {
  // Set up drag functionality
  const [{ isDragging }, drag] = useDrag({
    type: "animal",
    item: {
      id: animal.id,
      position: animal.position,
      image: animal.image,
      name: animal.name,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  // Calculate size based on level
  const baseSize = 60
  const sizeMultiplier = 1 + animal.level * 0.15
  const size = baseSize * sizeMultiplier

  // Calculate glow intensity based on level
  const glowOpacity = 0.2 + animal.level * 0.15

  return (
    <motion.div
      ref={drag}
      style={{
        left: animal.position.x,
        top: animal.position.y,
        width: size,
        height: size,
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
      }}
      className="absolute select-none"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
    >
      {/* Level indicator */}
      <div
        className="absolute -top-2 -right-2 rounded-full flex items-center justify-center text-xs font-bold text-white z-10"
        style={{
          backgroundColor: accentColor,
          width: "24px",
          height: "24px",
          boxShadow: `0 0 10px ${accentColor}`,
        }}
      >
        {animal.level}
      </div>

      {/* Glow effect based on level */}
      <div
        className="absolute inset-0 rounded-full blur-md -z-10"
        style={{
          backgroundColor: accentColor,
          opacity: glowOpacity,
        }}
      />

      {/* Animal image */}
      <motion.img
        src={animal.image}
        alt={animal.name}
        className="w-full h-full object-contain"
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 3,
          ease: "easeInOut",
        }}
      />

      {/* Progress indicator */}
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-full max-w-[80%]">
        <div className="h-1.5 bg-white bg-opacity-30 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${(animal.level / animal.maxLevel) * 100}%`,
              backgroundColor: accentColor,
            }}
          />
        </div>
      </div>
    </motion.div>
  )
}

