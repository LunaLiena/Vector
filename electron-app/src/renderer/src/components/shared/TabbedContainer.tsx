import { Layout } from '@components/layout/Layout';

export const createFabricContainer = <T extends string>() => {
  return {
    defineTabs: (tabs: Array<{ id: T; text: string; component: React.ComponentType<object>;disabled?:boolean }>) => ({
      create: (title: string) => {
        if (tabs.length === 0) {
          throw new Error('At least one tab must be defined');
        }

        const firstComponent = tabs[0].component;
        const componentMap = tabs.reduce(
          (acc, { id, component }) => {
            acc[id] = component;
            return acc;
          },
          {} as Record<T, React.ComponentType>
        );

        return () => (
          <Layout<T>
            title={title}
            tabs={tabs.map(({ id, text,disabled }) => ({ id, text,disabled }))}
            firstComponent={firstComponent}
            components={componentMap}
          />
        );
      }
    })
  };
};
