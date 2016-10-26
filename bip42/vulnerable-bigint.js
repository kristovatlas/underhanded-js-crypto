/*
Same as vulnerable.js, but using the "big-integer" node library to avoid
overflow problems.

COIN is returned to its original value from vulnerable.cpp.

Usage:
    $ node vulnerable-bigint.js

https://www.npmjs.com/package/big-integer
*/

var bigInt = require("big-integer");

var SubsidyHalvingInterval = 210000,
    COIN = bigInt(100000000);

/**
 * Returns the value of a given block to a miner based on subsidy and fees.
 *
 * @param {bigInt} nHeight The height of the block
 * @param {bigInt} nFees The total satoshi value of fees for the block
 * @return {bigInt} The satoshi value of the block
 */
function getBlockValue(nHeight, nFees) {
    "use strict";
    var nSubsidy = COIN.multiply(50),
        halvings = nHeight.divide(SubsidyHalvingInterval).valueOf();

    if (halvings === Infinity) {
        throw new Error("Number of havings exceeds JavaScript's max value.");
    }

    nSubsidy = nSubsidy.shiftRight(halvings);
    return nSubsidy.add(nFees);
}

var nHeight,
    nFees = bigInt(0), //Ignore fees
    lastBlockValue = bigInt(0),
    currentBlockValue;

console.log("Printing subsidy values for blocks using fixed function:");
for (nHeight = bigInt(0); nHeight.lt(210000 * 64 * 3); nHeight = nHeight.add(1)) {
    currentBlockValue = getBlockValue(nHeight, nFees);
    if (currentBlockValue.neq(lastBlockValue)) {
        console.log("Block " + nHeight + " value = " + currentBlockValue + " nheight/nSubsidyHalvingInterval=" + (nHeight / SubsidyHalvingInterval));
        lastBlockValue = currentBlockValue;
    }
}
console.log("Block " + nHeight + " value = " + lastBlockValue);

/*
Prints:
Printing subsidy values for blocks using fixed function:
Block 0 value = 5000000000 nheight/nSubsidyHalvingInterval=0
Block 210000 value = 2500000000 nheight/nSubsidyHalvingInterval=1
Block 420000 value = 1250000000 nheight/nSubsidyHalvingInterval=2
Block 630000 value = 625000000 nheight/nSubsidyHalvingInterval=3
Block 840000 value = 312500000 nheight/nSubsidyHalvingInterval=4
Block 1050000 value = 156250000 nheight/nSubsidyHalvingInterval=5
Block 1260000 value = 78125000 nheight/nSubsidyHalvingInterval=6
Block 1470000 value = 39062500 nheight/nSubsidyHalvingInterval=7
Block 1680000 value = 19531250 nheight/nSubsidyHalvingInterval=8
Block 1890000 value = 9765625 nheight/nSubsidyHalvingInterval=9
Block 2100000 value = 4882812 nheight/nSubsidyHalvingInterval=10
Block 2310000 value = 2441406 nheight/nSubsidyHalvingInterval=11
Block 2520000 value = 1220703 nheight/nSubsidyHalvingInterval=12
Block 2730000 value = 610351 nheight/nSubsidyHalvingInterval=13
Block 2940000 value = 305175 nheight/nSubsidyHalvingInterval=14
Block 3150000 value = 152587 nheight/nSubsidyHalvingInterval=15
Block 3360000 value = 76293 nheight/nSubsidyHalvingInterval=16
Block 3570000 value = 38146 nheight/nSubsidyHalvingInterval=17
Block 3780000 value = 19073 nheight/nSubsidyHalvingInterval=18
Block 3990000 value = 9536 nheight/nSubsidyHalvingInterval=19
Block 4200000 value = 4768 nheight/nSubsidyHalvingInterval=20
Block 4410000 value = 2384 nheight/nSubsidyHalvingInterval=21
Block 4620000 value = 1192 nheight/nSubsidyHalvingInterval=22
Block 4830000 value = 596 nheight/nSubsidyHalvingInterval=23
Block 5040000 value = 298 nheight/nSubsidyHalvingInterval=24
Block 5250000 value = 149 nheight/nSubsidyHalvingInterval=25
Block 5460000 value = 74 nheight/nSubsidyHalvingInterval=26
Block 5670000 value = 37 nheight/nSubsidyHalvingInterval=27
Block 5880000 value = 18 nheight/nSubsidyHalvingInterval=28
Block 6090000 value = 9 nheight/nSubsidyHalvingInterval=29
Block 6300000 value = 4 nheight/nSubsidyHalvingInterval=30
Block 6510000 value = 2 nheight/nSubsidyHalvingInterval=31
Block 6720000 value = 1 nheight/nSubsidyHalvingInterval=32
Block 6930000 value = 0 nheight/nSubsidyHalvingInterval=33
Block 40320000 value = 0
*/
