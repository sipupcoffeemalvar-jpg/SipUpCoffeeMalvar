"use client"

import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    variant: "danger" | "warning" | "info";
    isLoading?: boolean;
    error?: string | null;
    isConfirm?: boolean;
}

export const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText,
    cancelText,
    variant = "danger",
    isLoading = false,
    error,
    isConfirm = false,
}: ConfirmModalProps) => {

    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
    }
    const handleClose = () => {
        //alert('das');
        onClose();
    }

    const variantStyle = {
        danger: {
            icon: "text-red-600 text-red-400",
            button: "bg-red-500 hover:bg-red-600",
        },
        warning: {
            icon: "text-red-600 text-red-400",
            button: "bg-amber-500 hover:bg-amber-600",
        },
        info: {
            icon: "text-red-600 text-red-400",
            button: "bg-blue-500 hover:bg-blue-600",
        }
    };

    const style = variantStyle[variant];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black-400 p-4">
            <div className="w-full max-w-md rounded-lg border border-gray-800 bg-gray-400 shadow-1">
                <div className="flex items-center gap-4">
                    {/* <AlertTriangle className={`h-5 w-5 $(styles.icon)`} />asd */}

                    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur confirm-dialog ">
                        <div className="relative px-4 min-h-screen md:flex md:items-center md:justify-center">
                            <div className=" opacity-25 w-full h-full absolute z-10 inset-0"></div>
                            <div className="bg-white rounded-lg md:max-w-md md:mx-auto p-4 fixed inset-x-0 bottom-0 z-50 mb-4 mx-4 md:relative shadow-lg">
                                <div className="md:flex items-center">
                                    <div className="rounded-full flex items-center justify-center w-16 h-16 flex-shrink-0 mx-auto">
                                        <i className="bx bx-error text-3xl">
                                            &#9888;
                                        </i>
                                    </div>
                                    <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                                        <p className="font-bold">Warning!</p>
                                        <p className="text-sm text-gray-700 mt-1">You will lose all of your data by deleting this. This action cannot be undone.
                                        </p>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-300">{message}</p>
                                </div>
                                <div className="p-6">
                                    {error && 
                                        <div className="p-6">
                                            <p className="text-red-300 bg-ref">{message}</p>
                                        </div>
                                    }
                                </div>
                                <div className="text-center md:text-right mt-4 md:flex md:justify-end">
                                    {isConfirm &&(
                                    <button id="confirm-delete-btn" className={`block cursor-pointer 
                                        ${style.button} disabled:opacity-50 
                                        w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-red-200 text-white-700 rounded-lg font-semibold text-sm md:ml-2 md:order-2`}
                                        onClick={handleConfirm}
                                        disabled={isLoading}
                                        type="button">
                                        {
                                            isLoading
                                                ? "Processing . . . "
                                                : confirmText
                                        }
                                    </button>
                                    )}
                                    <button id="confirm-cancel-btn" className="block cursor-pointer 
                                        w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-gray-200 rounded-lg font-semibold text-sm mt-4 md:mt-0 md:order-1"
                                        onClick={handleClose}
                                        disabled={isLoading}
                                        type="button">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    );
};


export default ConfirmModal;