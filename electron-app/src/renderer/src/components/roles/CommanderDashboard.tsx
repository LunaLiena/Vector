import { CreateTask } from '@role-components/commander/CreateTask';
import { CommandList } from '@role-components/commander/CommandList';
import { ManageTask } from '@role-components/commander/ManageTask';
import { ViewTaskComments } from '@role-components/commander/ViewTaskComments';
import { TaskProgress } from '@role-components/commander/TaskProgress';
import { createFabricContainer } from '@shared/TabbedContainer';

type CommanderTabId = | 'create_task' | 'view-command-list' | 'task-manage' | 'view-task-comments' | 'task-progres-complete';
const {defineTabs} = createFabricContainer<CommanderTabId>();

export const CommanderDashboard = defineTabs([
  { id: 'create_task', text: 'Создание задачи',component:CreateTask },
  { id: 'view-command-list', text: 'Просмотр списка экипажа',component:CommandList },
  { id: 'task-manage', text: 'Управление задачами',component:ManageTask },
  { id: 'view-task-comments', text: 'Просмотр комментариев к задачам',component:ViewTaskComments },
  {id:'task-progres-complete',text:'Прогресс по выполнению задач',component:TaskProgress},
]).create('Панель командира');