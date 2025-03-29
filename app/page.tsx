"use client"

import { useState } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { TouchBackend } from "react-dnd-touch-backend"
import { usePreview } from "react-dnd-preview"
import LoginScreen from "@/components/login-screen"
import AquariumView from "@/components/aquarium-view"
import ProjectPanel from "@/components/project-panel"
import ProjectDetailModal from "@/components/project-detail-modal"
import { useMobile } from "@/hooks/use-mobile"
import type { Project } from "@/lib/types"

// Sample data for projects
const sampleProjects: Project[] = [
  {
    id: "1",
    name: "Ocean Swap",
    progress: 65,
    level: 2,
    maxLevel: 5,
    themeAnimal: {
      id: "dolphin",
      name: "Dolphin",
      image: "/animals/dolphin.svg",
      position: { x: 150, y: 150 },
      level: 2,
      maxLevel: 5,
    },
    targetTransactions: 100,
    currentTransactions: 65,
    accentColor: "#4ECDC4",
  },
  {
    id: "2",
    name: "Coral Lend",
    progress: 30,
    level: 1,
    maxLevel: 5,
    themeAnimal: {
      id: "turtle",
      name: "Turtle",
      image: "/animals/turtle.svg",
      position: { x: 300, y: 200 },
      level: 1,
      maxLevel: 5,
    },
    targetTransactions: 100,
    currentTransactions: 30,
    accentColor: "#FF6B6B",
  },
  {
    id: "3",
    name: "Reef Stake",
    progress: 90,
    level: 4,
    maxLevel: 5,
    themeAnimal: {
      id: "jellyfish",
      name: "Jellyfish",
      image: "/animals/jellyfish.svg",
      position: { x: 450, y: 150 },
      level: 4,
      maxLevel: 5,
    },
    targetTransactions: 100,
    currentTransactions: 90,
    accentColor: "#9D8DF1",
  },
  {
    id: "4",
    name: "Abyss Yield",
    progress: 45,
    level: 2,
    maxLevel: 5,
    themeAnimal: {
      id: "octopus",
      name: "Octopus",
      image: "/animals/octopus.svg",
      position: { x: 600, y: 250 },
      level: 2,
      maxLevel: 5,
    },
    targetTransactions: 100,
    currentTransactions: 45,
    accentColor: "#F9C80E",
  },
  {
    id: "5",
    name: "Tide Finance",
    progress: 10,
    level: 1,
    maxLevel: 5,
    themeAnimal: {
      id: "crab",
      name: "Crab",
      image: "/animals/crab.svg",
      position: { x: 200, y: 300 },
      level: 1,
      maxLevel: 5,
    },
    targetTransactions: 100,
    currentTransactions: 10,
    accentColor: "#F86624",
  },
]

// DnD Preview component
const DndPreview = () => {
  const { display, itemType, item, style } = usePreview()
  if (!display) {
    return null
  }

  return (
    <div className="fixed z-50 pointer-events-none" style={style}>
      <div className="relative opacity-70 scale-90 shadow-lg rounded-lg">
        <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-16 h-16 object-contain" />
      </div>
    </div>
  )
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [projects, setProjects] = useState<Project[]>(sampleProjects)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showSaveButton, setShowSaveButton] = useState(false)
  const [animalPositions, setAnimalPositions] = useState<Record<string, { x: number; y: number }>>({})
  const isMobile = useMobile()

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project)
  }

  const handleCloseModal = () => {
    setSelectedProject(null)
  }

  const handleAnimalMove = (animalId: string, position: { x: number; y: number }) => {
    setAnimalPositions((prev) => ({
      ...prev,
      [animalId]: position,
    }))
    setShowSaveButton(true)
  }

  const handleSaveConfiguration = () => {
    // Update projects with new animal positions
    const updatedProjects = projects.map((project) => {
      if (animalPositions[project.themeAnimal.id]) {
        return {
          ...project,
          themeAnimal: {
            ...project.themeAnimal,
            position: animalPositions[project.themeAnimal.id],
          },
        }
      }
      return project
    })

    setProjects(updatedProjects)
    setShowSaveButton(false)

    // Show save animation
    // This would be a simple animation for now
    const saveNotification = document.createElement("div")
    saveNotification.className = "fixed bottom-20 right-10 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
    saveNotification.textContent = "Configuration Saved!"
    document.body.appendChild(saveNotification)

    setTimeout(() => {
      document.body.removeChild(saveNotification)
    }, 2000)
  }

  // Choose the appropriate backend based on device
  const dndBackend = isMobile ? TouchBackend : HTML5Backend

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />
  }

  return (
    <DndProvider backend={dndBackend}>
      <div className="flex flex-col h-screen bg-gradient-to-b from-blue-50 to-blue-100">
        <div className="flex-grow h-4/5 relative">
          <AquariumView projects={projects} onAnimalMove={handleAnimalMove} />
        </div>
        <div className="h-1/5 bg-white border-t border-blue-200 shadow-inner">
          <ProjectPanel projects={projects} onSelectProject={handleSelectProject} />
        </div>

        {selectedProject && <ProjectDetailModal project={selectedProject} onClose={handleCloseModal} />}

        {showSaveButton && (
          <button
            onClick={handleSaveConfiguration}
            className="fixed bottom-24 right-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg transition-all duration-300 flex items-center space-x-2"
          >
            <span>Save Configuration</span>
          </button>
        )}

        <DndPreview />
      </div>
    </DndProvider>
  )
}

