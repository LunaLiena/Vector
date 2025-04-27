import { useState } from "react";
import { UserManagement } from "@components/roles/admin/UserManagment"
import { RoleManagement } from "@components/roles/admin/RoleManagment";
import { PermissionManagement } from "@components/roles/admin/PermissionManagement";
import { UserSupport } from "@components/roles/admin/UserSupport";
import { BodyContent } from "@shared/BodyContent";
import { InterfaceProvider } from "@shared/InterfaceProvider";
import { Header } from "@shared/Header";

export const AdminDashboard = () => {
  const [activeTab,setActiveTab] = useState('users');

  const renderTab = () =>{
    switch (activeTab) {
      case 'users':return <UserManagement />
      case 'roles':return <RoleManagement />
      case 'permissions':return <PermissionManagement />
      case 'support':return <UserSupport />
      default: return <UserManagement />
    }
  }

  const tabs = [
    {id:'users',text:'Управление экипажем'},
    {id:'roles',text:'Звания и должности'},
    {id:'permissions',text:'Права доступа'},
    {id:'support',text:'Поддержка'},
  ];


  return(
      <InterfaceProvider>
        <Header 
          textField="Центр управления системой" 
          HeaderButtonProps={{
            tabs:tabs,
            activeTab:activeTab,
            onTabChange:setActiveTab
          }} />
        <BodyContent key={activeTab}>
            {renderTab()}
        </BodyContent>
      </InterfaceProvider>
  )
};