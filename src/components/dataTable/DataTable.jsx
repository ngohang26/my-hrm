import React, { useState } from "react";
import './dataTable.css'
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const DataTable = ({ columns, rows, data, slug, onEdit }) => {
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

  const columnsWithAction = [...columns, editColumn];
  return (
    <div className="dataTable">
      <DataGrid
        className="dataGrid"
        rows={data}
        columns={columnsWithAction}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 50,
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
        checkboxSelection
        disableRowSelectionOnClick
        disableColumnFilter
        disableDensitySelector
        disableColumnSelector

      />
      {/* <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="Confirm Delete"
      >
        <h2>Confirm Delete</h2>
        <hr/>
        <p>Are you sure you want to delete this item?</p>
        <div className="modalButtons">
          <button onClick={() => setModalOpen(false)}>Cancel</button>
          <button onClick={handleConfirmDelete} style={{backgroundColor: "#7181db", color: "#fff"}}>Delete</button>
        </div>
      </Modal>
      {undoOpen && (
        <div className="undoSnackbar">
          <p>Item deleted</p>
          <button onClick={handleUndo}>Undo</button>
        </div>
      )} */}
    </div>
  )
}
export default DataTable
