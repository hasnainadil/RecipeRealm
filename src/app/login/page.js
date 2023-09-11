"use client"
import React, { useState } from 'react';
import { useEffect } from 'react';
import Link from 'next/link'; // Import Link from Next.js
import { useRouter } from 'next/navigation'; // Import useRouter from Next.js
import { toast } from "react-toastify";
import Image from 'next/image';
import styles from '@/styles/login.module.css'; // Import the CSS module
import axios from 'axios';
import images  from '@/constants/images';

const Login = () => {
    const router = useRouter()
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Login form submitted")
        console.log(formData)
        try {
            axios.post('/api/login', formData).then((res) => {
                console.log(res.data)
                if(res.data.success){
                    toast.success("Login success", { hideProgressBar: true, autoClose: 1000 })
                    router.push("/profile")
                }
                else{
                    throw new Error(res.data.message)
                }
            }).catch((err) => {
                console.log(err)
                toast.error(err.message, { hideProgressBar: true, autoClose: 1000 });
            })
        } catch (error) {
            toast.error(error.message, { hideProgressBar: true, autoClose: 1000 });
        }
    };
    useEffect(() => {
        router.refresh()
        router.prefetch("/profile")
        router.prefetch("/signup")
        setFormData({
            email: "",
            password: ""
        })
    }, []);

    return (
        <div className={styles.container} >
            <div className={styles.backgroundImages}></div>
            <Link  href={'/home'} class="flex text-4xl font-serif flex-col items-center justify-center mx-auto m-10">
            <Image loading='lazy' class="w-15 h-15 m-2" src={images.RR} alt="logo" /></Link>
            <div className={styles.loginForm}>
                <h1 className={styles.title}><b>Log In</b></h1>
                <form className={styles.form}>
                    <div className={styles.formGroup}>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className={styles.input}
                        />
                    </div>
                    <button type="submit" className={styles.button} onClick={handleSubmit}>
                        Log In
                    </button>
                </form>
                <p className="text-yellow-500 text-shadow-md">
                    Don't have an account?{' '}
                    <Link className={styles.signupText} href="/signup">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;