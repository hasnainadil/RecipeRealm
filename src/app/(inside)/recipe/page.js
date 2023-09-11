'use client'
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import RecipeCard from "@/components/RecipeCard";
import { useState } from "react";
import useSWR, { preload } from "swr"
import Drawer from 'react-modern-drawer'
import Checkbox from '@mui/material/Checkbox';
import axios from 'axios';
import 'react-modern-drawer/dist/index.css'
import Skeleton_viewer from '@/components/Skeleton_viewer';
import { toast } from 'react-toastify';

// preload(urls[0], fetcher)
// preload(urls[1], fetcher)
// preload('/api/get_all_tags', fetcher)

const fetcher = (path) => axios(path).then(res => res.data).catch((error) => {
  console.log(error)
  return error
})
const urls = ['/api/following_recipe', '/api/all_recipes', '/api/recommendation']

const App = () => {
  const recipe_per_page = 20;
  let page_count;
  console.log('redering begin')
  const [tagged_recipes, setTagged_recipes] = useState(null)
  const [tag_set, setTag_set] = useState(new Set())
  const [catagory_set, setCatagory_set] = useState(new Set())
  const [value, setValue] = useState('1');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const { data: all_tags, error: tag_error } = useSWR(`/api/get_all_tags`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: true
  })
  const { data: all_categories, error: catagory_error } = useSWR(`/api/all_categories`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: true
  })
  const { data: recipes, error: recipe_error } = useSWR(urls[Number(value) % 3], fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: true
  })
  if (recipes) {
    page_count = Math.ceil(recipes.totalCount / recipe_per_page)
  }
  if (recipes) {
    if (recipes.data?.length === 0) {
      toast.warning('No recipes found for this section')
    }
  }

  const [isOpen, setIsOpen] = useState(false)
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState)
  }
  const updateTag_set = async (tag_id) => {
    if (tag_set.has(tag_id)) {
      setTag_set(prev => {
        prev.delete(tag_id);
        return new Set(prev);
      })
    }
    else {
      setTag_set(prev => new Set(prev.add(tag_id)))
    }
    if (tag_set.size > 0 || catagory_set.size > 0) {
      axios.get('/api/tagged_recipe', { params: { tags: Array.from(tag_set).join(','), categories: Array.from(catagory_set).join(',') } }).then(res => {
        setTagged_recipes(res.data)
      }).catch(error => {
        console.log(error)
      })
    }
    else {
      setTagged_recipes(null)
    }
  }
  const updateCatagory_set = async (catagory_id) => {
    if (catagory_set.has(catagory_id)) {
      setCatagory_set(prev => {
        prev.delete(catagory_id);
        return new Set(prev);
      })
    }
    else {
      setCatagory_set(prev => new Set(prev.add(catagory_id)))
    }
    if (catagory_set.size > 0 || tag_set.size > 0) {
      axios.get('/api/tagged_recipe', { params: { catagories: Array.from(catagory_set).join(','), tags: Array.from(tag_set).join(',') } }).then(res => {
        setTagged_recipes(res.data)
      }).catch(error => {
        console.log(error)
      })
    }
    else {
      setTagged_recipes(null)
    }
  }



  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <div className='fixed mb-5 sm:w-[42.5rem] lg:w-[75rem] rounded-md z-20' >
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example" className='bg-gray-200 rounded'>
              <Tab label="All Recipes" value="1" className='hover:bg-gray-400' />
              <Tab label="Reccommendation" value="2" className='hover:bg-gray-400' />
              <Tab label="Following" value="3" className='hover:bg-gray-400' />
            </TabList>
          </Box>
        </div>
        <TabPanel value="1">
          {
            (tagged_recipes) ? (
              <ul className="flex w-full h-full flex-wrap justify-center rounded-2xl shadow-2xl mt-9">
                {tagged_recipes?.data?.map((recipe, index) => (
                  <li className=" w-1/3 p-3 bg-slate-100 outline  flex flex-row justify-center h-full mt-1 mb-1 relative" key={index} style={{ maxWidth: '300px', minWidth: '300px' }}>
                    <div className=' outline'>

                      <RecipeCard image={`/recipe_images/${recipe.IMAGE}`} rating={recipe.RATING} title={recipe.TITLE} publisher={"by- " + recipe.PUBLISHER_NAME} description={recipe.COOKING_INSTRUCTION} recipeID={recipe.RECIPE_ID} />
                    </div>
                  </li>
                ))
                }
              </ul>
            ) : (recipes) ? (
              <ul className="flex w-full h-full flex-wrap outline justify-center rounded-2xl shadow-2xl mt-9">
                {recipes?.data?.map((recipe, index) => (
                  <li className=" w-1/3 p-3 bg-slate-100  flex flex-row justify-center h-full mt-1 mb-1 relative" key={index} style={{ maxWidth: '300px', minWidth: '300px' }}>
                    <div className=' outline'>

                      <RecipeCard image={`/recipe_images/${recipe.IMAGE}`} rating={recipe.RATING} title={recipe.TITLE} publisher={"by- " + recipe.PUBLISHER_NAME} description={recipe.COOKING_INSTRUCTION} recipeID={recipe.RECIPE_ID} />
                    </div>
                  </li>
                ))
                }
              </ul>
            ) : (
              <Skeleton_viewer />
            )}
          <>
            <button className='text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 font-medium rounded-lg text-sm px-2 py-1 text-center mr-2 mb-2 top-1/3 right-0 fixed h-30 w-10' onClick={toggleDrawer}>
              <h1 className=' text-base h-40  mr-3' style={{ writingMode: 'vertical-lr', textOrientation: 'mixed' }}>Select Tags</h1>
            </button>
            <Drawer
              open={isOpen}
              onClose={toggleDrawer}
              direction='right'
              className='bla bla bla'
            >
              <div className='flex flex-col justify-center shrink'>
                <div className=" rounded-2xl top-10 m-0 relative flex flex-wrap justify-around shrink flex-row w-full h-4/5 min-w-fit shadow-sky-100 hover:shadow-xl pb-2">
                  <div className="h-1/3 w-full relative top-3 items-center flex flex-col p-1" style={{ maxHeight: '300px' }}>
                    <h1 className="text-center font-extrabold text-2xl m-3 text-amber-800 rounded-xl shadow-xl">
                      Tags
                    </h1>
                    <ul className="relative w-full flex flex-col p-2  overflow-y-auto max-h-fit hover:shadow-xl" >
                      {all_tags?.data?.map((tag, index) => (
                        <li className='bg-gray-200'>
                          <Checkbox checked={tag_set.has(tag.TAG_ID)} name={tag.TAG_ID} onChange={() => updateTag_set(tag.TAG_ID)} />
                          {tag.NAME}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="h-1/2 relative w-full items-center flex flex-col m-0" style={{ maxHeight: '300px' }}>
                    <h1 className="text-center font-extrabold text-2xl m-3 text-amber-800 shadow-xl">
                      Catagories
                    </h1>
                    <ul className="relative w-full flex flex-col p-2  overflow-y-auto max-h-fit hover:shadow-xl" >
                      {all_categories?.data?.map((categorie, index) => (
                        <li className='bg-gray-200'>
                          <Checkbox checked={catagory_set.has(categorie.CATEGORY_ID)} name={categorie.CATEGORY_ID} onChange={() => updateCatagory_set(categorie.CATEGORY_ID)} />
                          {categorie.NAME}
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
                {/* <button type="button" class="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-12 mb-2 relativen shrink m-auto" onClick={handleTags}>Filter</button> */}
              </div>
            </Drawer>
          </>
        </TabPanel>
        <TabPanel value="2">
          {
            recipes ? (
              <ul className="flex w-full outline  h-full flex-wrap justify-center rounded-2xl shadow-2xl  mt-9">
                {recipes?.data?.map((recipe, index) => (
                  <li className=" w-1/3 p-3 bg-slate-100  flex flex-row justify-center h-full mt-1 mb-1 relative" key={index} style={{ maxWidth: '300px', minWidth: '300px' }}>
                    <div className=' outline'>

                      <RecipeCard image={`/recipe_images/${recipe.IMAGE}`} rating={recipe.RATING} title={recipe.TITLE} publisher={"by- " + recipe.PUBLISHER_NAME} description={recipe.COOKING_INSTRUCTION} recipeID={recipe.RECIPE_ID} />
                    </div>
                  </li>
                ))
                }

              </ul>
            ) : (
              <Skeleton_viewer />
            )}
        </TabPanel>
        <TabPanel value="3">
          {
            recipes ? (
              <ul className="flex w-full h-full flex-wrap justify-center rounded-2xl shadow-2xl outline mt-9">
                {recipes?.data?.map((recipe, index) => (
                  <li className=" w-1/3 p-3 bg-slate-100  flex flex-row justify-center h-full mt-1 mb-1 relative" key={index} style={{ maxWidth: '300px', minWidth: '300px' }}>
                    <div className=' outline'>

                      <RecipeCard image={`/recipe_images/${recipe.IMAGE}`} rating={recipe.RATING} title={recipe.TITLE} publisher={"by- " + recipe.PUBLISHER_NAME} description={recipe.COOKING_INSTRUCTION} recipeID={recipe.RECIPE_ID} />
                    </div>
                  </li>
                ))
                }

              </ul>
            ) : (
              <Skeleton_viewer />
            )}
        </TabPanel>
      </TabContext>
    </Box>

  )
}

export default App