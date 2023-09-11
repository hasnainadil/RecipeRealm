import React from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { Disclosure } from "@headlessui/react";
import Link from "next/link";
import {
  MdOutlineFastfood,
  MdOutlineSettings,
  MdOutlineLogout,
  MdOutlineShoppingCart,
  MdOutlineNotificationsActive
} from "react-icons/md";
import { toast } from "react-toastify";
import axios from "axios";
import { CgProfile } from "react-icons/cg";
import { FaClipboardList } from "react-icons/fa";
import { BiMessageSquareDots } from "react-icons/bi";
import Image from 'next/image';
import { images } from "@/constants";

function SideNavbar() {
  const components =
    [
      {
        name: "Recipes",
        icon: <MdOutlineFastfood className="text-2xl text-gray-600 group-hover:text-white " />,
        link: "/recipe"
      },
      {
        name: "Profile",
        icon: <CgProfile className="text-2xl text-gray-600 group-hover:text-white " />,
        link: "/profile"
      },
      {
        name: "Meal Plan",
        icon: <FaClipboardList className="text-2xl text-gray-600 group-hover:text-white " />,
        link: "/mealplan"
      },
      {
        name: "Shopping List",
        icon: <MdOutlineShoppingCart className="text-2xl text-gray-600 group-hover:text-white " />,
        link: "/shopping"
      },
      {
        name: "Notifications",
        icon: <MdOutlineNotificationsActive className="text-2xl text-gray-600 group-hover:text-white " />,
        link: "/notification"
      }
    ]
  const logout = () => {
    axios.post('api/logout', {}).then((res) => {
      console.log(res.data)
      toast.success('Logged out successfully', { hideProgressBar: true, autoClose: 1000 })
    }).catch((err) => {
      console.log(err)
      toast.error('Something went wrong', { hideProgressBar: true, autoClose: 1000 })
    })
  }


  return (
    <div >
      <Disclosure as="nav">
        <Disclosure.Button className="absolute top-4 right-4 inline-flex items-center peer justify-center rounded-md p-2 text-gray-800 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white group z-50">
          <GiHamburgerMenu
            className="block md:hidden h-6 w-6"
            aria-hidden="true"
          />
        </Disclosure.Button>
        <div className="p-6 w-1/2 h-full bg-black z-20 fixed top-0 -left-96 lg:left-0 lg:w-60  peer-focus:left-0 peer:transition ease-out delay-150 duration-200">
          <div className="flex flex-col justify-start item-center">
            <Link href={'/home'} prefetch={true}>
              <Image loading='lazy' width={200} height={200} src={images.RR} alt="logo" />
            </Link>
            <div className=" my-4 border-b border-gray-100 pb-4">
              {components.map((component, index) => (
                <>
                  <Link href={component.link} prefetch={true}>
                    <div key={index} className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-yellow-600 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                      {component.icon}
                      <h3 className="text-base text-white group-hover:text-gray-200 font-semibold " >
                        {component.name}
                      </h3>
                    </div>
                  </Link>
                </>
              ))}
            </div>
            {/* setting  */}
            <div className=" my-4 border-b border-gray-100 pb-4">
              <Link href={'/settings'} prefetch={true}>
                <div className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-lime-500 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                  <MdOutlineSettings className="text-2xl text-gray-600 group-hover:text-white " />
                  <h3 className="text-base text-gray-100 group-hover:text-white font-semibold ">
                    Settings
                  </h3>
                </div>
              </Link>
            </div>
            <div className=" my-4">
              <Link href={'/home'} onClick={logout}>
                <div className="flex mb-2 justify-start items-center gap-4 pl-5 border border-gray-200  hover:bg-gray-700 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                  <MdOutlineLogout className="text-2xl text-gray-600 group-hover:text-white " />
                  <h3 className="text-base text-white group-hover:text-white font-semibold ">
                    Logout
                  </h3>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </Disclosure>
    </div>
  );
}

export default SideNavbar;
