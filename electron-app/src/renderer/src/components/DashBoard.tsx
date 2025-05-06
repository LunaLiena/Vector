// import { Outlet,useRouter } from "@tanstack/react-router"
// import { useAuthStore } from "@renderer/store/authStore"
import { Outlet } from '@tanstack/react-router';

export const DashBoard = ()=>{
 
    
  // const {role} = useAuthStore();
  // const router = useRouter();

  return(
    <div className="min-h-screen bg-gray-950">
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
};