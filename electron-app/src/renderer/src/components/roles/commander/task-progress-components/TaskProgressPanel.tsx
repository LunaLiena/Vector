import React from 'react';
import { TaskProgressCard } from './TaskProgressCard';

interface Task{
  id:string;
  name:string;
  progress:number;
  status:'not_started' | 'in_progress'|'completed';
}

interface TaskProgressPanelProps{
  userName:string;
  tasks:Array<Task>;
}

export const TaskProgressPanel:React.FC<TaskProgressPanelProps> = ({userName,tasks}) =>{
  return(
    <div>
      <h3 style={{marginBottom:'16px'}}>{userName}</h3>
      <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
        {tasks.map(task=>(
          <TaskProgressCard 
            key={task.id}
            name={task.name}
            progress={task.progress}
            status={task.status}
          />
        ))}
      </div>
    </div>
  );
};