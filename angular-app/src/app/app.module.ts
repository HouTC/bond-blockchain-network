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

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { DataService } from './data.service';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { BondComponent } from './Bond/Bond.component';
import { HoldingComponent } from './Holding/Holding.component';

import { IssuerComponent } from './Issuer/Issuer.component';
import { InvestorComponent } from './Investor/Investor.component';
import { RegulatorComponent } from './Regulator/Regulator.component';

import { MakePaymentComponent } from './MakePayment/MakePayment.component';
import { SetupDemoComponent } from './SetupDemo/SetupDemo.component';
import { Configuration }     from './configuration';
import { AboutComponent } from './about/about.component';
import { AllTransactionsComponent } from './all-transactions/all-transactions.component';

import {FilterAssetPipe} from './Bond/FilterAsset.pipe';
import {HoldingFilterAssetPipe} from './Holding/HoldingFilterAsset.pipe';

  @NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BondComponent,
    HoldingComponent,
    IssuerComponent,
    InvestorComponent,
    RegulatorComponent,
    MakePaymentComponent,
    AboutComponent,
    AllTransactionsComponent,
    FilterAssetPipe,
    HoldingFilterAssetPipe,
    SetupDemoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    Configuration,
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
