import { Task } from '@services/taskService';
import { Button,DropdownMenu,Icon } from '@gravity-ui/uikit';
import { AgGridReact } from 'ag-grid-react';
import { TrashBin } from '@gravity-ui/icons'; 
import type { ColDef,ICellRendererParams } from 'ag-grid-community';
import { useCallback, useMemo, useState } from 'react';
import { localeText } from '@utils/RU_locale_agrid';


export const ManageTask = () =>{

  const [rowData,setRowData] = useState<Array<Task>>([
    {
      id: 1,
      title: 'Обновление системы навигации',
      description: 'Провести апгрейд ПО навигационного модуля',
      assignedTo:3,
      dueDate: new Date(2024,3,15).toString(),
      statusId:1,
      createdBy:5,
    },
    {
      id: 2,
      title: 'Проверка герметичности',
      description: 'Тестирование модуля жизнеобеспечения',
      dueDate: new Date(2024,3,20).toString(),
      statusId:1,
      createdBy:5,
      assignedTo:3,
    }
  ]);

  const deleteHandler = useCallback((id:number)=>{
    setRowData(prev=>prev.filter(task=>task.id !== id));
  },[]);

  const columnDefs: Array<ColDef<Task>> = useMemo(() => [
    {
      headerName: 'Название',
      field: 'title',
      filter: 'agTextColumnFilter',
      sortable: true,
    },
    {
      headerName: 'Описание',
      field: 'description',
      flex: 2,
      tooltipField: 'description'
    },
    {
      headerName: 'Ответственный',
      field: 'assignedTo',
      filter: 'agSetColumnFilter',
      
    },
    {
      headerName: 'Срок выполнения',
      field: 'dueDate',
      filter: 'agDateColumnFilter',
      valueFormatter: params =>
        new Date(params.value).toLocaleDateString('ru-RU')
    },
    {
      headerName: 'Статус',
      field: 'status',
      filter: 'agSetColumnFilter',
      cellStyle: params => ({
        color: params.value === 'Завершена' ? 'green' :
          params.value === 'В работе' ? 'orange' : 'gray'
      })
    },
    {
      headerName: 'Действия',
      cellRenderer: (params: ICellRendererParams<Task>) => (
        
        <DropdownMenu items={[{
          action:()=>deleteHandler(params.data!.id),
          iconStart:<Icon data={TrashBin} size={16} />,
          theme:'danger',
          text:'Удалить'
        }

          
        ]} />
      ),
      sortable: false,
      filter: false
    }
  ], [deleteHandler]);

  const defaultColDef = useMemo(() => ({
    flex: 1,
    resizable: true,
    filter: true,
    floatingFilter: true,
  }), []);

  return(
    <div
      className="ag-theme-alpine"
      style={{
        width: '100%',
        boxSizing: 'border-box'
      }}
    >      <h2 style={{ color: '#fff', marginBottom: 12 }}>👨‍🚀 Задачи</h2>

      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        domLayout='autoHeight'
        rowSelection='single'
        animateRows={true}
        suppressMenuHide={false}
        enableBrowserTooltips={true}
        paginationPageSize={10}
        localeText={localeText}
      />
    </div>
  );
};