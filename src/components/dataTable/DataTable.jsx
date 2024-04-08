import React, { useState } from "react";
import './dataTable.css'
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const DataTable = ({ columns, data }) => {
  const [error, setError] = useState(null);

  if (error) {
    return <div>Đã xảy ra lỗi: {error.message}</div>;
  }

let columnsWithAction = [...columns];

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

export default DataTable;
