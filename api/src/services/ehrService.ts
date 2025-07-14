import { Contract } from "fabric-network"

async function createRecord(contract: Contract, 
    patientID: string, 
    ehrPublicJSON: string, 
    ehrPrivateJSON: string) 
{
    try {
        return await contract.createTransaction('CreateRecord')
            .setTransient({ ehrPrivate : Buffer.from(ehrPrivateJSON)})
            .submit(patientID, ehrPublicJSON)
    } catch (err) {
        console.log('Error submiting CreateRecord: ', err)
        throw err
    }
}

async function addPrescription(contract: Contract, patientID: string, prescriptionJSON: string) {
    try {
        return await contract.submitTransaction('AddPrescription', patientID, prescriptionJSON)
    } catch (err) {
        console.log('Error submiting transaction: ', err)
        throw err
    }
}

async function addAppointment(contract: Contract, patientID: string, appointmentJSON: string) {
    try {
        return await contract.submitTransaction('AddAppointment', patientID, appointmentJSON)
    } catch (err) {
        console.log('Error submiting transaction: ', err)
        throw err
    }
}

async function addProcedure(contract: Contract, patientID: string, procedureJSON: string) {
    try {
        return await contract.submitTransaction('AddProcedure', patientID, procedureJSON)
    } catch (err) {
        console.log('Error submiting transaction: ', err)
        throw err
    }
}

async function readRecord(contract: Contract, patientID: string) {
    try {
        return await contract.evaluateTransaction('ReadRecord', patientID)
    } catch (err) {
        console.log('Error submiting transaction: ', err)
        throw err
    }
}

async function readPrescriptions(contract: Contract, patientID: string, professionalID: string) {
    try {
        return await contract.evaluateTransaction('ReadPrescriptions', patientID, professionalID)
    } catch (err) {
        console.log('Error evaluating transaction: ', err)
        throw err
    }
}

async function readAppointments(contract: Contract, patientID: string, professionalID: string) {
    try {
        return await contract.evaluateTransaction('ReadAppointments', patientID, professionalID)
    } catch (err) {
        console.log('Error evaluating transaction: ', err)
        throw err
    }
}

async function readProcedures(contract: Contract, patientID: string, professionalID: string) {
    try {
        return await contract.evaluateTransaction('ReadProcedures', patientID, professionalID)
    } catch (err) {
        console.log('Error evaluating transaction: ', err)
        throw err
    }
}

async function readPrivateRecord(contract: Contract, patientID: string) {
    try {
        return await contract.evaluateTransaction('ReadRecordPrivate', patientID)
    } catch (err) {
        console.log('Error evaluating transaction: ', err)
        throw err
    }
}

export {
    createRecord,
    addPrescription,
    addAppointment,
    addProcedure,
    readRecord,
    readPrescriptions,
    readAppointments,
    readProcedures,
    readPrivateRecord
}