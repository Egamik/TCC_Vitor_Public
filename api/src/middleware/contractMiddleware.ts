import { Request, Response, NextFunction } from 'express'
import { getGatewayAndContract } from '../services/fabricService'
import { config } from '../config/networkConfig'

export function contractMiddleware(chaincodeName: string) {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {

            const { contract, gateway } = await getGatewayAndContract(
                config.channelName,
                chaincodeName
            )

            req.contract = contract
            req.gateway = gateway

            next()
        } catch (err) {
            console.error('Failed to get contract:', err)
            res.status(500).json({ error: 'Could not connect to Fabric network' })
            return
        }
    }
}
