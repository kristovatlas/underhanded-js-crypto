/*
Demonstrates the broken and fixed versions of GetBLockValue per BIP 42 due to
integer overflow.
Usage in OS X:
    $ g++ vulnerable.cpp
    $ ./a.out
*/
#include <iostream>

//https://github.com/ditto-b/bitcoin/blob/c5a9d2ca9e3234db9687c8cbec4b5b93ec161190/src/chainparams.h#L60
//https://github.com/ditto-b/bitcoin/blob/c5a9d2ca9e3234db9687c8cbec4b5b93ec161190/src/chainparams.cpp#L114
int nSubsidyHalvingInterval = 210000;

//https://github.com/ditto-b/bitcoin/blob/5cfd3a70a67ba707a8f074a1730724a6e86353b8/src/util.h#L38
int64_t COIN = 100000000;

int64_t GetBlockValueBroken(int nHeight, int64_t nFees)
{
    int64_t nSubsidy = 50 * COIN;

    // Subsidy is cut in half every 210,000 blocks which will occur approximately every 4 years.
    nSubsidy >>= (nHeight / nSubsidyHalvingInterval);

    return nSubsidy + nFees;
}

int64_t GetBlockValueFixed(int nHeight, int64_t nFees)
{
    int64_t nSubsidy = 50 * COIN;
    int halvings = nHeight / nSubsidyHalvingInterval;

    // Force block reward to zero when right shift is undefined.
    if (halvings >= 64)
        return nFees;

    // Subsidy is cut in half every 210,000 blocks which will occur approximately every 4 years.
    nSubsidy >>= halvings;

    return nSubsidy + nFees;
}

int main()
{
    int nHeight;
    int64_t nFees = 0; //Ignore fees
    int64_t lastBlockValue = 0;
    std::cout << "Printing subsidy values for blocks using broken function:\n";
    for (nHeight = 0; nHeight < (210000 * 64 * 3); nHeight++) {
        int64_t currentBlockValue = GetBlockValueBroken(nHeight, nFees);
        if (currentBlockValue != lastBlockValue) {
            std::cout << "Block " << nHeight << " value = " << currentBlockValue << " nheight/nSubsidyHalvingInterval=" << (nHeight / nSubsidyHalvingInterval) << " \n";
            lastBlockValue = currentBlockValue;
        }
    }

    std::cout << "Printing subsidy values for fixed function:\n";
    for (nHeight = 0; nHeight < (210000 * 64 * 3); nHeight++) {
        int64_t currentBlockValue = GetBlockValueFixed(nHeight, nFees);
        if (currentBlockValue != lastBlockValue) {
            std::cout << "Block " << nHeight << " value = " << currentBlockValue << "\n";
            lastBlockValue = currentBlockValue;
        }
    }
    std::cout << "Block " << nHeight << " value = " << lastBlockValue << "\n";

    return 0;
}

/*
Prints:
Printing subsidy values for blocks using broken function:
Block 0 value = 5000000000 nheight/nSubsidyHalvingInterval=0
Block 210000 value = 2500000000 nheight/nSubsidyHalvingInterval=1
[...snip...]
Block 6510000 value = 2 nheight/nSubsidyHalvingInterval=31
Block 6720000 value = 1 nheight/nSubsidyHalvingInterval=32
Block 6930000 value = 0 nheight/nSubsidyHalvingInterval=33
Block 13440000 value = 5000000000 nheight/nSubsidyHalvingInterval=64
Block 13650000 value = 2500000000 nheight/nSubsidyHalvingInterval=65
[...snip...]
Block 20160000 value = 1 nheight/nSubsidyHalvingInterval=96
Block 20370000 value = 0 nheight/nSubsidyHalvingInterval=97
Block 26880000 value = 5000000000 nheight/nSubsidyHalvingInterval=128
Block 27090000 value = 2500000000 nheight/nSubsidyHalvingInterval=129
[...snip...]
Block 33600000 value = 1 nheight/nSubsidyHalvingInterval=160
Block 33810000 value = 0 nheight/nSubsidyHalvingInterval=161

Printing subsidy values for fixed function:

Block 0 value = 5000000000
Block 210000 value = 2500000000
Block 420000 value = 1250000000
[...snip...]
Block 6720000 value = 1
Block 6930000 value = 0
Block 40320000 value = 0
*/
