import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StocknetApiService, TenderPayload } from '../../../shared/services/stocknet-api.service';

@Component({
  selector: 'app-tender-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tender-management.component.html',
})
export class TenderManagementComponent implements OnInit {
  tenders: TenderPayload[] = [];
  message = '';
  selectedTenderId: number | null = null;

  tenderForm = new FormGroup({
    reference: new FormControl('', Validators.required),
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    specification: new FormControl(''),
    closing_date: new FormControl('', Validators.required),
  });

  constructor(private api: StocknetApiService) {}

  ngOnInit(): void {
    this.loadTenders();
  }

  submitTender() {
    if (this.tenderForm.invalid) {
      this.tenderForm.markAllAsTouched();
      this.message = 'Complete the tender details before saving.';
      return;
    }

    const value = this.tenderForm.getRawValue();
    const payload: Partial<TenderPayload> = {
      reference: value.reference ?? '',
      title: value.title ?? '',
      description: value.description ?? '',
      specification: value.specification ?? '',
      closing_date: value.closing_date ?? '',
      published: false,
      created_by: 'System',
    };

    const request$ = this.selectedTenderId !== null
      ? this.api.updateTender(this.selectedTenderId, payload)
      : this.api.createTender(payload);

    request$.subscribe({
      next: () => {
        this.message = this.selectedTenderId !== null ? 'Tender updated successfully.' : 'Tender created successfully.';
        this.tenderForm.reset();
        this.selectedTenderId = null;
        this.loadTenders();
      },
      error: () => {
        this.message = 'Unable to save tender at this time.';
      },
    });
  }

  loadTenders() {
    this.api.getTenders().subscribe((items) => {
      this.tenders = items;
    });
  }

  editTender(tender: TenderPayload) {
    this.selectedTenderId = tender.id ?? null;
    this.tenderForm.setValue({
      reference: tender.reference ?? '',
      title: tender.title ?? '',
      description: tender.description ?? '',
      specification: tender.specification ?? '',
      closing_date: tender.closing_date ?? '',
    });
    this.message = '';
  }

  publishTender(tender: TenderPayload) {
    if (!tender.id) {
      return;
    }

    this.api.updateTender(tender.id, { published: true }).subscribe({
      next: () => {
        this.message = `Tender ${tender.reference} has been published.`;
        this.loadTenders();
      },
      error: () => {
        this.message = 'Unable to publish tender now.';
      },
    });
  }

  clearForm() {
    this.selectedTenderId = null;
    this.tenderForm.reset();
    this.message = '';
  }
}
