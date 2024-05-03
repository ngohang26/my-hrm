import React, { useState, useEffect } from "react";
import './dataTable.css'
import { DataGrid, GridToolbar, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from "@mui/x-data-grid";

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport csvOptions={{ utf8WithBom: true }} />
      {/* <GridToolbarFilterButton /> */}
    </GridToolbarContainer>
  );
}

const DataTable = ({ columns, data }) => {
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState(data);
  const [isInputFocused, setIsInputFocused] = useState(false);
  useEffect(() => {
    setRows(data);
  }, [data]);

  if (error) {
    return <div>Đã xảy ra lỗi: {error.message}</div>;
  }

  let columnsWithAction = [...columns];

  const handleSearch = (event) => {
    setSearchText(event.target.value);
    const filteredRows = data.filter((row) => 
      columnsWithAction.some((column) => 
        row[column.field]?.toString().toLowerCase().includes(event.target.value.toLowerCase())
      )
    );
    setRows(filteredRows);
  };
  const handleClearSearch = () => {
    setSearchText('');
    setRows(data);
  };  
  
  const handleFocus = () => {
    setIsInputFocused(true);
  };

  const handleBlur = () => {
    setIsInputFocused(false);
  };


  return (
    <div className="dataTable">
<div className="search-container">
  <input type="text" value={searchText} onChange={handleSearch} onFocus={handleFocus} onBlur={handleBlur} placeholder="Tìm kiếm..." className="form-search" />
  {isInputFocused && (
    <button onClick={handleClearSearch} className="clear-search-button">×</button>
  )}
</div>

      {rows.length > 0 ? (
        <DataGrid
          className="dataGrid"
          rows={rows}
          columns={columnsWithAction}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 20,
              },
            },
          }}
          components={{
            Toolbar: CustomToolbar,

          }}
          pageSizeOptions={[10]}
          disableRowSelectionOnClick
          disableDensitySelector
          disableColumnSelector
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
