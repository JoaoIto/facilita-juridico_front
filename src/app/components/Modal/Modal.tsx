import React, {CSSProperties, useState} from 'react';
import Button from "@mui/material/Button";

export const Modal: React.FC<IModal> = ({isOpen, setModalOpen, children}) => {

    if (isOpen) {
        return (
            <div className={`fixed h-screen w-screen bg-black opacity-90 flex items-center justify-center`}>
                <div className={`flex flex-col w-3/4 h-1/3 items-center self-center bg-white border border-4 border-slate-700 rounded-lg shadow-md p-10`}>
                    {children}
                    <Button className="self-end bg-blue-900 m-2" type="submit" variant="contained" color="primary"
                            onClick={setModalOpen}>
                        Fechar
                    </Button>
                </div>
            </div>
        );
    }
    return null;
};

