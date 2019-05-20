/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BondService } from './Bond.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-bond',
  templateUrl: './Bond.component.html',
  styleUrls: ['./Bond.component.css'],
  providers: [BondService]
})
export class BondComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  ISIN = new FormControl('', Validators.required);
  issuer = new FormControl('', Validators.required);
  issueAmount = new FormControl('', Validators.required);
  interestRate = new FormControl('', Validators.required);
  issueDate = new FormControl('', Validators.required);
  interestPaymentFreq = new FormControl('', Validators.required);
  maturityDate = new FormControl('', Validators.required);
  holdings = new FormControl('', Validators.required);
  minHolding = new FormControl('', Validators.required);
  type = new FormControl('', Validators.required);
  nextPaymentDate = new FormControl('', Validators.required);
  matured = new FormControl('', Validators.required);

  constructor(public serviceBond: BondService, fb: FormBuilder) {
    this.myForm = fb.group({
      ISIN: this.ISIN,
      issuer: this.issuer,
      issueAmount: this.issueAmount,
      interestRate: this.interestRate,
      issueDate: this.issueDate,
      interestPaymentFreq: this.interestPaymentFreq,
      maturityDate: this.maturityDate,
      holdings: this.holdings,
      minHolding: this.minHolding,
      type: this.type,
      nextPaymentDate: this.nextPaymentDate,
      matured: this.matured
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceBond.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.example.mynetwork.Bond',
      'ISIN': this.ISIN.value,
      'issuer': this.issuer.value,
      'issueAmount': this.issueAmount.value,
      'interestRate': this.interestRate.value,
      'issueDate': this.issueDate.value,
      'interestPaymentFreq': this.interestPaymentFreq.value,
      'maturityDate': this.maturityDate.value,
      'holdings': this.holdings.value,
      'minHolding': this.minHolding.value,
      'type': this.type.value,
      'nextPaymentDate': this.nextPaymentDate.value,
      'matured': this.matured.value
    };

    this.myForm.setValue({
      'ISIN': null,
      'issuer': null,
      'issueAmount': null,
      'interestRate': null,
      'issueDate': null,
      'interestPaymentFreq': null,
      'maturityDate': null,
      'holdings': null,
      'minHolding': null,
      'type': null,
      'nextPaymentDate': null,
      'matured': null
    });

    return this.serviceBond.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'ISIN': null,
        'issuer': null,
        'issueAmount': null,
        'interestRate': null,
        'issueDate': null,
        'interestPaymentFreq': null,
        'maturityDate': null,
        'holdings': null,
        'minHolding': null,
        'type': null,
        'nextPaymentDate': null,
        'matured': null
      });
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });
  }


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.example.mynetwork.Bond',
      'issuer': this.issuer.value,
      'issueAmount': this.issueAmount.value,
      'interestRate': this.interestRate.value,
      'issueDate': this.issueDate.value,
      'interestPaymentFreq': this.interestPaymentFreq.value,
      'maturityDate': this.maturityDate.value,
      'holdings': this.holdings.value,
      'minHolding': this.minHolding.value,
      'type': this.type.value,
      'nextPaymentDate': this.nextPaymentDate.value,
      'matured': this.matured.value
    };

    return this.serviceBond.updateAsset(form.get('ISIN').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteAsset(): Promise<any> {

    return this.serviceBond.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceBond.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'ISIN': null,
        'issuer': null,
        'issueAmount': null,
        'interestRate': null,
        'issueDate': null,
        'interestPaymentFreq': null,
        'maturityDate': null,
        'holdings': null,
        'minHolding': null,
        'type': null,
        'nextPaymentDate': null,
        'matured': null
      };

      if (result.ISIN) {
        formObject.ISIN = result.ISIN;
      } else {
        formObject.ISIN = null;
      }

      if (result.issuer) {
        formObject.issuer = result.issuer;
      } else {
        formObject.issuer = null;
      }

      if (result.issueAmount) {
        formObject.issueAmount = result.issueAmount;
      } else {
        formObject.issueAmount = null;
      }

      if (result.interestRate) {
        formObject.interestRate = result.interestRate;
      } else {
        formObject.interestRate = null;
      }

      if (result.issueDate) {
        formObject.issueDate = result.issueDate;
      } else {
        formObject.issueDate = null;
      }

      if (result.interestPaymentFreq) {
        formObject.interestPaymentFreq = result.interestPaymentFreq;
      } else {
        formObject.interestPaymentFreq = null;
      }

      if (result.maturityDate) {
        formObject.maturityDate = result.maturityDate;
      } else {
        formObject.maturityDate = null;
      }

      if (result.holdings) {
        formObject.holdings = result.holdings;
      } else {
        formObject.holdings = null;
      }

      if (result.minHolding) {
        formObject.minHolding = result.minHolding;
      } else {
        formObject.minHolding = null;
      }

      if (result.type) {
        formObject.type = result.type;
      } else {
        formObject.type = null;
      }

      if (result.nextPaymentDate) {
        formObject.nextPaymentDate = result.nextPaymentDate;
      } else {
        formObject.nextPaymentDate = null;
      }

      if (result.matured) {
        formObject.matured = result.matured;
      } else {
        formObject.matured = null;
      }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  resetForm(): void {
    this.myForm.setValue({
      'ISIN': null,
      'issuer': null,
      'issueAmount': null,
      'interestRate': null,
      'issueDate': null,
      'interestPaymentFreq': null,
      'maturityDate': null,
      'holdings': null,
      'minHolding': null,
      'type': null,
      'nextPaymentDate': null,
      'matured': null
      });
  }

}
