'use client'

import Skeleton_viewer from "@/components/Skeleton_viewer"
import Image from "next/image"
import StarBorderPurple500SharpIcon from '@mui/icons-material/StarBorderPurple500Sharp';
import { toast } from "react-toastify"
import { Button } from "@mui/material"
import useSWR from "swr"
import axios from "axios"
import { useState, useRef } from "react"
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip from '@mui/material/Tooltip';
import DialogContentText from '@mui/material/DialogContentText';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PeopleIcon from '@mui/icons-material/People';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DialogActions from '@mui/material/DialogActions';
import { useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation";
import DateRangeIcon from '@mui/icons-material/DateRange';


const fetcher = (path) => axios(path).then(res => res.data).catch((error) => {
    console.log(error)
    toast.error(error.message)
    return error
})


function extractVideoId(videoLink) {
    const regex = /(?:\?v=|\/embed\/|\/watch\?v=|\/v\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = videoLink.match(regex);

    if (match) {
        return match[1];
    } else {
        return null; // Return null if no video ID is found
    }
}

export default function page({ params }) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [isFavorite, setIsFavorite] = useState(null)
    const [comment, setComment] = useState('')
    const [rating, setRating] = useState('5')
    const recipeid = params.recipeid
    const { data: recipe_data, error: recipe_error } = useSWR(`/api/recipe_details?id=${recipeid}`, fetcher)
    if (recipe_data) {
        if (isFavorite === null) {
            setIsFavorite(recipe_data.isFav)
            console.log('is fav? ' + recipe_data.isFav)
        }
    }
    console.log('is fav? ' + isFavorite)
    if (recipe_error) {
        console.log(recipe_error)
        toast.error(recipe_error.message)
        toast.error('Reload the page')
    }
    // const [ingredient_data, setIngredient_data] = useState()
    let ingredient_data = useRef(10)
    const showIngredient = async (temp_ingredientid) => {
        try {
            console.log(temp_ingredientid);
            const data = await (await axios.get(`/api/ingredient_info?id=${temp_ingredientid}`)).data
            console.log(ingredient_data.data);
            ingredient_data.current = data;
            setOpen(true);
        } catch (error) {
            console.error(error);
        }
    }
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
    const setFav = (is_fav) => {
        if (is_fav) {
            console.log('add')
            axios.post('/api/set_fav', {
                recipe_id: recipeid
            }).then((res) => {
                console.log(res.data)
                if (res.data.success) {
                    toast.success('Recipe added to favorites')
                }
                else {
                    throw new Error(res.data.message)
                }
            }).catch((e) => {
                toast.error(e.message)
            })
        }
        else {
            console.log('remove')
            axios.post('/api/remove_fav', {
                recipe_id: recipeid
            }).then((res) => {
                console.log(res.data)
                if (res.data.success) {
                    toast.success('Recipe removed from favorites')
                }
                else {
                    throw new Error(res.data.message)
                }
            }).catch((e) => {
                toast.error(e.message)
            })
        }
    }
    const debouncedSetFav = useCallback(debounce(setFav, 500), [])
    const addFav = () => {
        try {
            const is_fav = !isFavorite
            setIsFavorite(!isFavorite)
            debouncedSetFav(is_fav)
            console.log(is_fav)

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }
    const handleClose = () => {
        setOpen(false);
    };
    const [reviewOpen, setreviewOpen] = useState(false);

    const handleClickreviewOpen = () => {
        setreviewOpen(true);
    };

    const handleClickreviewClose = () => {
        setreviewOpen(false);
    };
    const submitReview = () => {
        handleClickreviewClose()
        console.log(comment, rating)
        axios.post('/api/add_review', {
            recipe_id: recipeid,
            comment: comment,
            rating: rating
        }).then((res) => {
            console.log(res.data)
            if (res.data.success) {
                toast.success('Review added')
                router.refresh()
            }
            else {
                throw new Error(res.data.message)
            }
        }).catch((e) => {
            toast.error(e.message)
        })

    }
    const handleDelete = () => {
        axios.post('/api/recipe_delete', {
            recipe_id: recipe_data?.recipes[0]?.RECIPE_ID
        }).then((res) => {
            console.log(res.data)
            if (res.data.success) {
                toast.success('Recipe deleted')
                router.push('/profile')
            }
            else {
                throw new Error(res.data.message)
            }
        }).catch((e) => {
            toast.error(e.message)
        })
    }

    return (
        <>
            <Dialog
                open={open && ingredient_data.current}
                onClose={handleClose}
            >
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    <h1 className='text-center text-2xl font-semibold'>
                        {ingredient_data.current?.data?.NAME}
                    </h1>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <div className='flex flex-col flex-wrap'>
                            <div className='flex flex-col flex-wrap'>
                                <h1 className='text-center text-2xl font-semibold'>Nutrition Facts</h1>
                                <h3 className='text-base'>
                                    CALORIES: {ingredient_data.current?.data?.CALORIES}
                                </h3>
                                <h3 className='text-base'>
                                    FAT: {ingredient_data.current?.data?.FAT}
                                </h3>
                                <h3 className='text-base'>
                                    CARBS: {ingredient_data.current?.data?.CARBOHYDRATE}
                                </h3>
                                <h3 className='text-base'>
                                    PROTEIN: {ingredient_data.current?.data?.PROTEIN}
                                </h3>
                                <h3 className='text-base'>
                                    FIBER: {ingredient_data.current?.data?.FIBER}
                                </h3>
                            </div>
                            <div className='flex flex-col flex-wrap'>
                                <h1 className='text-center text-2xl font-semibold'>Substitutes</h1>
                                <ul className='flex overflow-auto flex-col flex-wrap'>
                                    {
                                        ingredient_data.current?.substitute?.map((substitute) => {
                                            return (
                                                <li className='flex flex-row flex-wrap'>
                                                    <h3 className='text-base'>
                                                        {substitute?.SUBSTITUTE_NAME}
                                                    </h3>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
            {
                recipe_data ?
                    (<div className="flex flex-col justify-center h-full w-full">
                        <div className="flex mb-5 outline-double bg-blue-100  hover:shadow-md shrink flex-row justify-center w-full">
                            <div className="flex rounded-sm border-2 border-black flex-col m-2 justify-center w-1/3">
                                <Image src={`/recipe_images/${recipe_data?.medias[0]?.IMAGE}`} loading="lazy" quality={100}
                                    width="0"
                                    height="0"
                                    sizes="100vw"
                                    className="w-full h-auto" alt="logo" />
                            </div>
                            <div className="flex p-2 shrink flex-col justify-start w-full">
                                <h1 className="text-3xl font-bold">{recipe_data.recipes[0]?.TITLE}</h1>
                                <h2 className="text-xl font-semibold italic">Creator: {recipe_data.recipes[0]?.NAME}</h2>
                                <ul className="flex mt-3 border-2 border-black flex-row flex-wrap justify-center">
                                    <h1 className="mr-3">
                                        Category:
                                    </h1>
                                    {
                                        recipe_data?.categories?.map((category) => (
                                            <li className="hover:bg-blue-200 mr-1">
                                                {category.NAME}
                                            </li>
                                        ))
                                    }
                                </ul>
                                <div className="flex flex-row flex-wrap justify-between">
                                    <h1 className="text-sm mr-3 m-auto text-right font-bold">
                                        <DateRangeIcon />
                                        {recipe_data.recipes[0]?.MODIFICATION_DATE ? recipe_data.recipes[0]?.MODIFICATION_DATE : recipe_data.recipes[0]?.CREATION_DATE}</h1>
                                    <h1 className=" text-base italic m-auto">
                                        <StarBorderPurple500SharpIcon className=" bg-yellow-500" />
                                        Rating: {recipe_data.recipes[0]?.RATING}
                                    </h1>
                                    <Button onClick={addFav} className='inline mr-2 m-auto' endIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}>
                                        Add Favorite
                                    </Button>
                                    <h1 className=" text-base italic m-auto">
                                        <PeopleIcon /> {recipe_data.recipes[0]?.FAVOURITE_OF}
                                    </h1>
                                </div>
                                <div className="mt-2 w-full rounded border-2 border-black flex flex-row justify-center flex-wrap bg-blue-100 hover:bg-blue-200 hover:shadow-md">
                                    <h1 className="mr-3">
                                        Tags:
                                    </h1>
                                    <ul className="flex flex-row justify-center flex-wrap">
                                        {recipe_data?.tags?.map((tag) => (
                                            <li className="ml-1 mr-1 group">
                                                <Tooltip title={tag.DESCRIPTION} arrow>
                                                    <span className="group-hover:bg-yellow-400">{tag.NAME}</span>
                                                </Tooltip>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="flex flex-row justify-between mt-5 hover:shadow rounded w-full flex-wrap">
                                    <div className="flex-wrap flex flex-col justify-center w-1/2 o ">
                                        <h1 className="text-2xl underline font-bold">COOKING INSTRUCTION</h1>
                                        <ul className="flex flex-col  flex-wrap" style={{ listStyleType: "disc" }}>
                                            {
                                                recipe_data.recipes[0]?.COOKING_INSTRUCTION?.map((instruction) => (
                                                    <li className="flex-wrap flex-row mr-1 ml-2">
                                                        {instruction}
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                    <div className="flex-wrap flex flex-col justify-center w-1/2 items-end">
                                        <h1 className="text-2xl underline font-bold">INGREDIENTS</h1>
                                        <ul className="flex flex-col flex-wrap shrink" style={{ listStyleType: "disc" }}>
                                            {recipe_data.ingredients?.map((ingredient) => (
                                                <li className="mr-1 group">
                                                    <button
                                                        onClick={() => showIngredient(ingredient.INGREDIENT_ID)}
                                                        className="group-hover:text-yellow-600"
                                                    >
                                                        {ingredient.NAME}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="flex mt-3 flex-row justify-between bg-orange-100 w-full flex-wrap">
                                    <div className="hover:bg-orange-300 rounded-md p-2 m-2">
                                        Preparation time: {recipe_data.recipes[0]?.PREPARATION_TIME}
                                    </div>
                                    <div className=" hover:bg-orange-300 rounded-md p-2 m-2">
                                        Cooking-time: {recipe_data.recipes[0]?.COOKING_TIME}
                                    </div>
                                </div>
                                <ul className="flex w-full rounded bg-green-100 mt-2 flex-row justify-center flex-wrap">
                                    <h1 className="mr-3">
                                        NEUTRITION
                                    </h1>
                                    <li className="hover:bg-green-200 mr-2">
                                        CALORIES :{recipe_data.nutritions[0]?.CALORIES}
                                    </li>
                                    <li className="hover:bg-green-200 mr-2">
                                        PROTEIN:{recipe_data.nutritions[0]?.PROTEIN}
                                    </li>
                                    <li className="hover:bg-green-200 mr-2">
                                        CARBOHYDRATE :{recipe_data.nutritions[0]?.CARBOHYDRATE}
                                    </li>
                                    <li className="hover:bg-green-200 mr-2">
                                        FAT :{recipe_data.nutritions[0]?.FAT}
                                    </li>
                                    <li className="hover:bg-green-200 mr-2">
                                        FIBER :{recipe_data.nutritions[0]?.FIBER}
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-3 flex bg-blue-100 outline-double flex-row justify-start  boder-2 border-gray-400 rounded">
                            <iframe className="m-auto" width="560" height="315" src={`https://www.youtube.com/embed/${extractVideoId(recipe_data.medias[0]?.VIDEO_URL)}`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                        </div>

                        <div className="relative outline-double bg-blue-100 border-2 border-black rounded items-center w-full flex flex-col mt-3" style={{ maxHeight: '425px' }}>
                            <h1 className="text-center font-extrabold text-2xl m-3 rounded shadow-xl">
                                Reviews
                            </h1>
                            <ul className="relative rounded w-full flex flex-col p-2  overflow-y-auto max-h-fit hover:shadow-xl" >

                                {
                                    recipe_data.reviews.map((review) => (
                                        <li className=" border-2 hover:bg-blue-300 border-black rounded mr-1">
                                            <div className=" m-2 flex flex-col justify-center w-full ">
                                                <h1 className="text-2xl font-bold">{review.COMMENTS}</h1>
                                                <h2 className="text-xl italic">{review.NAME}</h2>
                                                <h3 className=" text-base italic text-left"><StarBorderPurple500SharpIcon /> {review.RATING}</h3>
                                                <h3 className=" text-base italic">{review.REVIEW_DATE}</h3>
                                            </div>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                        <div className="flex flex-row justify-between mt-5  w-full flex-wrap">
                            <Button variant="outlined" className="bg-blue-200 hover:bg-blue-400 hover:shadow text-black" onClick={handleClickreviewOpen}>
                                ADD REVIEW
                            </Button>
                            <Dialog
                                open={reviewOpen}
                                onClose={handleClickreviewClose}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >
                                <DialogTitle id="alert-dialog-title">
                                    {recipe_data?.recipes[0]?.NAME}
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        Add your review here. We would love to hear from you.
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <input className="border-2 border-black rounded-md m-2 p-2" type="text" placeholder="Comment" onChange={(e) => setComment(e.target.value)} required />
                                    <StarBorderPurple500SharpIcon className="bg-blue-200 m-2 border-black rounded border-2" />
                                    <select class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={rating}
                                        onChange={(e) => {
                                            setRating(e.target.value);
                                        }}
                                    >
                                        <option value="5">5</option>
                                        <option value="4">4</option>
                                        <option value="3">3</option>
                                        <option value="2">2</option>
                                        <option value="1">1</option>
                                    </select>
                                    <Button onClick={handleClickreviewClose} autoFocus>
                                        Cancel
                                    </Button>
                                    <Button type="submit" onClick={submitReview}>Save</Button>
                                </DialogActions>
                            </Dialog>
                            {
                                (recipe_data.recipes[0]?.USER_ID === recipe_data.userId) ? (
                                    <Button onClick={handleDelete} variant="outlined" className="bg-red-300 hover:bg-red-500 hover:shadow text-black" >
                                        Delete
                                    </Button>
                                ) : <></>
                            }
                            <Button variant="outlined" className="bg-blue-200 hover:bg-blue-400 hover:shadow text-black" >
                                <Link href={{
                                    pathname: '/shopping',
                                    query: {
                                        search: String(recipe_data.ingredients.map((ingredient) => JSON.stringify(ingredient)).join('-')),
                                    }
                                }}>
                                    Generate Shopping List
                                </Link>
                            </Button>
                        </div>
                    </div>
                    ) :
                    <Skeleton_viewer />
            }
        </>
    )
}