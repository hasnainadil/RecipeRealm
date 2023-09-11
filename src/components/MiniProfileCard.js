'use client'

import { useState } from "react";
import { useRouter } from 'next/navigation';
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button,
} from "@material-tailwind/react";
import LinearProgress from '@mui/material/LinearProgress';
import Link from "next/link";
import Image from "next/image";

export default function ProfileCard({ name = '', email = '', userID = '', baseLink = '/profile', image = '' }) {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const handleClick = () => {
        setIsLoading(true);
    }
    return (
        <div >
            <Card className="relative max-w-[16rem] max-h-[18rem] ">
                <CardHeader floated={false} color="blue-gray" className="relative flex flex-row justify-center bg-transparent">
                    <Image loading="lazy" className="object-cover m-1" width={100} height={100} src={(image.includes('null') || image.includes('undefined')) ? '/avatar/profile.png' : image} alt="ui/ux review check" style={{borderRadius:'50%'}}
                    />
                </CardHeader>
                <CardBody>
                    <div className="mb-3 h-full flex items-center justify-between">
                        <Typography variant="h5" color="blue-gray" className="text-3xl">
                            {name}
                        </Typography>
                        {/* <Typography
                        color="blue-gray"
                        className="flex items-center gap-1.5 font-normal"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="-mt-0.5 h-5 w-5 text-yellow-700"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                clipRule="evenodd"
                            />
                        </svg>
                        {rating}
                    </Typography> */}
                    </div>
                    <Typography color="gray" className="italic">
                        {email}
                    </Typography>
                </CardBody>
                <CardFooter className="pt-3">
                    <Link href={baseLink + '/' + userID}>
                        <Button onClick={handleClick} className="hover:bg-blue-400 h-full" size="lg" fullWidth={true} style={{ maxHeight: '30px', minWidth: '30px', minHeight: '30px' }}>
                            View Full Profile
                        </Button>
                    </Link>
                    {isLoading ? <div className="m-3"><LinearProgress /></div> : ""}
                </CardFooter>
            </Card>
        </div>
    );
}