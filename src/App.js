import React, { useState, useEffect } from 'react';
import { Outlet, RouterProvider, createBrowserRouter, Route } from 'react-router-dom';
import { SideBar } from './components/sidebar/SideBar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Dashboard } from './pages/dashboard/Dashboard';
import './styles/global.css'
import Users from './pages/users/Users';
import Employee from './pages/employees/Employee';
import Department from './pages/departments/Department'
import Attendance from './pages/Attendance/Attendance';
import Payroll from './pages/Payroll/Payroll';
import PaySlip from './pages/PaySlip/PaySlip';
import Contract from './pages/Contract/Contract';
import ContractDetail from './pages/Contract/ContractDetail';
import ContractView from './pages/Contract/ContractView';
import AuthHandler from './Auth/AuthHandler';
import { ProtectedRoute } from './Auth/ProtectedRoute';
import ForgotPassword from './pages/login/ForgotPassword';
import { EmployeeDetail } from './pages/employees/EmployeeDetail';
import PermissionContext from './Auth/PermissionContext';
import { jwtDecode } from 'jwt-decode';
import YourContract from './pages/Contract/YourContract';
import Allowance from './pages/Allowance/Allowance';
import Report from './pages/Payroll/Report';
import JobPosition from './pages/Recruitment/JobPosition';
import Candidate from './pages/Recruitment/Candidate';

const queryClient = new QueryClient();

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decodedToken = jwtDecode(token);
      setPermissions(decodedToken.authorities || []);
    }
  }, []);

  const Layout = () => {
    return (
      <div className='main'>
        <div className='container'>
          <div className='menuContainer'>
            <SideBar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          </div>
          <div className='contentContainer'>
            <br />
            <QueryClientProvider client={queryClient}>

              <Outlet />
            </QueryClientProvider>
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    )
  }
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AuthHandler />
    },
    {
      path: "forgotpassword",
      element: <ForgotPassword />
    },
    {
      path: "/hrm",
      element: <ProtectedRoute>
        <Layout />
      </ProtectedRoute>,
      children: [
        {
          path: "dashboard",
          element: <Dashboard />
        },
        {
          path: "users",
          element: <Users />
        },
        {
          path: "employees",
          element: <Employee />
        },
        {
          path: "employee",
          element: <EmployeeDetail />
        },
        {
          path: "departments",
          element: <Department />
        },
        {
          path: "attendances",
          element: <Attendance />
        },
        {
          path: "payroll",
          element: <Payroll />
        },
        {
          path: "report",
          element: <Report />
        },
        {
          path: "payslip",
          element: <PaySlip />
        },
        {
          path: "contracts",
          element: <Contract />
        },
        {
          path: "contract",
          element: <YourContract />
        },
        {
          path: "contracts/update/:employeeCode",
          element: <ContractDetail />
        },
        {
          path: "contracts/view/:employeeCode",
          element: <ContractView />
        },
        {
          path: "allowance",
          element: <Allowance />
        },
        {
          path: "candidates",
          element: <Candidate />
        },
        {
          path: "jobPositions",
          element: <JobPosition />
        },
      ],
    },

  ])
  return (
    <PermissionContext.Provider value={permissions}>
      <RouterProvider router={router} />
    </PermissionContext.Provider>
  )
}

export default App;