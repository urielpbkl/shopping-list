import { useDispatch } from 'react-redux'
import '../CSS/Modal.css'
import { setModal } from '../reducers/showModalSlice'

export const Modal = ({ children }) => {

    const modalDispatch = useDispatch()

    const closeModal = () => {
        modalDispatch(setModal({
            showModal: false
        }))
    }

    return (
        <div className='modal-container'>
            <div className='contenido-modal'>
                <div className='close-btn-container'>
                    <button
                        className='close-modal-btn'
                        onClick={closeModal}
                    >
                        <svg className="w-6 h-6 close-modal-btn-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>

                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}
