// src/components/roles/CommanderDashboard.tsx

import {CreateTask} from '@role-components/commander/CreateTask';
import {CommandList} from '@role-components/commander/CommandList';
import {ManageTask} from '@role-components/commander/ManageTask';
import { ViewTaskComments } from '@role-components/commander/ViewTaskComments';
import { GenericTabbedInterface } from '@shared/GenericTabbedInterface';
import {ViewTaskList} from '@role-components/commander/ViewTaskList';

const tabComponent = {
  create_task:<CreateTask />,
  view_command_list:<CommandList />,
  task_manage:<ManageTask />,
  view_task_comments:<ViewTaskComments />,
  view_task_list:<ViewTaskList />,
}

export const CommanderDashboard = () => {
  
  const tabs = [
    {id:'create_task',text:'Создание задачи'},
    {id:'view_command_list',text:'Просмотр списка экипажа'},
    {id:'task_manage',text:'Управление задачами'},
    {id:'view_task_comments',text:'Просмотр комментариев к задачам'},
    {id:'view_task_list',text:'Просмотр списка задач'}
  ];

  return (
    <GenericTabbedInterface title='Панель капитана' tabs={tabs} defaultTab='create-task'>
      {(activeTab)=>tabComponent[activeTab as keyof typeof tabComponent] || tabComponent.create_task}
    </GenericTabbedInterface>
  );
};