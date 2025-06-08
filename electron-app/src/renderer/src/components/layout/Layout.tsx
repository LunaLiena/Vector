import { useState } from 'react';
import { BodyContent } from '@shared/BodyContent';
import { InterfaceProvider } from '@shared/InterfaceProvider';
import { Header } from '@shared/Header';
import React from 'react';
import { AnimatePresence } from 'framer-motion';

interface TabConfig<T extends string> {
    id: T;
    text: string;
}

interface TabbedDashboardProps<T extends string> {
    title: string;
    tabs: Array<TabConfig<T>>;
    firstComponent:React.ComponentType;
    components: Record<T, React.ComponentType>;
}

export const Layout = <T extends string>({
  title,
  tabs,
  firstComponent:FirstComponent,
  components,
}: TabbedDashboardProps<T>) => {
  const firstTabId = tabs[0].id;
  const [activeTab, setActiveTab] = useState<T>(firstTabId);


  const handleTabChange = (tabId: string) => {
    if (tabs.some(tab => tab.id === tabId)) {
      setActiveTab(tabId as T);
    }
  };

  const ActiveComponent = activeTab ? components[activeTab] : FirstComponent;

  return (
    <InterfaceProvider>
      <Header
        textField={title}
        HeaderButtonProps={{
          tabs,
          activeTab:activeTab || firstTabId,
          onTabChange: handleTabChange,
        }}
      />
      <AnimatePresence mode='wait'>
        <BodyContent key={activeTab || 'first'}>
          {ActiveComponent && React.createElement(ActiveComponent)}
        </BodyContent>
      </AnimatePresence>
    </InterfaceProvider>
  );
};