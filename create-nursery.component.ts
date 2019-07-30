import { Component, OnInit } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MapLoaderService } from 'src/app/services/shared/map-loader.service';
import { NurseryService } from 'src/app/services/nursery.service';

@Component({
  selector: 'app-create-nursery',
  templateUrl: './create-nursery.component.html',
  styleUrls: ['./create-nursery.component.scss']
})
export class CreateNurseryComponent extends MapComponent implements OnInit {

  nurseryForm = new FormGroup({
    nurseryRegistrationNumber: new FormControl(),
    firstName: new FormControl(),
    familyName: new FormControl(),
    nurseryName: new FormControl(),
    comName: new FormControl(),
    nurseryDescription: new FormControl(),
    address: new FormControl(),
    contactNumber: new FormControl(),
    email: new FormControl(),
    alpha_threshold: new FormControl(),
    beta_threshold: new FormControl(),
    charlie_threshold: new FormControl(),
    donationNeeded: new FormControl()
  });
  error: string = null;

  constructor(
    protected mapLoaderService: MapLoaderService,
    private nurseryService: NurseryService,
    private route: ActivatedRoute,
    private router: Router
    ) {
    super(mapLoaderService);
  }

  ngOnInit() {
  }

  createNursery() {
    const nurseryData = this.nurseryForm.value;
    this.nurseryService.createNursery(nurseryData).subscribe(() => {
      this.router.navigate(['ngolist']);
      return;
    },
      err => {
        console.error(err);
      }
    );
  }

  public setAlpha() {
    this.nurseryForm.patchValue({
      alpha_threshold: this.selectionArea
    });
  }

  public setBeta() {
    this.nurseryForm.patchValue({
      beta_threshold: this.selectionArea
    });
  }

  public setCharlie() {
    this.nurseryForm.patchValue({
      charlie_threshold: this.selectionArea
    });
  }


}
