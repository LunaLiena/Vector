import { AgGridReact } from 'ag-grid-react';
import {Task} from '@services/taskService';
import { ColDef, RowClickedEvent, themeQuartz } from 'ag-grid-community';
import { colorSchemeLightCold } from 'ag-grid-community';
import { localeText } from '@utils/RU_locale_agrid';

const myTheme = themeQuartz.withPart(colorSchemeLightCold);

export interface TaskTableProps{
  rowData:Array<Task>,
  columnDefs?:Array<ColDef<Task>>,
  onRowClicked: (event: RowClickedEvent<Task>)=>void;
}

export const TaskListTable = (props:TaskTableProps) =>{
  return (
    <div className='ag-theme-quartz' style={{ height: '100%'}}>
      <AgGridReact<Task>
        localeText={localeText}
        theme={myTheme}
        rowData={props.rowData}
        columnDefs={props.columnDefs}
        domLayout="autoHeight"
        rowSelection={'single'}
        onRowClicked={props.onRowClicked}
        suppressCellFocus
        headerHeight={40}
        rowHeight={40}
        pagination
      />
    </div>
  );
};