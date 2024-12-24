import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie'; 
import { useRouter } from 'next/router';
import NotificationBell from './NotificationBell';

const Navbar = ({userId} : {userId : any}) => {
    const [cookies] = useCookies(['token', 'role']);
    const [update, setUpdate] = useState(false); // State to force re-render
    const [profileOpened , setProfileOpened] = useState(false);
    const [data, setData] = useState([]);
    const [userDetails, setUserDetails] = useState({
        name : ""
    });

    useEffect(() => {
            fetch('http://localhost:3001/users/fetchme', {credentials : 'include'}).then(response => response.json()).then(dataJson => {
                setUserDetails(dataJson);
                console.log("Data is: " + dataJson);
            });

            fetch('http://localhost:3001/notifications/' , {credentials : 'include'}).then(response => response.json()).then(dataJson => {
                setData(dataJson);
                console.log("Data is: " + dataJson);
            });
        }, []);

    console.log('Current role:', cookies.role);

    const [search, setSearch] = useState('');

    const searchFunction = (e : any) => {
        redirect('http://localhost:3000/search/' + search);
    }

    return (
        <>



        <nav className="bg-gray-300 dark:bg-gray-900"> 
        <div className=" flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="https://www.svgrepo.com/show/115818/e-learning.svg" className="h-8" alt="E-Learning Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">E-Learners</span>
        </a>
        <div className="flex items-center md:order-3 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <NotificationBell data={data} />
            <button onClick={() => setProfileOpened(!profileOpened)} type="button" className="pl-5" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown" data-dropdown-placement="bottom">
                <a href="#" className='text-white font-bold block py-2 px-3 text-white rounded md:bg-transparent md:text-gray-900 md:p-0 md:dark:text-blue-500' aria-current="page">
                    {userDetails.name}
                </a>
            </button>
        </div>
        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
            <li>
                <a href="#" className=" font-bold block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Home</a>
            </li>
            <li>
                <a href="#" className=" font-bold block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">About</a>
            </li>
            <li>
            <form onSubmit={searchFunction}>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} id="search-navbar" className="block w-full p-1 ps-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Search..." />
            </form>
            </li>
            </ul>
        </div>
        </div>
        </nav>


        </>

    )
};

export default Navbar;