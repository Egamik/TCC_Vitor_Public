// Wallet singleton
import { Wallet, Wallets } from "fabric-network"
import path from 'path'
import { config } from "../config/networkConfig"

let walletInstance: Wallet | null = null

export async function getWallet(): Promise<Wallet> {
    if (walletInstance) {
        return walletInstance
    }

    try {
        const walletPath = path.resolve(__dirname, config.walletPath)
        walletInstance = await Wallets.newFileSystemWallet(walletPath)
        return walletInstance
    } catch (err) {
        console.log('Erro ao criar wallet!')
        throw err
    }
}