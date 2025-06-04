
interface UserCardProps {
  id: string;
  name: string;
  taskCount: number;
  selected: boolean;
  onSelect: (id: string) => void;
}


export const UserCard:React.FC<UserCardProps> = ({id,name,taskCount,selected,onSelect}:UserCardProps) =>{
  return (
    <div
      onClick={() => onSelect(id)}
      style={{
        padding: '12px',
        border: '1px solid rgb(111, 120, 46)',
        borderRadius: '8px',
        cursor: 'pointer',
        backgroundColor: selected ? 'rgb(255,190,92)' : 'grey',
        transition: 'background-color 0.2s',
      }}
    >
      <h3 style={{ margin: 0 }}>{name}</h3>
      <p style={{ margin: '4px 0 0', color: '#fff' }}>Задач: {taskCount}</p>
    </div>
  );
};