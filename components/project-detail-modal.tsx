"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronRight, Award } from "lucide-react"
import type { Project } from "@/lib/types"

interface ProjectDetailModalProps {
  project: Project
  onClose: () => void
}

export default function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  const [showPreview, setShowPreview] = useState(false)

  // Close modal on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  // Calculate next level
  const nextLevel = Math.min(project.level + 1, project.maxLevel)
  const isMaxLevel = project.level === project.maxLevel

  // Calculate size for current and next level
  const baseSize = 80
  const currentSize = baseSize * (1 + project.level * 0.15)
  const nextSize = baseSize * (1 + nextLevel * 0.15)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="p-6 flex items-center justify-between border-b"
            style={{ backgroundColor: `${project.accentColor}10` }}
          >
            <div className="flex items-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                style={{ backgroundColor: `${project.accentColor}30` }}
              >
                <img
                  src={project.themeAnimal.image || "/placeholder.svg"}
                  alt={project.themeAnimal.name}
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{project.name}</h2>
                <p className="text-gray-600 text-sm">Theme Animal: {project.themeAnimal.name}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Progress section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-700">Progress</h3>
                <span className="text-sm font-semibold" style={{ color: project.accentColor }}>
                  {project.currentTransactions}/{project.targetTransactions} Transactions
                </span>
              </div>

              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${project.progress}%`,
                    background: `linear-gradient(90deg, ${project.accentColor}80, ${project.accentColor})`,
                  }}
                />
              </div>

              <div className="flex justify-between text-xs text-gray-500">
                <span>Level {project.level}</span>
                <span>Level {project.maxLevel}</span>
              </div>
            </div>

            {/* Growth preview section */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="font-medium text-gray-700 mb-3">Growth Preview</h3>

              <div className="flex items-center justify-center">
                {/* Current level */}
                <div className="flex flex-col items-center">
                  <div
                    className="relative rounded-full flex items-center justify-center mb-2"
                    style={{
                      width: currentSize,
                      height: currentSize,
                      backgroundColor: `${project.accentColor}20`,
                    }}
                  >
                    <motion.img
                      src={project.themeAnimal.image}
                      alt={project.themeAnimal.name}
                      className="w-3/4 h-3/4 object-contain"
                      animate={{
                        y: [0, -5, 0],
                      }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 3,
                        ease: "easeInOut",
                      }}
                    />
                    <div
                      className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs font-bold shadow-sm"
                      style={{ color: project.accentColor, border: `2px solid ${project.accentColor}` }}
                    >
                      {project.level}
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">Current</span>
                </div>

                {/* Arrow */}
                <ChevronRight className="mx-4 text-gray-400" />

                {/* Next level */}
                <div className="flex flex-col items-center">
                  {isMaxLevel ? (
                    <div className="flex flex-col items-center">
                      <div
                        className="relative rounded-full flex items-center justify-center mb-2 border-2 border-dashed"
                        style={{
                          width: currentSize,
                          height: currentSize,
                          borderColor: project.accentColor,
                        }}
                      >
                        <Award className="w-1/2 h-1/2" style={{ color: project.accentColor }} />
                      </div>
                      <span className="text-sm text-gray-600">Max Level</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div
                        className={`relative rounded-full flex items-center justify-center mb-2 ${showPreview ? "bg-opacity-50" : "bg-opacity-10"} transition-all duration-500`}
                        style={{
                          width: nextSize,
                          height: nextSize,
                          backgroundColor: `${project.accentColor}${showPreview ? "40" : "10"}`,
                        }}
                      >
                        <motion.img
                          src={project.themeAnimal.image}
                          alt={project.themeAnimal.name}
                          className={`w-3/4 h-3/4 object-contain transition-opacity duration-500 ${showPreview ? "opacity-100" : "opacity-30"}`}
                          animate={
                            showPreview
                              ? {
                                  y: [0, -5, 0],
                                  scale: [1, 1.05, 1],
                                }
                              : {}
                          }
                          transition={{
                            repeat: Number.POSITIVE_INFINITY,
                            duration: 3,
                            ease: "easeInOut",
                          }}
                        />
                        <div
                          className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs font-bold shadow-sm"
                          style={{ color: project.accentColor, border: `2px solid ${project.accentColor}` }}
                        >
                          {nextLevel}
                        </div>
                      </div>
                      <span className="text-sm text-gray-600">Next Level</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
                onClick={() => window.open("#", "_blank")}
              >
                View Details
              </button>

              {!isMaxLevel && (
                <button
                  className="flex-1 py-2 px-4 text-white rounded-lg font-medium transition-colors"
                  style={{ backgroundColor: project.accentColor }}
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? "Hide Growth" : "Show Growth"}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

