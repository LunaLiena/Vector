// src/components/shared/TabbedDashboard.tsx
import { useState } from 'react';
import { BodyContent } from '@shared/BodyContent';
import { InterfaceProvider } from '@shared/InterfaceProvider';
import { Header } from '@shared/Header';

interface Tab {
    id: string;
    text: string;
}

interface TabbedDashboardProps {
    title: string;
    tabs: Array<Tab>;
    defaultTab: string;
    components: Record<string, React.ComponentType>;
}

export interface LayoutSettings{
  tabs:Array<Record<string,string>>,
  components:Map<string,React.ComponentType>,
}

export const Layout = ({
  title,
  tabs,
  defaultTab,
  components,
}: TabbedDashboardProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const ActiveComponent = components[activeTab] || components[defaultTab];

  return (
    <InterfaceProvider>
      <Header
        textField={title}
        HeaderButtonProps={{
          tabs,
          activeTab,
          onTabChange: setActiveTab,
        }}
      />
      <BodyContent key={activeTab}>
        <ActiveComponent />
      </BodyContent>
    </InterfaceProvider>
  );
};