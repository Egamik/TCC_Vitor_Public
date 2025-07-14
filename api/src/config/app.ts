import express, { Application } from 'express'
import appRouter from '../router/app.router.js'
import { enrollAdmin } from '../services/caService.js'


const createApp = (): Application => {
    const app = express()

    // Config Fabric client
    enrollAdmin().then(() => {
        console.log('Admin enrolled successfully!')
    }).catch((err) => {
        console.log('Error enrolling admin: ', err)
        process.exit(1)
    })
    
    // Middleware
    app.use(express.json())

    // Routes
    app.use('', appRouter)

    return app
}

export const app = createApp()