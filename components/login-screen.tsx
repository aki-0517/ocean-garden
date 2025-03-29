"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Waves } from "lucide-react"

interface LoginScreenProps {
  onLogin: () => void
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = () => {
    setIsLoading(true)
    // Simulate login process
    setTimeout(() => {
      onLogin()
    }, 1500)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-400 to-teal-500">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white bg-opacity-90 p-10 rounded-2xl shadow-xl max-w-md w-full"
      >
        <div className="flex flex-col items-center justify-center space-y-6">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.5,
              type: "spring",
              stiffness: 200,
            }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center"
          >
            <Waves className="w-12 h-12 text-white" />
          </motion.div>

          <h1 className="text-3xl font-bold text-center text-gray-800">Ocean DeFi Garden</h1>
          <p className="text-gray-600 text-center">Explore your interactive DeFi aquarium</p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full py-3 px-6 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-70"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Entering...
              </div>
            ) : (
              "Enter"
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

