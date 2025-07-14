import { Gateway, Contract } from 'fabric-network'
import fs from 'fs'
import { getWallet } from '../utils/wallet.js'
import { config } from '../config/networkConfig.js'

const ccp = JSON.parse(fs.readFileSync(config.connectionProfile, 'utf8'))

/**
 * Connects to fabric peer with especified identity
 * @param channelName channel to connect to
 * @param chaincodeName  chaincode to call for
 * @returns contract, gateway
 */
export async function getGatewayAndContract(
    channelName: string, 
    chaincodeName: string
): Promise<{ contract: Contract; gateway: Gateway }> {

    const wallet = await getWallet()
    const activeID = JSON.parse(fs.readFileSync(config.activeIDPath, 'utf8'))
    const identity = await wallet.get(activeID.active)
    if (!identity) throw new Error(`Identity for user ${activeID.active} not found`)

    const gateway = new Gateway()
    await gateway.connect(ccp, {
        wallet,
        identity: identity,
        discovery: { enabled: true, asLocalhost: false }
    })

    const network = await gateway.getNetwork(channelName)
    const contract = network.getContract(chaincodeName)

    return { contract, gateway }
}
