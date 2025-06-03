import { Button, TextArea } from '@gravity-ui/uikit';

export interface CreateCommentAreaProps {
  replyToId:number | null;
  newComment:string;
  setNewComment:(e:React.SetStateAction<string>)=>void;
  handleSubmitComment:()=>Promise<void>;
  setReplyToId: (value: React.SetStateAction<number | null>) => void;
  isSubmitting:boolean;

}

export const CreateCommentArea = (props:CreateCommentAreaProps) =>{

  return(
    <div style={{ marginTop: 16 }}>
      <TextArea
        placeholder={props.replyToId ? 'Ответ на комментарий...' : 'Новый комментарий...'}
        value={props.newComment}
        onChange={(e) => props.setNewComment(e.target.value)}
        minRows={3}
        style={{ marginBottom: 8 }}
      />
      <div style={{ display: 'flex', gap: 8 }}>
        <Button
          size="m"
          view="action"
          onClick={props.handleSubmitComment}
          loading={props.isSubmitting}
          disabled={!props.newComment.trim()}
        >
          Отправить
        </Button>
        {props.replyToId && (
          <Button
            size="m"
            view="flat-secondary"
            onClick={() => props.setReplyToId(null)}
          >
            Отменить ответ
          </Button>
        )}
      </div>
    </div>
  );
};