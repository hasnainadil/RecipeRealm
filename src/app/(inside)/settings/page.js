'use client'
import { useState } from "react";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import EditProfile from "@/components/EditProfile";
import CreateRecipe from "@/components/CreateRecipe";


export default function Page() {
    const [value, setValue] = useState('1');
    const handleChange = (event, newValue) => {
        setValue(newValue);
      };
    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <div className='fixed mb-5 sm:w-[42.5rem] lg:w-[75rem] rounded-md z-20' >
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example" className='bg-amber-200 rounded'>
              <Tab label="Edit profile" value="1" className='hover:bg-gray-400' />
              <Tab label="Create" value="2" className='hover:bg-gray-400' />
            </TabList>
          </Box>
        </div>
        <TabPanel value="1">
            <div className='flex flex-col items-center justify-center w-full bg-white mt-10'>
                <EditProfile/>
            </div>
        </TabPanel>
        <TabPanel value="2">
            <div className='flex flex-col items-center justify-center mt-10'>
                <CreateRecipe />
            </div>
        </TabPanel>
      </TabContext>

    </Box>
    )
}