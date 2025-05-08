import { UserManagement } from '@role-components/admin/UserManagment';
import { RoleManagement } from '@role-components/admin/RoleManagment';
import { PermissionManagement } from '@role-components/admin/PermissionManagement';
import { GenericTabbedInterface } from '@shared/GenericTabbedInterface';

const tabComponents = {
  users:<UserManagement />,
  roles:<RoleManagement />,
  permissions:<PermissionManagement />,
};

export const AdminDashboard = () => {

  const tabs = [
    {id:'users',text:'Управление экипажем'},
    {id:'roles',text:'Звания и должности'},
    {id:'permissions',text:'Права доступа'},
  ];

  return(
    <GenericTabbedInterface title='Центр управления системой' tabs={tabs} defaultTab='users'>
      {(activeTab)=>tabComponents[activeTab as keyof typeof tabComponents] || tabComponents.users}
    </GenericTabbedInterface>
  );
};