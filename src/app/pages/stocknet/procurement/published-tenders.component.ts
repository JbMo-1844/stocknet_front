import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { StocknetApiService, TenderPayload } from '../../../shared/services/stocknet-api.service';

@Component({
  selector: 'app-published-tenders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Published Tenders</p>
            <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Supplier portal announcements</h1>
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <p class="text-sm text-gray-500">This list shows active tenders that have been published for suppliers.</p>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div class="overflow-x-auto">
          <table class="min-w-full text-left text-sm">
            <thead class="text-gray-500">
              <tr>
                <th class="py-2">Reference</th>
                <th class="py-2">Title</th>
                <th class="py-2">Closing date</th>
                <th class="py-2">Created by</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let tender of publishedTenders" class="border-t border-gray-100 dark:border-gray-800">
                <td class="py-3 text-gray-700 dark:text-gray-200">{{ tender.reference }}</td>
                <td class="py-3 text-gray-700 dark:text-gray-200">{{ tender.title }}</td>
                <td class="py-3 text-gray-700 dark:text-gray-200">{{ tender.closing_date }}</td>
                <td class="py-3 text-gray-700 dark:text-gray-200">{{ tender.created_by || 'System' }}</td>
              </tr>
              <tr *ngIf="publishedTenders.length === 0">
                <td colspan="4" class="py-4 text-center text-sm text-gray-500">No published tenders are available yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class PublishedTendersComponent implements OnInit {
  publishedTenders: TenderPayload[] = [];

  constructor(private api: StocknetApiService) {}

  ngOnInit(): void {
    this.api.getPublishedTenders().subscribe((items) => {
      this.publishedTenders = items;
    });
  }
}
