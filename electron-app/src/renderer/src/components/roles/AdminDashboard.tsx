import { UserManagement } from '@role-components/admin/UserManagment';
import { RoleManagement } from '@role-components/admin/RoleManagment';
import { PermissionManagement } from '@role-components/admin/PermissionManagement';
import { Layout } from '@components/layout/Layout';

export const AdminDashboard = () => {

  const tabs = [
    {id:'users',text:'Управление экипажем'},
    {id:'roles',text:'Звания и должности'},
    {id:'permissions',text:'Права доступа'},
  ];

  const components = {
    'users':UserManagement,
    'roles':RoleManagement,
    'permissions':PermissionManagement,
  };

  return(
    
    <Layout title='Центр управления системой' 
      tabs={tabs} 
      defaultTab='users' 
      components={components} 
    />
  );
};