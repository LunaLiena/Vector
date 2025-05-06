import { CSSProperties,ReactNode } from 'react';
import {motion,AnimatePresence} from 'framer-motion';
import { slideFadeVariants,transition } from './animation';

interface BodyContentProps{
    style?:CSSProperties;
    children:ReactNode;
    motionkey?:string|number;
}

export const BodyContent = ({style,children,motionkey}:BodyContentProps)=>{
  const defaultStyles:CSSProperties = {
    flex:1,
    overflow:'auto',
    width:'100%',
    position:'relative',
  };

  return (
    <AnimatePresence>
      <motion.div 
        key={motionkey}
        className="admin-content" 
        style={{...defaultStyles,...style}} 
        initial="initial" 
        animate="animate" 
        exit="exi
                t" 
        transition={transition}
        variants={slideFadeVariants}
      >
        {children}
      </motion.div>
    </AnimatePresence>

  );
};