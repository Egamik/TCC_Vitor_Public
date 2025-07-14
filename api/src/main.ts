import { app } from './config/app.js'
import http from 'http'

const port = 8080

const server = http.createServer(app)

server.listen(port, () => {
    console.log(`Server running on port ${port}`)
})