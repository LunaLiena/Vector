import { CSSProperties,ReactNode } from "react";
import {motion} from 'framer-motion';
import { fadeVariants,transition } from "./animation";

interface InterfaceProviderProps{
    children:ReactNode;
    style?:CSSProperties;
    fullHeight?:boolean;
    padding?:string | number;
    gap?:string | number;
}

export const InterfaceProvider = ({
    children,
    style = {},
    fullHeight = true,
    gap = '16px'
}:InterfaceProviderProps)=>{
    const baseStyles: CSSProperties = {
        width: '98vw',
        marginTop:'12px',
        margin: '0 auto', 
        height: fullHeight ? '100vh' : 'auto',
        minHeight: fullHeight ? '100vh' : undefined,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        gap: gap,
        ...style
    };

  return (
    <motion.div 
    className="interface-provider" 
    style={baseStyles} 
    initial="initial" 
    animate="animate" 
    exit="exit" 
    variants={fadeVariants} 
    transition={transition}
    >
      {children}
    </motion.div>
  );
} 