import path from "path"

export const config = {
    caURL: 'http://ca1.org0.network.br:7054',
    caName: 'ca1',
    mspId: 'org0-network-br',
    adminUserId: 'admin',
    adminUserPass: 'adminpw',
    walletPath: path.join(__dirname, '../fabric/wallet'),
    activeIDPath: path.join(__dirname, "../fabric/activeIdentity.json"),
    connectionProfile: path.join(__dirname, '../fabric/connection-profile.json'),
    channelName: 'jornada-channel',
    chaincodeEhrName: 'ehr',
    chaincodeAlName: 'accessList'
}