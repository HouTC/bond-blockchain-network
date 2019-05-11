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
 * Coupon Payment transaction
 * @param {org.example.mynetwork.CouponPayment} cp -coupon payment made by issuers
 * @transaction
 */
async function couponPayment(cp) {
    // Get the current time.
    var d = new Date();
    var currentd = d.getTime();

    var bulkCoupon = cp.bond.issueAmount * cp.bond.interestRate / 4;
    //check if the issuer has paid coupon
    if (cp.bond.pStatus === false){
        //check if the payment is correct and if the sum of holdings is smaller or equal to the issue amount
        var sum = 0;
        for(var i = 0; i < cp.bond.holdings.length; i++){
            sum += cp.bond.holdings[i].faceValue;
        }

        if (sum <= cp.bond.issueAmount){
            // Update the participant with the new value.
            cp.issuer.balance -= bulkCoupon;


            console.log('#### issuer balance after: ' + cp.issuer.balance);
            window.alert('#### issuer balance after: ' + cp.issuer.balance);



            // Get the participant registry for the participant.
            const participantRegistry = await getParticipantRegistry('org.example.mynetwork.Issuer');
            // Update the asset in the asset registry.
            await participantRegistry.update(cp.issuer);

            // declare coupon variable
            var coupon;

            // loop through all holdings of a specific bond
            for(var i = 0; i < cp.bond.holdings.length; i++){

                // calculate coupon amount for each holding
                coupon = cp.bond.holdings[i].faceValue * cp.bond.interestRate / 4;
                // add coupon amount to investor's balance 
                cp.bond.holdings[i].owner.balance += coupon;
                // get the participant registry for the participant 
                const participantRegistry = await getParticipantRegistry('org.example.mynetwork.Investor');
                // update the participant in the participant registry
                await participantRegistry.update(cp.bond.holdings[i].owner);

                // emit PaymentDistributedEvent event
                let event = getFactory().newEvent('org.example.mynetwork', 'PaymentDistributedEvent');
                event.investor = cp.bond.holdings[i].owner;
                emit(event);
            }
            //change the payment status to true until the next payment date
            // bp.bond.pStatus = true;
            // // Get the participant registry for the participant.
            // const assetRegistry = await getAssetRegistry('org.example.mynetwork.Bond');
            // // Update the asset in the asset registry.
            // await assetRegistry.update(bp.bond);
    
            // An event to notify the issuer of successful payment
            // emit PaymentMadeEvent event
            let event = getFactory().newEvent('org.example.mynetwork', 'PaymentMadeEvent');
            event.issuer = cp.issuer;
            emit(event);
        }else{
            throw new Error('The sum of holdings cannot be bigger than the issue amount.');
        }
    }else{
        //Tell issuer that they have paid the coupon.
        throw new Error('Already paid.');
    }
}

/**
 * regulator can decline bond, if bond input is wrong
 * @param {org.example.mynetwork.DeclineBond} db
 * @transaction
 */
async function declineBond(db) {
    // Get the asset registry for the asset.
    const assetRegistry = await getAssetRegistry('org.example.mynetwork.Bond');
    // Update the asset in the asset registry.
    await assetRegistry.remove(db.bond);

    // Emit an event for the modified asset.
    
}

/**
 * set up demo 
 * @param {org.example.mynetwork.SetupDemo} sd
 * @transaction
 */
async function setupDemo(sd) {
    const factory = getFactory();
    const namespace = 'org.example.mynetwork';

    // create the issuers
    const issuerRegistry = await getParticipantRegistry(namespace + '.Issuer');
    const issuer1 = factory.newResource(namespace, 'Issuer', 'anz');
    issuer1.name = 'ANZ Bank New Zealand Limited';
    issuer1.balance = 1000;
    await issuerRegistry.add(issuer1);

    // create the investors
    const investorRegistry = await getParticipantRegistry(namespace + '.Investor');
    const investor1 = factory.newResource(namespace, 'Investor', 'alice');
    investor1.name = 'Alice';
    investor1.balance = 0;
    await investorRegistry.add(investor1);

    const investor2 = factory.newResource(namespace, 'Investor', 'bob');
    investor2.name = 'Bob';
    investor2.balance = 0;
    await investorRegistry.add(investor2);

    // create the holdings
    const holdingRegistry = await getAssetRegistry(namespace + '.Holding');
    const holding1 = factory.newResource(namespace, 'Holding', '1');
    holding1.owner = investor1;
    holding1.bond = '1';
    holding1.faceValue = 500;
    await holdingRegistry.add(holding1);

    const holding2 = factory.newResource(namespace, 'Holding', '2');
    holding2.owner = investor2;
    holding2.bond = '1';
    holding2.faceValue = 500;
    await holdingRegistry.add(holding2);

    // create the bonds
    const bondRegistry = await getAssetRegistry(namespace + '.Bond');
    const bond1 = factory.newResource(namespace, 'Bond', '1');
    bond1.issuer = issuer1;
    bond1.issueAmount = 1000;
    bond1.interestRate = 0.04;
    bond1.issueDate = '15 Jun 2018';
    bond1.interestPaymentFreq = 'Quarterly';
    bond1.maturityDate = '15 Jun 2019';

    bond1.holdings = [holding1, holding2];

    bond1.minHolding = 500;
    bond1.type = 'Debt/Equity Hybrids';
    await bondRegistry.add(bond1);
}


// /**
//  * Sample transaction
//  * @param {org.example.mynetwork.SampleTransaction} sampleTransaction
//  * @transaction
//  */
// async function sampleTransaction(tx) {
//     // Save the old value of the asset.
//     const oldValue = tx.asset.value;

//     // Update the asset with the new value.
//     tx.asset.value = tx.newValue;

//     // Get the asset registry for the asset.
//     const assetRegistry = await getAssetRegistry('org.example.mynetwork.SampleAsset');
//     // Update the asset in the asset registry.
//     await assetRegistry.update(tx.asset);

//     // Emit an event for the modified asset.
//     let event = getFactory().newEvent('org.example.mynetwork', 'SampleEvent');
//     event.asset = tx.asset;
//     event.oldValue = oldValue;
//     event.newValue = tx.newValue;
//     emit(event);
// }
