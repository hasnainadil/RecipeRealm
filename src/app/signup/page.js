"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify';
import axios from 'axios';
import Link from 'next/link';

const Signup = () => {
    const router = useRouter();
    router.prefetch('/login')
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        emailAddress: '',
        PASSWORD: '',
        password_confirmation: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.PASSWORD !== formData.password_confirmation) {
            throw new Error("Password and confirm password do not match");
        }
        else {
            delete formData.password_confirmation;
        }
        console.log(formData);
        try {
            axios.post('/api/signup', formData).then((res) => {
                if (res.data.success) {
                    toast.success('Signup successful', { hideProgressBar: true, autoClose: 1000 });
                    router.push('/login');
                }
                else {
                    throw new Error(res.data.message);
                }
            }).catch((err) => {
                toast.error('Signup failed ' + err.message, { hideProgressBar: true, autoClose: 1000 });
            });
        } catch (error) {
            toast.error('Signup failed ' + error.message, { hideProgressBar: true, autoClose: 1000 });
        }
    };

    return (
        <div>
            <div className="flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0 bg-gradient-to-br from-black via-gray-50 to-black">
                <div>
                    <a href="/">
                        <h3 className="text-4xl font-bold text-yellow-500">
                            RecipeRealm
                        </h3>
                    </a>
                </div>
                <div className="w-full px-6 py-4 mt-6 overflow-hidden bg-white bg-opacity-5 shadow-md sm:max-w-lg sm:rounded-lg">
                    <form onChange={handleChange}>
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-yellow-600 undefined"
                            >
                                First Name
                            </label>
                            <div className="flex flex-col items-start">
                                <input
                                    type="text"
                                    name="first_name"
                                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </div>
                        </div>
                        <div className='mt-4'>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-yellow-600 undefined"
                            >
                                Last Name
                            </label>
                            <div className="flex flex-col items-start">
                                <input
                                    type="text"
                                    name="last_name"
                                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-yellow-600 undefined"
                            >
                                Email
                            </label>
                            <div className="flex flex-col items-start">
                                <input
                                    type="email"
                                    name="emailAddress"
                                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-yellow-600 undefined"
                            >
                                Password
                            </label>
                            <div className="flex flex-col items-start">
                                <input
                                    type="password"
                                    name="PASSWORD"
                                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label
                                htmlFor="password_confirmation"
                                className="block text-sm font-medium text-yellow-600 undefined"
                            >
                                Confirm Password
                            </label>
                            <div className="flex flex-col items-start">
                                <input
                                    type="password"
                                    name="password_confirmation"
                                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </div>
                        </div>
                        <div className="flex items-center mt-4">
                            <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-yellow-600 rounded-md hover:bg-yellow-500 focus:outline-none focus:bg-yellow-500" onClick={handleSubmit}>
                                Register
                            </button>
                        </div>
                    </form>
                    <div className="mt-4 text-grey-600">
                        Already have an account?{" "}
                        <span>
                            <Link className="text-yellow-600 hover:underline" href="/login">
                                Log in
                            </Link>
                        </span>
                    </div>

                    <div className="my-6 space-y-2">
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;