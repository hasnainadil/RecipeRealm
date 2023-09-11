'use client'
import Checkbox from '@mui/material/Checkbox';
import { useEffect } from 'react';
import RecipeCard from '@/components/RecipeCard';
import { useState } from 'react';
import axios from 'axios';
import { useCallback } from 'react';

import { toast } from 'react-toastify';

export default function Page() {
    const [Breakfast_recipes, setBreakfast_recipes] = useState([])
    const [Lunch_recipes, setLunch_recipes] = useState([])
    const [Dinner_recipes, setDinner_recipes] = useState([])
    const [BreakfastSet, setBreakfastSet] = useState(new Set())
    const [allowed_recipes, setAllowed_recipes] = useState(null);
    const [LunchSet, setLunchSet] = useState(new Set())
    const [DinnerSet, setDinnerSet] = useState(new Set())
    const [title, setTitle] = useState('')
    const [duration, setDuration] = useState('')
    const debounce = (func, delay) => {
        let timer;
        return function (...args) {
            const context = this;
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                timer = null;
                func.apply(context, args);
            }, delay);
        }
    }

    const handleBreakfastSearch = (event) => {
        axios.get('/api/mealplan?catagory=breakfast&search=' + event.target.value).then((res) => {
            setBreakfast_recipes(res.data.data)
        }
        )
    }
    const handleLunchSearch = (event) => {
        axios.get('/api/mealplan?catagory=lunch&search=' + event.target.value).then((res) => {
            setLunch_recipes(res.data.data)
        }
        )
    }
    const handleDinnerSearch = (event) => {
        axios.get('/api/mealplan?catagory=dinner&search=' + event.target.value).then((res) => {
            setDinner_recipes(res.data.data)
        }
        )
    }
    const optimizedBreakfastSearch = useCallback(debounce(handleBreakfastSearch, 500), []);
    const optimizedLunchSearch = useCallback(debounce(handleLunchSearch, 500), []);
    const optimizedDinnerSearch = useCallback(debounce(handleDinnerSearch, 500), []);
    const handleBreakfastCheckbox = (recipeID) => {
        if (BreakfastSet.has(recipeID)) {
            setBreakfastSet(prev => {
                prev.delete(recipeID);
                return new Set(prev);
            })
        }
        else {
            const allowed_ids = allowed_recipes.map((recipe)=>recipe.RECIPE_ID)
            if(!allowed_ids.includes(recipeID)){
                toast.warning('Your dietry restriction forbids this recipe.')
            }
            setBreakfastSet(prev => new Set(prev.add(recipeID)))
        }
    }
    const handleLunchCheckbox = (recipeID) => {
        if (LunchSet.has(recipeID)) {
            setLunchSet(prev => {
                prev.delete(recipeID);
                return new Set(prev);
            })
        }
        else {
            const allowed_ids = allowed_recipes.map((recipe)=>recipe.RECIPE_ID)
            if(!allowed_ids.includes(recipeID)){
                toast.warning('Your dietry restriction forbids this recipe.')
            }
            setLunchSet(prev => new Set(prev.add(recipeID)))
        }
    }
    const handleDinnerCheckbox = (recipeID) => {
        if (DinnerSet.has(recipeID)) {
            setDinnerSet(prev => {
                prev.delete(recipeID);
                return new Set(prev);
            })
        }
        else {
            const allowed_ids = allowed_recipes.map((recipe)=>recipe.RECIPE_ID)
            if(!allowed_ids.includes(recipeID)){
                toast.warning('Your dietry restriction forbids this recipe.')
            }
            setDinnerSet(prev => new Set(prev.add(recipeID)))
        }
    }

    useEffect(() => {
        axios.get('/api/mealplan?catagory=breakfast&search=').then((res) => {
            setBreakfast_recipes(res.data.data)
        })
        axios.get('/api/mealplan?catagory=lunch&search=').then((res) => {
            setLunch_recipes(res.data.data)
        })
        axios.get('/api/mealplan?catagory=dinner&search=').then((res) => {
            setDinner_recipes(res.data.data)
        })
        axios.get('/api/check_dietry').then((res)=>{
            setAllowed_recipes(res.data.data)
        })
    }, [])
    const handleclick = () => {
        axios.post('/api/create_mealplan', {
            title: title,
            duration: duration,
            breakfast: Array.from(BreakfastSet),
            lunch: Array.from(LunchSet),
            dinner: Array.from(DinnerSet)
        }).then((res) => {
            console.log(res)
            if(res.data.success)
            {
                toast.success('Meal Plan created')
            }
            else
            throw new Error(res.data.message)
        }).catch((err) => {
            console.log(err)
            toast.error(err.message)

        })
    }


    return (
        <div className="flex flex-col h-screen bg-white  items-start w-full">
            <div className='p-3 flex flex-row w-full justify-between flex-wrap border-2 border-black rounded'>
                <h1 className=" m-auto text-2xl text-left font-bold mb-3">
                    <input type="text" className="border-2 border-black rounded-md text-center text-black" placeholder='Title' onChange={(e) => setTitle(e.target.value)} />
                </h1>
                <h3 className=" m-auto text-lg mt-3 text-left underline font-bold">
                    <input type='number' className="border-2 border-black rounded-md text-center text-black" placeholder='Duration' onChange={(e) => setDuration(e.target.value)} /> Days
                </h3>
            </div>
            <div className="flex flex-row flex-wrap justify-between w-full">
                <div className="flex flex-col border-2 rounded p-3 border-black hover:shadow-lg shrink bg-white m-5 overflow-auto">
                    <h1 className="text-2xl font-bold">Breakfast</h1>
                    <input
                        type="search"
                        onChange={optimizedBreakfastSearch}
                        class="relative m-0 -mr-0.5 block w-[1px] min-w-full flex-auto rounded-l border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
                        placeholder="Search"
                        aria-label="Search"
                        aria-describedby="button-addon1" />
                    <div className="flex flex-col bg-white m-5 min-h-[20rem]  max-h-[20rem] overflow-auto">
                        {Breakfast_recipes?.map((recipe) => {
                            return (
                                <div className="flex flex-row flex-wrap justify-center">
                                    <Checkbox checked={BreakfastSet.has(recipe.RECIPE_ID)} name={recipe.RECIPE_ID} onChange={() => handleBreakfastCheckbox(recipe.RECIPE_ID)} />
                                    <RecipeCard image={`/recipe_images/${recipe.IMAGE}`} title={recipe.TITLE} publisher={"by- " + recipe.PUBLISHER_NAME} description={recipe.COOKING_INSTRUCTION} recipeID={recipe.RECIPE_ID} />
                                </div>
                            )

                        })}
                    </div>
                </div>
                <div className="flex flex-col border-2 rounded p-3 hover:shadow-lg  border-black shrink bg-white m-5 overflow-auto">
                    <h1 className="text-2xl font-bold">Lunch</h1>
                    <input
                        type="search"
                        onChange={optimizedLunchSearch}
                        class="relative m-0 -mr-0.5 block w-[1px] min-w-full flex-auto rounded-l border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
                        placeholder="Search"
                        aria-label="Search"
                        aria-describedby="button-addon1" />
                    <div className="flex flex-col bg-white m-5 min-h-[20rem]  max-h-[20rem] overflow-auto">
                        {Lunch_recipes?.map((recipe) => {

                            return (
                                <div className="flex flex-row flex-wrap justify-center">
                                    <Checkbox checked={LunchSet.has(recipe.RECIPE_ID)} name={recipe.RECIPE_ID} onChange={() => handleLunchCheckbox(recipe.RECIPE_ID)} />
                                    <RecipeCard image={`/recipe_images/${recipe.IMAGE}`} title={recipe.TITLE} publisher={"by- " + recipe.PUBLISHER_NAME} description={recipe.COOKING_INSTRUCTION} recipeID={recipe.RECIPE_ID} />
                                </div>
                            )

                        })}
                    </div>
                </div>
                <div className="flex flex-col border-2 rounded p-3 hover:shadow-lg border-black bg-white m-5 overflow-auto">
                    <h1 className="text-2xl font-bold">Dinner</h1>
                    <input
                        type="search"
                        onChange={optimizedDinnerSearch}
                        class="relative m-0 -mr-0.5 block w-[1px] min-w-full flex-auto rounded-l border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
                        placeholder="Search"
                        aria-label="Search"
                        aria-describedby="button-addon1" />
                    <div className="flex flex-col bg-white m-5 min-h-[20rem]  max-h-[20rem] overflow-auto">
                        {Dinner_recipes?.map((recipe) => {
                            return (
                                <div className="flex flex-row flex-wrap justify-center">
                                    <Checkbox checked={DinnerSet.has(recipe.RECIPE_ID)} name={recipe.RECIPE_ID} onChange={() => handleDinnerCheckbox(recipe.RECIPE_ID)} />
                                    <RecipeCard image={`/recipe_images/${recipe.IMAGE}`} title={recipe.TITLE} publisher={"by- " + recipe.PUBLISHER_NAME} description={recipe.COOKING_INSTRUCTION} recipeID={recipe.RECIPE_ID} />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <div className='w-full flex-col flex-wrap items-end'>

                <button className="bg-blue-500 mx-auto hover:bg-blue-700 text-white w-1/4 font-bold py-2 px-4 rounded" onClick={handleclick}>Save</button>
            </div>
        </div>

    )
}