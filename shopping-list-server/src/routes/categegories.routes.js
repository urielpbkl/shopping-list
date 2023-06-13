import { Router } from 'express'
import { addNewCategory, deleteCategory, editCategory, getAllCategories } from "../controllers/categories.controller.js";



const router = Router()

router.post('/categories/add-new-category', addNewCategory)
router.get('/categories/get-all-categories', getAllCategories)
router.put('/categories/edit-category/:category_id', editCategory)
router.delete('/categories/delete-category/:category_id', deleteCategory)

export default router