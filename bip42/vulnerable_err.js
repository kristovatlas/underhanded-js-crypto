/*
Same as vulnerable.js, but with basic error handling for problematic conditions.
*/

/*jslint bitwise: true */

var SubsidyHalvingInterval = 210000,
    COIN = 10000000,
    MAX_SIGNED_INT = 4294967295,
    MAX_RSHIFT_RVAL = 31

function getBlockValueThrower(nHeight, nFees) {
    "use strict";
    var nSubsidy = 50 * COIN,
        halvings = nHeight / SubsidyHalvingInterval;

    if (nSubsidy > MAX_SIGNED_INT) {
        throw "Subsidy value exceeds maximum.";
    }

    if (halvings > MAX_RSHIFT_RVAL) {
        throw "Halving factor exceeds maximum above which an integer overflow occurs.";
    }

    nSubsidy = nSubsidy >> halvings;
    return nSubsidy + nFees;
}

var nHeight,
    nFees = 0, //Ignore fees
    lastBlockValue = 0,
    currentBlockValue;

console.log("Printing subsidy values for blocks using fixed function:");
for (nHeight = 0; nHeight < (210000 * 64 * 3); nHeight += 1) {
    currentBlockValue = getBlockValueThrower(nHeight, nFees);
    if (currentBlockValue !== lastBlockValue) {
        console.log("Block " + nHeight + " value = " + currentBlockValue + " nheight/nSubsidyHalvingInterval=" + (nHeight / SubsidyHalvingInterval));
        lastBlockValue = currentBlockValue;
    }
}
console.log("Block " + nHeight + " value = " + lastBlockValue);

/*
Prints:
Printing subsidy values for blocks using fixed function:
Block 0 value = 500000000 nheight/nSubsidyHalvingInterval=0
Block 210000 value = 250000000 nheight/nSubsidyHalvingInterval=1
Block 420000 value = 125000000 nheight/nSubsidyHalvingInterval=2
Block 630000 value = 62500000 nheight/nSubsidyHalvingInterval=3
Block 840000 value = 31250000 nheight/nSubsidyHalvingInterval=4
Block 1050000 value = 15625000 nheight/nSubsidyHalvingInterval=5
Block 1260000 value = 7812500 nheight/nSubsidyHalvingInterval=6
Block 1470000 value = 3906250 nheight/nSubsidyHalvingInterval=7
Block 1680000 value = 1953125 nheight/nSubsidyHalvingInterval=8
Block 1890000 value = 976562 nheight/nSubsidyHalvingInterval=9
Block 2100000 value = 488281 nheight/nSubsidyHalvingInterval=10
Block 2310000 value = 244140 nheight/nSubsidyHalvingInterval=11
Block 2520000 value = 122070 nheight/nSubsidyHalvingInterval=12
Block 2730000 value = 61035 nheight/nSubsidyHalvingInterval=13
Block 2940000 value = 30517 nheight/nSubsidyHalvingInterval=14
Block 3150000 value = 15258 nheight/nSubsidyHalvingInterval=15
Block 3360000 value = 7629 nheight/nSubsidyHalvingInterval=16
Block 3570000 value = 3814 nheight/nSubsidyHalvingInterval=17
Block 3780000 value = 1907 nheight/nSubsidyHalvingInterval=18
Block 3990000 value = 953 nheight/nSubsidyHalvingInterval=19
Block 4200000 value = 476 nheight/nSubsidyHalvingInterval=20
Block 4410000 value = 238 nheight/nSubsidyHalvingInterval=21
Block 4620000 value = 119 nheight/nSubsidyHalvingInterval=22
Block 4830000 value = 59 nheight/nSubsidyHalvingInterval=23
Block 5040000 value = 29 nheight/nSubsidyHalvingInterval=24
Block 5250000 value = 14 nheight/nSubsidyHalvingInterval=25
Block 5460000 value = 7 nheight/nSubsidyHalvingInterval=26
Block 5670000 value = 3 nheight/nSubsidyHalvingInterval=27
Block 5880000 value = 1 nheight/nSubsidyHalvingInterval=28
Block 6090000 value = 0 nheight/nSubsidyHalvingInterval=29
Uncaught Halving factor exceeds maximum above which an integer overflow occurs.
*/
