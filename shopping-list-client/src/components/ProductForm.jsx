import { useEffect } from "react"
import { useState } from "react"
import { useSelector } from "react-redux"
import '../CSS/ProductForm.css'


export const ProductForm = () => {

    const { editProduct, editProductData } = useSelector(state => state.editProduct) //CONSUMIMOS EL STATE A TRAVÉS DE REDUX
    const [productName, setProductName] = useState(editProductData ? editProductData.name : '')
    const [mallName, setMallName] = useState(editProductData ? editProductData.mall : '')
    const [category, setCategory] = useState(editProductData ? editProductData.category : '')
    const [quantity, setQuantity] = useState(editProductData ? editProductData.quantity : '')
    const [measurementUnit, setMeasurementUnit] = useState(editProductData ? editProductData.measurementunit : '')
    const [malls, setMalls] = useState([])
    const [categories, setCategories] = useState([])
    const [measurementUnits, setMeasurementUnits] = useState([])

    const getMalls = async () => {
        try {
            const url = `http://localhost:8080/malls/get-all-malls` //SELECCIONAMOS CLIENTE POR SU "id"
            const respuesta = await fetch(url, {
                method: 'GET',
                headers: {
                    "Content-type": "application/json"
                }
            }) //NO PONEMOS EL MÉTODO PORQUE "fetch" POR DEFECTO YA TRAE EL MÉTODO "GET"
            const resultado = await respuesta.json() //CREAMOS UN "JSON" QUE CONTENGA LOS DATOS DEL CLIENTE SELECCIONADO

            const { malls } = resultado
            setMalls(malls)

        } catch (error) {
            console.log(error)
        }
    }

    const getCategories = async () => {
        try {
            const url = `http://localhost:8080/categories/get-all-categories` //SELECCIONAMOS CLIENTE POR SU "id"
            const respuesta = await fetch(url, {
                method: 'GET',
                headers: {
                    "Content-type": "application/json"
                }
            }) //NO PONEMOS EL MÉTODO PORQUE "fetch" POR DEFECTO YA TRAE EL MÉTODO "GET"
            const resultado = await respuesta.json() //CREAMOS UN "JSON" QUE CONTENGA LOS DATOS DEL CLIENTE SELECCIONADO

            const { categories } = resultado
            setCategories(categories)

        } catch (error) {
            console.log(error)
        }
    }

    const getAllMeasurementUnits = async () => {
        try {
            const url = `http://localhost:8080/measuerementunits/get-all-measurement-units` //SELECCIONAMOS CLIENTE POR SU "id"
            const respuesta = await fetch(url, {
                method: 'GET',
                headers: {
                    "Content-type": "application/json"
                }
            }) //NO PONEMOS EL MÉTODO PORQUE "fetch" POR DEFECTO YA TRAE EL MÉTODO "GET"
            const resultado = await respuesta.json() //CREAMOS UN "JSON" QUE CONTENGA LOS DATOS DEL CLIENTE SELECCIONADO

            const { measurementUnits } = resultado

            setMeasurementUnits(measurementUnits)

        } catch (error) {
            console.log(error)
        }
    }

    const addProduct = async (e) => {
        e.preventDefault()
        const productData = {
            "name": productName,
            "mall": mallName,
            "category": category,
            "quantity": quantity,
            "measurementunit": measurementUnit
        }
        try {
            const url = `http://localhost:8080/products/add-product/`
            await fetch(url, {
                method: 'POST',
                body: JSON.stringify(productData),
                headers: {
                    "Content-type": "application/json"
                }
            })
            window.location.reload(false) //RECARGAMOS EL COMPONENTE UNA VEZ QUE HAYAMOS ENVIADO LOS DATOS

        } catch (error) {
            console.log(error)
        }
    }

    const handleEditProduct = async (e) => {
        e.preventDefault()
        const productData = {
            "name": productName,
            "mall": mallName,
            "category": category,
            "quantity": quantity,
            "measurementunit": measurementUnit
        }

        try {
            const url = `http://localhost:8080/products/edit-product/${editProductData.product_id}`
            await fetch(url, {
                method: 'PUT',
                body: JSON.stringify(productData),
                headers: {
                    "Content-type": "application/json"
                }
            })
            window.location.reload(false) //RECARGAMOS EL COMPONENTE UNA VEZ QUE HAYAMOS ENVIADO LOS DATOS

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getMalls()
        getCategories()
        getAllMeasurementUnits()
    }, [])


    return (
        <div className="add-new-product-form-container">
            {editProduct ? (
                <h2>Editar producto</h2>
            ) : (
                <h2>Agregar un nuevo producto</h2>
            )}
            <form
                className="add-new-product-form"
                onSubmit={(e) => {
                    editProduct ? handleEditProduct(e) :
                    addProduct(e)
                }}
            >
                <input
                    type="text"
                    name='productName'
                    id='productName'
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                />
                <select
                    id="malls"
                    name="malls"
                    value={mallName}
                    onChange={(e) => setMallName(e.target.value)}
                    required
                >
                    <option className='' value="">
                        --Selecciona un supermercado--
                    </option>
                    {malls.map((item, index) => {
                        const { mall_id, name } = item
                        return (
                            <option
                                key={index}
                                value={mall_id}
                            >
                                {name}
                            </option>
                        )
                    }
                    )}
                </select>
                <select
                    id="categories"
                    name="categories"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                >
                    <option className='' value="">
                        --Selecciona una categoría--
                    </option>
                    {categories.map((item, index) => {
                        const { category_id, name } = item
                        return (
                            <option
                                key={index}
                                value={category_id}
                            >
                                {name}
                            </option>
                        )
                    }
                    )}
                </select>
                <input
                    type="number"
                    name='quantity'
                    id='quantity'
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                />
                <select
                    id="measurementUnits"
                    name="measurementUnits"
                    value={measurementUnit}
                    onChange={(e) => setMeasurementUnit(e.target.value)}
                    required
                >
                    <option className='' value="">
                        --Selecciona el tipo de medida--
                    </option>
                    {measurementUnits.map((item, index) => {
                        const { measurementunit_id, name } = item
                        return (
                            <option
                                key={index}
                                value={measurementunit_id}
                            >
                                {name}
                            </option>
                        )
                    }
                    )}
                </select>
                <button className="add-product-btn">
                    {!editProduct ? "Agregar Producto" : "Guardar cambios"}
                </button>
            </form>
        </div>
    )
}
