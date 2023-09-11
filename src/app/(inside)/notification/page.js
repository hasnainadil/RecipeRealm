'use client'
import useSWR from "swr";
import axios from "axios";

const fetcher = (url) => axios.get(url).then((res) => res.data).catch((err) => console.log(err));

const NotificationCard = ({ message = '', date = '' }) => {
    const cardStyles = {
        background: 'linear-gradient(to bottom, #FFD700, #FFA500)', // Golden gradient
    };

    return (
        <div
            style={cardStyles}
            className="shadow-lg p-4 flex flex-row justify-between rounded-lg mb-4 w-full transition-transform transform hover:scale-105"
        >
            <p className="text-gray-600">{message}</p>
            <p className="text-gray-600 italic text-base">{date}</p>
        </div>
    );
};

export default function NotificationPage() {
    const { data, error } = useSWR("/api/get_notifications", fetcher);
    return (
        <div className="flex flex-col items-start justify-start min-h-screen py-2">
            <h1 className="text-4xl font-bold">Notifications</h1>
            {
                data?.notifications?.map((notification) => (
                    (notification.NOTIFICATION_TYPE === 'profile') ?
                        (<Link href={notification.R_U_ID ? `/profile/${notification.R_U_ID}` : "/profile"}>
                            <NotificationCard notification={notification} />
                        </Link>)
                        : (notification.NOTIFICATION_TYPE === 'recipe') ?
                            (<Link href={notification.R_U_ID ? `/recipe/${notification.R_U_ID}` : "/recipe"}>
                                <NotificationCard notification={notification} />
                            </Link>)
                            :
                            (<NotificationCard message={notification.MESSAGE} date={notification.CREATED_AT} />)))
            }
        </div>
    )
}