import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StocknetApiService, ProcurementRequestPayload, ProcurementRequestItemPayload } from '../../../shared/services/stocknet-api.service';

interface ProcurementRequest extends ProcurementRequestPayload {
  id: number;
  submitted_by: string;
  created_at: string;
  showTimeline?: boolean;
  timeline?: Array<{ status: string; time: string; actor: string }>;
}

@Component({
  selector: 'app-procurement-requests',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './procurement-requests.component.html',
})
export class ProcurementRequestsComponent implements OnInit {
  requests: ProcurementRequest[] = [];
  showForm = false;
  message = '';

  requestForm = new FormGroup({
    department: new FormControl('Kitchen', Validators.required),
    justification: new FormControl('', Validators.required),
    budget_estimate: new FormControl(0, [Validators.required, Validators.min(0)]),
    requestItems: new FormArray([this.createRequestedItemGroup()]),
  });

  constructor(private api: StocknetApiService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  get itemsArray(): FormArray {
    return this.requestForm.get('requestItems') as FormArray;
  }

  createRequestedItemGroup(): FormGroup {
    return new FormGroup({
      item_name: new FormControl('', Validators.required),
      quantity: new FormControl(1, [Validators.required, Validators.min(1)]),
      unit: new FormControl('kg', Validators.required),
      estimated_price: new FormControl(0, [Validators.required, Validators.min(0)]),
      note: new FormControl(''),
    });
  }

  addItemRow() {
    this.itemsArray.push(this.createRequestedItemGroup());
  }

  removeItemRow(index: number) {
    if (this.itemsArray.length > 1) {
      this.itemsArray.removeAt(index);
    }
  }

  toggleForm() {
    this.showForm = !this.showForm;
    this.message = '';
    if (!this.showForm) {
      this.resetForm();
    }
  }

  submitRequest() {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      this.message = 'Please complete all required fields and requested items.';
      return;
    }

    const value = this.requestForm.getRawValue();
    const payload: ProcurementRequestPayload = {
      department: value.department ?? '',
      justification: value.justification ?? '',
      budget_estimate: Number(value.budget_estimate ?? 0),
      status: 'Pending',
      requested_items: (value.requestItems ?? []).map((item: any) => ({
        item_name: item.item_name,
        quantity: Number(item.quantity ?? 0),
        unit: item.unit,
        estimated_price: Number(item.estimated_price ?? 0),
        note: item.note ?? '',
      })) as ProcurementRequestItemPayload[],
    };

    this.api.createProcurementRequest(payload).subscribe({
      next: () => {
        this.message = 'Procurement request submitted successfully.';
        this.resetForm();
        this.showForm = false;
        this.loadRequests();
      },
      error: () => {
        this.message = 'Unable to submit procurement request right now.';
      },
    });
  }

  loadRequests() {
    this.api.getProcurementRequests().subscribe((entries) => {
      this.requests = entries.map((entry) => ({
        ...entry,
        id: entry.id ?? 0,
        submitted_by: entry.submitted_by || 'Unknown',
        created_at: entry.created_at || '',
        showTimeline: false,
        timeline: [
          { status: entry.status || 'Pending', time: entry.created_at || '', actor: entry.submitted_by || 'System' },
        ],
      }));
    });
  }

  approveRequest(request: ProcurementRequest) {
    this.api.updateProcurementRequest(request.id, { status: 'Approved' }).subscribe({
      next: () => this.loadRequests(),
      error: () => (this.message = 'Unable to approve the request right now.'),
    });
  }

  rejectRequest(request: ProcurementRequest) {
    this.api.updateProcurementRequest(request.id, { status: 'Rejected' }).subscribe({
      next: () => this.loadRequests(),
      error: () => (this.message = 'Unable to reject the request right now.'),
    });
  }

  toggleTimeline(request: ProcurementRequest) {
    request.showTimeline = !request.showTimeline;
  }

  statusBadgeClass(status: string) {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300';
      default:
        return 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300';
    }
  }

  private resetForm() {
    this.requestForm.reset({ department: 'Kitchen', justification: '', budget_estimate: 0, requestItems: [] });
    this.itemsArray.clear();
    this.itemsArray.push(this.createRequestedItemGroup());
  }
}
