import { Request, Response } from "express"
import { registerAndEnrollUser, getActiveID, setActiveID, listIDs } from "../services/caService.js"

const createIdentity = async (req: Request, res: Response) => {
    const { userId, role, org } = req.body

    if (!userId || !role) {
        res.status(400).json({error: 'Missing arguments!'})
        return
    }

    if (role !== "professional" && role !== "patient") {
        res.status(400).json({error: "Invalid role."})
        return
    }
    const orgParam = !org ? "org0-network-br" : org
    
    const userIdStr = typeof userId === 'string' ? userId : ''
    const cleanedUserId = userIdStr.trim().replace(/^"+|"+$/g, '')

    try {
        await registerAndEnrollUser(cleanedUserId, role, orgParam)
        res.status(200).json({message: 'User enrolled', userId})
    } catch (err) {
        res.status(500).json({error: err})
    }
}

const setActiveIdentity = async (req: Request, res: Response) => {
    const { id } = req.body

    const userIdStr = typeof id === "string" ? id : ''
    const cleanedUserId = userIdStr.trim().replace(/^"+|"+$/g, '')

    try {
        await setActiveID(cleanedUserId)
        res.status(200).json({ message: `Identity ${id} is now active.` })
    } catch (err) {
        console.log('Error [SetActiveIdentity]: ', err)
        res.status(500).json({error: err})
    }
}

const getActiveIdentity = async (req: Request, res: Response) => {
    try {
        const active = await getActiveID()
        res.status(200).json({ message: active})
        return
    } catch (err) {
        console.log('Error [getActiveIdentity]: ', err)
        res.status(500).json({error: err})
    }
}

const listIdentities = async (req: Request, res: Response) => {
    try {
        const ids = await listIDs()
        res.status(200).json({ message: ids })
    } catch (err) {
        console.log('Error [listIdentities]: ', err)
        res.status(500).json({ error: err})
    }
}

export {
    createIdentity,
    setActiveIdentity,
    getActiveIdentity,
    listIdentities
}