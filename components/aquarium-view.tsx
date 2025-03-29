"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useDrop } from "react-dnd"
import DraggableAnimal from "./draggable-animal"
import type { Project } from "@/lib/types"

interface AquariumViewProps {
  projects: Project[]
  onAnimalMove: (animalId: string, position: { x: number; y: number }) => void
}

// Ocean decoration elements
const decorations = [
  { id: "seaweed1", type: "seaweed", x: "10%", y: "70%", scale: 1.2, rotation: 5 },
  { id: "seaweed2", type: "seaweed", x: "25%", y: "85%", scale: 0.9, rotation: -8 },
  { id: "seaweed3", type: "seaweed", x: "85%", y: "75%", scale: 1.1, rotation: 10 },
  { id: "coral1", type: "coral", x: "15%", y: "90%", scale: 1, rotation: 0 },
  { id: "coral2", type: "coral", x: "70%", y: "85%", scale: 1.2, rotation: 0 },
  { id: "starfish1", type: "starfish", x: "40%", y: "95%", scale: 0.8, rotation: 15 },
  { id: "starfish2", type: "starfish", x: "60%", y: "92%", scale: 0.7, rotation: -20 },
  { id: "shell1", type: "shell", x: "30%", y: "95%", scale: 0.6, rotation: 0 },
  { id: "shell2", type: "shell", x: "80%", y: "93%", scale: 0.5, rotation: 25 },
]

// Bubble animation component
const Bubbles = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(15)].map((_, i) => {
        const size = Math.random() * 20 + 10
        const left = Math.random() * 100
        const animationDuration = Math.random() * 10 + 10
        const delay = Math.random() * 15

        return (
          <motion.div
            key={i}
            className="absolute bottom-0 rounded-full bg-white bg-opacity-40"
            style={{
              width: size,
              height: size,
              left: `${left}%`,
            }}
            initial={{ y: 0, opacity: 0 }}
            animate={{
              y: -window.innerHeight,
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: animationDuration,
              delay: delay,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        )
      })}
    </div>
  )
}

// Decoration component
const Decoration = ({
  type,
  x,
  y,
  scale,
  rotation,
}: {
  type: string
  x: string
  y: string
  scale: number
  rotation: number
}) => {
  let imagePath = ""

  switch (type) {
    case "seaweed":
      imagePath = "/decorations/seaweed.svg"
      break
    case "coral":
      imagePath = "/decorations/coral.svg"
      break
    case "starfish":
      imagePath = "/decorations/starfish.svg"
      break
    case "shell":
      imagePath = "/decorations/shell.svg"
      break
    default:
      imagePath = "/decorations/seaweed.svg"
  }

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: x,
        bottom: y,
        transform: `scale(${scale}) rotate(${rotation}deg)`,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: Math.random() }}
    >
      <img src={imagePath || "/placeholder.svg"} alt={type} className="w-16 h-16 object-contain" />
    </motion.div>
  )
}

export default function AquariumView({ projects, onAnimalMove }: AquariumViewProps) {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null)

  // Set up drop target for the aquarium
  const [, drop] = useDrop({
    accept: "animal",
    drop: (item: any, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset()
      if (!delta) return

      const left = Math.round(item.position.x + delta.x)
      const top = Math.round(item.position.y + delta.y)

      // Ensure the animal stays within bounds
      const boundedLeft = Math.max(0, Math.min(containerSize.width - 100, left))
      const boundedTop = Math.max(0, Math.min(containerSize.height - 100, top))

      onAnimalMove(item.id, { x: boundedLeft, y: boundedTop })
      return undefined
    },
  })

  // Update container size on resize
  useEffect(() => {
    if (!containerRef) return

    const updateSize = () => {
      setContainerSize({
        width: containerRef.offsetWidth,
        height: containerRef.offsetHeight,
      })
    }

    updateSize()
    window.addEventListener("resize", updateSize)

    return () => {
      window.removeEventListener("resize", updateSize)
    }
  }, [containerRef])

  // Set container ref and drop ref
  const setRefs = (el: HTMLDivElement) => {
    setContainerRef(el)
    drop(el)
  }

  return (
    <div ref={setRefs} className="relative w-full h-full overflow-hidden bg-gradient-to-b from-blue-300 to-blue-500">
      {/* Ocean background with parallax effect */}
      <div className="absolute inset-0 bg-[url('/background/ocean-bg.svg')] bg-cover bg-center opacity-20" />

      {/* Decorations */}
      {decorations.map((decoration) => (
        <Decoration
          key={decoration.id}
          type={decoration.type}
          x={decoration.x}
          y={decoration.y}
          scale={decoration.scale}
          rotation={decoration.rotation}
        />
      ))}

      {/* Bubbles animation */}
      <Bubbles />

      {/* Draggable animals */}
      {projects.map((project) => (
        <DraggableAnimal key={project.id} animal={project.themeAnimal} accentColor={project.accentColor} />
      ))}

      {/* Light rays effect */}
      <div className="absolute inset-0 bg-[url('/effects/light-rays.svg')] bg-cover bg-center opacity-30 pointer-events-none" />
    </div>
  )
}

