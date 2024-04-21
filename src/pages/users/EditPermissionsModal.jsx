// // EditPermissionsModal.js
// import React, { useState, useEffect } from 'react';
// import PermissionTable from './PermissionTable';

// const EditPermissionsModal = ({ userId, isOpen, onClose }) => {
//   const [permissions, setPermissions] = useState([]);

//   useEffect(() => {
//     // Lấy danh sách quyền hiện tại của người dùng từ API
//     fetch(`/users/${userId}/permissions`)
//       .then(response => response.json())
//       .then(data => {
//         setPermissions(data);
//       });
//   }, [userId]);

//   const handlePermissionChange = (permissionId) => {
//     setPermissions(prevPermissions =>
//       prevPermissions.map(permission =>
//         permission.id === permissionId
//           ? { ...permission, selected: !permission.selected }
//           : permission
//       )
//     );
//   };

//   const handleSave = () => {
//     // Gọi API để cập nhật quyền
//     fetch(`http://localhost:8080/users/${userId}/change-permissions`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`
//       },
//       body: JSON.stringify(permissions)
//     }).then(() => {
//       onClose();
//     });
//   };

//   return (
//     <div>
//       {isOpen && (
//         <div>
//           <h2>Edit Permissions</h2>
//           <PermissionTable permissions={permissions} onPermissionChange={handlePermissionChange} />
//           <button onClick={handleSave}>Save</button>
//           <button onClick={onClose}>Cancel</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EditPermissionsModal;
