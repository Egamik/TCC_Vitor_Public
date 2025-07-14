import { Request, Response } from "express"
import { addAppointment, addPrescription, addProcedure, 
    createRecord, readAppointments, readPrescriptions, 
    readPrivateRecord, readProcedures, readRecord 
} from "../services/ehrService"


export const createRecordHandler = async (req: Request, res: Response) => {
    const { ownerID, patientPrivate } = req.body
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

    const ownerIdStr = typeof ownerID === "string" ? ownerID : ''
    const cleanOwnerId = ownerIdStr.trim().replace(/^"+|"+$/g, '')

    if (cleanOwnerId === "") {
        res.status(400).json({error: "Missing or malformed arguments"})
    }

    try {
        await createRecord(contract, cleanOwnerId, "", JSON.stringify(patientPrivate))
        res.status(200).json({message: "Asset created suscessfuly."})
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Error creating asset: " + err })
    }
}

export const addPrescriptionHandler = async (req: Request, res: Response) => {
    const { ownerID, prescriptionJSON } = req.body
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

    const ownerIdStr = typeof ownerID === "string" ? ownerID : ''
    const cleanOwnerId = ownerIdStr.trim().replace(/^"+|"+$/g, '')

    if (cleanOwnerId === "" || prescriptionJSON === "") {
        res.status(400).json({error: "Missing or malformed arguments"})
    }

    try {
        await addPrescription(contract, cleanOwnerId, JSON.stringify(prescriptionJSON))
        res.status(200).json({message: "Prescription created suscessfuly."})
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Error creating asset: " + err })
    }
}

export const addAppointmentHandler = async (req: Request, res: Response) => {
    const { ownerID, appointmentJSON } = req.body
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

    const ownerIdStr = typeof ownerID === "string" ? ownerID : ''
    const cleanOwnerId = ownerIdStr.trim().replace(/^"+|"+$/g, '')

    if (cleanOwnerId === "" || appointmentJSON === "") {
        res.status(400).json({error: "Missing or malformed arguments"})
    }

    try {
        await addAppointment(contract, cleanOwnerId, JSON.stringify(appointmentJSON))
        res.status(200).json({message: "Appointment created suscessfuly."})
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Error creating asset: " + err })
    }
}

export const addProcedureHandler = async (req: Request, res: Response) => {
    const { ownerID, procedureJSON } = req.body
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

    const ownerIdStr = typeof ownerID === "string" ? ownerID : ''
    const cleanOwnerId = ownerIdStr.trim().replace(/^"+|"+$/g, '')

    if (cleanOwnerId === "" || procedureJSON === "") {
        res.status(400).json({error: "Missing or malformed arguments"})
    }

    try {
        await addProcedure(contract, cleanOwnerId, JSON.stringify(procedureJSON))
        res.status(200).json({message: "Asset created suscessfuly."})
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Error creating asset: " + err })
    }
}

export const readRecordHandler = async (req: Request, res: Response) => {
    const { ownerID } = req.query
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

    const ownerIdStr = typeof ownerID === "string" ? ownerID : ''
    const cleanOwnerId = ownerIdStr.trim().replace(/^"+|"+$/g, '')

    if (cleanOwnerId === "") {
        res.status(400).json({error: "Missing or malformed arguments"})
    }

    try {
        const response = await readRecord(contract, cleanOwnerId)
        res.status(200).json({message: response.toString()})
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Error reading asset: " + err })
    }
}

export const readPrescriptionsHandler = async (req: Request, res: Response) => {
    const { ownerID, professionalID } = req.query
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

    const ownerIdStr = typeof ownerID === "string" ? ownerID : ''
    const proIdStr = typeof professionalID === "string" ? professionalID : ''
    const cleanOwnerId = ownerIdStr.trim().replace(/^"+|"+$/g, '')
    const cleanedProId = proIdStr.trim().replace(/^"+|"+$/g, '')
    
    if (cleanOwnerId === "" || cleanedProId === "") {
        res.status(400).json({error: "Missing or malformed arguments"})
    }

    try {
        const response = await readPrescriptions(contract, cleanOwnerId, cleanedProId)
        res.status(200).json({message: response.toString()})
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Error creating asset: " + err })
    }
}

export const readAppointmentsHandler = async (req: Request, res: Response) => {
    const { ownerID, professionalID } = req.query
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

    const ownerIdStr = typeof ownerID === "string" ? ownerID : ''
    const proIdStr = typeof professionalID === "string" ? professionalID : ''
    const cleanOwnerId = ownerIdStr.trim().replace(/^"+|"+$/g, '')
    const cleanedProId = proIdStr.trim().replace(/^"+|"+$/g, '')

    if (cleanOwnerId === "" || cleanedProId === "") {
        res.status(400).json({error: "Missing or malformed arguments"})
    }

    try {
        const response = await readAppointments(contract, cleanOwnerId, cleanedProId)
        res.status(200).json({message: response.toString()})
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Error reading asset: " + err })
    }
}

export const readProceduresHandler = async (req: Request, res: Response) => {
    const { ownerID, professionalID } = req.query
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

    const ownerIdStr = typeof ownerID === "string" ? ownerID : ''
    const proIdStr = typeof professionalID === "string" ? professionalID : ''
    const cleanOwnerId = ownerIdStr.trim().replace(/^"+|"+$/g, '')
    const cleanedProId = proIdStr.trim().replace(/^"+|"+$/g, '')

    if (cleanOwnerId === "" || cleanedProId === "") {
        res.status(400).json({error: "Missing or malformed arguments"})
    }

    try {
        const response = await readProcedures(contract, cleanOwnerId, cleanedProId)
        res.status(200).json({message: response.toString()})
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Error reading asset: " + err })
    }
}

export const readPrivateRecordHandler = async (req: Request, res: Response) => {
    const { ownerID } = req.query
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

    const ownerIdStr = typeof ownerID === "string" ? ownerID : ''
    const cleanOwnerId = ownerIdStr.trim().replace(/^"+|"+$/g, '')

    if (cleanOwnerId === "") {
        res.status(400).json({error: "Missing or malformed arguments"})
    }

    try {
        const response = await readPrivateRecord(contract, cleanOwnerId)
        res.status(200).json({message: response.toString()})
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Error reading asset: " + err })
    }
}
