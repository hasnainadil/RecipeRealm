'use client'
import Image from "next/image"
import useSwr from "swr"
import Link from "next/link"
import { images } from "@/constants"
import { useSearchParams, useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "react-toastify"
import Skeleton_viewer from "@/components/Skeleton_viewer"


const fetcher = (url) => axios.get(url).then((res) => res.data).catch((err) => toast.error(err.message))

function SearchItems({ heading = '', subHeading = '', image = '' }) {
    return (
        <div className="flex flex-row flex-wrap border-2 rounded border-black">
            <div className="w-1/4 m-2">
                <Image width={60} height={60} src={image} />
            </div>
            <div className="flex flex-row flex-wrap justify-center">
                <h1 className="text-2xl font-bold ml-3 mr-3 m-auto">{heading}</h1>
                <p className="text-sm italic ml-2 mr-2 m-auto">{subHeading}</p>
            </div>
        </div>
    )
}

export default function SearchPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const serach_term = searchParams.get('search')
    console.log(serach_term)
    const { data, error } = useSwr(`/api/search_items?search_type=all&search_query=${serach_term}`, fetcher, {
        onError: (err) => {
            toast.error(err.message)
        },
        revalidateIfStale: false,
        revalidateOnFocus: false,
    })
    if (error) {
        toast.error(error.message)
        toast.error('Something went wrong. Reloading...')
        router.reload()
    }
    if (!data) return <div><Skeleton_viewer /></div>
    return (
        <div className="flex flex-col h-full">
            <h1 className="text-2xl font-bold">Search Results</h1>
            <div className="flex flex-col rounded hover:shadow bg-gray-200 m-5  max-h-[15rem] ">
                <h1 className=" text-lg text-center font-bold">Recipes</h1>
                <div className="flex flex-col bg-white m-5  max-h-[15rem] overflow-auto">
                    {
                        data?.recipes?.map((recipe, index) => {
                            return (
                                <Link key={index} href={`/recipe/${recipe.RECIPE_ID}`}>
                                    <SearchItems heading={recipe.TITLE} subHeading={recipe.PUBLISHER_NAME} image={`/recipe_images/${recipe.IMAGE}`} />
                                </Link>
                            )
                        })}
                </div>
            </div>
            <div className="flex flex-col rounded hover:shadow bg-gray-200 m-5  max-h-[15rem] ">
                <h1 className=" text-lg text-center font-bold">Profiles</h1>
                <div className="flex flex-col bg-white m-5  max-h-[15rem] overflow-auto">
                    {
                        data?.profiles?.map((profile, index) => {
                            return (
                                <Link key={index} href={`/profile/${profile.USER_ID}`}>
                                    <SearchItems heading={profile.NAME} subHeading={'Follower: ' + profile.FOLLOWERS} image={`/profile_images/${profile.PROFILE_PICTURE}`} />
                                </Link>
                            )
                        })}
                </div>
            </div>
        </div>
    )
}
