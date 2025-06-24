import { Card, Text } from '@gravity-ui/uikit'
import { Task } from '@services/taskService'

export interface TaskCardProps {
  taskProgressList: Array<Task>
  handleTaskSelect: (task: Task) => Promise<void>
}

export const TaskCard = (props: TaskCardProps) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
      {props.taskProgressList.map((task) => (
        <Card
          key={task.id}
          view="outlined"
          type="action"
          onClick={() => props.handleTaskSelect(task)}
          style={{
            cursor: 'pointer',
            padding: '16px'
          }}
        >
          <Text variant="subheader-2">{task.title}</Text>
          <br />
          <Text color="secondary">{task.description}</Text>
          <br />
          <Text>Срок: {new Date(task.due_date).toLocaleDateString()}</Text>
          <br />
          {task.status && (
            <div
              style={{
                marginTop: '8px',
                borderRadius: '4px',
                display: 'inline-block'
              }}
            >
              <Text>{task.status.status_name}</Text>
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}
