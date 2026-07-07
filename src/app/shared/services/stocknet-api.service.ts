import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface StockItemPayload {
  id?: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  reorder_level: number;
  status: string;
  performed_by?: string;
}

export interface PurchasePayload {
  id?: number;
  supplier: string;
  invoice: string;
  item: string;
  quantity: string;
  amount: string;
  status: string;
  date: string;
  purchaser: string;
  note: string;
}

export interface TenderPayload {
  id?: number;
  reference: string;
  title: string;
  description?: string;
  specification?: string;
  closing_date: string;
  published?: boolean;
  created_by?: string;
  created_at?: string;
}

export interface BidPayload {
  id?: number;
  tender: number;
  bidder_name: string;
  amount: number;
  details?: string;
  submitted_at?: string;
}

export interface ProcurementRequestItemPayload {
  item_name: string;
  quantity: number;
  unit: string;
  estimated_price: number;
  note?: string;
}

export interface ProcurementRequestPayload {
  id?: number;
  department: string;
  justification: string;
  budget_estimate: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  requested_items: ProcurementRequestItemPayload[];
  submitted_by?: string;
  created_at?: string;
}

export interface MenuPayload {
  id?: number;
  day: string;
  cell: string;
  cell_leader: string;
  meal_type: string;
  meal_name: string;
  menu_items: Array<{ item: string; quantity: string }>;
}

export interface ReleasePayload {
  id?: number;
  day: string;
  meal_type: string;
  person_given: string;
  item: string;
  quantity: number;
  unit: string;
  note: string;
}

@Injectable({ providedIn: 'root' })
export class StocknetApiService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    const configuredBaseUrl = environment.apiBaseUrl?.trim();
    const fallbackBaseUrl = typeof window !== 'undefined' && window.location?.origin ? window.location.origin : '';
    this.baseUrl = `${configuredBaseUrl || fallbackBaseUrl}/api`.replace(/([^:]\/)\/+/g, '$1');
  }

  getHealth(): Observable<{ status: string }> {
    return this.http.get<{ status: string }>(`${this.baseUrl}/health/`);
  }

  getItems(): Observable<StockItemPayload[]> {
    return this.http.get<StockItemPayload[]>(`${this.baseUrl}/items/`);
  }

  createItem(payload: Partial<StockItemPayload>): Observable<StockItemPayload> {
    return this.http.post<StockItemPayload>(`${this.baseUrl}/items/`, payload);
  }

  updateItem(id: number, payload: Partial<StockItemPayload>): Observable<StockItemPayload> {
    return this.http.patch<StockItemPayload>(`${this.baseUrl}/items/${id}/`, payload);
  }

  getPurchases(): Observable<PurchasePayload[]> {
    return this.http.get<PurchasePayload[]>(`${this.baseUrl}/purchases/`);
  }

  createPurchase(payload: Partial<PurchasePayload>): Observable<PurchasePayload> {
    return this.http.post<PurchasePayload>(`${this.baseUrl}/purchases/`, payload);
  }

  getProcurementRequests(): Observable<ProcurementRequestPayload[]> {
    return this.http.get<ProcurementRequestPayload[]>(`${this.baseUrl}/procurement/requests/`);
  }

  createProcurementRequest(payload: Partial<ProcurementRequestPayload>): Observable<ProcurementRequestPayload> {
    return this.http.post<ProcurementRequestPayload>(`${this.baseUrl}/procurement/requests/`, payload);
  }

  updateProcurementRequest(id: number, payload: Partial<ProcurementRequestPayload>): Observable<ProcurementRequestPayload> {
    return this.http.patch<ProcurementRequestPayload>(`${this.baseUrl}/procurement/requests/${id}/`, payload);
  }

  getTenders(published?: boolean): Observable<TenderPayload[]> {
    const query = published ? '?published=true' : '';
    return this.http.get<TenderPayload[]>(`${this.baseUrl}/procurement/tenders/${query}`);
  }

  getPublishedTenders(): Observable<TenderPayload[]> {
    return this.getTenders(true);
  }

  createTender(payload: Partial<TenderPayload>): Observable<TenderPayload> {
    return this.http.post<TenderPayload>(`${this.baseUrl}/procurement/tenders/`, payload);
  }

  updateTender(id: number, payload: Partial<TenderPayload>): Observable<TenderPayload> {
    return this.http.patch<TenderPayload>(`${this.baseUrl}/procurement/tenders/${id}/`, payload);
  }

  getBids(): Observable<BidPayload[]> {
    return this.http.get<BidPayload[]>(`${this.baseUrl}/procurement/bids/`);
  }

  createBid(payload: Partial<BidPayload>): Observable<BidPayload> {
    return this.http.post<BidPayload>(`${this.baseUrl}/procurement/bids/`, payload);
  }

  getSupplierApplications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/procurement/applications/`);
  }

  getTenderEvaluations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/procurement/evaluations/`);
  }

  getPurchaseOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/procurement/purchase-orders/`);
  }

  getDeliveries(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/procurement/deliveries/`);
  }

  getGoodsReceipts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/procurement/receipts/`);
  }

  getInvoices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/procurement/invoices/`);
  }

  getPayments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/procurement/payments/`);
  }

  getMenus(): Observable<MenuPayload[]> {
    return this.http.get<MenuPayload[]>(`${this.baseUrl}/menus/`);
  }

  createMenu(payload: Partial<MenuPayload>): Observable<MenuPayload> {
    return this.http.post<MenuPayload>(`${this.baseUrl}/menus/`, payload);
  }

  updateMenu(id: number, payload: Partial<MenuPayload>): Observable<MenuPayload> {
    return this.http.patch<MenuPayload>(`${this.baseUrl}/menus/${id}/`, payload);
  }

  getMenuAlerts(): Observable<Array<{ item: string; required_quantity: number; available_quantity: number; day: string; meal_type: string; cell: string }>> {
    return this.http.get<Array<{ item: string; required_quantity: number; available_quantity: number; day: string; meal_type: string; cell: string }>>(`${this.baseUrl}/menus/alerts/`);
  }

  getReleaseLogs(): Observable<Array<{ type: string; description: string; performed_by: string; target: string; timestamp: number; day?: string; meal_type?: string; category?: string; quantity?: number }>> {
    return this.http.get<Array<{ type: string; description: string; performed_by: string; target: string; timestamp: number; day?: string; meal_type?: string; category?: string; quantity?: number }>>(`${this.baseUrl}/releases/logs/`);
  }

  getReleases(): Observable<ReleasePayload[]> {
    return this.http.get<ReleasePayload[]>(`${this.baseUrl}/releases/`);
  }

  createRelease(payload: Partial<ReleasePayload>): Observable<ReleasePayload> {
    return this.http.post<ReleasePayload>(`${this.baseUrl}/releases/`, payload);
  }
}
