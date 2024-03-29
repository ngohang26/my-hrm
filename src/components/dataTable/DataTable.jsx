import React, { useState } from "react";
import './dataTable.css'
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const DataTable = ({ columns, rows, data, slug, onEdit, showEditColumn }) => {
  const [error, setError] = useState(null);

  if (error) {
    return <div>Đã xảy ra lỗi: {error.message}</div>;
  }

  const editColumn = {
    field: 'edit',
    headerName: 'Edit',
    width: 100,
    renderCell: (params) => (
        <div className="action">
            <button onClick={() => onEdit(params.row)}>Edit</button>
        </div>
    ),
};

let columnsWithAction = [...columns];
if (showEditColumn) {
  columnsWithAction.push(editColumn);
}  

return (
    <div className="dataTable">
      {data.length > 0 ? (
        <DataGrid
          className="dataGrid"
          rows={data}
          columns={columnsWithAction}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 20,
              },
            },
          }}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          pageSizeOptions={[10]}
          disableRowSelectionOnClick
          disableColumnFilter
          disableDensitySelector
          disableColumnSelector
          dis
        />
      ) : (
        <div className="empty-data">
          <img src= "/empty.png" alt="Empty data" /> 
          <div>Không có dữ liệu để hiển thị</div> 
        </div>

      )}
    </div>
  )
}

export default DataTable
