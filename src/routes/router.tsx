import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '@/layouts/AppLayout'
import {
  AdminAuditLogPage,
  AdminDashboardPage,
  AdminSettingsPage,
  AdminStoresPage,
  AdminUsersPage,
  BookingDetailPage,
  BookingsPage,
  DashboardPage,
  FavoritesPage,
  HomePage,
  LoginPage,
  NotFoundPage,
  OwnerBookingsPage,
  OwnerDashboardPage,
  OwnerStoreDetailPage,
  OwnerStoresPage,
  ProfilePage,
  RegisterPage,
  StoreDetailPage,
  StoresPage,
} from '@/routes/lazyPages'
import ProtectedRoute from '@/routes/ProtectedRoute'
import RequireRole from '@/routes/RequireRole'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'stores', element: <StoresPage /> },
      { path: 'stores/:id', element: <StoreDetailPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'bookings', element: <BookingsPage /> },
          { path: 'bookings/:id', element: <BookingDetailPage /> },
          { path: 'favorites', element: <FavoritesPage /> },
          { path: 'profile', element: <ProfilePage /> },
        ],
      },
      {
        element: <RequireRole roles={['store_owner', 'super_admin']} />,
        children: [
          { path: 'owner', element: <OwnerDashboardPage /> },
          { path: 'owner/bookings', element: <OwnerBookingsPage /> },
          { path: 'owner/stores', element: <OwnerStoresPage /> },
          { path: 'owner/stores/:id', element: <OwnerStoreDetailPage /> },
        ],
      },
      {
        element: <RequireRole roles={['super_admin']} />,
        children: [
          { path: 'admin', element: <AdminDashboardPage /> },
          { path: 'admin/stores', element: <AdminStoresPage /> },
          { path: 'admin/users', element: <AdminUsersPage /> },
          { path: 'admin/settings', element: <AdminSettingsPage /> },
          { path: 'admin/audit-logs', element: <AdminAuditLogPage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
