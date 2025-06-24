import { createFabricContainer } from '@shared/TabbedContainer';
import { ReadTasks } from '@role-components/engineer/ReadTasks';
import { StatusManage } from '@role-components/engineer/StatusManage';
import { UserRead } from '@role-components/engineer/UserRead';
import { PrivateOffice } from '@role-components/engineer/PrivateOffice';

type EngineerTabId = |'status-manage'|'user-read'|'read-tasks'|'private-office';
const {defineTabs} = createFabricContainer<EngineerTabId>();

export const EngineerDashboard = defineTabs([
  {id:'read-tasks',text:'Список задач',component:ReadTasks},
  {id:'status-manage',text:'Текущие задачами',component:StatusManage},
  {id:'user-read',text:'Список пользователей',component:UserRead},
  {id:'private-office',text:'Личный кабинет',component:PrivateOffice}
]).create('Панель инженера');