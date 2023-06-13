import { Router } from 'express'
import { addNewMall, deleteMall, editMall, getAllMalls } from '../controllers/malls.controllers.js';
import { upload } from '../middlewares/upload.js';

const router = Router()

router.post('/malls/add-new-mall', upload, addNewMall);
router.get('/malls/get-all-malls', getAllMalls);
router.put('/malls/edit-mall/:mall_id', upload, editMall)
router.delete('/malls/delete-mall/:mall_id', deleteMall)

export default router