import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DropdownComponent } from '../../ui/dropdown/dropdown.component';
import { DropdownItemComponent } from '../../ui/dropdown/dropdown-item/dropdown-item.component';

@Component({
  selector: 'app-notification-dropdown',
  templateUrl: './notification-dropdown.component.html',
  imports:[CommonModule,RouterModule,DropdownComponent,DropdownItemComponent]
})
export class NotificationDropdownComponent {
  isOpen = false;
  notifications: Array<{ title: string; message: string; time: string }> = [
    {
      title: 'Critical Alert',
      message: 'Inventory level for item #FJ-492 is below reorder threshold.',
      time: '2 min ago',
    },
    {
      title: 'New Purchase Order',
      message: 'Purchase order PO-2026 has been created and is awaiting approval.',
      time: '10 min ago',
    },
    {
      title: 'Pending Invoice',
      message: 'Invoice INV-8847 is pending payment for supplier Acme Supply.',
      time: '30 min ago',
    },
    {
      title: 'System Notice',
      message: 'Daily stock reconciliation completed successfully.',
      time: '1 hr ago',
    },
  ];

  get notifying() {
    return this.notifications.length > 0;
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }
}