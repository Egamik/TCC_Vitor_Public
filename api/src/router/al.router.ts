import { Router } from "express"
import { addIdentityHandler, 
        createAssetHandler, 
        getIdentityListHandler, 
        isIdentityApprovedHandler, 
        ownerExistsHandler, 
        removeIdentityHandler } from "../controller/al.controller"
import { contractMiddleware } from "../middleware/contractMiddleware"

const router = Router()

router.post('/asset', contractMiddleware('accesslist'), createAssetHandler)
router.post('/id', contractMiddleware('accesslist'), addIdentityHandler)
router.get('/id', contractMiddleware('accesslist'), isIdentityApprovedHandler)
router.get('/ids', contractMiddleware('accesslist'), getIdentityListHandler)
router.get('/owner', contractMiddleware('accesslist'), ownerExistsHandler)

router.delete('/id', contractMiddleware('accesslist'), removeIdentityHandler)

export default router