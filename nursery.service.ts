import { Injectable } from '@angular/core';
import { ApiService } from '../services/shared/api.service';


@Injectable({
  providedIn: 'root'
})
export class NurseryService {

  constructor(private apiService: ApiService) {

  }

  createNursery(nurseryData) {
    const data = {
      ngoRegistrationNumber: nurseryData.nurseryRegistrationNumber,
      ngoName: nurseryData.nurseryName,
      ngoDescription: nurseryData.nurseryDescription,
      address: nurseryData.address,
      contactNumber: nurseryData.contactNumber,
      contactEmail: nurseryData.email,
      alpha_threshold: nurseryData.alpha_threshold,
      beta_threshold: nurseryData.beta_threshold,
      charlie_threshold: nurseryData.charlie_threshold,
      donation_needed: nurseryData.donationNeeded,
      docType: 'ngo'
    };
    return this.apiService.post(`ngos`, data);
  }
}
