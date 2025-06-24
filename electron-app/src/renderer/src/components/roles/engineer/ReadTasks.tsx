import { useState, useEffect, useMemo, useCallback } from 'react';
import { Text, Select, Button, Modal, Card, TextInput, Icon } from '@gravity-ui/uikit';
import {
  Magnifier,
  Xmark,
  Stopwatch,
  CircleXmark,
  Clock,
  Briefcase,
  Check,
  Ban
} from '@gravity-ui/icons';
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import { Task, TaskService } from '@services/taskService';
import { BaseAgGridTable } from '@components/tables/BaseAgGridTable';
import { TaskStatus, TaskStatusService } from '@services/taskStatusService';

interface StatusIconProps {
  color: string
  icon: React.ReactNode
  text: string
}

const StatusIcon = ({ color, icon, text }: StatusIconProps) => {
  return (
    <div className="status-icon-container" style={{ display: 'flex', margin: 12 }}>
      <Text>{text}</Text>
      <span style={{ color, marginLeft: 5 }}>{icon}</span>
    </div>
  );
};

export const ReadTasks = () => {
  const [tasks, setTasks] = useState<Array<Task>>([]);
  const [taskStatus, setTaskStatus] = useState<Array<TaskStatus>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalTasks, setTotalTasks] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data - replace with actual API call in production
  useEffect(() => {
    const fetchAssignableTasks = async () => {
      try {
        setLoading(true);
        setError(null);

        const [myTasks, statusTasks] = await Promise.all([
          TaskService.getMyTasks().catch((err) => {
            setError(`error TaskService from (ReadTask): ${err}`);
            return [];
          }),
          TaskStatusService.getTaskStatuses().catch((err) => {
            setError(`Error TaskStatusService from (ReadTask): ${err}`);
            return [];
          })
        ]);

        setTasks(myTasks);
        setTaskStatus(statusTasks);
        console.log('tasks: ', myTasks);
        console.log('task status:', statusTasks);
      } catch (err) {
        console.error('Failed with assignable tasks:', err);
        setError('Failed to load assignable tasks. Please try again');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignableTasks();
  }, [page, pageSize]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || task.status?.status_name === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchTerm, statusFilter]);

  const paginatedTasks = useMemo(() => {
    return filteredTasks.slice((page - 1) * pageSize, page * pageSize);
  }, [filteredTasks, page, pageSize]);

  const statusOptions = useMemo(() => {
    const options = [{ value: 'all', content: 'Все статусы' }];
    if (taskStatus.length > 0) {
      taskStatus.forEach((status) => {
        options.push({
          value: status.status_name,
          content: status.status_name
        });
      });
    }
    return options;
  }, [taskStatus]);

  const StatusIconRenderer = useCallback(
    (params: ICellRendererParams<Task>) => {
      const statusName = params.data?.status?.status_name || 'Неизвестно';
      const status = taskStatus.find((s) => s.status_name === statusName);

      if (!status) return null;

      switch (status.status_name) {
      case 'Ожидание запуска':
        return (
          <StatusIcon
            color="var(--g-color-text-warning)"
            icon={<Icon data={Clock} size={16} />}
            text={statusName}
          />
        );
      case 'На выполнении':
        return (
          <StatusIcon
            color="var(--g-color-text-positive)"
            icon={<Icon data={Briefcase} size={16} />}
            text={statusName}
          />
        );
      case 'Отменена': // Отменено
        return (
          <StatusIcon
            color="var(--g-color-text-danger)"
            icon={<Icon data={CircleXmark} size={16} />}
            text={statusName}
          />
        );
      case 'На проверке':
        return (
          <StatusIcon
            color="var(--g-color-text-warning)"
            icon={<Icon data={Stopwatch} size={16} />}
            text={statusName}
          />
        );
      case 'Назначена':
        return (
          <StatusIcon
            color="var(--g-color-text-purple)"
            icon={<Icon data={Check} size={16} />}
            text={statusName}
          />
        );
      case 'Приостановлена':
        return (
          <StatusIcon
            color="var(--g-color-text-red)"
            icon={<Icon data={Ban} size={16} />}
            text={statusName}
          />
        );
      default:
        return <Text>{statusName}</Text>;
      }
    },
    [taskStatus]
  );

  const ActionRenderer = useCallback((params: ICellRendererParams<Task>) => {
    return (
      <Button
        view="flat"
        size="s"
        style={{
          color: '#000'
        }}
        onClick={() => {
          setSelectedTask(params.data || null);
          setIsModalOpen(true);
        }}
      >
        <Icon data={Magnifier} size={16} />
      </Button>
    );
  }, []);

  const columns: ColDef<Task>[] = useMemo(
    () => [
      {
        field: 'title',
        headerName: 'Название',
        filter: 'agSetColumnFilter',
        cellRenderer: (params: ICellRendererParams<Task>) => (
          <Text variant="subheader-2" ellipsis>
            {params.value}
          </Text>
        ),
        flex: 1
      },
      {
        field: 'description',
        headerName: 'Описание',
        width: 300,
        cellRenderer: (params: ICellRendererParams<Task>) => <Text ellipsis>{params.value}</Text>,
        flex: 1
      },
      {
        field: 'due_date',
        headerName: 'Срок выполнения',
        width: 150,
        cellRenderer: (params: ICellRendererParams<Task>) => (
          <Text>{params.value ? new Date(params.value).toLocaleDateString() : ''}</Text>
        )
      },
      {
        field: 'status',
        headerName: 'Статус',
        width: 150,
        cellRenderer: StatusIconRenderer,
        valueGetter: (params) => params.data?.status?.status_name || 'Неизвестно'
      }
    ],
    [StatusIconRenderer, ActionRenderer]
  );

  if (loading) return <Text variant="display-1">Загрузка...</Text>;
  if (error) return <Text color="danger">{error}</Text>;

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
        <TextInput
          placeholder="Поиск по названию или описанию"
          value={searchTerm}
          onUpdate={setSearchTerm}
          hasClear
        />
        <Select
          value={[statusFilter]}
          onUpdate={(vals) => setStatusFilter(vals[0])}
          options={statusOptions}
        />
      </div>

      <BaseAgGridTable<Task>
        rowData={paginatedTasks}
        columnDefs={columns}
        headerHeight={50}
        rowHeight={50}
        withPagination
        withAutoHeight
        textColor="var(--g-color-text-dark)"
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
        <Select
          value={[pageSize.toString()]}
          onUpdate={(vals) => {
            setPageSize(Number(vals[0]));
            setPage(1);
          }}
          options={[
            { value: '10', content: '10 строк' },
            { value: '20', content: '20 строк' },
            { value: '50', content: '50 строк' }
          ]}
        />
      </div>

      <Modal open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
        {selectedTask && (
          <Card view="raised" style={{ padding: 20, width: 600 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <Text variant="header-1">{selectedTask.title}</Text>
              <Button view="flat" onClick={() => setIsModalOpen(false)}>
                <Xmark />
              </Button>
            </div>

            <div style={{ marginBottom: 15 }}>
              <Text variant="subheader-2">Описание:</Text>
              <Text>{selectedTask.description}</Text>
            </div>

            <div style={{ display: 'flex', gap: 30, marginBottom: 15 }}>
              <div>
                <Text variant="subheader-2">Срок выполнения:</Text>
                <Text>{new Date(selectedTask.due_date).toLocaleDateString()}</Text>
              </div>
              <div>
                <Text variant="subheader-2">Статус:</Text>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {StatusIconRenderer({ data: selectedTask } as ICellRendererParams<Task>)}
                </div>
              </div>
            </div>
          </Card>
        )}
      </Modal>
    </div>
  );
};
