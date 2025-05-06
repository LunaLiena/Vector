
interface StackProps{
  children:React.ReactNode;
  gap?:number;
}

export const Stack = ({children,gap=1}:StackProps) => (
  <div style={{display:'flex',flexDirection:'column',gap:`${gap}px`}}>
    {children}
  </div>
);