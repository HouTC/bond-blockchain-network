import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.example.mynetwork{
   export class Issuer extends Participant {
      issuerId: string;
      name: string;
      firstListed: string;
      balance: number;
   }
   export class Investor extends Participant {
      investorId: string;
      name: string;
      balance: number;
   }
   export class Regulator extends Participant {
      regulatorID: string;
      name: string;
   }
   export class Bond extends Asset {
      ISIN: string;
      issuer: Issuer;
      issueAmount: number;
      interestRate: number;
      issueDate: Date;
      interestPaymentFreq: string;
      maturityDate: Date;
      holdings: Holding[];
      minHolding: number;
      type: string;
      nextPaymentDate: Date;
      matured: boolean;
   }
   export class Holding extends Asset {
      holdingId: string;
      owner: Investor;
      bond: string;
      faceValue: number;
   }
   export class MakePayment extends Transaction {
      bond: Bond;
   }
   export class PaymentMadeEvent extends Event {
      issuer: Issuer;
   }
   export class CouponDistributedEvent extends Event {
      investor: Investor;
   }
   export class PrincipalRepaidEvent extends Event {
      issuer: Issuer;
   }
   export class PrincipalReceivedEvent extends Event {
      investor: Investor;
   }
   export class SetupDemo extends Transaction {
   }
// }
