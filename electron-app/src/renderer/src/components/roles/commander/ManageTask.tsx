import { Button, DropdownMenu, Icon, Spin } from '@gravity-ui/uikit';
import { AgGridReact } from 'ag-grid-react';
import { Bars, TrashBin } from '@gravity-ui/icons';
import { themeQuartz, type ColDef, type ICellRendererParams } from 'ag-grid-community';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { localeText } from '@utils/RU_locale_agrid';
import useSWR, { mutate } from 'swr';
import { UserService } from '@services/userService';
import { Task, TaskService } from '@services/taskService';
import { TaskStatusService } from '@services/taskStatusService';

const fetchData = async () => {
  try {
    const [tasks, users, statuses] = await Promise.all([
      TaskService.getTasks(),
      UserService.getAllUsers(),
      TaskStatusService.getTaskStatuses()
    ]);
    return { tasks, users, statuses };
  } catch (err) {
    console.error('Failed to fetch data:', err);
    throw err;
  }
};

const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const color =
    '#' +
    ((hash >> 24) ^ (hash >> 16) ^ (hash >> 8) ^ hash).toString(16).slice(0, 6).padStart(6, '0');
  return color;
};

export const ManageTask = () => {
  const { data, error, isLoading } = useSWR('/api/tasks-and-users', fetchData, {
    revalidateOnFocus: false
  });

  const [userMap, setUserMap] = useState<Record<number, string>>({});
  const [statusMap, setStatusMap] = useState<Record<number, string>>({});
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (data?.users) {
      const map: Record<number, string> = {};
      data.users.forEach((user) => {
        map[user.id] = user.username;
      });
      setUserMap(map);
    }
  }, [data?.users]);

  useEffect(() => {
    if (data?.statuses) {
      const map: Record<number, string> = {};
      data.statuses.forEach((status) => {
        map[status.id] = status.status_name;
      });
      setStatusMap(map);
    }
  }, [data?.statuses]);

  console.log('Tasks:', data?.tasks);
  console.log('Users:', data?.users);
  console.log('Task statuses:', data?.statuses);
  console.log('UserMap:', userMap);
  const deleteHandler = useCallback(async (id: number) => {
    setDeletingId(id);
    setDeleteError(null);
    try {
      await TaskService.deleteTask(id);
      mutate('/api/tasks-and-users');
    } catch (err) {
      setDeleteError('deleteHandler error');
      console.error('Failed to delete task:', err);
      mutate('/api/tasks-and-users');
      throw err;
    } finally {
      setDeletingId(null);
    }
  }, []);

  const columnDefs: Array<ColDef<Task>> = useMemo(
    () => [
      {
        headerName: 'Название',
        field: 'title',
        filter: 'agTextColumnFilter',
        sortable: true
      },
      {
        headerName: 'Описание',
        field: 'description',
        flex: 2,
        tooltipField: 'description'
      },
      {
        headerName: 'Ответственный',
        field: 'assigned_to',
        filter: 'agSetColumnFilter',
        filterParams: {
          values: data?.users
            ? ['Не назначен', ...data.users.map((user) => user.username)]
            : ['Не назначен']
        },
        valueGetter: (params) => {
          if (!params.data?.assigned_to) return 'Не назначен';
          const user = data?.users.find((u) => u.id === params.data?.assigned_to);

          return user ? `${user.username}` : `ID: ${params.data.assigned_to}`;
        }
      },
      {
        headerName: 'Срок выполнения',
        field: 'due_date',
        filter: 'agDateColumnFilter',
        valueFormatter: (params) =>
          params.value ? new Date(params.value).toLocaleDateString('ru-RU') : '',
        valueGetter: (params) => {
          if (!params.data?.due_date) return new Date().toDateString();
          return params.data.due_date;
        }
      },
      {
        headerName: 'Статус',
        field: 'status_id',
        filter: 'agSetColumnFilter',
        filterParams: {
          values: data?.statuses
            ? ['Не установлен', ...data.statuses.map((status) => status.status_name)]
            : ['Не установлен']
        },
        valueGetter: (params) => {
          if (!params.data?.status_id) return 'Не установлен';
          return statusMap[params.data.status_id] || `ID: ${params.data.status_id}`;
        },
        cellStyle: (params) => {
          const value = params.value;
          if (!value || value === 'Не установлен') {
            return { color: 'grey' };
          }
          return { color: stringToColor(value) };
        }
      },
      {
        headerName: 'Действия',
        cellRenderer: (params: ICellRendererParams<Task>) => (
          <div>
            {deleteError && params.data!.id === deletingId && (
              <div style={{ color: 'red' }}>{deleteError}</div>
            )}
            <DropdownMenu
              items={[
                {
                  action: () => deleteHandler(params.data!.id),
                  iconStart:
                    deletingId === params.data!.id ? (
                      <Spin size="xs" />
                    ) : (
                      <Icon data={TrashBin} size={16} />
                    ),
                  theme: 'danger',
                  text: deletingId === params.data!.id ? 'Удаление...' : 'Удалить',
                  disabled: deletingId === params.data!.id
                }
              ]}
              renderSwitcher={(props) => (
                <Button {...props} view="flat-warning">
                  <Icon size={16} data={Bars} />
                </Button>
              )}
            />
          </div>
        ),
        sortable: false,
        filter: false
      }
    ],
    [deleteHandler, data?.users, data?.statuses, statusMap]
  );

  const defaultColDef = useMemo(
    () => ({
      flex: 1,
      resizable: true,
      filter: true,
      floatingFilter: true
    }),
    []
  );

  if (isLoading || !data) {
    return <Spin size="xl" />;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error.message}</div>;
  }

  return (
    <div
      className="ag-theme-alpine-dark"
      style={{
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      <h2 style={{ color: '#fff', marginBottom: 12 }}>👨‍🚀 Задачи</h2>
      <AgGridReact
        rowData={data.tasks}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        domLayout="autoHeight"
        rowSelection="single"
        animateRows={true}
        suppressMenuHide={false}
        enableBrowserTooltips={true}
        paginationPageSize={10}
        localeText={localeText}
        overlayNoRowsTemplate="Нет данных о задачах"
        overlayLoadingTemplate="Загрузка..."
      />
    </div>
  );
};

const myTheme = themeQuartz.withParams({
  backgroundColor: 'rgb(249,245,227)',
  foregroundColor: 'rgb(46, 132, 69)',
  headerTextColor: 'rgb(204, 245, 172)',
  headerBackgroundColor: 'rgb(64, 156, 209)',
  oddRowBackgroundColor: 'rgb(0, 0, 0, 0.03)',
  headerColumnResizeHandleColor: 'rgb(126, 46, 132)'
});
