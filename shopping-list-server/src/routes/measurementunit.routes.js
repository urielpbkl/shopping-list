import { Router } from 'express'
import { addNewMeasurementUnit, deleteMeasurementUnit, editMeasurementUnit, getAllMeasurementUnits } from "../controllers/measurementunit.controllers.js";



const router = Router()

router.post('/measuerementunits/add-measurement-unit', addNewMeasurementUnit)
router.get('/measuerementunits/get-all-measurement-units', getAllMeasurementUnits)
router.put('/measuerementunits/edit-measurement-unit/:measurementunit_id', editMeasurementUnit)
router.delete('/measuerementunits/delete-measurement-unit/:measurementunit_id', deleteMeasurementUnit)

export default router