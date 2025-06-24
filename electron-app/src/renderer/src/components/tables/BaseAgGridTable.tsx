import { AgGridReact } from 'ag-grid-react'
import { themeQuartz, colorSchemeLightCold, Theme, ColDef } from 'ag-grid-community'
import { localeText } from '@utils/RU_locale_agrid'
import { ReactElement } from 'react'

// import { ModuleRegistry } from 'ag-grid-community';
// import { SetFilterModule } from 'ag-grid-enterprise';
// ModuleRegistry.registerModules([SetFilterModule]);

declare module 'react' {
  interface CSSProperties {
    '--ag-foreground-color'?: string
    '--ag-data-color'?: string
    [key: `--ag-${string}`]: string | undefined
  }
}

const myTheme = themeQuartz.withPart(colorSchemeLightCold)

export interface BaseTableProps<TData> {
  theme?: Theme | 'ag-theme-quartz' | 'ag-theme-alpine' | 'ag-theme-balham' | undefined
  textColor?: string
  headerHeight?: number
  rowHeight?: number
  withPagination?: boolean
  withAutoHeight?: boolean
  rowData: Array<TData>
  columnDefs: Array<ColDef<TData>>
}

export const BaseAgGridTable = <TData,>({
  theme = 'ag-theme-quartz',
  textColor = 'black',
  headerHeight = 40,
  rowHeight = 40,
  withPagination = true,
  withAutoHeight = true,
  columnDefs,
  rowData,
  ...props
}: BaseTableProps<TData>): ReactElement => {
  return (
    <div
      className={theme as string}
      style={{
        height: '100%',
        '--ag-foreground-color': textColor,
        '--ag-data-color': textColor
      }}
    >
      <AgGridReact<TData>
        localeText={localeText}
        theme={myTheme}
        headerHeight={headerHeight}
        rowHeight={rowHeight}
        columnDefs={columnDefs}
        pagination={withPagination}
        domLayout={withAutoHeight ? 'autoHeight' : undefined}
        {...props}
        rowData={rowData}
      />
    </div>
  )
}

BaseAgGridTable.displayName = 'BaseAgGridTable'
