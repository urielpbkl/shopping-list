import '../CSS/ShoppingList.css'
import { useState } from 'react'
import { useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { useDispatch } from 'react-redux'
import { setModal } from '../reducers/showModalSlice'
import { setEditProduct } from '../reducers/editProductSlice'

export const ShoppingList = () => {

    const modalDispatch = useDispatch()
    const editProductDispatch = useDispatch()
    const [shoppingListData, setShoppingListData] = useState([])


    const getProductData = async (product_id) => {

        try {
            const url = `http://localhost:8080/products/get-product-data/${product_id}` //SELECCIONAMOS CLIENTE POR SU "id"
            const respuesta = await fetch(url, {
                headers: {
                    "Content-type": "application/json"
                }
            }) //NO PONEMOS EL MÉTODO PORQUE "fetch" POR DEFECTO YA TRAE EL MÉTODO "GET"
            const resultado = await respuesta.json() //CREAMOS UN "JSON" QUE CONTENGA LOS DATOS DEL CLIENTE SELECCIONADO

            const { productData } = resultado

            return productData

        } catch (error) {
            console.log(error)
        }
    }

    const showAddProductForm = () => {
        editProductDispatch(setEditProduct({
            editProduct: false
        }))
        modalDispatch(setModal({
            showModal: true
        }))
    }

    const showEditProductForm = async (product_id) => {
        try {
            removeClassFromElements();
            const productData = await getProductData(product_id);
            editProductDispatch(
                setEditProduct({
                    editProduct: true,
                    editProductData: productData
                })
            );
            modalDispatch(
                setModal({
                    showModal: true
                })
            );
        } catch (error) {
            console.log(error);
        }
    };
    

    const removeClassFromElements = (product_id) => {
        const elements = document.getElementsByClassName('list-product-options-menu');

        for (let i = 0; i < elements.length; i++) {
            if (elements[i].id != product_id) {
                elements[i].className = 'hidden-list-product-options-menu'
            }
        }
    }

    const handleShowProductOptions = (product_id) => {
        removeClassFromElements(product_id)
        const productOptionsMenu = document.getElementById(product_id)
        if (productOptionsMenu.classList.contains('list-product-options-menu')) {
            productOptionsMenu.className = 'hidden-list-product-options-menu'
        } else {
            productOptionsMenu.className = 'list-product-options-menu'
        }
    }

    const getShoppingList = async () => {
        try {
            const url = `http://localhost:8080/products/get-all-products` //SELECCIONAMOS CLIENTE POR SU "id"
            const respuesta = await fetch(url, {
                headers: {
                    "Content-type": "application/json"
                }
            }) //NO PONEMOS EL MÉTODO PORQUE "fetch" POR DEFECTO YA TRAE EL MÉTODO "GET"
            const resultado = await respuesta.json() //CREAMOS UN "JSON" QUE CONTENGA LOS DATOS DEL CLIENTE SELECCIONADO
            const { shoppingList } = resultado
            setShoppingListData(shoppingList)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getShoppingList(getShoppingList)
    }, [])

    const updateShoppingData = async (product_id, mall_id) => {
        try {
            const url = `http://localhost:8080/products/change-product-mall/${product_id}/${mall_id}` //SELECCIONAMOS CLIENTE POR SU "id"
            await fetch(url, {
                method: 'PUT',
                headers: {
                    "Content-type": "application/json"
                }
            }) //NO PONEMOS EL MÉTODO PORQUE "fetch" POR DEFECTO YA TRAE EL MÉTODO "GET"
            //const resultado = await respuesta.json() 

        } catch (error) {
            console.log(error)
        }
    }

    const deleteProductFromShoppingList = async (product_id) => {

        removeClassFromElements()

        const confirmar = confirm('Realmente deseas eliminar este producto?')

        if (confirmar) {

            try {
                const url = `http://localhost:8080/products/delete-product-from-shopping-list/${product_id}` //SELECCIONAMOS CLIENTE POR SU "id"
                await fetch(url, {
                    method: 'DELETE',
                    headers: {
                        "Content-type": "application/json"
                    }
                }) //NO PONEMOS EL MÉTODO PORQUE "fetch" POR DEFECTO YA TRAE EL MÉTODO "GET"

                window.location.reload(false) //RECARGAMOS EL COMPONENTE UNA VEZ QUE HAYAMOS ENVIADO LOS DATOS

            } catch (error) {
                console.log(error)
            }
        }
    }


    const handleDragEnd = ({ destination, source }) => {
        // Si no hay destino, no se hace nada y se sale de la función
        if (!destination) return;

        // Crear una copia de shoppingListData
        const updatedList = [...shoppingListData];

        // Encontrar el índice del centro comercial de origen
        const sourceMallIndex = updatedList.findIndex(item => item.mall.mall_id === source.droppableId);

        // Encontrar el índice del centro comercial de destino
        const destinationMallIndex = updatedList.findIndex(item => item.mall.mall_id === destination.droppableId);

        // Si no se encuentra el centro comercial de origen o destino, no se hace nada y se sale de la función
        // En JavaScript, el valor -1 se utiliza comúnmente como una convención para indicar que no se encontró un elemento en una lista o matriz.
        if (sourceMallIndex === -1 || destinationMallIndex === -1) return;

        // Obtener la lista de productos del centro comercial de origen y destino
        const sourceProducts = updatedList[sourceMallIndex].products;
        const destinationProducts = updatedList[destinationMallIndex].products;

        // Si no se encuentran las listas de productos, no se hace nada y se sale de la función
        if (!sourceProducts || !destinationProducts) return;

        // Extraer el producto arrastrado de la lista de productos del centro comercial de origen
        const [draggedProduct] = sourceProducts.splice(source.index, 1);

        // Insertar el producto arrastrado en la lista de productos del centro comercial de destino en la posición correspondiente
        destinationProducts.splice(destination.index, 0, draggedProduct);

        // Actualizar los datos de la lista de compras
        setShoppingListData(updatedList);

        // Actualizar los datos en el servidor
        updateShoppingData(draggedProduct.product_id, destination.droppableId);
    };



    return (
        <div className='shopping-list-container'>
            <h1>My shopping list</h1>
            <div
                className='add-new-product-btn-container'
            >
                <button
                    className='add-new-product-btn'
                    onClick={showAddProductForm}
                >
                    <svg className="w-6 h-6 add-new-product-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M12 5.25a.75.75 0 01.75.75v5.25H18a.75.75 0 010 1.5h-5.25V18a.75.75 0 01-1.5 0v-5.25H6a.75.75 0 010-1.5h5.25V6a.75.75 0 01.75-.75z" clipRule="evenodd" />
                    </svg>

                </button>
            </div>
            <DragDropContext onDragEnd={handleDragEnd}>
                <ul className="shopping-list">
                    {shoppingListData.map((item, index) => {
                        const { mall, products } = item
                        return (
                            <div
                                key={index}
                            >
                                <li className='shopping-list-mall-name-list-item'>
                                    <span>
                                        {mall.name}
                                    </span>
                                    <img className='shopping-list-mall-logo' src={`http://localhost:8080/static/${mall.logoUrl}`} alt="item" />
                                </li>
                                <Droppable
                                    droppableId={mall.mall_id}
                                >
                                    {provided => (
                                        <ol
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                        >
                                            <li
                                                className='shopping-list-product-display-none'
                                            ></li>
                                            {products.map((product, indice) => {
                                                const { product_id, name, category } = product
                                                return (
                                                    <Draggable
                                                        key={indice}
                                                        draggableId={product_id}
                                                        index={indice}
                                                    >
                                                        {(provided) => (
                                                            <li
                                                                className='shopping-list-product'
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                            >
                                                                <div className='list-product-data-container'>
                                                                    <span className='list-product-categorie'>
                                                                        {category}
                                                                    </span>
                                                                    <p className='list-product-name'>
                                                                        {name}
                                                                    </p>
                                                                </div>
                                                                <div className='edit-list-product-btn-container'>
                                                                    <button
                                                                        className='edit-list-product-btn'
                                                                        onClick={() => handleShowProductOptions(product_id)}
                                                                    >
                                                                        <svg
                                                                            className="w-6 h-6 edit-list-product-btn-logo"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            strokeWidth={1.5}
                                                                            stroke="currentColor"
                                                                        >
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                                                                        </svg>
                                                                    </button>
                                                                    <div
                                                                        id={product_id}
                                                                        className='hidden-list-product-options-menu'
                                                                    >
                                                                        <button
                                                                            className='list-product-option-btn option-edit-btn'
                                                                            onClick={() => showEditProductForm(product_id)}
                                                                        >
                                                                            Editar
                                                                            <svg className="w-6 h-6 list-product-option-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                                                                <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                                                                            </svg>
                                                                        </button>
                                                                        <button
                                                                            className='list-product-option-btn option-delete-btn'
                                                                            onClick={() => deleteProductFromShoppingList(product_id)}
                                                                        >
                                                                            Eliminar
                                                                            <svg className="w-6 h-6 list-product-option-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                                                                <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" />
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        )}
                                                    </Draggable>
                                                )
                                            })}
                                            {provided.placeholder} {/* Marcador de posición para el componente */}
                                        </ol>
                                    )}
                                </Droppable>
                            </div>
                        )
                    })}
                </ul>
            </DragDropContext>
        </div>
    );
}