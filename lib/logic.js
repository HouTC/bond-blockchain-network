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
 * @param {org.example.mynetwork.MakePayment} mp -coupon payment made by issuers
 * @transaction
 */
async function makePayment(mp) {
    var bond = mp.bond;

    // Get the current time, not available for demo.
    var d = new Date();
    var currentd = d.getTime();

    var bulkCoupon = bond.issueAmount * bond.interestRate / 4;

    //check if the issuer has paid coupon, not available for demo.
    //if(bond.pStatus === false)


    //check if the bond is mature
    if (bond.nextPaymentDate < bond.maturityDate && bond.matured == false){
        //check if the payment is correct and if the sum of holdings is smaller or equal to the issue amount
        var sum = 0;
        for(var i = 0; i < bond.holdings.length; i++){
            sum += bond.holdings[i].faceValue;
        }

        if (sum <= bond.issueAmount){
            // Update the participant with the new value.
            bond.issuer.balance -= bulkCoupon;


            // Get the participant registry for the participant.
            const participantRegistry = await getParticipantRegistry('org.example.mynetwork.Issuer');
            // Update the asset in the asset registry.
            await participantRegistry.update(bond.issuer);

            //update the bond with the new next payment date
            bond.nextPaymentDate.setUTCMonth(bond.nextPaymentDate.getUTCMonth() + 3);
            // Get the asset registry for the bond. 
            const assetRegistry = await getAssetRegistry('org.example.mynetwork.Bond');
            // Update the asset in the asset registry.
            await assetRegistry.update(bond);

            console.log('issuer balance after: ' + bond.issuer.balance);
            window.alert("Coupon payment was successful.");

            // declare coupon variable
            var coupon;

            // loop through all holdings of a specific bond
            for(var i = 0; i < bond.holdings.length; i++){

                // calculate coupon amount for each holding
                coupon = bond.holdings[i].faceValue * bond.interestRate / 4;
                // add coupon amount to investor's balance 
                bond.holdings[i].owner.balance += coupon;
                // get the participant registry for the participant 
                const participantRegistry = await getParticipantRegistry('org.example.mynetwork.Investor');
                // update the participant in the participant registry
                await participantRegistry.update(bond.holdings[i].owner);

                // emit PaymentDistributedEvent event
                let event = getFactory().newEvent('org.example.mynetwork', 'PaymentDistributedEvent');
                event.investor = bond.holdings[i].owner;
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
            event.issuer = bond.issuer;
            emit(event);
        }else{
            throw new Error('The sum of holdings cannot be bigger than the issue amount.');
        }
    }

    else if(bond.nextPaymentDate.getUTCDate() == bond.maturityDate.getUTCDate() && bond.matured == false){
        //update the issuer with the new balance
        var bpay = bulkCoupon + bond.issueAmount;
        bond.issuer.balance -= bpay;

        // Get the participant registry for the participant.
        const participantRegistry = await getParticipantRegistry('org.example.mynetwork.Issuer');
        // Update the asset in the asset registry.
        await participantRegistry.update(bond.issuer);

        //update the bond with the maturity status
        bond.matured = true;
        // Get the asset registry for the bond. 
        const assetRegistry = await getAssetRegistry('org.example.mynetwork.Bond');
        // Update the asset in the asset registry.
        await assetRegistry.update(bond);

        console.log('issuer balance after: ' + bond.issuer.balance);
        window.alert("Coupon payment and principal payment were successful.");

        // declare coupon variable
            var coupon;
            var principal;

            // loop through all holdings of a specific bond
            for(var i = 0; i < bond.holdings.length; i++){

                // calculate coupon and principal amount for each holding
                coupon = bond.holdings[i].faceValue * bond.interestRate / 4;
                principal = bond.holdings[i].faceValue;
                var dpay = coupon + principal;

                // add coupon amount to investor's balance 
                bond.holdings[i].owner.balance += dpay;
                // get the participant registry for the participant 
                const participantRegistry = await getParticipantRegistry('org.example.mynetwork.Investor');
                // update the participant in the participant registry
                await participantRegistry.update(bond.holdings[i].owner);

                // emit PaymentDistributedEvent event
                let event = getFactory().newEvent('org.example.mynetwork', 'PaymentDistributedEvent');
                event.investor = bond.holdings[i].owner;
                emit(event);
            }
            let event = getFactory().newEvent('org.example.mynetwork', 'PaymentMadeEvent');
            event.issuer = bond.issuer;
            emit(event);
    }

    else if(bond.matured ==true){
        //Tell issuer that they have paid the coupon.
        throw new Error('The bond is already matured.');
    }
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
    issuer1.balance = 10000;
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
    
    bond1.issueDate = new Date("2018-06-22");
    bond1.interestPaymentFreq = 'Quarterly';
    bond1.maturityDate = new Date("2019-06-22");
    bond1.nextPaymentDate = new Date("2018-09-22");

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
