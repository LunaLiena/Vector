
import { useMemo, useState, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, FirstDataRenderedEvent, GridSizeChangedEvent } from 'ag-grid-community';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import {  Icon, Spin } from '@gravity-ui/uikit';
import {localeText} from '@utils/RU_locale_agrid';
import ArchiveIcon from '@gravity-ui/icons/svgs/archive.svg';
import { useUsers } from '@hooks/useUsers';
import { useStatuses } from '@hooks/useStatuses';
ModuleRegistry.registerModules([AllCommunityModule]);

const REFRESH_INTERVAL = 30_000;



const CustomFilterIcon = () => (
  <span style={{display:'inline-block', width:14,height:14}}>
    <svg viewBox='0 0 24 24' fill='orange' width={14} height={14}>
      <path d="M3 4h18v2H3zm4 7h10v2H7zm2 7h6v2H9z" />
    </svg>
  </span>
);

export const CommandList = () => {
  const [pageSize] = useState(5);

  const {users,error:usersError,isLoading:isLoadingUsers,mutate:refreshUsers,} = useUsers({refreshInterval:REFRESH_INTERVAL});
  const {statuses,error:statusesError,isLoading:isLoadingStatuses,mutate:refreshStatuses} = useStatuses({refreshInterval:REFRESH_INTERVAL});

  const isLoading = isLoadingStatuses || isLoadingUsers;
  const error = usersError || statusesError;

  const columnDefs: Array<ColDef> = useMemo(() => [
    { field: 'username', headerName: 'Имя', sortable: true, filter: 'agTextColumnFilter',minWidth:150 },
    { field: 'role', headerName: 'Роль', sortable: true, filter: 'agTextColumnFilter', valueGetter: (params) => params.data.role.name ?? '--', minWidth: 150 },
    {
      field: 'status', headerName: 'Статус', filter: 'agTextColumnFilter', minWidth: 150,
      valueGetter: (params) => {
        return params.data.status?.status_name ?? 'Статус не задан';
      }, 
    },
    { field: 'online', headerName: 'В сети', sortable: true, filter: 'agSetColumnFilter', cellRenderer: (params) => { return params.value ? '🟢 В сети' : '🟠 не в сети'; }, minWidth: 150 },
  ], []);

  const onGridSizeChanged = useCallback((params: GridSizeChangedEvent) => {
    params.api.sizeColumnsToFit();
  }, []);

  const onFirstDataRendered = useCallback((params: FirstDataRenderedEvent) => {
    params.api.sizeColumnsToFit();
  }, []);

  const refreshData = useCallback(()=>{
    refreshUsers();
    refreshStatuses();
  },[refreshUsers,refreshStatuses]);

  if (isLoading || !users || !statuses){
    <Spin size='xl'/>;
  }


  if (error) {
    return <div style={{ color: 'red' }}>{error.message ?? 'ошибка загрузки данных'}</div>;
  }

  console.log('users in command List:',users);
  return (
    <div style={{ width: '100%', height: '100%', }}>
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
          paginationPageSizeSelector={[10,20,50]}
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
          overlayNoRowsTemplate='Нет данных о пользователях'
          overlayLoadingTemplate='Загрузка...'
        />
      </div>
    </div>
  );
};
