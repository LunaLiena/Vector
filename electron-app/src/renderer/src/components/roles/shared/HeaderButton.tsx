import { Button, Icon, DropdownMenu, TabProvider, TabList, Tab } from '@gravity-ui/uikit';
import { useAuthStore } from '@store/authStore';
import { ArrowRightFromSquare, Bars } from '@gravity-ui/icons';
import '@styles/header.css';
import React, { useEffect, useRef, useState } from 'react';
import { TabsDropdownMenu } from './header-components/TabsDropDownMenu';

export interface TabButton {
  id: string;
  text: string;
}

export interface HeaderButtonProps {
  tabs: Array<TabButton>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const HeaderButton = ({ tabs, activeTab, onTabChange }: HeaderButtonProps) => {
  const { logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const tabsWrapperRef = useRef<HTMLDivElement>(null);
  const [hiddenTabs, setHiddenTabs] = useState<Array<TabButton>>([]);

  useEffect(() => {
    const calculateVisibleTabs = () => {
      if (!containerRef.current || !tabsWrapperRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const logoutButtonWidth = 120;
      const menuButtonWidth = 50;
      const availableWidth = containerWidth - logoutButtonWidth - menuButtonWidth - 32;

      let totalWidth = 0;
      const newHiddenTabs: Array<TabButton> = [];

      tabsWrapperRef.current.querySelectorAll('.tab-button').forEach(btn => {
        (btn as HTMLElement).style.display = 'inline-block';
      });

      tabs.forEach((tab, index) => {
        const tabEl = tabsWrapperRef.current?.querySelectorAll('.tab-button')[index] as HTMLElement;
        if (tabEl) {
          const tabWidth = tabEl.offsetWidth + 8;
          if (totalWidth + tabWidth <= availableWidth) {
            totalWidth += tabWidth;
          } else {
            tabEl.style.display = 'none';
            newHiddenTabs.push(tab);
          }
        }
      });
      setHiddenTabs(newHiddenTabs);
    };

    calculateVisibleTabs();
    const resizeObserver = new ResizeObserver(calculateVisibleTabs);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [tabs]);

  const handleMenuToggle = (open: boolean) => {
    setMenuOpen(open);
  }

  return (
    <div className="header-container" ref={containerRef}>
      <div className="tabs-container" ref={tabsWrapperRef}>
        <TabProvider value={activeTab} onUpdate={onTabChange}>
          <TabList className='tab-list'>
            {tabs.map((tab) => (
              <Tab
                key={tab.id}
                value={tab.id}
                className='gravity-ui-tab'
                disabled={false}
              >
                {tab.text}
              </Tab>
            ))}
          </TabList>
        </TabProvider>
        {hiddenTabs.length > 0 && (
          <TabsDropdownMenu tabs={hiddenTabs} menuOpen={menuOpen} onMenuToggle={handleMenuToggle} onTabSelect={onTabChange} />
        )}
      </div>
      <Button
        size="l"
        onClick={logout}
        view="flat"
        pin="round-round"
        className="logout-button"
      >
        <Icon data={ArrowRightFromSquare} />
        <span className="logout-text">Выход</span>
      </Button>
    </div>
  );
};