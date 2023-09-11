"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/editRecipe.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select';

export default function EditProfile() {
    const router = useRouter();

    // Create state variables to manage form input
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('/avatar/avatar.png');

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Add code here to update the user's profile data
        // You can make an API request to update the user's data
        // For example: axios.put('/api/update_profile', { firstName, lastName, email });
        // After a successful update, you can redirect the user to their profile page
        router.push('/profile');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Create a URL for the selected file
            const imageUrl = URL.createObjectURL(file);
            setAvatar(imageUrl); // Update the avatar image
        }
    };

    const ingredientOptions = [
        { value: 'ingredient1', label: 'Ingredient 1' },
        { value: 'ingredient2', label: 'Ingredient 2' },
        // Add more ingredient options as needed
    ];

    const categoryOptions = [
        { value: 'category1', label: 'Category 1' },
        { value: 'category2', label: 'Category 2' },
        // Add more category options as needed
    ];

    const tagOptions = [
        { value: 'tag1', label: 'Tag 1' },
        { value: 'tag2', label: 'Tag 2' },
        // Add more tag options as needed
    ];

    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        // This code will only run on the client-side
        // Initialize Bootstrap JavaScript when the component mounts
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/bootstrap/dist/js/bootstrap.bundle.min.js';
        script.async = true;
        script.onload = () => {
            // Bootstrap JavaScript has loaded
            // You can safely open the modal here
        };
        document.body.appendChild(script);
    }, []);

    return (
        <div className={styles.container}>
            <h1 className={`${styles.editProfileHeading}`}>Edit Recipe</h1>
            <hr />
            <div className="row">
                {/* left column */}
                <div className="col-md-8">
                    <div className={`${styles.photoUploadContainer}`}>
                        <img src={avatar} className={`${styles.avatar} ${styles['img-circle']}`} alt="avatar" />
                        <h4 className={`${styles.editProfileHeading}`}>Upload a different photo</h4>
                        <input type="file" className={`custom-file-input ${styles.formcontrol}`} onChange={handleFileChange} />
                    </div>
                </div>
                {/* edit form column */}
                <div className="col-md-9 personal-info" style={{ border: '2px solid black', padding: '40px', borderRadius: '10px' }}>
                    <h3 className={`${styles.editProfileHeading}`}>Recipe info</h3>
                    <form className="form-horizontal" role="form">
                        <div className={styles.formgroup}>
                            <label className={`col-lg-3 control-label ${styles.editProfileHeading}`}>Recipe title:</label>
                            <div className="col-lg-12">
                                <input className={styles.formcontrol} type="text" defaultValue="Swish Borger" />
                            </div>
                        </div>
                        {/* Dropdown for Ingredients */}
                        <div className={styles.formgroup}>
                            <label className={`control-label ${styles.editProfileHeading}`}>Ingredients:</label>
                            <div className="col-lg-12">
                                <Select
                                    className={styles.formcontrol}
                                    options={ingredientOptions}
                                    isMulti
                                    value={selectedIngredients}
                                    onChange={setSelectedIngredients}
                                    placeholder="Select ingredients..."
                                    closeMenuOnSelect={false}
                                />
                            </div>
                        </div>
                        {/* Dropdown for Add Category */}
                        <div className={styles.formgroup}>
                            <label className={`control-label ${styles.editProfileHeading}`}>Add Category:</label>
                            <div className="col-lg-12">
                                <Select
                                    className={styles.formcontrol}
                                    options={categoryOptions}
                                    isMulti
                                    value={selectedCategories}
                                    onChange={setSelectedCategories}
                                    placeholder="Select categories..."
                                    closeMenuOnSelect={false}
                                />
                            </div>
                        </div>
                        {/* Dropdown for Add Tags */}
                        <div className={styles.formgroup}>
                            <label className={`control-label ${styles.editProfileHeading}`}>Add Tags:</label>
                            <div className="col-lg-12">
                                <Select
                                    className={styles.formcontrol}
                                    options={tagOptions}
                                    isMulti
                                    value={selectedTags}
                                    onChange={setSelectedTags}
                                    placeholder="Select tags..."
                                    closeMenuOnSelect={false}
                                />
                            </div>
                        </div>
                        <div className={styles.formgroup}>
                            <label className={`control-label ${styles.editProfileHeading}`}>Preparation Time (minutes):</label>
                            <div className="col-lg-12">
                                <input className={styles.formcontrol} type="number" defaultValue="0" />
                            </div>
                        </div>
                        <div className={styles.formgroup}>
                            <label className={`control-label ${styles.editProfileHeading}`}>Cooking Time (minutes):</label>
                            <div className="col-lg-12">
                                <input className={styles.formcontrol} type="number" defaultValue="0" />
                            </div>
                        </div>
                        <div className={styles.formgroup}>
                            <label className={`control-label ${styles.editProfileHeading}`}>Cooking Instructions:</label>
                            <div className="col-lg-12">
                                <textarea className={styles.formcontrol} rows="15" defaultValue="Add cooking instructions here"></textarea>
                            </div>
                        </div>
                        <div className={styles.formgroup}>
                            <label className="col-md-3 control-label" />
                            <div className="col-md-8">
                                <input type="button" className={styles.btnprimary} defaultValue="Save Changes" />
                                <span style={{ margin: '0 10px' }} /> {/* Add margin to create space */}
                                <input type="reset" className={styles.btnsecondary} defaultValue="Cancel" />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
