"use client";

import "../../src/styles/styles.css"
import { useState, useTransition } from "react";
import { ConfirmModal } from "../common/ConfirmModal" 

type AuthFormProps = {
    action: (formdata: FormData) => Promise<{ error: string } | void>;
    isRegister?: boolean;
}

export const AuthForm = ({ action, isRegister = false }: AuthFormProps) => {
    const [error, setError] = useState<string | null>();
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleSubmit = async (formData: FormData) => {
        setError(null);
        startTransition(async () => {
            const result = await action(formData);
            if (result?.error) {
                setError(result.error);
            }
        });
    }
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
    }

    return <form action={handleSubmit} className="w-full space-y-4">
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        {isRegister && (
                            <div>
                            <label htmlFor="Name" className="block text-sm font-medium leading-5  text-gray-700">Name</label>
                                <input
                                    type="text"
                                    id="Name"
                                    name="Name"
                                    required
                                    placeholder="What's your name"
                                    autoComplete="false"
                                    className="input-field" >
                                </input>
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-5  text-gray-700">Email address</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    placeholder="user@example.com"
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    autoComplete="false"
                                    className="input-field" />

                            </div>
                        </div>

                        <div className="mt-6">
                            <label htmlFor="password" className="block text-sm font-medium leading-5 text-gray-700">Password</label>
                            <div className="mt-1 rounded-md shadow-sm">
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    required
                                    placeholder="******"
                                    autoComplete="false"
                                    minLength={6}
                                    className="input-field" />
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                            <div className="flex items-center">
                                <input id="remember_me" name="remember" type="checkbox" value="1" className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out" />
                                <label htmlFor="remember_me" className="ml-2 block text-sm leading-5 text-gray-900">Remember me</label>
                            </div>

                            <div className="text-sm leading-5">
                                <a href="#" onClick={() => {alert('Sorry not available!');}}
                                    className="font-medium text-blue-500 hover:text-blue-500 focus:outline-none focus:underline transition ease-in-out duration-150">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        <div className="mt-6">
                            <span className="block w-full rounded-md shadow-sm">
                                <button type="submit" disabled={isPending} className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out" >
                                    {isPending ? "Loading . . . . ." : isRegister ? "Sign Up" : "Sign In"}
                                </button>
                            </span>
                        </div>
                        <div className="pt-3">
                            {error && (
                                <div className="text-red-800 border border-red-800 p-1 bg-red-300">
                                    {error}

                                    <ConfirmModal
                                            isOpen={isModalOpen}
                                            onClose={handleCloseModal}
                                            onConfirm={() => {}}
                                            title="Title"
                                            error={error}
                                            message={
                                              
                                                `Are you sure you want to delete this product`
                                            }
                                            confirmText="Delete"
                                            cancelText="Cancel"
                                            variant="danger"
                                            isLoading={true}
                                            isConfirm={false} />
                                </div>

                                
                            )}
                        </div>

                </div>
            </div>
    </form>;
}