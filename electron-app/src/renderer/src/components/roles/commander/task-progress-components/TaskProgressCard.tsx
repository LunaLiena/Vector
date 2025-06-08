import React from 'react';
import { Progress } from '@gravity-ui/uikit';

interface TaskProgressCardProps{
  name:string;
  progress:number;
  status: 'not_started' | 'in_progress' | 'completed';
}

const getStatusColor = (status:TaskProgressCardProps['status']):'danger' | 'warning' |'success'=>{
  switch(status){
  case 'not_started':return 'danger';
  case 'in_progress':return 'warning';
  case 'completed':return 'success';
  default:return 'warning';
  }
};

export const TaskProgressCard:React.FC<TaskProgressCardProps> = ({name,progress,status}) =>{
  const statusLabel = 
  status === 'completed' ? 'завершено' : status === 'in_progress' ? 'В процессе':'Не начато';
  const statusColor = 
  status === 'completed' ? 'green': status === 'in_progress' ? 'orange':'red';

  return(
    <div
      style={{
        padding: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontWeight: 500 }}>{name}</span>
        <span style={{ color: statusColor }}>{statusLabel}</span>
      </div>

      <Progress value={progress} theme={getStatusColor(status)} size="m" />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '4px',
          color: '#666',
          fontSize: '14px',
        }}
      >
        <span>Прогресс:</span>
        <span>{progress}%</span>
      </div>
    </div>
  );
};