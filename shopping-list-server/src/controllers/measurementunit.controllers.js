import { pool } from "../database/database.js";
import { v4 as uuidv4 } from 'uuid';


export const addNewMeasurementUnit = async (request, response) => {

    const { name } = request.body

    const measurementunit_id = uuidv4()

    try {
        const newMeasurementUnit = await pool.query(
            `INSERT INTO public.measurementunit (measurementunit_id, name) VALUES($1, $2) RETURNING *`,
            [measurementunit_id, name]
        )
        response.status(201).json({
            message: 'Unidad de medida creada exitosamente!',
            data: newMeasurementUnit.rows[0]
        })
    } catch (error) {
        console.error(error.message)
        response.status(500).json({
            message: 'Something went wrong!'
        })
    }
}


export const getAllMeasurementUnits = async (request, response) => {

    try {
        const measurementUnits = await pool.query('SELECT * FROM public.measurementunit')
        response.status(200).json({
            measurementUnits: measurementUnits.rows
        })
    } catch (error) {
        console.error(error.message)
        response.status(500).json({
            message: 'Something went wrong!'
        })
    }
}


export const editMeasurementUnit = async (request, response) => {

    const { name } = request.body;
    const { measurementunit_id } = request.params

    // Verificar si el registro existe en la base de datos
    const measurementUnitExists = await pool.query('SELECT * FROM public.measurementunit WHERE measurementunit_id = $1', [measurementunit_id]);
    if (measurementUnitExists.rows.length === 0) {
        response.status(404).json({
            message: 'La unidad de medida no existe!'
        });
        return;
    }

    try {

        // Actualizar los datos del registro en la base de datos
        const editedMeasurementUnit = await pool.query(
            `UPDATE public.measurementunit SET name = $1  WHERE measurementunit_id = $2 RETURNING *`, [name, measurementunit_id]
        );

        response.status(200).json({
            message: 'La unidad de medida se actualizó correctamente!!!',
            data: editedMeasurementUnit.rows[0]
        });

    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: 'Parece ser que ha habido un error!'
        });
    }
}


export const deleteMeasurementUnit = async (request, response) => {

    const { measurementunit_id } = request.params

    // Verificar si el registro existe en la base de datos
    const measurementuNitExists = await pool.query('SELECT * FROM public.measurementunit WHERE measurementunit_id = $1', [measurementunit_id]);
    if (measurementuNitExists.rows.length === 0) {
        response.status(404).json({
            message: 'La unidad de medida no existe!'
        });
        return;
    }

    try {

        // Eliminar el registro en la base de datos
        const deteledMeasurementUnit = await pool.query(
            `DELETE from public.measurementunit WHERE measurementunit_id = $1`, [measurementunit_id]
        );
        response.status(200).json({
            message: 'La unidad de medida fue eliminada correctamente!!!',
            data: deteledMeasurementUnit.rows[0]
        });

    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: 'Parece ser que ha habido un error!'
        });
    }
}