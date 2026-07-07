import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { StocknetApiService } from '../../../shared/services/stocknet-api.service';

@Component({
  selector: 'app-stocknet-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stocknet-dashboard.component.html',
})
export class StocknetDashboardComponent implements OnInit {
  inventoryItems: Array<{ name: string; qty: string; status: string; note: string }> = [];

  recentPurchases: Array<{ supplier: string; item: string; qty: string; amount: string; status: string; date: string }> = [];

  releaseActivity: Array<{ day: string; meal: string; item: string; qty: string; person: string }> = [];

  weeklyMenu: Array<{ day: string; breakfast: string; lunch: string; supper: string }> = [];

  focusItems: Array<{ title: string; tone: string }> = [];

  constructor(private api: StocknetApiService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  get metrics() {
    return [
      { label: 'Stock items tracked', value: `${this.inventoryItems.length}`, change: 'Active inventory lines', color: 'from-emerald-500 to-green-600' },
      { label: 'Low stock alerts', value: `${this.inventoryItems.filter((item) => item.status === 'Low').length}`, change: 'Needs replenishment', color: 'from-amber-500 to-orange-500' },
      { label: 'Pending procurement', value: `${this.recentPurchases.filter((purchase) => purchase.status === 'Pending').length}`, change: 'Awaiting confirmation', color: 'from-sky-500 to-blue-600' },
      { label: 'Meals planned', value: `${this.weeklyMenu.length} days`, change: 'Breakfast, lunch & supper', color: 'from-violet-500 to-purple-600' },
    ];
  }

  private loadDashboardData() {
    this.api.getItems().subscribe((items) => {
      this.inventoryItems = items.map((item) => ({
        name: item.name,
        qty: `${item.quantity} ${item.unit}`,
        status: item.status,
        note: `${item.category} • reorder ${item.reorder_level}`,
      }));

      const lowStockItems = this.inventoryItems.filter((item) => item.status === 'Low');
      if (lowStockItems.length) {
        this.focusItems = lowStockItems.map((item) => ({
          title: `We need to buy ${item.name.toLowerCase()} for ${item.qty}.`,
          tone: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
        }));
      } else {
        this.focusItems = [
          {
            title: 'Inventory looks healthy. Continue monitoring the next delivery window.',
            tone: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
          },
        ];
      }
    });

    this.api.getPurchases().subscribe((purchases) => {
      this.recentPurchases = purchases.slice(0, 3).map((purchase) => ({
        supplier: purchase.supplier,
        item: purchase.item,
        qty: purchase.quantity,
        amount: purchase.amount,
        status: purchase.status,
        date: purchase.date,
      }));
    });

    this.api.getReleases().subscribe((releases) => {
      this.releaseActivity = releases.slice(0, 3).map((release) => ({
        day: release.day,
        meal: release.meal_type,
        item: release.item,
        qty: `${release.quantity} ${release.unit}`,
        person: release.person_given,
      }));
    });

    this.api.getMenus().subscribe((menus) => {
      this.weeklyMenu = menus.slice(0, 3).map((menu) => ({
        day: menu.day,
        breakfast: menu.meal_type === 'Breakfast' ? menu.meal_name : '—',
        lunch: menu.meal_type === 'Lunch' ? menu.meal_name : '—',
        supper: menu.meal_type === 'Supper' ? menu.meal_name : '—',
      }));
    });
  }
}
