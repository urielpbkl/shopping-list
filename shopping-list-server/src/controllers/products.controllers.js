import { pool } from "../database/database.js";
import { v4 as uuidv4 } from 'uuid';


export const addNewProduct = async (request, response) => {

    const { name, mall, category, quantity, measurementunit } = request.body

    const product_id = uuidv4()

    try {
        const newProduct = await pool.query(
            `INSERT INTO public.products (product_id, name, mall, category, quantity, measurementunit) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
            [product_id, name, mall, category, quantity, measurementunit]
        )
        response.status(201).json({
            message: 'Producto creado exitosamente!',
            data: newProduct.rows[0]
        })
    } catch (error) {
        console.error(error.message)
        response.status(500).json({
            message: 'Something went wrong!'
        })
    }
}


export const getAllProducts = async (request, response) => {
    try {
        // Consulta para obtener todos los centros comerciales
        const malls = await pool.query('SELECT * FROM public.malls');

        // Mapear cada centro comercial en una promesa
        const mallsPromises = malls.rows.map(async (mall) => {
            // Consulta para obtener todos los productos de un centro comercial específico
            const products = await pool.query('SELECT * FROM public.products WHERE mall = $1', [mall.mall_id]);

            // Mapear cada producto en una promesa
            const productPromises = products.rows.map(async (product) => {
                // Consultas para obtener los detalles adicionales del producto
                const mall = await pool.query('SELECT * FROM public.malls WHERE mall_id = $1', [product.mall]);
                const category = await pool.query('SELECT * FROM public.categories WHERE category_id = $1', [product.category]);
                const measurementUnit = await pool.query('SELECT * FROM public.measurementunit WHERE measurementunit_id = $1', [product.measurementunit]);

                // Retornar un objeto con los detalles del producto
                return {
                    product_id: product.product_id,
                    name: product.name,
                    mall: mall.rows[0].name,
                    mall_logo: mall.rows[0].logo,
                    category: category.rows[0].name,
                    quantity: product.quantity,
                    measurement_unit: measurementUnit.rows[0].name
                };
            });

            // Esperar todas las promesas de productos para obtener los datos completos
            const products_array = await Promise.all(productPromises);

            // Retornar un objeto con los detalles del centro comercial y los productos asociados
            return {
                mall: {
                    mall_id: mall.mall_id,
                    name: mall.name,
                    logoUrl: mall.logo
                },
                products: products_array
            };
        });

        // Esperar todas las promesas de centros comerciales para obtener la lista completa de compras
        const shoppingList = await Promise.all(mallsPromises);

        // Retornar la lista de compras como respuesta
        response.status(200).json({
            shoppingList: shoppingList
        });
    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: 'Something went wrong!'
        });
    }
};




export const changeProductMall = async (request, response) => {

    const { product_id, mall_id } = request.params

    // Verificar si el registro existe en la base de datos
    const productExists = await pool.query('SELECT * FROM public.products WHERE product_id = $1', [product_id]);
    if (productExists.rows.length === 0) {
        response.status(404).json({
            message: 'El producto no existe!'
        });
        return
    }

    try {

        // Actualizar los datos del registro en la base de datos
        const editedProduct = await pool.query(
            `UPDATE public.products SET mall = $1  WHERE product_id = $2 RETURNING *`, [mall_id, product_id]
        );

        response.status(200).json({
            message: 'El producto se actualizó correctamente!!!',
            data: editedProduct.rows[0]
        });

    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: 'Parece ser que ha habido un error!'
        });
    }
}




export const getProductData = async (request, response) => {
    
    const { product_id } = request.params
    
    // Verificar si el registro existe en la base de datos
    const productExists = await pool.query('SELECT * FROM public.products WHERE product_id = $1', [product_id]);
    if (productExists.rows.length === 0) {
        response.status(404).json({
            message: 'El producto no existe!'
        });
        return
    }
    
    try {
        
        // Actualizar los datos del registro en la base de datos
        const product = await pool.query('SELECT * FROM public.products WHERE product_id = $1', [product_id])
        
        response.status(200).json({
            productData: product.rows[0]
        });
        
    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: 'Parece ser que ha habido un error!'
        });
    }
}



export const editProduct = async (request, response) => {

    const { product_id } = request.params
    const { name, mall, category, quantity, measurementunit } = request.body

    // Verificar si el registro existe en la base de datos
    const productExists = await pool.query('SELECT * FROM public.products WHERE product_id = $1', [product_id]);
    if (productExists.rows.length === 0) {
        response.status(404).json({
            message: 'El producto no existe!'
        });
        return
    }

    try {

        // Actualizar los datos del registro en la base de datos
        const editedProduct = await pool.query(
            `UPDATE public.products SET name = $1, mall = $2, category = $3, quantity = $4, 
            measurementunit = $5  WHERE product_id = $6 RETURNING *`, 
            [name, mall, category, quantity, measurementunit, product_id]
        );

        response.status(200).json({
            message: 'El producto se actualizó correctamente!!!',
            data: editedProduct.rows[0]
        });

    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: 'Parece ser que ha habido un error!'
        });
    }
}



export const deleteProduct = async (request, response) => {

    const { product_id } = request.params

    // Verificar si el registro existe en la base de datos
    const productExists = await pool.query('SELECT * FROM public.products WHERE product_id = $1', [product_id]);
    if (productExists.rows.length === 0) {
        response.status(404).json({
            message: 'El producto selecionado no existe!'
        });
        return;
    }

    try {

        // Eliminar el registro en la base de datos
        const deteledProduct = await pool.query(
            `DELETE from public.products WHERE product_id = $1`, [product_id]
        );
        response.status(200).json({
            message: 'El producto fue eliminado correctamente!!!',
            data: deteledProduct.rows[0]
        });

    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: 'Parece ser que ha habido un error!'
        });
    }
}