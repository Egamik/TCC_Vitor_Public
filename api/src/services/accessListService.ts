import { Contract } from "fabric-network"

async function createAsset(contract: Contract, ownerID: string) {
    try {
        return await contract.submitTransaction('CreateAsset', ownerID)
    } catch (err) {
        console.log('Error submiting transaction: ', err)
        throw err
    }
}

async function addIdentity(contract: Contract, ownerID: string, professionalID: string) {
    try {
        return await contract.submitTransaction('AddIdentity', ownerID, professionalID)
    } catch (err) {
        console.log('Error submiting transaction: ', err)
        throw err
    }
}

async function removeIdentity(contract: Contract, ownerID: string, professionalID: string) {
    try {
        return await contract.submitTransaction('RemoveIdentity', ownerID, professionalID)
    } catch (err) {
        console.log('Error submiting transaction: ', err)
        throw err
    }
}

async function isIdentityApproved(contract: Contract, ownerID: string, professionalID: string) {
    try {
        return await contract.evaluateTransaction('IsIdentityApproved', ownerID, professionalID)
    } catch (err) {
        console.log('Error evaluating transaction: ', err)
        throw err
    }
}

async function getIdentityList(contract: Contract, ownerID: string) {
    try {
        return await contract.evaluateTransaction('GetIdentityList', ownerID)
    } catch (err) {
        console.log('Error evaluating transaction: ', err)
        throw err
    }
}

async function ownerExists(contract: Contract, ownerID: string) {
    try {
        return await contract.evaluateTransaction('OwnerExists', ownerID)
    } catch (err) {
        console.log('Error evaluating transaction: ', err)
        throw err
    }
}

export {
    createAsset,
    addIdentity,
    removeIdentity,
    isIdentityApproved,
    getIdentityList,
    ownerExists
}