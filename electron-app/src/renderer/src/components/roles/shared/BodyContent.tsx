import { CSSProperties, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { slideFadeVariants, transition } from './animation';

interface BodyContentProps {
  style?: CSSProperties;
  children: ReactNode;
  motionkey?: string | number;
}

export const BodyContent = ({ style, children, motionkey }: BodyContentProps) => {
  const defaultStyles: CSSProperties = {
    flex: 1,
    overflow: 'visible',
    width: '100%',
    position: 'relative',
    minHeight: '0',
    alignSelf: 'stretch',
  };

  return (
    <AnimatePresence>
      <motion.div
        key={motionkey}
        className="body-content"
        style={{ ...defaultStyles, ...style }}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={transition}
        variants={slideFadeVariants}
      >
        {children}
      </motion.div>
    </AnimatePresence>

  );
};