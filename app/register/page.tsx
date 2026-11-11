import Link from "next/link";
import { signUp } from "./../actions/auth";
import { AuthForm } from "../components/common/AuthForm";
import { error } from "console";

const RegisterPage = () => {
    return (

        <>
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-6">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <img className="mx-auto h-10 w-auto" src="" alt="Logo" />
                    <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm leading-5 text-blue-500 max-w">
                        Or

                        <Link
                            href={"/login"}
                            className="font-medium text-blue-500 hover:text-blue-500 focus:outline-none focus:underline transition ease-in-out duration-150">
                            &nbsp; Sign in
                        </Link>
                    </p>
                </div>
                <div>
                            <AuthForm action={signUp} isRegister />
                </div>
            </div>
        </>
    );
};

export default RegisterPage;