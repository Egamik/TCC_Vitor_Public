import { Router } from "express"
import alRouter  from "./al.router.js"
import ehrRouter from "./ehr.router.js"
import walletRouter from "./wallet.router.js"

const router = Router()

router.use('/al', alRouter)
router.use('/ehr', ehrRouter)
router.use('/wallet', walletRouter)

export default router