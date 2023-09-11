'use client'
import Image from "next/image"
// import { images } from "@/constants"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import axios from "axios"
import { usePathname } from "next/navigation"
import { useCallback } from "react"


export default function HeadNavBar() {
    const router = useRouter()
    const pathname = usePathname();
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const path = useRef('')
    const [image, setImage] = useState('')
    let searchPlaceholder = ''
    if (pathname.includes('/recipe')) {
        searchPlaceholder = 'Search for recipes'
        path.current = '/recipe'
    }
    else if (pathname.includes('/profile')) {
        searchPlaceholder = 'Search for users'
        path.current = '/profile'
    }
    const handleLink = (e) => {
        e.preventDefault()
        console.log(e.target.value)
        searchQuery('')
        setSearchResults([])
    }
    const handleClick = (e) => {
        e.preventDefault()
        console.log(e.target.value)
        const query = searchQuery
        setSearchQuery('')
        router.push('/search?search=' + query)
    }

    useEffect(() => {
        axios.get('/api/cookie_data').then((res) => {
            setImage(`/profile_images/${res.data.data.profile_pic}`)
        }).catch((err) => {
            console.log(err)
        })
        console.log('use effect')
        setSearchQuery('')
        setSearchResults([])
        console.log(searchQuery + 'search query')
    }, [pathname])

    const setRecipes = async (search_query) => {
        if (pathname.includes('/recipe')) {
            // search for recipes
            setSearchResults(await (await axios.get(`/api/search_items?search_type=recipes&search_query=${search_query}&row_num=5`)).data.recipes)
        }
        else if (pathname.includes('/profile')) {
            // search for profiles
            setSearchResults(await (await axios.get(`/api/search_items?search_type=profiles&search_query=${search_query}&row_num=5`)).data.profiles)
        }
        console.log(searchResults)
        if (search_query == '') {
            setSearchResults([])
        }
    }

    const handleChange = async (e) => {
        setSearchQuery(e.target.value)
        console.log(searchQuery)
        optimizedChange(e.target.value)

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
    const optimizedChange = useCallback(debounce(setRecipes, 500), []);
    return (
        <>
            <nav className="flex shrink flex-initial justify-right bg-gradient-to-tr from-white via-transparent to-black/60">
                <form className="relative w-2/3 m-2 ml-20 items-right ">
                    <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                    <div class="relative ">
                        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input type="text" id="default-search" value={searchQuery} onChange={handleChange} class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 z-50" placeholder={searchPlaceholder} required />
                        <div className="absolute bg-white z-50  max-h-40 overflow-auto w-full border-2 rounded border-black">
                            {
                                searchResults?.map((result) => {
                                    if (path.current == '/profile')
                                        return (
                                            <Link href={'/profile/' + String(result.USER_ID ? result.USER_ID : result.RECIPE_ID)} onclick={handleLink}>
                                                <div className="flex flex-col flex-wrap hover:bg-blue-200 ">
                                                    <h1 className="text-2xl m-auto">{result.NAME ? result.NAME : result.TITLE}</h1>
                                                </div>
                                            </Link>
                                        )
                                    else if (path.current == '/recipe')
                                        return (
                                            <Link href={'/recipe/' + String(result.RECIPE_ID ? result.RECIPE_ID : result.USER_ID)} onclick={handleLink}>
                                                <div className="flex flex-col flex-wrap hover:bg-blue-200 ">
                                                    <h1 className="text-2xl m-auto">{result.NAME ? result.NAME : result.TITLE}</h1>
                                                </div>
                                            </Link>
                                        )
                                })
                            }
                        </div>
                        <button onClick={handleClick} type="submit" class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                    </div>
                </form>

                <div style={{ margin: '10px', zIndex: '10', display: 'inline-block' }}>
                    <Link href="/profile">
                        <Image loading="lazy" className="border-2 rounded p-1" src={(image.includes('null') || image.includes('undefined')) ? '/avatar/profile.png' : image} width={50} height={50} alt="logo" />
                    </Link>
                </div>

            </nav>
        </>
    )
}