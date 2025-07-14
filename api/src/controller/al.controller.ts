import { Request, Response } from "express"
import { 
    addIdentity, 
    createAsset, 
    getIdentityList, 
    isIdentityApproved, 
    ownerExists, 
    removeIdentity 
} from "../services/accessListService"

export const createAssetHandler = async (req: Request, res: Response) => {
    const { ownerID } = req.body
    const contract = req.contract
    const gate = req.gateway

    if (!gate) {
        res.status(500).json({message: "Error: missing gateway connection."})
        return
    }

    if (!contract) {
        res.status(500).json({message: "Error: missing contract."})
        return
    }

    // Remove quotes
    const ownerIdStr = typeof ownerID === 'string' ? ownerID : ''
    const cleanedOwnerId = ownerIdStr.trim().replace(/^"+|"+$/g, '')
    
    if (cleanedOwnerId === "") {
        res.status(400).json({error: "Missing ownerID"})
    }

    try {
        await createAsset(contract, cleanedOwnerId)
        res.status(200).json({message: "Asset created suscessfuly."})
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Failed to creating asset: " + err })
    }
}

export const addIdentityHandler = async (req: Request, res: Response) => {
    const { ownerID, professionalID } = req.body
    const contract = req.contract
    const gate = req.gateway

    if (!contract) {
        res.status(500).json({message: "Error: missing contract."})
        return
    }

    if (!gate) {
        res.status(500).json({message: "Error: missing gateway connection."})
        return
    }

    const ownerIdStr = typeof ownerID === 'string' ? ownerID : ''
    const proIdStr = typeof professionalID === 'string' ? professionalID : ''
    const cleanedOwnerId = ownerIdStr.trim().replace(/^"+|"+$/g, '')
    const cleanedProId = proIdStr.trim().replace(/^"+|"+$/g, '')
    
    if (cleanedOwnerId === "" || cleanedProId === "") {
        res.status(400).json({error: "Missing arguments"})
    }

    try {
        await addIdentity(contract, cleanedOwnerId, cleanedProId)
        res.status(200).json({ message: "Identity added successfully" })
    } catch (err) {
        res.status(500).json({ error: "Failed to add identity" })
    }
}

export const removeIdentityHandler = async (req: Request, res: Response) => {
    const { ownerID, professionalID } = req.body
    const contract = req.contract
    const gate = req.gateway

    if (!contract) {
        res.status(500).json({message: "Error: missing contract."})
        return
    }

    if (!gate) {
        res.status(500).json({message: "Error: missing gateway connection."})
        return
    }

    const ownerIdStr = typeof ownerID === 'string' ? ownerID : ''
    const proIdStr = typeof professionalID === 'string' ? professionalID : ''
    const cleanedOwnerId = ownerIdStr.trim().replace(/^"+|"+$/g, '')
    const cleanedProId = proIdStr.trim().replace(/^"+|"+$/g, '')
    
    if (cleanedOwnerId === "" || cleanedProId === "") {
        res.status(400).json({error: "Missing arguments"})
    }
    
    try {
        await removeIdentity(contract, cleanedOwnerId, cleanedProId)
        res.status(200).json({ message: "Identity removed successfully" })
    } catch (err) {
        res.status(500).json({ error: "Failed to remove identity" })
    }
}

export const isIdentityApprovedHandler = async (req: Request, res: Response) => {
    const { ownerID, professionalID } = req.query
    const contract = req.contract
    const gate = req.gateway

    if (!contract) {
        res.status(500).json({message: "Error: missing contract."})
        return
    }

    if (!gate) {
        res.status(500).json({message: "Error: missing gateway connection."})
        return
    }

    const ownerIdStr = typeof ownerID === 'string' ? ownerID : ''
    const proIdStr = typeof professionalID === 'string' ? professionalID : ''
    const cleanedOwnerId = ownerIdStr.trim().replace(/^"+|"+$/g, '')
    const cleanedProId = proIdStr.trim().replace(/^"+|"+$/g, '')
        
    if (cleanedOwnerId === "" || cleanedProId === "") {
        res.status(400).json({error: "Missing arguments"})
    }

    try {
        const response = await isIdentityApproved(contract, cleanedOwnerId, cleanedProId)
        res.status(200).json({ approved: response.toString() })
    } catch (err) {
        res.status(500).json({ error: "Failed to evaluate identity approval" })
    }
}

export const getIdentityListHandler = async (req: Request, res: Response) => {
    const { ownerID } = req.query
    const contract = req.contract
    const gate = req.gateway

    if (!contract) {
        res.status(500).json({message: "Error: missing contract."})
        return
    }

    if (!gate) {
        res.status(500).json({message: "Error: missing gateway connection."})
        return
    }

    const ownerIdStr = typeof ownerID === 'string' ? ownerID : ''
    const cleanedOwnerId = ownerIdStr.trim().replace(/^"+|"+$/g, '')

    if (cleanedOwnerId === "") {
        res.status(400).json({error: "Missing ownerID"})
    }

    try {
        const response = await getIdentityList(contract, cleanedOwnerId)
        res.status(200).json({ identities: JSON.parse(response.toString()) })
    } catch (err) {
        res.status(500).json({ error: "Failed to retrieve identity list" })
    }
}

export const ownerExistsHandler = async (req: Request, res: Response) => {
    const {ownerID} = req.query
    const contract = req.contract
    const gate = req.gateway
 
    if (!contract) {
        res.status(500).json({message: "Error: missing contract."})
        return
    }

    if (!gate) {
        res.status(500).json({message: "Error: missing gateway connection."})
        return
    }

    const ownerIdStr = typeof ownerID === 'string' ? ownerID : ''
    const cleanedOwnerId = ownerIdStr.trim().replace(/^"+|"+$/g, '')

    if (cleanedOwnerId === '') {
        res.status(400).json({error: "Missing ownerID"})
    }

    try {
        const response = await ownerExists(contract, cleanedOwnerId)
        res.status(200).json({message: response.toString()})
        return
    } catch (err) {
        console.log("Error ownerExists: ", err)
        res.status(500)
    }
}
