
import { useMemo, useState, useCallback, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, FirstDataRenderedEvent, GridSizeChangedEvent } from 'ag-grid-community';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import '@styles/table/index.css';
import { User } from '@api-types/user';
import { UserService } from '@services/userService';
import { ArrowToggle, Icon, Spin } from '@gravity-ui/uikit';
import { Task, TaskService } from '@services/taskService';
import {localeText} from '@utils/RU_locale_agrid';
import ArchiveIcon from '@gravity-ui/icons/svgs/archive.svg';
ModuleRegistry.registerModules([AllCommunityModule]);

interface UserRow {
  id: number;
  name: string;
  role: string;
  task?: string;
  online: boolean;
}



const users: UserRow[] = [
  { id: 1, name: 'Alice', role: 'commander', task: 'Inspect module A', online: true },
  { id: 2, name: 'Bob', role: 'engineer', task: '', online: false },
  { id: 3, name: 'Charlie', role: 'admin', task: 'System diagnostics', online: true },
  { id: 4, name: 'Dave', role: 'earth-ops', task: '', online: false },
  { id: 5, name: 'Eva', role: 'engineer', task: 'Repair solar array', online: true },
];

interface TableProps  {
  id:number;
  name:string;
  role:string;
  task:string;
  online:boolean;
};

const CustomFilterIcon = () => (
  <span style={{display:'inline-block', width:14,height:14}}>
    <svg viewBox='0 0 24 24' fill='orange' width={14} height={14}>
      <path d="M3 4h18v2H3zm4 7h10v2H7zm2 7h6v2H9z" />
    </svg>
  </span>
);

export const CommandList = () => {
  const [pageSize] = useState(5);
  const [users,setUsers] = useState<Array<User>>([]);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState<string | null>(null);


  const columnDefs: ColDef[] = useMemo(() => [
    { field: 'username', headerName: 'Имя', sortable: true, filter: 'agTextColumnFilter' },
    { field: 'role', headerName: 'Роль', sortable: true, filter: 'agTextColumnFilter',valueGetter:(params)=>params.data.role.name ?? '--', },
    { field: 'status', headerName: 'Статус', filter: 'agTextColumnFilter', valueGetter: (params) => params.data.status?.statusName ?? '—', },
    { field: 'online', headerName: 'В сети',  sortable: true, filter: 'agSetColumnFilter', cellRenderer: (params) => { return params.value ? '🟢 В сети' : '🟠 не в сети'; } },
  ], []);

  const onGridSizeChanged = useCallback((params: GridSizeChangedEvent) => {
    params.api.sizeColumnsToFit();
  }, []);

  const onFirstDataRendered = useCallback((params: FirstDataRenderedEvent) => {
    params.api.sizeColumnsToFit();
  }, []);

  useEffect(()=>{
    const fetchData = async () =>{
      try{
        setLoading(true);
        setError('');

        const [users] = await Promise.all([
          UserService.getAllUsers().catch(err=>{
            setError(`Error with user service: ${err}`);
            return [];
          })
        ]);
        setUsers(users);
      }catch(err){
        console.error('Failed to fetch data:',err);
        setError('Failed to load users.Please try again.');
      }finally{
        setLoading(false);
      }
    };

    fetchData();
  },[]);

  if (loading){
    <Spin />;
  }

  return (
    <div style={{ width: '100%', height: '100%', padding: '16px' }}>
      <h2 style={{ color: '#fff', marginBottom: 12 }}><Icon data={ArchiveIcon} size={3}/> Пользователи</h2>
      <div
        style={{
          width: '100%',
          border: '1px solid rgb(255,190,92)',
          borderRadius: 12,
          backgroundColor: 'transparent',
          color:'#fff',
          fontFamily:'sans-serif'
        }}
      >
        <AgGridReact
          localeText={localeText}
          rowData={users}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={pageSize}
          domLayout="autoHeight"
          onGridSizeChanged={onGridSizeChanged}
          onFirstDataRendered={onFirstDataRendered}
          animateRows={true}
          suppressMenuHide={false}
          enableBrowserTooltips={true}
          components={{
            filterIcon:CustomFilterIcon,
          }}
          gridOptions={{
            icons:{
              filter: '<span>🔽</span>', // запасной способ, если не SVG
              menu: '<span style="color: orange">☰</span>',
              first: '<span>⏮️</span>',
              last: '<span>⏭️</span>',
              next: '<span>➡️</span>',
              previous: '<span>⬅️</span>',
            }
          
          }}
        />
      </div>
     
    </div>
  );
};
