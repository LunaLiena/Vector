import { Button, Icon } from "@gravity-ui/uikit";
import { useAuthStore } from "@store/authStore";
import { motion } from "framer-motion";
import { transition } from "./animation";
import {ArrowRightFromSquare} from '@gravity-ui/icons';


export interface TabButton{
    id:string;
    text:string;
}

export interface HeaderButtonProps{
    tabs:Array<TabButton>;
    activeTab:string;
    onTabChange:(tabId:string)=>void;
    
}

export const HeaderButton = ({tabs,activeTab,onTabChange}:HeaderButtonProps)=>{
  
  const {logout} = useAuthStore();

  return(        
    <div className="admin-tabs" style={{ display: 'flex', gap: '8px', marginBottom: '16px', marginTop: '16px' }}>
      {tabs.map((tab) => (
        <motion.div
          key={tab.id}
          whileHover={{scale:1.03}}
          whileTap={{scale:0.97}}
          transition={transition}
        >

        <Button
          key={tab.id}
          view={activeTab === tab.id ? 'normal' : 'flat'}
          size="l"
          onClick={() => onTabChange(tab.id)}
        >
          {tab.text}
        </Button>
        </motion.div>

      ))}
      <motion.div whileHover={{scale:1.03}} whileTap={{scale:0.97}} transition={transition}>
        <Button 
        size="l" 
        onClick={logout} 
        view="flat" 
        pin="round-round" 
        style={{marginLeft:'auto'}}
        >
        <Icon data={ArrowRightFromSquare} />
        Выход
        
        </Button>
      </motion.div>
    </div>
  )
}