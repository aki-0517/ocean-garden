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

export default function AquariumView({ projects, onAnimalMove }: AquariumViewProps) {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null)

  const [, drop] = useDrop({
    accept: "animal",
    drop: (item: any, monitor) => {
      const clientOffset = monitor.getSourceClientOffset()
      if (!clientOffset || !containerRef) return

      const containerRect = containerRef.getBoundingClientRect()

      const halfSize = 50 // 仮に画像が 100px 四方程度だと想定

      // コンテナ基準の座標を算出
      let left = clientOffset.x - containerRect.left - halfSize
      let top = clientOffset.y - containerRect.top - halfSize

      // コンテナ内に収まるようにクリッピング
      left = Math.max(0, Math.min(containerSize.width - 100, left))
      top = Math.max(0, Math.min(containerSize.height - 100, top))

      // 新しい座標を親へ通知
      onAnimalMove(item.id, { x: left, y: top })
    },
  })

  // コンテナサイズの取得＆監視
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

  // ref と drop をまとめて設定
  const setRefs = (el: HTMLDivElement) => {
    setContainerRef(el)
    drop(el)
  }

  return (
    <div
      ref={setRefs}
      className="relative w-full h-full overflow-hidden"
      style={{
        backgroundImage: "url('/background/bg-ocean.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Ocean background (追加の背景) */}
      <div className="absolute inset-0 bg-[url('/background/bg-ocean.png')] bg-cover bg-center" />

      {/* Bubbles animation */}
      <Bubbles />

      {/* Draggable animals */}
      {projects.map((project) => (
        <DraggableAnimal
          key={project.id}
          animal={project.themeAnimal}
          accentColor={project.accentColor}
        />
      ))}

      {/* Light rays effect */}
      <div className="absolute inset-0 bg-[url('/effects/light-rays.svg')] bg-cover bg-center opacity-30 pointer-events-none" />
    </div>
  )
}
