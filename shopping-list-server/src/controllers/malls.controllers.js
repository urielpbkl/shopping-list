import { pool } from "../database/database.js";
import { v4 as uuidv4 } from 'uuid';

export const addNewMall = async (request, response) => {
    const mall_id = uuidv4();

    const logo = request.file.filename
    const name = request.body.name

    try {

        const newMall = await pool.query(`INSERT INTO public.malls (mall_id, logo, name) 
            VALUES($1, $2, $3) RETURNING *`, [mall_id, logo, name])
        response.status(201).json({
            message: 'Mall added successfully!',
            data: newMall.rows[0]
        })

    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: 'Something went wrong!'
        });
    }
}


export const getAllMalls = async (request, response) => {
    try {
        const malls = await pool.query('SELECT * FROM public.malls');

        // http://localhost:8080/static/1686264891414costco-logo.png

        if (malls.rows.length > 0) {
            response.status(201).json({
                malls: malls.rows
            })
        } else {
            response.status(200).json({
                malls: null
            });
        }
    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: 'Something went wrong!'
        });
    }
};



export const editMall = async (request, response) => {

    const { mall_id } = request.params

    const logo = request.file.filename
    const name = request.body.name

    // Verificar si el registro existe en la base de datos
    const mallExists = await pool.query('SELECT * FROM public.malls WHERE mall_id = $1', [mall_id]);
    if (mallExists.rows.length === 0) {
        response.status(404).json({
            message: 'El supermercado selecionado no existe!'
        });
        return;
    }

  
    try {
      // Actualiza los datos del centro comercial en la base de datos
      const updatedMall = await pool.query(
        'UPDATE public.malls SET name = $1, logo = $2 WHERE mall_id = $3 RETURNING *',
        [name, logo, mall_id]
      );
  
      if (updatedMall.rows.length === 0) {
        // Si no se encuentra el centro comercial con el ID especificado
        return response.status(404).json({
          message: 'Mall not found',
        });
      }
  
      response.status(200).json({
        message: 'Mall updated successfully!',
        data: updatedMall.rows[0],
      });
    } catch (error) {
      console.error(error.message);
      response.status(500).json({
        message: 'Something went wrong!',
      });
    }
  };
  


export const deleteMall = async (request, response) => {

    const { mall_id } = request.params

    // Verificar si el registro existe en la base de datos
    const mallExists = await pool.query('SELECT * FROM public.malls WHERE mall_id = $1', [mall_id]);
    if (mallExists.rows.length === 0) {
        response.status(404).json({
            message: 'El supermercado selecionado no existe!'
        });
        return;
    }

    try {

        // Eliminar el registro en la base de datos
        const deteledMall = await pool.query(
            `DELETE from public.malls WHERE mall_id = $1`, [mall_id]
        );
        response.status(200).json({
            message: 'El supermercado fue eliminado correctamente!!!',
            data: deteledMall.rows[0]
        });

    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: 'Parece ser que ha habido un error!'
        });
    }
}