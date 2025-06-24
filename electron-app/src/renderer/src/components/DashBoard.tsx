import { Outlet } from '@tanstack/react-router'

export const DashBoard = () => {
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  )
}
