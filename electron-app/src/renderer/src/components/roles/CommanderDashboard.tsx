// src/components/roles/CommanderDashboard.tsx

import { useState } from "react";
import {CreateTask} from '@role-components/commander/CreateTask'
import {CommandList} from '@role-components/commander/CommandList'
import {ManageTask} from '@role-components/commander/ManageTask'
import { ViewTaskComments } from "@role-components/commander/ViewTaskComments";

import {InterfaceProvider} from '@shared/InterfaceProvider';
import { BodyContent } from "@shared/BodyContent";
import {Header} from '@shared/Header';


export const CommanderDashboard = () => {
  
  const [activeTab,setActiveTab] = useState('create_task');

  const renderTab = () =>{
    switch(activeTab){
    case 'create_task':return <CreateTask />
    case 'view-command-list':return <CommandList />
    case 'task-manage':return <ManageTask />
    case 'view-task-comments':return <ViewTaskComments />
  }
  }

  const tabs = [
    {id:'create_task',text:"Создание задачи"},
    {id:'view-command-list',text:"Просмотр списка экипажа"},
    {id:'task-manage',text:'Управление задачами'},
    {id:'view-task-comments',text:'Просмотр комментариев к задачам'}
  ];


  return (
    <InterfaceProvider>
      <Header textField="Панель капитана" HeaderButtonProps={{
        tabs:tabs,
        activeTab:activeTab,
        onTabChange:setActiveTab,
      }}/>
      <BodyContent key={activeTab}>
        {renderTab()}
      </BodyContent>
    </InterfaceProvider>
  );
};