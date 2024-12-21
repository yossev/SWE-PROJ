'use client'

import { redirect } from "next/navigation";

/*import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation'*/

export default async function Home({
    params,
  }: {
    params: Promise<{ moduleId: string }>
  })
{
    const getModuleData = async () => {
        const moduleId = (await (params)).moduleId;
        const res = await fetch('http://localhost:3001/modules/get/' + moduleId)
        return res.json();
    }

    const downloadFile = async(fileName: string) => {
        redirect("http://localhost:3001/modules/download?fileUrl=" + fileName);
    }

    const getModuleId = async () => {
        return (await params).moduleId;
    }



    const data = await getModuleData();

    return (
        <>
        <h1 className="mb-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">{data.title}</h1>
        <h2 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{data.content}</h2>

        <div className="h-screen dark:bg-gray-800">

        <div className="py-20 px-6 md:px-12 lg:grid lg:grid-cols-2 lg:gap-8">
  
            {
                    (
                    <div>
                        {data.resources.length > 0 ? data.resources.map( (resource : any) => (
                            
                <>
                <div
                className="block w-full p-6 mb-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:hover:bg-gray-700 	hover:bg-gray-100 dark:border-gray-700 lg:mb-0">
                    <h3 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{resource.split("." , 2)[0]}</h3>
                <button type="button" className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800" onClick={() => downloadFile(resource)}>
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">Download
                    </span>
                    </button>
                </div>

                <br />
                </>
                            
                        )) : <p>No Data Found</p>}
                    </div>)
            }

        </div>
        </div>
        </>
    );
}