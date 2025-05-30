// src/components/roles/CommanderDashboard.tsx

import { CreateTask } from '@role-components/commander/CreateTask';
import { CommandList } from '@role-components/commander/CommandList';
import { ManageTask } from '@role-components/commander/ManageTask';
import { ViewTaskComments } from '@role-components/commander/ViewTaskComments';
import { Layout } from '@components/layout/Layout';


export const CommanderDashboard = () => {

  const tabs = [
    { id: 'create_task', text: 'Создание задачи' },
    { id: 'view-command-list', text: 'Просмотр списка экипажа' },
    { id: 'task-manage', text: 'Управление задачами' },
    { id: 'view-task-comments', text: 'Просмотр комментариев к задачам' }
  ];

  const components = {
    'create_task': CreateTask,
    'view-command-list': CommandList,
    'task-manage': ManageTask,
    'view-task-comments': ViewTaskComments,
  };

  return (
    <Layout 
      title='Панель командира'
      tabs={tabs}
      defaultTab='view-command-list'
      components={components}
    />
  );
};