import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../shared/services/auth.service';
import { StocknetApiService } from '../../../shared/services/stocknet-api.service';

const CATEGORY_OPTIONS = [
  'Cereals & Grains',
  'Legumes & Pulses',
  'Flour & Baking Products',
  'Vegetables',
  'Fruits',
  'Dairy Products',
  'Cooking Oils & Fats',
  'Herbs & Spices',
  'Sugar & Sweeteners',
  'Cleaning Supplies',
  'Laundry Supplies',
  'Personal Hygiene',
  'Beverages',
];

const UNIT_OPTIONS: Record<string, string[]> = {
  'Cereals & Grains': ['kg', 'g'],
  'Legumes & Pulses': ['kg', 'g'],
  'Flour & Baking Products': ['kg', 'bags'],
  'Vegetables': ['kg', 'bundles', 'pieces'],
  'Fruits': ['kg', 'pieces', 'dozens'],
  'Dairy Products': ['L', 'mL', 'pieces'],
  'Cooking Oils & Fats': ['L', 'mL'],
  'Herbs & Spices': ['g', 'kg', 'packets'],
  'Sugar & Sweeteners': ['kg', 'g', 'bags'],
  'Cleaning Supplies': ['L', 'bottles', 'bars', 'packets'],
  'Laundry Supplies': ['bars', 'kg', 'bottles'],
  'Personal Hygiene': ['bottles', 'bars', 'tubes', 'packets'],
  'Beverages': ['L', 'bottles', 'cartons', 'cans'],
};

interface InventoryItem {
  id?: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  reorder: number;
  status: 'Low' | 'Healthy';
}

interface ReleaseEntry {
  day: string;
  mealType: string;
  personGiven: string;
  item: string;
  quantity: number;
  unit: string;
  note: string;
}

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './inventory.component.html',
})
export class InventoryComponent implements OnInit {
  summary: Array<{ label: string; value: string }> = [];

  items: InventoryItem[] = [];
  categoryOptions = CATEGORY_OPTIONS;
  unitOptions: string[] = [];

  releaseHistory: ReleaseEntry[] = [];
  showAddForm = false;
  showReleaseForm = false;
  message = '';
  editingItemId: number | null = null;
  selectedCategory = 'All';
  filteredItems: InventoryItem[] = [];
  searchQuery = '';

  inventoryForm = new FormGroup({
    name: new FormControl('', Validators.required),
    category: new FormControl(CATEGORY_OPTIONS[0], Validators.required),
    quantity: new FormControl(0, [Validators.required, Validators.min(0)]),
    unit: new FormControl('kg', Validators.required),
    reorderLevel: new FormControl(0, [Validators.required, Validators.min(0)]),
  });

  releaseForm: FormGroup;

  constructor(private api: StocknetApiService, private authService: AuthService) {
    this.unitOptions = UNIT_OPTIONS[CATEGORY_OPTIONS[0]];
    this.releaseForm = new FormGroup({
      day: new FormControl('Monday', Validators.required),
      mealType: new FormControl('Breakfast', Validators.required),
      personGiven: new FormControl('', Validators.required),
      releaseItems: new FormArray([this.createReleaseRowGroup()]),
    });
  }

  ngOnInit(): void {
    this.loadInventory();
    this.loadReleases();
  }

  get releaseItemsArray(): FormArray {
    return this.releaseForm.get('releaseItems') as FormArray;
  }

  get canEditInventory(): boolean {
    return this.authService.getCurrentUser()?.role === 'admin';
  }

  createReleaseRowGroup(): FormGroup {
    return new FormGroup({
      itemName: new FormControl(this.items[0]?.name ?? '', Validators.required),
      quantity: new FormControl(1, [Validators.required, Validators.min(1)]),
      note: new FormControl(''),
    });
  }

  addReleaseRow() {
    this.releaseItemsArray.push(this.createReleaseRowGroup());
  }

  removeReleaseRow(index: number) {
    if (this.releaseItemsArray.length > 1) {
      this.releaseItemsArray.removeAt(index);
    }
  }

  toggleForm() {
    this.showAddForm = !this.showAddForm;
    this.message = '';
    if (!this.showAddForm) {
      this.resetInventoryForm();
    }
  }

