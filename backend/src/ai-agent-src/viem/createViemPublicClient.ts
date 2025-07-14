import { createPublicClient, http } from 'viem'
import { baseSepolia } from 'viem/chains'

export function createViemPublicClient() {
    return createPublicClient({
        chain: baseSepolia,
        transport: http(),
    });
}
