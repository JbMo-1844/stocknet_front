import { Routes } from '@angular/router';
import { NotFoundComponent } from './pages/other-page/not-found/not-found.component';
import { AppLayoutComponent } from './shared/layout/app-layout/app-layout.component';
import { SignInComponent } from './pages/auth-pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/auth-pages/sign-up/sign-up.component';
import { StocknetDashboardComponent } from './pages/stocknet/stocknet-dashboard/stocknet-dashboard.component';
import { InventoryComponent } from './pages/stocknet/inventory/inventory.component';
import { ProcurementComponent } from './pages/stocknet/procurement/procurement.component';
import { ProcurementRequestsComponent } from './pages/stocknet/procurement/procurement-requests.component';
import { TenderManagementComponent } from './pages/stocknet/procurement/tender-management.component';
import { SupplierApplicationsComponent } from './pages/stocknet/procurement/supplier-applications.component';
import { BidEvaluationComponent } from './pages/stocknet/procurement/bid-evaluation.component';
import { AwardManagementComponent } from './pages/stocknet/procurement/award-management.component';
import { PublishedTendersComponent } from './pages/stocknet/procurement/published-tenders.component';
import { ReportsComponent } from './pages/stocknet/reports/reports.component';
import { MenusComponent } from './pages/stocknet/menus/menus.component';
import { PurchaseOrdersComponent } from './pages/stocknet/procurement/purchase-orders.component';
import { DeliveriesComponent } from './pages/stocknet/procurement/deliveries.component';
import { GoodsReceiptComponent } from './pages/stocknet/procurement/goods-receipt.component';
import { InvoicesComponent } from './pages/stocknet/procurement/invoices.component';
import { PaymentsComponent } from './pages/stocknet/procurement/payments.component';
import { ProcurementReportsComponent } from './pages/stocknet/procurement/procurement-reports.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AdminUsersComponent } from './pages/admin/admin-users.component';
import { AdminLogsComponent } from './pages/admin/admin-logs.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { RoleGuard } from './shared/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: StocknetDashboardComponent,
        pathMatch: 'full',
        title: 'StockNet Dashboard | Lucky Summer SDA Store',
      },
      {
        path: 'dashboard',
        component: StocknetDashboardComponent,
        title: 'Operations Dashboard | StockNet',
      },
      {
        path: 'inventory',
        component: InventoryComponent,
        canActivate: [RoleGuard],
        data: { roles: ['admin', 'storekeeper', 'stock-keeper'] },
        title: 'Inventory | StockNet',
      },
      {
        path: 'procurement',
        component: ProcurementComponent,
        canActivate: [RoleGuard],
        data: { roles: ['admin', 'procurement-officer'] },
        title: 'Procurement Dashboard | StockNet',
      },
      {
        path: 'procurement/requests',
        component: ProcurementRequestsComponent,
        canActivate: [RoleGuard],
        data: { roles: ['admin', 'procurement-officer'] },
        title: 'Procurement Requests | StockNet',
      },
      {
        path: 'procurement/tenders',
        component: TenderManagementComponent,
        canActivate: [RoleGuard],
        data: { roles: ['admin', 'procurement-officer'] },
        title: 'Tender Management | StockNet',
      },
      {
        path: 'procurement/published-tenders',
        component: PublishedTendersComponent,
        canActivate: [RoleGuard],
        data: { roles: ['admin', 'procurement-officer', 'storekeeper', 'stock-keeper'] },
        title: 'Published Tenders | StockNet',
      },
      {
        path: 'procurement/applications',
        component: SupplierApplicationsComponent,
        canActivate: [RoleGuard],
        data: { roles: ['admin', 'procurement-officer'] },
        title: 'Supplier Applications | StockNet',
      },
      {
        path: 'procurement/evaluation',
        component: BidEvaluationComponent,
        canActivate: [RoleGuard],
        data: { roles: ['admin', 'procurement-officer'] },
        title: 'Bid Evaluation | StockNet',
      },
      {
        path: 'procurement/awards',
        component: AwardManagementComponent,
        canActivate: [RoleGuard],
        data: { roles: ['admin', 'procurement-officer'] },
        title: 'Award Management | StockNet',
      },
      {
        path: 'procurement/purchase-orders',
        component: PurchaseOrdersComponent,
        canActivate: [RoleGuard],
        data: { roles: ['admin', 'procurement-officer'] },
        title: 'Purchase Orders | StockNet',
      },
      {
        path: 'procurement/deliveries',
        component: DeliveriesComponent,
        canActivate: [RoleGuard],
        data: { roles: ['admin', 'procurement-officer'] },
        title: 'Deliveries | StockNet',
      },
      {
        path: 'procurement/receipts',
        component: GoodsReceiptComponent,
        canActivate: [RoleGuard],
        data: { roles: ['admin', 'procurement-officer'] },
        title: 'Goods Receipt | StockNet',
      },
      {
        path: 'procurement/invoices',
        component: InvoicesComponent,
        canActivate: [RoleGuard],
        data: { roles: ['admin', 'procurement-officer'] },
        title: 'Invoices | StockNet',
      },
      {
        path: 'procurement/payments',
        component: PaymentsComponent,
        canActivate: [RoleGuard],
        data: { roles: ['admin', 'procurement-officer'] },
        title: 'Payments | StockNet',
      },
      {
        path: 'procurement/reports',
        component: ProcurementReportsComponent,
        canActivate: [RoleGuard],
        data: { roles: ['admin', 'procurement-officer'] },
        title: 'Procurement Reports | StockNet',
      },
      {
        path: 'menus',
        component: MenusComponent,
        canActivate: [RoleGuard],
        data: { roles: ['admin', 'storekeeper', 'stock-keeper'] },
        title: 'Menus | StockNet',
      },
      {
        path: 'reports',
        component: ReportsComponent,
        canActivate: [RoleGuard],
        data: { roles: ['admin'] },
        title: 'Reports | StockNet',
      },
      {
        path: 'profile',
        component: ProfileComponent,
        title: 'Profile | StockNet',
      },
      {
        path: 'admin/users',
        component: AdminUsersComponent,
        canActivate: [RoleGuard],
        data: { roles: ['admin'] },
        title: 'User Management | StockNet',
      },
      {
        path: 'admin/logs',
        component: AdminLogsComponent,
        canActivate: [RoleGuard],
        data: { roles: ['admin'] },
        title: 'System Logs | StockNet',
      },
    ],
  },
  {
    path: 'signin',
    component: SignInComponent,
    title: 'Sign In | StockNet',
  },
  {
    path: 'signup',
    component: SignUpComponent,
    title: 'Sign Up | StockNet',
  },
  {
    path: '**',
    component: NotFoundComponent,
    title: 'Not Found | StockNet',
  },
];
