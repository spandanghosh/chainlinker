import { defineChain } from "viem";

export const flowTestnet = defineChain({
    id: 545,
    name: 'EVM on Flow',
    nativeCurrency: {
        decimals: 18,
        name: 'Flow Token',
        symbol: 'FLOW',
    },
    rpcUrls: {
        default: {
            http: ['https://testnet.evm.nodes.onflow.org'],
        },
    },
    blockExplorers: {
        default: { name: 'Flow Explorer', url: 'https://evm-testnet.flowscan.io' },
    },
    testnet: true,

})