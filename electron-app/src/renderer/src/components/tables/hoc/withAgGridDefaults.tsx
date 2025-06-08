import { ComponentType } from 'react';
import { BaseTableProps } from '../BaseAgGridTable';

export function withAgGridDefaults<TData>(
  WrappedComponent:ComponentType<BaseTableProps<TData>>,
  defaultProps:Partial<BaseTableProps<TData>> = {}
){
  const WithAgGridDefaults = (props:BaseTableProps<TData>)=>{
    const mergedProps = {...defaultProps,...props};
    return <WrappedComponent {...mergedProps} />;
  };

  const wrappedComponentName = WrappedComponent.displayName || 'Component';
  WithAgGridDefaults.displayName = `withAgGridDefaults(${wrappedComponentName})`;
  return WithAgGridDefaults;
};