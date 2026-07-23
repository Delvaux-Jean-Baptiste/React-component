import { useState } from 'react'
import Modal from './modal.jsx'


function ConfirmDialog({
    title= "Confirmation",
    text= "Are you certain?" ,
    confirmLabel = "Yes",
    variant = "primary",
    onConfirm = () => {}
}) {
    const [isOpen, setIsOpen] = useState(true);


    const handleConfirm = () => {
        onConfirm();
        setIsOpen(false);
    };
    return (
        <>
            <Modal
                    isOpen={isOpen}
                    title={title}
                    onClose={() => setIsOpen(false)}
                    onConfirm={handleConfirm}
                    confirmLabel={confirmLabel}
                    cancelLabel="Annuler"
                    confirmVariant={variant}
                    size="medium"
                    closeOnOverlay={true}
                >
                    <p>{text}</p>
            </Modal>
        </>
    )
}

export default ConfirmDialog
