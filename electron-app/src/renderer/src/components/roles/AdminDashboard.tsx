import { UserManagement } from '@role-components/admin/UserManagment'
import { RoleManagement } from '@role-components/admin/RoleManagment'
import { PermissionManagement } from '@role-components/admin/PermissionManagement'
import { createFabricContainer } from '@shared/TabbedContainer'

type AdminTabId = 'users' | 'roles' | 'permissions'
const { defineTabs } = createFabricContainer<AdminTabId>()

export const AdminDashboard = defineTabs([
  { id: 'users', text: 'Управление экипажем', component: UserManagement },
  { id: 'roles', text: 'Звания и должности', component: RoleManagement },
  { id: 'permissions', text: 'Права доступа', component: PermissionManagement }
]).create('Центр управления системой')