  startEditItem(item: InventoryItem) {
    if (!this.canEditInventory) {
      this.message = 'Only admins can edit reorder levels.';
      return;
    }

    this.editingItemId = item.id ?? null;
    this.showAddForm = true;
    this.inventoryForm.reset({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      reorderLevel: item.reorder,
    });
    this.inventoryForm.get('name')?.disable();
    this.inventoryForm.get('category')?.disable();
    this.inventoryForm.get('quantity')?.disable();
    this.inventoryForm.get('unit')?.disable();
    this.onCategoryChange();
  }

  toggleReleaseForm() {
    this.showReleaseForm = !this.showReleaseForm;
    this.message = '';
    if (!this.showReleaseForm) {
      this.resetReleaseForm();
    } else {
      this.resetReleaseForm();
    }
  }

  applyMealPreset(day: string, mealType: string) {
    this.showReleaseForm = true;
    this.releaseForm.patchValue({ day, mealType, personGiven: '' });
    this.releaseItemsArray.clear();
    const firstRow = this.createReleaseRowGroup();
    this.releaseItemsArray.push(firstRow);
    if (this.items.length) {
      firstRow.patchValue({ itemName: this.items[0].name, quantity: 1, note: '' });
    }
  }

  submitInventory() {
    if (this.inventoryForm.invalid) {
      this.inventoryForm.markAllAsTouched();
      return;
    }

    const value = this.inventoryForm.getRawValue();
    const nextItem: InventoryItem = {
      name: value.name ?? '',
      category: value.category ?? '',
      quantity: Number(value.quantity ?? 0),
      unit: value.unit ?? 'bags',
      reorder: Number(value.reorderLevel ?? 0),
      status: (Number(value.quantity ?? 0) <= Number(value.reorderLevel ?? 0)) ? 'Low' : 'Healthy',
    };

    const actorName = this.authService.getCurrentUser()?.name || 'System';
    const request$ = this.editingItemId !== null
      ? this.api.updateItem(this.editingItemId, {
          reorder_level: nextItem.reorder,
          status: nextItem.status,
          performed_by: actorName,
        })
      : this.api.createItem({
          name: nextItem.name,
          category: nextItem.category,
          quantity: nextItem.quantity,
          unit: nextItem.unit,
          reorder_level: nextItem.reorder,
          status: nextItem.status,
          performed_by: actorName,
        });

    request$.subscribe({
      next: () => {
        this.message = this.editingItemId !== null
          ? `${nextItem.name} reorder level has been updated.`
          : `${nextItem.name} has been added to stock.`;
        this.resetInventoryForm();
        this.showAddForm = false;
        this.loadInventory();
      },
      error: () => {
        this.message = 'Unable to save item right now.';
      },
    });
  }

  async submitRelease() {
    if (this.releaseForm.invalid) {
      this.releaseForm.markAllAsTouched();
      this.message = 'Please choose an item and a quantity before releasing.';
      return;
    }

    const value = this.releaseForm.getRawValue();
    const rows = (value.releaseItems ?? []) as Array<{ itemName: string; quantity: number; note: string }>;
    const validRows = rows.filter((row) => row.itemName && Number(row.quantity) > 0);

    if (validRows.length === 0) {
      this.message = 'Select at least one item to release.';
      return;
    }

    try {
      for (const row of validRows) {
        const selectedItem = this.items.find((item) => item.name === row.itemName);
        if (!selectedItem) {
          this.message = 'The selected item could not be found in stock.';
          return;
        }

        const quantity = Number(row.quantity) || 0;
        if (quantity > selectedItem.quantity) {
          this.message = 'You are trying to release that which is not available.';
          return;
        }

        const nextQuantity = selectedItem.quantity - quantity;
        const nextStatus = nextQuantity <= selectedItem.reorder ? 'Low' : 'Healthy';

        await firstValueFrom(this.api.updateItem(Number(selectedItem.id), {
          quantity: nextQuantity,
          status: nextStatus,
          performed_by: this.authService.getCurrentUser()?.name || 'System',
        }));

        await firstValueFrom(this.api.createRelease({
          day: value.day ?? '',
          meal_type: value.mealType ?? '',
          person_given: value.personGiven ?? '',
          item: selectedItem.name,
          quantity,
          unit: selectedItem.unit,
          note: row.note ?? '',
        }));

        this.releaseHistory.unshift({
          day: value.day ?? '',
          mealType: value.mealType ?? '',
          personGiven: value.personGiven ?? '',
          item: selectedItem.name,
          quantity,
          unit: selectedItem.unit,
          note: row.note ?? '',
        });
      }

      this.message = `Release recorded for ${value.mealType} on ${value.day}.`;
      this.resetReleaseForm();
      this.showReleaseForm = false;
      this.loadInventory();
      this.loadReleases();
    } catch (error: any) {
      const apiMessage = error?.error?.quantity?.[0] ?? error?.error?.detail ?? 'Unable to update stock right now.';
      this.message = apiMessage;
    }
  }

