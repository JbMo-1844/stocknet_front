import { Component, OnInit } from '@angular/core';
import { InputFieldComponent } from './../../form/input/input-field.component';
import { ModalService } from '../../../services/modal.service';

import { ModalComponent } from '../../ui/modal/modal.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { ProfileService, UserProfile } from '../../../services/profile.service';

@Component({
  selector: 'app-user-meta-card',
  imports: [
    ModalComponent,
    InputFieldComponent,
    ButtonComponent
],
  templateUrl: './user-meta-card.component.html',
  styles: ``
})
export class UserMetaCardComponent implements OnInit {

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
