import { DropdownMenu, Button, Icon } from '@gravity-ui/uikit';
import { Bars } from '@gravity-ui/icons';
import React from 'react';
import { useDropdownStyles } from '@hooks/useDropdownStyles';
import { AnimatePresence, motion } from 'framer-motion';

interface TabsDropdownMenuProps {
    tabs: Array<{
        id: string;
        text: string;
    }>;
    menuOpen: boolean;
    onMenuToggle: (open: boolean) => void;
    onTabSelect: (tabId: string) => void;
}

export const TabsDropdownMenu = ({
    tabs,
    menuOpen,
    onMenuToggle,
    onTabSelect,
}: TabsDropdownMenuProps) => {
    const { dropdownRef, buttonRef } = useDropdownStyles();

    // Стили для различных элементов
    const styles = {
        dropdownContainer: {
            position: 'relative' as const,
            zIndex: 1000,
            display: 'inline-block',
        },
        dropdownButton: {
            padding: '6px 12px',
            borderRadius: '8px',
            marginLeft: '8px',
            transition: 'all 0.2s ease',
            '&:hover': {
                backgroundColor: 'var(--g-color-base-simple-hover)',
            },
        },
        dropdownMenu: {
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            border: '1px solid var(--g-color-line-generic)',
            marginTop: '4px',
            padding: '4px 0', // Убираем стандартные отступы списка
            listStyle: 'none', // Убираем точки у списка
        },
        menuItem: {
            padding: '10px 16px',
            fontSize: '14px',
            transition: 'background-color 0.2s ease',
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: 'var(--g-color-base-simple-hover)',
            },
        },
    };

    // Анимации
    const menuVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
    };

    const buttonVariants = {
        initial: { scale: 1 },
        tap: { scale: 0.95 },
        hover: { scale: 1.05 },
    };

    return (
        <div ref={dropdownRef} style={styles.dropdownContainer}>
            <DropdownMenu
                renderSwitcher={({ onClick, onKeyDown }) => (
                    <motion.div
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                        variants={buttonVariants}
                    >
                        <Button
                            ref={buttonRef}
                            view="flat"
                            size="l"
                            onClick={(e: React.MouseEvent<HTMLElement>) => {
                                e.preventDefault();
                                onClick(e);
                            }}
                            onKeyDown={onKeyDown}
                            aria-label="Дополнительные вкладки"
                            style={styles.dropdownButton}
                        >
                            <Icon data={Bars} size={18} />
                        </Button>
                    </motion.div>
                )}
                open={menuOpen}
                onOpenToggle={onMenuToggle}
                popupProps={{
                    style: styles.dropdownMenu,
                }}
            >
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={menuVariants}
                            transition={{ duration: 0.2 }}
                        >
                            {tabs.map((tab) => (
                                <DropdownMenu.Item
                                    key={tab.id}
                                    action={() => {
                                        onTabSelect(tab.id);
                                        onMenuToggle(false);
                                    }}
                                    style={styles.menuItem}
                                >
                                    {tab.text}
                                </DropdownMenu.Item>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </DropdownMenu>
        </div>
    );
};