  private resetInventoryForm() {
    this.editingItemId = null;
    this.inventoryForm.reset({ name: '', category: CATEGORY_OPTIONS[0], quantity: 0, unit: this.unitOptions[0] ?? 'kg', reorderLevel: 0 });
    this.inventoryForm.get('name')?.enable();
    this.inventoryForm.get('category')?.enable();
    this.inventoryForm.get('quantity')?.enable();
    this.inventoryForm.get('unit')?.enable();
    this.onCategoryChange();
  }

  private resetReleaseForm() {
    this.releaseForm.reset({ day: 'Monday', mealType: 'Breakfast', personGiven: '', releaseItems: [{ itemName: this.items[0]?.name ?? '', quantity: 1, note: '' }] });
    this.releaseItemsArray.clear();
    const firstRow = this.createReleaseRowGroup();
    this.releaseItemsArray.push(firstRow);
    if (this.items.length) {
      firstRow.patchValue({ itemName: this.items[0].name, quantity: 1, note: '' });
    }
  }

  onCategoryChange() {
    const selectedCategory = this.inventoryForm.get('category')?.value ?? CATEGORY_OPTIONS[0];
    this.unitOptions = UNIT_OPTIONS[selectedCategory] ?? ['kg'];
    const currentUnit = this.inventoryForm.get('unit')?.value;
    if (!currentUnit || !this.unitOptions.includes(currentUnit)) {
      this.inventoryForm.patchValue({ unit: this.unitOptions[0] ?? 'kg' });
    }
  }

  private loadInventory() {
    this.api.getItems().subscribe((items) => {
      this.items = items.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        reorder: item.reorder_level,
        status: item.status as 'Low' | 'Healthy',
      }));
      this.syncReleaseFormSelection();
      this.refreshSummary();
      this.applyCategoryFilter();
    });
  }

  private loadReleases() {
    this.api.getReleases().subscribe((entries) => {
      this.releaseHistory = entries.map((entry) => ({
        day: entry.day,
        mealType: entry.meal_type,
        personGiven: entry.person_given,
        item: entry.item,
        quantity: entry.quantity,
        unit: entry.unit,
        note: entry.note,
      }));
      this.refreshSummary();
    });
  }

  private syncReleaseFormSelection() {
    if (!this.items.length) {
      return;
    }

    this.releaseItemsArray.controls.forEach((control) => {
      const group = control as FormGroup;
      const itemNameControl = group.get('itemName');
      const quantityControl = group.get('quantity');
      const currentItem = itemNameControl?.value;

      if (!currentItem || !this.items.some((item) => item.name === currentItem)) {
        itemNameControl?.setValue(this.items[0].name);
      }

      if (!quantityControl?.value || Number(quantityControl.value) < 1) {
        quantityControl?.setValue(1);
      }
    });
  }

  private matchesSearch(item: InventoryItem): boolean {
    const search = this.searchQuery.trim().toLowerCase();
    if (!search) {
      return true;
    }
    return item.name.toLowerCase().includes(search) || item.category.toLowerCase().includes(search);
  }

  applyCategoryFilter() {
    this.filteredItems = this.items.filter((item) => {
      const categoryMatch = this.selectedCategory === 'All' || item.category === this.selectedCategory;
      return categoryMatch && this.matchesSearch(item);
    });
  }

  private refreshSummary() {
    this.summary = [
      { label: 'Active items', value: `${this.items.length}` },
      { label: 'Critical stock', value: `${this.items.filter((item) => item.quantity <= item.reorder).length}` },
      { label: 'Releases logged', value: `${this.releaseHistory.length}` },
    ];
  }
}
