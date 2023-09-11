"use client"
import React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { AboutUs, Chef, FindUs, Footer, Gallery, Header, Intro, Laurels, SpecialMenu } from '@/container';
import { Navbar } from '@/components';
import './app.css';
import { useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify';

const App = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  useEffect(() => {
    router.refresh()
    router.prefetch("/login")
    if (searchParams.get('log') == 'false') {
      toast.error('Not Logged In', { hideProgressBar: true, autoClose: 1000 })
    }
  }, []);
  return (
    <div>
      <div className='fixed w-full l h-full z-50' >
        <Navbar />
      </div>
      <Header />
      <AboutUs />
      <SpecialMenu />
      <Chef />
      <Intro />
      <Laurels />
      <Gallery />
      <FindUs />
      <Footer />
    </div>
  )
};

export default App;
