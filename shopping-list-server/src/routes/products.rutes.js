import { Router } from 'express'
import { addNewProduct, changeProductMall, deleteProduct, editProduct, getAllProducts, getProductData } from '../controllers/products.controllers.js'

const router = Router()

router.post('/products/add-product', addNewProduct)
router.get('/products/get-all-products', getAllProducts)
router.get('/products/get-product-data/:product_id', getProductData)
router.put('/products/edit-product/:product_id', editProduct);
router.put('/products/change-product-mall/:product_id/:mall_id', changeProductMall);
router.delete('/products/delete-product-from-shopping-list/:product_id', deleteProduct);

export default router