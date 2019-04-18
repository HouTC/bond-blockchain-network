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

'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * Sample transaction
 * @param {org.example.mynetwork.SampleTransaction} sampleTransaction
 * @transaction
 */
async function sampleTransaction(tx) {
    // Save the old value of the asset.
    const oldValue = tx.asset.value;

    // Update the asset with the new value.
    tx.asset.value = tx.newValue;

    // Get the asset registry for the asset.
    const assetRegistry = await getAssetRegistry('org.example.mynetwork.SampleAsset');
    // Update the asset in the asset registry.
    await assetRegistry.update(tx.asset);

    // Emit an event for the modified asset.
    let event = getFactory().newEvent('org.example.mynetwork', 'SampleEvent');
    event.asset = tx.asset;
    event.oldValue = oldValue;
    event.newValue = tx.newValue;
    emit(event);
}

/**
 * Sample transaction
 * @param {org.example.mynetwork.BulkPayment} bp -bulk payment made by issuers
 * @transaction
 */
async function bulkPayment(bp) {
    /**
     * // Save the old value of the balance.
    const oldBalance = bp.Issuer.balance;
     */

    // Get the current time.
    var d = new Date();
    var currentd = d.getTime();

    //before each payment date, issuers get notified with the amount of payment and paymentdate.

    var properCoupon = bp.bond.issueAmount * bp.bond.interestRate;

    //check if the issuer has paid coupon
    if (bp.bond.pStatus === false){
        //check if the payment is correct
        if (bp.coupon === properCoupon){
            // Update the participant with the new value.
            bp.issuer.balance -= bp.coupon;
            // Get the participant registry for the participant.
            const participantRegistry = await getParticipantRegistry('org.example.mynetwork.Issuer');
            // Update the asset in the asset registry.
            await participantRegistry.update(bp.issuer);

            bp.bond.pStatus = true;
            // Get the participant registry for the participant.
            const assetRegistry = await getAssetRegistry('org.example.mynetwork.Bond');
            // Update the asset in the asset registry.
            await assetRegistry.update(bp.bond);
    
            //Emit an event to notify the issuer of successful payment
    
        }
        else{
            //Emit an event to notify the issuer of incorrect ammount.
        }
    }
    else{
        //Tell issuer that they have paid the coupon.
    }

    // emit BulkPaymentMadeEvent event
    let event = getFactory().newEvent('org.example.mynetwork', 'BulkPaymentMadeEvent');
    event.issuerID = bp.issuer.getIdentifier();
    emit(event);

    /**
     * 
     * // Emit an event for the modified asset.
    let event = getFactory().newEvent('org.example.mynetwork', 'SampleEvent');
    event.asset = tx.asset;
    event.oldValue = oldValue;
    event.newValue = tx.newValue;
    emit(event);
     */
}

/**
 * Sample transaction
 * @param {org.example.mynetwork.DistributeCoupon} dc - coupon distributed to investors
 * @transaction
 */
async function distributeCoupon(dc) {

    // declare total face value variable
    var total;

    // loop through all holdings for a specific bond
    for(var i = 0; i < dc.bond.holdings.length; i++){

        // add face value of each holding to total
        total += dc.bond.holdings[i].faceValue;
    }

    // check if total face value is equal to issue amount and if payment status is true
    if(total == dc.bond.issueAmount && dc.bond.pStatus == true){

        // declare coupon variable
        var coupon;

        // loop through all holdings for a specific bond
        for(var i = 0; i < dc.bond.holdings.length; i++){

            // calculate coupon amount for each holding
            coupon = dc.bond.holdings[i].faceValue * dc.bond.interestRate;
            // add coupon amount to investor's balance 
            dc.bond.holdings[i].owner.balance += coupon;
            // get the participant registry for the participant 
            const participantRegistry = await getParticipantRegistry('org.example.mynetwork.Investor');
            // update the participant in the participant registry
            await participantRegistry.update(dc.bond.holdings[i].owner);
            
            // emit CouponDistributedEvent event
            let event = getFactory().newEvent('org.example.mynetwork', 'CouponDistributedEvent');
            event.bondISIN = dc.bond.getIdentifier();
            emit(event);


            /*
            // Emit an event for the modified asset.
            let event = getFactory().newEvent('org.example.mynetwork', 'SampleEvent');
            event.asset = tx.asset;
            event.oldValue = oldValue;
            event.newValue = tx.newValue;
            emit(event);
            */
        }
    } else {
        // emit an event 
    }

    
}
