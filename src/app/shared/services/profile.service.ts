import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

export interface SocialLinks {
  facebook: string;
  x: string;
  linkedin: string;
  instagram: string;
}

export interface AddressDetails {
  country: string;
  cityState: string;
  postalCode: string;
  taxId: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  role: string;
  location: string;
  avatar: string;
  email: string;
  phone: string;
  bio: string;
  social: SocialLinks;
  address: AddressDetails;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly storageKey = 'stocknet-profile';

  private profile: UserProfile = this.createDefaultProfile();

  constructor(private authService: AuthService) {
    this.load();
  }

  getProfile(): UserProfile {
    return this.profile;
  }

  updateProfile(patch: Partial<UserProfile>): void {
    this.profile = { ...this.profile, ...patch };
    this.save();
  }

  private load(): void {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Partial<UserProfile>;
        this.profile = {
          ...this.createDefaultProfile(),
          ...parsed,
          social: {
            ...this.createDefaultProfile().social,
            ...(parsed.social ?? {}),
          },
          address: {
            ...this.createDefaultProfile().address,
            ...(parsed.address ?? {}),
          },
        };
      } catch {
        this.profile = this.createDefaultProfile();
      }
    }

    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      const [firstName, ...rest] = currentUser.name.split(' ');
      this.profile = {
        ...this.profile,
        firstName: this.profile.firstName || firstName || 'User',
        lastName: this.profile.lastName || rest.join(' ') || '',
        email: this.profile.email || currentUser.email,
        role:
          currentUser.role === 'admin'
            ? 'Administrator'
            : currentUser.role === 'procurement-officer'
              ? 'Procurement Officer'
              : 'Storekeeper',
        location: this.profile.location || 'Lucky Summer SDA Store',
      };
    }

    this.save();
  }

  private save(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.profile));
  }

  private createDefaultProfile(): UserProfile {
    return {
      firstName: 'User',
      lastName: 'Name',
      role: 'Storekeeper',
      location: 'Lucky Summer SDA Store',
      avatar: '/images/user/owner.jpg',
      email: 'user@stocknet.test',
      phone: '+233 000 000 000',
      bio: 'Inventory and operations user',
      social: {
        facebook: 'https://facebook.com',
        x: 'https://x.com',
        linkedin: 'https://linkedin.com',
        instagram: 'https://instagram.com',
      },
      address: {
        country: 'Ghana',
        cityState: 'Accra',
        postalCode: 'GA 000',
        taxId: 'ST-001',
      },
    };
  }
}
