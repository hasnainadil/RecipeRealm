'use client'
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import Link from 'next/link';
import useSWR from 'swr';
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog } from '@mui/material';
import { DialogTitle } from '@mui/material';
import { DialogContent } from '@mui/material';
import { DialogContentText } from '@mui/material';

const fetcher = (url) => axios.get(url).then((res) => res.data).catch((err) => console.log(err))

export default function MealPlan() {
    const router = useRouter()
    const { data: mealplans } = useSWR('/api/all_mealplans', fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: true
    })
    const [mealplan_data, set_mealplan_data] = useState(null)
    const [open, setOpen] = useState(false)
    const show_mealplan = (id) => {
        axios.get('/api/mealplan_info', { params: { id: id } }).then((res) => {
            set_mealplan_data(res.data)
            setOpen(true)
        }).catch((err) => console.log(err))
    }
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Dialog
                open={open && mealplan_data}
                onClose={handleClose}
            >
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    <h1 className='text-center text-2xl font-semibold'>
                        {mealplan_data?.data[0].PLAN_NAME}
                    </h1>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <div className='flex flex-col items-start flex-wrap'>
                            <h3 className='text-center text-base italic font-semibold'>{mealplan_data?.data[0]?.CREATION_DATE}</h3>
                            <h3 className='text-center text-base italic font-semibold'>{mealplan_data?.data[0]?.DURATION} </h3>
                            <div className='flex flex-row flex-wrap'>
                                <h2 className='text-center text-xl font-semibold'>Breakfast</h2>
                                <div className='flex flex-col overflow-auto w-full h-20'>
                                    {mealplan_data?.data.map((meal) => {
                                        if (meal.MEAL_SLOT === 'Breakfast') {
                                            return (
                                                <Link href={'recipe/' + meal.RECIPE_ID}>
                                                    {meal.RECIPE_TITLE}
                                                </Link>
                                            )
                                        }
                                    })}
                                </div>

                            </div>
                            <div className='flex flex-row flex-wrap'>
                                <h2 className='text-center text-xl font-semibold'>Lunch</h2>
                                <div className='flex flex-col overflow-auto w-full h-20'>
                                    {mealplan_data?.data.map((meal) => {
                                        if (meal.MEAL_SLOT === 'Lunch') {
                                            return (
                                                <Link href={'recipe/' + meal.RECIPE_ID}>
                                                    {meal.RECIPE_TITLE}
                                                </Link>
                                            )
                                        }
                                    })}
                                </div>
                            </div>
                            <div className='flex flex-row flex-wrap'>
                                <h2 className='text-center text-xl font-semibold'>Dinner</h2>
                                <div className='flex flex-col overflow-auto w-full h-20'>
                                    {mealplan_data?.data.map((meal) => {
                                        if (meal.MEAL_SLOT === 'Dinner') {
                                            return (
                                                <Link href={'recipe/' + meal.RECIPE_ID}>
                                                    {meal.RECIPE_TITLE}
                                                </Link>
                                            )
                                        }
                                    })}
                                </div>
                            </div>
                        </div>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
            <div className=" border-slate-500 felx bg-white flex-col w-full h-screen justify-center">
                <div className="flex flex-row flex-wrap w-full justify-center">
                    <Button className=' bg-amber-300 hover:bg-amber-400' endIcon={<AddIcon />} onClick={() => router.push('mealplan/create')}>Add Meal</Button>
                    <ul className=' m-2 w-full h-full flex flex-row flex-wrap justify-center'>
                        {
                            mealplans?.data?.map((mealplan) => {
                                return (
                                    <li className='h-full m-'>
                                        <Button onClick={() => show_mealplan(mealplan.PLAN_ID)}>
                                            <div className='border-2 flex flex-row rounded-md border-black  h-full'>
                                                <h1 className='m-auto text-left w-1/2 text-xl font-semibold'>{mealplan.PLAN_NAME}</h1>
                                                <div className='m-auto flex flex-col justify-center'>
                                                    <h3 className='text-right italic'>{mealplan.CREATION_DATE}</h3>
                                                    <h3 className='text-right'>{mealplan.DURATION}</h3>
                                                </div>
                                            </div>
                                        </Button>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        </>
    )
}