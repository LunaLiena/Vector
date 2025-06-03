import { Card,Text } from '@gravity-ui/uikit';
import { HeaderButton, HeaderButtonProps } from '@shared/HeaderButton';
import {motion} from 'framer-motion';
import {transition} from './animation';

interface HeaderProps{
    HeaderButtonProps:HeaderButtonProps,
    textField:string;
}

export const Header = ({textField,HeaderButtonProps}:HeaderProps) =>{
  return(
    <Card view="raised" style={{padding:'16px',marginBottom:'12px',width:'100%'}}>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={transition}
      >
        <Text variant="header-1">{textField}</Text>
      </motion.div>
      <HeaderButton tabs={HeaderButtonProps.tabs} activeTab={HeaderButtonProps.activeTab} onTabChange={HeaderButtonProps.onTabChange} />
    </Card>
  );
};