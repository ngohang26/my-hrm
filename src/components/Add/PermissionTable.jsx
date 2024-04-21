import React from 'react';

const PermissionTable = ({ selectedUserPermissions, permissionMap, modules, permissions, handleCheckboxChange }) => {
  return (
    <table>
      <thead>
        <tr>
          {modules.map(module => (
            <th key={module}>{module}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {permissions.map(permission => (
          <tr key={permission}>
            {modules.map(module => (
              <td key={module}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedUserPermissions.some(p => p.module === module && p.permission === permission)}
                    onChange={() => handleCheckboxChange(module, permission)}
                  />
                  {permission}
                </label>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PermissionTable;
