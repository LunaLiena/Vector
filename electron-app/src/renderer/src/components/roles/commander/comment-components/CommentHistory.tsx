import { Button,Text} from '@gravity-ui/uikit';
import {Comment} from '@services/commentService';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface ExtendedComment extends Comment{
  replies?: Array<Comment>;
}

export interface CommentHistoryProps {
  selectedTaskId:number|null;
  loadingComments:boolean; 
  commentsData:Array<Comment>  | undefined;
  setReplyToId: (value: React.SetStateAction<number | null>) => void
}

export const CommentHistory = (props:CommentHistoryProps) =>{

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy HH:mm', { locale: ru });
  };

  return(
    <div style={{
      maxHeight: '60vh',
      overflowY: 'auto',
      marginBottom: 12,
      border: '1px solid #444',
      borderRadius: 4,
      padding: 8
    }}>
      {(props.commentsData as ExtendedComment[])?.length ? (
        (props.commentsData as ExtendedComment[]).map((comment) => (
          <div key={comment.id} style={{
            padding: 12,
            marginBottom: 8,
            backgroundColor: '#2a2a2a',
            borderRadius: 4
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text variant="subheader-2" color="primary">
                {comment.author?.username || 'Неизвестный автор'}
              </Text>
              <Text color="secondary">
                {comment.created_at ? formatDate(comment.created_at) : ''}
              </Text>
            </div>
            <Text style={{ margin: '8px 0' }}>{comment.text}</Text>
   
            <Button
              size="s"
              view="flat-secondary"
              onClick={() => props.setReplyToId(comment.id)}
            >
                             Ответить
            </Button>
   
            {comment.replies?.map((reply) => (
              <div key={reply.id} style={{
                padding: 8,
                marginTop: 8,
                marginLeft: 16,
                backgroundColor: '#1f1f1f',
                borderRadius: 4
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text variant="subheader-3" color="primary">
                                   ↳ {reply.author?.username || 'Неизвестный автор'}
                  </Text>
                  <Text color="secondary" variant="caption-1">
                    {reply.created_at ? formatDate(reply.created_at) : ''}
                  </Text>
                </div>
                <Text variant="body-2" style={{ marginTop: 4 }}>{reply.text}</Text>
              </div>
            ))}
          </div>
        ))
      ) : (
        <Text color="secondary">Нет комментариев</Text>
      )}
    </div>
  );
};