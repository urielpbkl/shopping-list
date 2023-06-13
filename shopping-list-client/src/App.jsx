import { ShoppingList } from "./components/ShoppingList"
import './app.css'
import { Modal } from "./components/Modal"
import { ProductForm } from "./components/ProductForm"
import { useSelector } from "react-redux"


function App() {

  const { showModal } = useSelector(state => state.modal) //CONSUMIMOS EL STATE A TRAVÉS DE REDUX

  return (
    <>
      <div className="shopping-list-app-principal-container">
        {showModal ? (
          <Modal>
            <ProductForm />
          </Modal>
        ) : ''}
        <ShoppingList />
      </div>
    </>
  )
}

export default App
