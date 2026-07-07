import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StocknetApiService } from '../../../shared/services/stocknet-api.service';

@Component({
  selector: 'app-procurement',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './procurement.component.html',
})
export class ProcurementComponent implements OnInit {
  cards = [
    { label: 'Open purchase orders', value: '0' },
    { label: 'Pending approvals', value: '0' },
    { label: 'Expected deliveries', value: '0' },
  ];

  showForm = false;
  message = '';

  purchases: Array<{ supplier: string; invoice: string; item: string; qty: string; amount: string; status: string; date: string; purchaser: string; note: string }> = [];

  constructor(private api: StocknetApiService) {}

  ngOnInit(): void {
    this.loadPurchases();
  }

  procurementForm = new FormGroup({
    date: new FormControl('', Validators.required),
    supplier: new FormControl('', Validators.required),
    invoice: new FormControl('', Validators.required),
    item: new FormControl('', Validators.required),
    quantity: new FormControl('', Validators.required),
    unit: new FormControl('bags', Validators.required),
    amount: new FormControl('', [Validators.required, Validators.min(0)]),
    purchaser: new FormControl('', Validators.required),
    status: new FormControl('Pending', Validators.required),
    note: new FormControl(''),
  });

  toggleForm() {
    this.showForm = !this.showForm;
    this.message = '';
    if (!this.showForm) {
      this.procurementForm.reset({ date: '', supplier: '', invoice: '', item: '', quantity: '', unit: 'bags', amount: '', purchaser: '', status: 'Pending', note: '' });
    }
  }

  submitPurchase() {
    if (this.procurementForm.invalid) {
      this.procurementForm.markAllAsTouched();
      return;
    }

    const value = this.procurementForm.getRawValue();
    const nextPurchase = {
      supplier: value.supplier ?? '',
      invoice: value.invoice ?? '',
      item: value.item ?? '',
      qty: `${value.quantity} ${value.unit}`,
      amount: `GHS ${Number(value.amount ?? 0).toLocaleString()}`,
      status: value.status ?? 'Pending',
      date: value.date ?? '',
      purchaser: value.purchaser ?? '',
      note: value.note ?? '',
    };

    this.api.createPurchase({
      supplier: value.supplier ?? '',
      invoice: value.invoice ?? '',
      item: value.item ?? '',
      quantity: `${value.quantity} ${value.unit}`,
      amount: `GHS ${Number(value.amount ?? 0).toLocaleString()}`,
      status: value.status ?? 'Pending',
      date: value.date ?? '',
      purchaser: value.purchaser ?? '',
      note: value.note ?? '',
    }).subscribe({
      next: () => {
        this.message = `Purchase for ${nextPurchase.item} has been recorded.`;
        this.procurementForm.reset({ date: '', supplier: '', invoice: '', item: '', quantity: '', unit: 'bags', amount: '', purchaser: '', status: 'Pending', note: '' });
        this.showForm = false;
        this.loadPurchases();
      },
      error: () => {
        this.message = 'Unable to save purchase right now.';
      },
    });
  }

  private loadPurchases() {
    this.api.getPurchases().subscribe((entries) => {
      this.purchases = entries.map((entry) => ({
        supplier: entry.supplier,
        invoice: entry.invoice,
        item: entry.item,
        qty: entry.quantity,
        amount: entry.amount,
        status: entry.status,
        date: entry.date,
        purchaser: entry.purchaser,
        note: entry.note,
      }));
      this.cards = [
        { label: 'Open purchase orders', value: `${this.purchases.filter((entry) => entry.status === 'Pending').length}` },
        { label: 'Pending approvals', value: `${this.purchases.filter((entry) => entry.status === 'Approved').length}` },
        { label: 'Expected deliveries', value: `${this.purchases.filter((entry) => entry.status === 'Received').length}` },
      ];
    });
  }
}
