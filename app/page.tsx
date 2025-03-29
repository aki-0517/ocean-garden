"use client"

import { useState } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { TouchBackend } from "react-dnd-touch-backend"
import AquariumView from "@/components/aquarium-view"
import ProjectPanel from "@/components/project-panel"
import ProjectDetailModal from "@/components/project-detail-modal"
import { useMobile } from "@/hooks/use-mobile"
import type { Project } from "@/lib/types"
import {
  ConnectButton,
  useCurrentAccount,
  useSuiClient,
  useAccounts,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit"
import { Transaction } from "@mysten/sui/transactions"

// Sample data for projects with official logos for project icons
// and custom images for theme animals.
const sampleProjects: Project[] = [
  {
    id: "1",
    name: "Bluefin",
    progress: 65,
    level: 2,
    maxLevel: 5,
    themeAnimal: {
      id: "bluefin",
      name: "Bluefin",
      image: "/logos/bluefin.webp",
      position: { x: 50, y: 50 },
      level: 2,
      maxLevel: 5,
      icon: "/animals/blufin1.png",
      icon2: "/animals/blufin2.png",
    },
    targetTransactions: 100,
    currentTransactions: 65,
    accentColor: "#4ECDC4",
  },
  {
    id: "2",
    name: "Walrus",
    progress: 30,
    level: 1,
    maxLevel: 5,
    themeAnimal: {
      id: "walrus",
      name: "Walrus",
      image: "/logos/walrus.png",
      position: { x: 300, y: 100 },
      level: 1,
      maxLevel: 5,
      icon: "/animals/walrus2.png",
      icon2: "/animals/walrus1.png",
    },
    targetTransactions: 100,
    currentTransactions: 30,
    accentColor: "#FF6B6B",
  },
  {
    id: "3",
    name: "Cetus",
    progress: 90,
    level: 4,
    maxLevel: 5,
    themeAnimal: {
      id: "cetus",
      name: "Cetus",
      image: "/logos/cetus.webp",
      position: { x: 450, y: 50 },
      level: 4,
      maxLevel: 5,
      icon: "/animals/cetus1.png",
      icon2: "/animals/cetus2.webp",
    },
    targetTransactions: 100,
    currentTransactions: 90,
    accentColor: "#9D8DF1",
  },
  {
    id: "4",
    name: "Haedal",
    progress: 45,
    level: 2,
    maxLevel: 5,
    themeAnimal: {
      id: "haedal",
      name: "Haedal",
      image: "/logos/haedal.webp",
      position: { x: 600, y: 150 },
      level: 2,
      maxLevel: 5,
      icon: "/animals/haedal1.png",
      icon2: "/animals/haedal2.jpeg",
    },
    targetTransactions: 100,
    currentTransactions: 45,
    accentColor: "#F9C80E",
  },
  {
    id: "5",
    name: "Scallop",
    progress: 10,
    level: 1,
    maxLevel: 5,
    themeAnimal: {
      id: "scallop",
      name: "Scallop",
      image: "/logos/scallop.webp",
      position: { x: 150, y: 200 },
      level: 1,
      maxLevel: 5,
      icon: "/animals/scallop1.png",
      icon2: "/animals/scallop2.png",
    },
    targetTransactions: 100,
    currentTransactions: 10,
    accentColor: "#F86624",
  },
]

export default function Home() {
  const [projects, setProjects] = useState<Project[]>(sampleProjects)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [txDigest, setTxDigest] = useState<string>("")
  const isMobile = useMobile()
  const dndBackend = isMobile ? TouchBackend : HTML5Backend

  // @mysten/dapp-kit hooks
  const currentAccount = useCurrentAccount()
  const accounts = useAccounts()
  const client = useSuiClient()
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction()

  // ドラッグ＆ドロップで水槽内の動物を移動したときの処理
  const handleAnimalMove = (
    animalId: string,
    position: { x: number; y: number }
  ) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.themeAnimal.id === animalId
          ? {
              ...project,
              themeAnimal: {
                ...project.themeAnimal,
                position,
              },
            }
          : project
      )
    )
  }

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project)
  }

  const handleCloseModal = () => {
    setSelectedProject(null)
  }

  // Send Transaction ボタン押下時の空トランザクション送信処理
  const handleSendTransaction = () => {
    const tx = new Transaction() // 空のトランザクション
    signAndExecuteTransaction(
      {
        transaction: tx,
        chain: "sui:devnet",
      },
      {
        onSuccess: async (result) => {
          console.log("Transaction executed", result)
          try {
            const txDetails = await client.waitForTransaction({
              digest: result.digest,
              options: {
                showEffects: true,
                showEvents: true,
              },
            })
            setTxDigest(txDetails.digest)
          } catch (err) {
            console.error("waitForTransaction error", err)
          }
        },
        onError: (error) => {
          console.error("signAndExecute error", error)
        },
      }
    )
  }

  // ウォレット未接続の場合は「Connect Wallet」画面を表示
  if (!currentAccount) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-400 to-teal-500">
        <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Ocean DeFi Garden
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Please connect your wallet to continue.
          </p>
          <div className="flex justify-center">
            <ConnectButton connectText="Connect Wallet" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <DndProvider backend={dndBackend}>
      <div className="relative flex flex-col h-screen bg-gradient-to-b from-blue-800 to-blue-100">
        {/* 右上にウォレット情報を表示 */}
        <div className="absolute top-4 right-4 p-4 rounded shadow-lg z-50">
          <ConnectButton connectText="Connect Wallet" />
        </div>

        {/* 水槽エリアを枠付きで可愛くラップ */}
        <div className="flex-grow h-4/5 relative p-4">
          <div className="h-full border-4 border-blue-500 rounded-2xl shadow-inner bg-white">
            <AquariumView projects={projects} onAnimalMove={handleAnimalMove} />
          </div>
          {/* 水槽の右下に Send Transaction ボタンを配置（デザイン変更済み） */}
          <button
            onClick={handleSendTransaction}
            className="absolute bottom-12 right-12 px-8 py-4 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 text-white font-bold text-lg shadow-lg hover:scale-105 transition transform duration-200"
          >
            Save
          </button>
          {/* トランザクション送信結果の表示 */}
          {txDigest && (
            <p className="absolute bottom-20 right-6 bg-white bg-opacity-90 p-2 rounded shadow text-sm">
              Tx Digest: {txDigest}
            </p>
          )}
        </div>

        {/* 下部のプロジェクト一覧エリア */}
        <div className="h-1/3 bg-white border-t border-blue-200 shadow-inner overflow-auto p-4">
          <ProjectPanel projects={projects} onSelectProject={handleSelectProject} />
        </div>

        {/* プロジェクト詳細モーダル */}
        {selectedProject && (
          <ProjectDetailModal project={selectedProject} onClose={handleCloseModal} />
        )}
      </div>
    </DndProvider>
  )
}
