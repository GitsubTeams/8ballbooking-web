import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '@/layouts/AppLayout'
import {
  AdminAuditLogPage,
  AdminDashboardPage,
  AdminSettingsPage,
  AdminStoresPage,
  AdminUsersPage,
  AdminWithdrawalsPage,
  BookingDetailPage,
  BookingsPage,
  DashboardPage,
  FavoritesPage,
  HomePage,
  LoginPage,
  LoyaltyPage,
  NotFoundPage,
  OwnerBookingsPage,
  OwnerDashboardPage,
  OwnerStoreDetailPage,
  OwnerStoresPage,
  OwnerWalletPage,
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
          { path: 'loyalty', element: <LoyaltyPage /> },
          { path: 'profile', element: <ProfilePage /> },
        ],
      },
      {
        element: <RequireRole roles={['store_owner', 'super_admin']} />,
        children: [
          { path: 'owner', element: <OwnerDashboardPage /> },
          { path: 'owner/bookings', element: <OwnerBookingsPage /> },
          { path: 'owner/wallet', element: <OwnerWalletPage /> },
          { path: 'owner/stores', element: <OwnerStoresPage /> },
          { path: 'owner/stores/:id', element: <OwnerStoreDetailPage /> },
        ],
      },
      {
        element: <RequireRole roles={['super_admin']} />,
        children: [
          { path: 'admin', element: <AdminDashboardPage /> },
          { path: 'admin/stores', element: <AdminStoresPage /> },
          { path: 'admin/withdrawals', element: <AdminWithdrawalsPage /> },
          { path: 'admin/users', element: <AdminUsersPage /> },
          { path: 'admin/settings', element: <AdminSettingsPage /> },
          { path: 'admin/audit-logs', element: <AdminAuditLogPage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
