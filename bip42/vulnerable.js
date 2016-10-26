/*
This is a JS port of vulnerable.cpp

Note that because JS's right shift interprets the right-hand operator as a
32-bit value, the "getBlockValueFixed" function suffers from the same kind of
problem as the one in vulnerable.cpp.

ECMAScript 2016 Language Specification for right shift operator:
http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf

Since JS can only handle 32-bit integers, I've divided COIN by 10 compared
to vulnerable.cpp to avoid creating two simulatneous overflows.
*/

/*jslint bitwise: true */

var SubsidyHalvingInterval = 210000;
var COIN = 10000000;

function getBlockValueBroken(nHeight, nFees) {
    "use strict";
    var nSubsidy = 50 * COIN;
    nSubsidy = nSubsidy >> (nHeight / SubsidyHalvingInterval);
    return nSubsidy + nFees;
}

function getBlockValueFixed(nHeight, nFees) {
    "use strict";
    var nSubsidy = 50 * COIN,
        halvings = nHeight / SubsidyHalvingInterval;

    // Force block reward to zero when right shift is undefined.
    if (halvings >= 64) {
        return nFees;
    }

    // Subsidy is cut in half every 210,000 blocks which will occur approximately every 4 years.
    nSubsidy >>= halvings;

    return nSubsidy + nFees;
}

var nHeight,
    nFees = 0, //Ignore fees
    lastBlockValue = 0,
    currentBlockValue;

console.log("Printing subsidy values for blocks using broken function:");
for (nHeight = 0; nHeight < (210000 * 64 * 3); nHeight += 1) {
    currentBlockValue = getBlockValueBroken(nHeight, nFees);
    if (currentBlockValue !== lastBlockValue) {
        console.log("Block " + nHeight + " value = " + currentBlockValue + " nheight/nSubsidyHalvingInterval=" + (nHeight / SubsidyHalvingInterval));
        lastBlockValue = currentBlockValue;
    }
}

console.log("Printing subsidy values for blocks using fixed function:");
for (nHeight = 0; nHeight < (210000 * 64 * 3); nHeight += 1) {
    currentBlockValue = getBlockValueFixed(nHeight, nFees);
    if (currentBlockValue !== lastBlockValue) {
        console.log("Block " + nHeight + " value = " + currentBlockValue + " nheight/nSubsidyHalvingInterval=" + (nHeight / SubsidyHalvingInterval));
        lastBlockValue = currentBlockValue;
    }
}
console.log("Block " + nHeight + " value = " + lastBlockValue);

/*
Prints:
Printing subsidy values for blocks using broken function:
Block 0 value = 500000000 nheight/nSubsidyHalvingInterval=0
Block 210000 value = 250000000 nheight/nSubsidyHalvingInterval=1
[...snip...]
Block 5880000 value = 1 nheight/nSubsidyHalvingInterval=28
Block 6090000 value = 0 nheight/nSubsidyHalvingInterval=29
Block 6720000 value = 500000000 nheight/nSubsidyHalvingInterval=32
Block 6930000 value = 250000000 nheight/nSubsidyHalvingInterval=33
[...snip...]
Block 12600000 value = 1 nheight/nSubsidyHalvingInterval=60
Block 12810000 value = 0 nheight/nSubsidyHalvingInterval=61
Block 13440000 value = 500000000 nheight/nSubsidyHalvingInterval=64
Block 13650000 value = 250000000 nheight/nSubsidyHalvingInterval=65
[...snip...]
Block 19320000 value = 1 nheight/nSubsidyHalvingInterval=92
Block 19530000 value = 0 nheight/nSubsidyHalvingInterval=93
Block 20160000 value = 500000000 nheight/nSubsidyHalvingInterval=96
Block 20370000 value = 250000000 nheight/nSubsidyHalvingInterval=97
[...snip...]
Block 26040000 value = 1 nheight/nSubsidyHalvingInterval=124
Block 26250000 value = 0 nheight/nSubsidyHalvingInterval=125
Block 26880000 value = 500000000 nheight/nSubsidyHalvingInterval=128
Block 27090000 value = 250000000 nheight/nSubsidyHalvingInterval=129
[...snip...]
Block 32760000 value = 1 nheight/nSubsidyHalvingInterval=156
Block 32970000 value = 0 nheight/nSubsidyHalvingInterval=157
Block 33600000 value = 500000000 nheight/nSubsidyHalvingInterval=160
Block 33810000 value = 250000000 nheight/nSubsidyHalvingInterval=161
[...snip...]
Block 39480000 value = 1 nheight/nSubsidyHalvingInterval=188
Block 39690000 value = 0 nheight/nSubsidyHalvingInterval=189

Printing subsidy values for blocks using fixed function:

Block 0 value = 500000000 nheight/nSubsidyHalvingInterval=0
Block 210000 value = 250000000 nheight/nSubsidyHalvingInterval=1
[...snip...]
Block 5880000 value = 1 nheight/nSubsidyHalvingInterval=28
Block 6090000 value = 0 nheight/nSubsidyHalvingInterval=29
Block 6720000 value = 500000000 nheight/nSubsidyHalvingInterval=32
Block 6930000 value = 250000000 nheight/nSubsidyHalvingInterval=33
[...snip...]
Block 12600000 value = 1 nheight/nSubsidyHalvingInterval=60
Block 12810000 value = 0 nheight/nSubsidyHalvingInterval=61
Block 40320000 value = 0
*/
