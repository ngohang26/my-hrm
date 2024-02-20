import React from 'react'
import DataTable from '../../components/dataTable/DataTable.jsx'
import './Users.css'
// import Add from '../../components/Add/Add'
import { userRows } from "../../data.js"

const userColumns = [
  {
    field: 'img',
    headerName: 'AVATAR',
    renderCell: (params) => (
      <img src={params.value} alt="Avatar" style={{ width: '40px', height: '40px' }} />
    ),
    flex: 1,
  },
  {
    field: 'fullName',
    headerName: 'FULL NAME',
    flex: 2.5,
    renderCell: (params) => (
      <div style={{ fontSize: 15, fontWeight: 500 }}>
        {params.value}
      </div>
    )
  },
  { field: 'email', headerName: 'EMAIL', flex: 2.8, },
  { field: 'createdDate', headerName: 'CREATED DATE', flex: 1.7, },
  {
    field: 'role',
    headerName: 'Role',
    renderCell: (params) => {
      let color;
      let backgroundColor;

      switch (params.value) {
        case 'Super Admin':
          color = '#fff';
          backgroundColor = '#5a5279';
          break;
        case 'HR Admin':
          color = '#fff';
          backgroundColor = '#ea8484';
          break;
        case 'Admin':
          color = '#fff';
          backgroundColor = '#84a4ea';
          break;
        default:
          color = '#656262';
          backgroundColor = '#d1d3d4';
      }

      return (
        <div style={{ color, backgroundColor, padding: "3px 6px", borderRadius: '5px' }}>
          {params.value}
        </div>
      );
    },
    flex: 1.7
  },
  { field: 'position', headerName: 'POSITION', flex: 2, },

];

const Users = () => {
  // const [open, setOpen] = useState(false);
  return (
    <div className='users'>
      <div className='info'>
        <h1>Users</h1>
        {/* <button onClick={() => setOpen(true)}>Add New User</button>       */}
      </div>
      <DataTable slug="users" columns={userColumns} rows={userRows} />
      {/* {open && <Add columns={userColumns} setOpen={setOpen} />} */}
    </div>
  )
}

export default Users