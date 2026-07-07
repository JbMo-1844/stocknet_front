import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StocknetApiService } from '../../../shared/services/stocknet-api.service';

interface MenuEntry {
  id?: number;
  day: string;
  cell: string;
  cellLeader: string;
  mealType: string;
  mealName: string;
  menuItems: Array<{ item: string; quantity: string }>;
}

@Component({
  selector: 'app-menus',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './menus.component.html',
})
export class MenusComponent implements OnInit {
  daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  cells = ['A', 'B', 'C', 'D', 'E', 'F'];
  mealTypes = ['Breakfast', 'Lunch', 'Dinner'];

  menuEntries: MenuEntry[] = [];
  showMenuForm = false;
  message = '';
  editingMenuId: number | null = null;
  formSubmitted = false;
  selectedDay = 'Monday';
  activeMealType: string | null = null;

  menuForm = new FormGroup({
    day: new FormControl('Monday', Validators.required),
    cell: new FormControl('A', Validators.required),
    cellLeader: new FormControl('', Validators.required),
    mealType: new FormControl('Breakfast', Validators.required),
    mealName: new FormControl('', Validators.required),
    menuItems: new FormArray([this.createMenuItemGroup()], Validators.required),
  });

  constructor(private api: StocknetApiService) {}

  ngOnInit(): void {
    this.loadMenus();
  }

  get menuItemsArray(): FormArray {
    return this.menuForm.get('menuItems') as FormArray;
  }

  createMenuItemGroup() {
    return new FormGroup({
      item: new FormControl('', Validators.required),
      quantity: new FormControl('', Validators.required),
    });
  }

  addMenuItem() {
    this.menuItemsArray.push(this.createMenuItemGroup());
  }

  removeMenuItem(index: number) {
    if (this.menuItemsArray.length > 1) {
      this.menuItemsArray.removeAt(index);
    }
  }

  toggleForm() {
    this.showMenuForm = !this.showMenuForm;
    this.message = '';
    this.formSubmitted = false;
    if (!this.showMenuForm) {
      this.resetForm();
      this.editingMenuId = null;
      this.activeMealType = null;
    }
  }

  selectDay(day: string) {
    this.selectedDay = day;
    this.showMenuForm = false;
    this.activeMealType = null;
    this.message = '';
  }

  openMealPlanner(mealType: string) {
    this.activeMealType = mealType;
    this.showMenuForm = true;
    const existingEntry = this.findEntryForDayAndMeal(this.selectedDay, mealType);
    this.editingMenuId = existingEntry?.id ?? null;
    this.populateForm(existingEntry ?? {
      day: this.selectedDay,
      cell: 'A',
      cellLeader: '',
      mealType,
      mealName: '',
      menuItems: [],
    });
  }

  startEditMenu(entry: MenuEntry) {
    this.editingMenuId = entry.id ?? null;
    this.showMenuForm = true;
    this.activeMealType = entry.mealType;
    this.populateForm(entry);
  }

  submitMenu() {
    this.formSubmitted = true;
    console.log('submitMenu called', {
      editingMenuId: this.editingMenuId,
      formValue: this.menuForm.getRawValue(),
      isValid: this.menuForm.valid,
    });

    if (this.menuForm.invalid) {
      this.menuForm.markAllAsTouched();
      this.message = 'Please fill in all required fields before saving.';
      return;
    }

    const value = this.menuForm.getRawValue();
    const normalizedMenuItems = (value.menuItems ?? [])
      .filter((entry): entry is { item: string; quantity: string } => Boolean(entry?.item || entry?.quantity))
      .map((entry) => ({
        item: entry?.item ?? '',
        quantity: entry?.quantity ?? '',
      }));

    const payload = {
      day: value.day ?? '',
      cell: value.cell ?? '',
      cellLeader: value.cellLeader ?? '',
      mealType: value.mealType ?? 'Breakfast',
      mealName: value.mealName ?? '',
      menuItems: normalizedMenuItems,
    };

    const request$ = this.editingMenuId !== null
      ? this.api.updateMenu(this.editingMenuId, {
          day: payload.day,
          cell: payload.cell,
          cell_leader: payload.cellLeader,
          meal_type: payload.mealType,
          meal_name: payload.mealName,
          menu_items: normalizedMenuItems,
        })
      : this.api.createMenu({
          day: payload.day,
          cell: payload.cell,
          cell_leader: payload.cellLeader,
          meal_type: payload.mealType,
          meal_name: payload.mealName,
          menu_items: normalizedMenuItems,
        });

    request$.subscribe({
      next: () => {
        this.message = this.editingMenuId !== null
          ? `Menu for Cell ${payload.cell} on ${payload.day} has been updated.`
          : `Menu for Cell ${payload.cell} on ${payload.day} has been saved.`;
        this.resetForm();
        this.showMenuForm = false;
        this.editingMenuId = null;
        this.activeMealType = null;
        this.loadMenus();
      },
      error: () => {
        this.message = 'Unable to save menu right now.';
      },
    });
  }

  getMealEntriesForSelectedDay(): Array<{ mealType: string; entry: MenuEntry | null }> {
    return this.mealTypes.map((mealType) => ({
      mealType,
      entry: this.findEntryForDayAndMeal(this.selectedDay, mealType),
    }));
  }

  private findEntryForDayAndMeal(day: string, mealType: string): MenuEntry | null {
    return this.menuEntries.find((entry) => entry.day === day && this.normalizeMealType(entry.mealType) === this.normalizeMealType(mealType)) ?? null;
  }

  private normalizeMealType(mealType: string): string {
    return mealType === 'Supper' ? 'Dinner' : mealType;
  }

  private populateForm(entry: MenuEntry) {
    this.menuForm.reset({
      day: entry.day,
      cell: entry.cell,
      cellLeader: entry.cellLeader,
      mealType: entry.mealType,
      mealName: entry.mealName,
      menuItems: [],
    });
    this.menuItemsArray.clear();

    const rows = entry.menuItems.length ? entry.menuItems : [{ item: '', quantity: '' }];
    rows.forEach((row) => {
      const group = this.createMenuItemGroup();
      group.patchValue({ item: row.item, quantity: row.quantity });
      this.menuItemsArray.push(group);
    });
  }

  private resetForm() {
    this.menuForm.reset({ day: 'Monday', cell: 'A', cellLeader: '', mealType: 'Breakfast', mealName: '', menuItems: [] });
    this.formSubmitted = false;
    this.menuItemsArray.clear();
    this.menuItemsArray.push(this.createMenuItemGroup());
  }

  private loadMenus() {
    this.api.getMenus().subscribe((entries) => {
      this.menuEntries = entries.map((entry) => ({
        id: entry.id,
        day: entry.day,
        cell: entry.cell,
        cellLeader: entry.cell_leader,
        mealType: this.normalizeMealType(entry.meal_type),
        mealName: entry.meal_name,
        menuItems: entry.menu_items ?? [],
      }));
    });
  }
}
