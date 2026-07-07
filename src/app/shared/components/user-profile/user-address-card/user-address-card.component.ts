import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../../services/modal.service';

import { InputFieldComponent } from '../../form/input/input-field.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { LabelComponent } from '../../form/label/label.component';
import { ModalComponent } from '../../ui/modal/modal.component';
import { FormsModule } from '@angular/forms';
import { ProfileService, UserProfile } from '../../../services/profile.service';

@Component({
  selector: 'app-user-address-card',
  imports: [
    InputFieldComponent,
    ButtonComponent,
    LabelComponent,
    ModalComponent,
    FormsModule
],
  templateUrl: './user-address-card.component.html',
  styles: ``
})
export class UserAddressCardComponent implements OnInit {

  constructor(public modal: ModalService, private profileService: ProfileService) {}

  isOpen = false;
  user!: UserProfile;

  ngOnInit(): void {
    this.user = this.profileService.getProfile();
  }

  openModal() { this.isOpen = true; }
  closeModal() { this.isOpen = false; }

  handleSave() {
    this.profileService.updateProfile(this.user);
    this.modal.closeModal();
    this.isOpen = false;
  }
}
