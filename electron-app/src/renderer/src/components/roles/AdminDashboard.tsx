import { useState } from 'react';
import { UserManagement } from '@role-components/admin/UserManagment';
import { RoleManagement } from '@role-components/admin/RoleManagment';
import { PermissionManagement } from '@role-components/admin/PermissionManagement';
import { BodyContent } from '@shared/BodyContent';
import { InterfaceProvider } from '@shared/InterfaceProvider';
import { Header } from '@shared/Header';

export const AdminDashboard = () => {
  const [activeTab,setActiveTab] = useState('users');

  const renderTab = () =>{
    switch (activeTab) {
    case 'users':return <UserManagement />;
    case 'roles':return <RoleManagement />;
    case 'permissions':return <PermissionManagement />;
    default: return <UserManagement />;
    }
  };

  const tabs = [
    {id:'users',text:'Управление экипажем'},
    {id:'roles',text:'Звания и должности'},
    {id:'permissions',text:'Права доступа'},
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
  );
};