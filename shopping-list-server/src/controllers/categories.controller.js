import { pool } from "../database/database.js";
import { v4 as uuidv4 } from 'uuid';

export const addNewCategory = async (request, response) => {
    const { category } = request.body
    const category_id = uuidv4()
    try {
        const newCategory = await pool.query(
            `INSERT INTO public.categories (category_id, name) VALUES($1, $2) RETURNING *`,
            [category_id, category]
        )
        response.status(201).json({
            message: 'Category added successfully!',
            data: newCategory.rows[0]
        })
    } catch (error) {
        console.error(error.message)
        response.status(500).json({
            message: 'Something went wrong!'
        })
    }
}


export const getAllCategories = async (request, response) => {

    try {
        const categories = await pool.query('SELECT * FROM public.categories')
        response.status(200).json({
            categories: categories.rows
        })
    } catch (error) {
        console.error(error.message)
        response.status(500).json({
            message: 'Something went wrong!'
        })
    }
}


export const editCategory = async (request, response) => {

    const { name } = request.body;
    const { category_id } = request.params

    // Verificar si el registro existe en la base de datos
    const categoryExists = await pool.query('SELECT * FROM public.categories WHERE category_id = $1', [category_id]);
    if (categoryExists.rows.length === 0) {
        response.status(404).json({
            message: 'La categoría selecionada no existe!'
        });
        return;
    }

    try {

        // Actualizar los datos del registro en la base de datos
        const editedCategory = await pool.query(
            `UPDATE public.categories SET name = $1  WHERE category_id = $2 RETURNING *`, [name, category_id]
        );

        response.status(200).json({
            message: 'La categoría se actualizó correctamente!!!',
            data: editedCategory.rows[0]
        });

    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: 'Parece ser que ha habido un error!'
        });
    }
}


export const deleteCategory = async (request, response) => {

    const { category_id } = request.params

    // Verificar si el registro existe en la base de datos
    const categoryExists = await pool.query('SELECT * FROM public.categories WHERE category_id = $1', [category_id]);
    if (categoryExists.rows.length === 0) {
        response.status(404).json({
            message: 'La categoría selecionada no existe!'
        });
        return;
    }

    try {

        // Eliminar el registro en la base de datos
        const deteledCategory = await pool.query(
            `DELETE from public.categories WHERE category_id = $1`, [category_id]
        );
        response.status(200).json({
            message: 'La categoría fue eliminada correctamente!!!',
            data: deteledCategory.rows[0]
        });

    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: 'Parece ser que ha habido un error!'
        });
    }
}
