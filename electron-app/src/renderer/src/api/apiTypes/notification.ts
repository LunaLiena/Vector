
export type Notification ={
  id:string;
  userId:string;
  title:string;
  message:string;
  type:'normal' | 'info' | 'success' | 'warning' | 'danger' | 'utility';
  isRead:boolean;
  createdAt:string;
  duration?:number;
}