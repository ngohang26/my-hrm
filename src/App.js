import React, {useState} from 'react';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import {SideBar} from './components/sidebar/SideBar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Dashboard } from './pages/dashboard/Dashboard';
import { Navbar } from './components/navbar/Navbar';
import './styles/global.css'
import Users from './pages/users/Users';
import Employee from './pages/employees/Employee';
import Department from './pages/departments/Department'

const queryClient = new QueryClient();

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const Layout = () => {
    return (
      <div className='main'>
        <div className='container'>
          <div className='menuContainer'>
          <SideBar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          </div>
          <div className='contentContainer'>
            <Navbar />    
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
      element: <Layout />,
      children: [
        // {
        //   path: "/",
        //   element: <Home />
        // },
        {
          path: "/dashboard",
          element: <Dashboard />
        },
        {
          path: "/users",
          element: <Users />
        },
        {
          path: "/employees",
          element: <Employee />
        },
        {
          path: "/departments",
          element: <Department />
        },

      ],
    },
    
  ])
  return <RouterProvider router={router} />
}

export default App;