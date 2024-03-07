interface IModal {
    isOpen: boolean;
    setModalOpen: () => void;
    children: React.ReactNode;
}