'use client'
import { useRef, useState } from "react"
import Checkbox from '@mui/material/Checkbox';
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Button } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import { toast } from "react-toastify";

function Card({ heading = '', subHeading = '', image = '', line = true }) {
    return (
        <div className="flex flex-row flex-wrap hover:bg-gray-500 hover:text-blue-300 border-2 overflow-auto rounded border-black">
            {/* <div className="w-1/4 m-2">
                <Image width={60} height={60} src={image} />
            </div> */}
            <div className="flex flex-row flex-wrap overflow-auto justify-center">
                <h1 className={`text-2xl font-bold ml-3 mr-3 m-auto decoration-black decoration-double  ${line ? 'line-through' : ''}`}>{heading}</h1>
                <p className="text-sm italic ml-2 mr-2 m-auto">{subHeading}</p>
            </div>
        </div>
    )
}


export default function Shopping() {
    const searchParams = useSearchParams();
    const [open, setOpen] = useState(false);
    const [checkedIngredients, setCheckedIngredients] = useState(new Set());
    const [ingredients, setIngredients] = useState([]);
    if (searchParams.has('search')) {
        if (ingredients.length == 0)
            setIngredients(searchParams.get('search').split('-').map((ingredient) => {
                return JSON.parse(ingredient)
            }))
    }
    else {
        if (ingredients.length == 0)
            axios.get('/api/all_ingredients').then((response) => {
                console.log(response.data)
                setIngredients(response.data.data)
            }).catch((error) => {
                console.log(error)
            })
    }
    const handlecheck = async (ingredient_id) => {
        if (checkedIngredients.has(ingredient_id)) {
            setCheckedIngredients(prev => {
                prev.delete(ingredient_id);
                return new Set(prev);
            })
        }
        else {
            setCheckedIngredients(prev => {
                prev.add(ingredient_id);
                return new Set(prev);
            })
        }
        console.log(checkedIngredients)
    }
    let ingredient_data = useRef(10)
    const showIngredient = async (temp_ingredientid) => {
        try {
            console.log(temp_ingredientid);
            const data = await (await axios.get(`/api/ingredient_info?id=${temp_ingredientid}`)).data
            console.log(data);
            ingredient_data.current = data;
            console.log(ingredient_data);
            setOpen(true);
        } catch (error) {
            console.error(error);
        }
    }
    const handleClose = () => {
        setOpen(false);
    };
    const handleSave = () => {
        console.log(checkedIngredients)
        axios.post('/api/save_shopping_list', { ingredients: Array.from(checkedIngredients) }).then((response) => {
            console.log(response.data)
            if (response.data.succss) {
                toast.success('Shopping List Saved', { autoClose: 1000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined })
            }
            else {
                toast.error('Error Saving Shopping List', { autoClose: 1000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined })
            }
        }).catch((error) => {
            console.log(error)
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
            <div className="flex flex-col bg-white items-start w-full h-screen">
                <div className="flex m-5 flex-row flex-wrap justify-between">
                    <Button onClick={handleSave} variant="outlined" className=" bg-amber-400 hover:bg-red-400">
                        Shop
                    </Button>
                </div>
                <div className="flex mt-3 bg-slate-300 flex-col flex-wrap outline-double items-start w-full">
                {
                    ingredients?.map(ingredient => {
                        return (
                            <div className="flex flex-row flex-wrap m-3  justify-center">
                                <Checkbox checked={checkedIngredients.has(ingredient.INGREDIENT_ID)} onChange={() => { handlecheck(ingredient.INGREDIENT_ID) }} />
                                <Button onClick={() => { showIngredient(ingredient.INGREDIENT_ID) }} >
                                    <Card heading={ingredient.NAME} line={checkedIngredients.has(ingredient.INGREDIENT_ID)} />
                                </Button>
                            </div>
                        )
                    }
                    )
                }
                </div>
            </div>
        </>
    )
}