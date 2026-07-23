import { useState } from "react";
import Modal from "./modal";
import SpecialButton from "./specialButton";

const modals = [
    {
        title: "Supprimer un utilisateur",
        text: "Voulez-vous vraiment supprimer cet utilisateur ? Cette action est irréversible.",
        confirm: "Supprimer",
        variant: "danger",
    },
    {
        title: "Enregistrer les modifications",
        text: "Vous avez effectué des modifications. Souhaitez-vous les enregistrer ?",
        confirm: "Enregistrer",
        variant: "primary",
    },
    {
        title: "Déconnexion",
        text: "Êtes-vous sûr de vouloir vous déconnecter ?",
        confirm: "Déconnexion",
        variant: "secondary",
    },
    {
        title: "Téléchargement terminé",
        text: "Votre fichier a bien été téléchargé. Vous pouvez maintenant l'ouvrir.",
        confirm: "Ouvrir",
        variant: "primary",
    },
    {
        title: "Erreur",
        text: "Une erreur inattendue est survenue. Veuillez réessayer plus tard.",
        confirm: "Réessayer",
        variant: "danger",
    },
    {
        title: "Invitation",
        text: "Vous avez reçu une invitation à rejoindre le projet React Components.",
        confirm: "Accepter",
        variant: "primary",
    },
];

export default function ModalDemo() {
    const [isOpen, setIsOpen] = useState(false);
    const [modalData, setModalData] = useState(modals[0]);

    const openRandomModal = () => {
        const random =
            modals[Math.floor(Math.random() * modals.length)];

        setModalData(random);
        setIsOpen(true);
    };

    const handleConfirm = () => {
        alert(`Action : ${modalData.confirm}`);
        setIsOpen(false);
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
            }}
        >
            <SpecialButton
                label="Ouvrir une modal aléatoire"
                variant="primary"
                onClick={openRandomModal}
            />

            <Modal
                isOpen={isOpen}
                title={modalData.title}
                onClose={() => setIsOpen(false)}
                onConfirm={handleConfirm}
                confirmLabel={modalData.confirm}
                cancelLabel="Annuler"
                confirmVariant={modalData.variant}
                size="medium"
                closeOnOverlay={true}
            >
                <p>{modalData.text}</p>
            </Modal>
        </div>
    );
}