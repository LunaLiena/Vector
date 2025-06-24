// src/components/roles/CommanderDashboard.tsx
import { motion } from 'framer-motion'

export const GroundDashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <h1 className="text-3xl font-bold text-white mb-6">Панель командира экипажа</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div whileHover={{ y: -5 }} className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-2">Текущая миссия</h2>
          <p className="text-gray-300">Статус и детали текущей миссии</p>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-2">Состав экипажа</h2>
          <p className="text-gray-300">Информация о членах экипажа</p>
        </motion.div>
      </div>
    </motion.div>
  )
}
