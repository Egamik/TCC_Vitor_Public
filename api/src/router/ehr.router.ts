import { Router } from "express"
import { addAppointmentHandler, 
    addPrescriptionHandler, 
    addProcedureHandler, 
    createRecordHandler, 
    readAppointmentsHandler, 
    readPrescriptionsHandler, 
    readPrivateRecordHandler, 
    readProceduresHandler, 
    readRecordHandler 
} from "../controller/ehr.controller"
import { contractMiddleware } from "../middleware/contractMiddleware"

const router = Router()

router.post('/record', contractMiddleware('ehr'), createRecordHandler)
router.post('/prescription', contractMiddleware('ehr'), addPrescriptionHandler)
router.post('/appointment', contractMiddleware('ehr'), addAppointmentHandler)
router.post('/procedure', contractMiddleware('ehr'), addProcedureHandler)

router.get('/record', contractMiddleware('ehr'), readRecordHandler)
router.get('/private', contractMiddleware('ehr'), readPrivateRecordHandler)
router.get('/prescription', contractMiddleware('ehr'), readPrescriptionsHandler)
router.get('/appointment', contractMiddleware('ehr'), readAppointmentsHandler)
router.get('/procedure', contractMiddleware('ehr'), readProceduresHandler)

export default router