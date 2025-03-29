"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Project } from "@/lib/types"

interface ProjectPanelProps {
  projects: Project[]
  onSelectProject: (project: Project) => void
}

export default function ProjectPanel({ projects, onSelectProject }: ProjectPanelProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" })
    }
  }

  return (
    <div className="relative h-full py-3 px-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">DeFi Projects</h2>

      <div className="relative">
        {/* Scroll buttons */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-80 rounded-full p-1 shadow-md"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-80 rounded-full p-1 shadow-md"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>

        {/* Scrollable container */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-2 px-6 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onClick={() => onSelectProject(project)} />
          ))}
        </div>
      </div>
    </div>
  )
}

interface ProjectCardProps {
  project: Project
  onClick: () => void
}

function ProjectCard({ project, onClick }: ProjectCardProps) {
  const isCompleted = project.progress >= 100

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex-shrink-0 w-48 bg-white rounded-xl shadow-md overflow-hidden mr-4 cursor-pointer transition-all duration-300 border-2`}
      style={{ borderColor: isCompleted ? project.accentColor : "transparent" }}
    >
      <div className="p-4">
        <div className="flex items-center mb-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
            style={{ backgroundColor: `${project.accentColor}20` }}
          >
            <img
              src={project.themeAnimal.image || "/placeholder.svg"}
              alt={project.themeAnimal.name}
              className="w-6 h-6 object-contain"
            />
          </div>
          <div>
            <h3 className="font-medium text-gray-800">{project.name}</h3>
            <p className="text-xs text-gray-500">
              Level {project.level}/{project.maxLevel}
            </p>
          </div>
        </div>

        <div className="mb-1 flex justify-between text-xs">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium" style={{ color: project.accentColor }}>
            {project.progress}%
          </span>
        </div>

        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${project.progress}%`,
              background: `linear-gradient(90deg, ${project.accentColor}80, ${project.accentColor})`,
            }}
          />
        </div>
      </div>
    </motion.div>
  )
}

