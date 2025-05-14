import { ReactNode, useState } from 'react';
import { InterfaceProvider } from './InterfaceProvider';
import { Header } from './Header';
import test from 'node:test';
import { text } from 'stream/consumers';
import { BodyContent } from './BodyContent';


interface Tab{
    id:string;
    text:string;
}

interface GenericTabbedInterfaceProps{
    title:string;
    tabs:Array<Tab>;
    defaultTab:string;
    children:(activeTab:string)=>ReactNode;
}

export const GenericTabbedInterface = ({
  title,
  tabs,
  defaultTab,
  children
}:GenericTabbedInterfaceProps)=>{
  const [activeTab,setActiveTab] = useState(defaultTab);

  return(
    <InterfaceProvider>
      <Header textField={title}
        HeaderButtonProps={{
          tabs:tabs,
          activeTab:activeTab,
          onTabChange:setActiveTab,
        }}/>
      <BodyContent key={activeTab}>
        {children(activeTab)}
      </BodyContent>
    </InterfaceProvider>
  );
};