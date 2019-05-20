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

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';

import { BondComponent } from './Bond/Bond.component';
import { HoldingComponent } from './Holding/Holding.component';

import { IssuerComponent } from './Issuer/Issuer.component';
import { InvestorComponent } from './Investor/Investor.component';
import { RegulatorComponent } from './Regulator/Regulator.component';

import { MakePaymentComponent } from './MakePayment/MakePayment.component';
import { SetupDemoComponent } from './SetupDemo/SetupDemo.component';

import { AboutComponent } from './about/about.component';
import { AllTransactionsComponent } from './all-transactions/all-transactions.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'Bond', component: BondComponent },
  { path: 'Holding', component: HoldingComponent },
  { path: 'Issuer', component: IssuerComponent },
  { path: 'Investor', component: InvestorComponent },
  { path: 'Regulator', component: RegulatorComponent },
  { path: 'MakePayment', component: MakePaymentComponent },
  { path: 'SetupDemo', component: SetupDemoComponent },
  {path: 'About', component: AboutComponent},
  { path: 'AllTransactions', component: AllTransactionsComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
 imports: [RouterModule.forRoot(routes)],
 exports: [RouterModule],
 providers: []
})
export class AppRoutingModule { }
