'use client'
import { Dispatch , SetStateAction } from "react";
import { redirect } from "next/navigation";
import { usePathname } from 'next/navigation'
import { getCookie, getCookies, setCookie, deleteCookie, hasCookie } from 'cookies-next/client';
import { useEffect, useState } from "react";
import ModuleSidebar from "components/ModuleSidebar";
import ModuleContent from "components/ModuleContent";
import CourseNotes from "components/CourseNotes";

type Dispatcher<S> = Dispatch<SetStateAction<S>>;

export default function Home()
{
    const path = usePathname().split('/');

    const [data, setData] = useState({
        title: "Test Module",
        content: "Test Content",
        resources: ["test.pdf"],
        difficulty: "Easy",
        valid_content: true,
        course_id: "5f8d9f4a2d8c8e3b0f5d",
        statusCode: 200,
    });

    const [refresh , setRefresh] = useState(false);

    const [notes, setNotes] = useState([]);

    let userId = getCookie("userId");
    let token = getCookie("token");

    console.log("User ID is: " + userId);
    console.log("Token is: " + token);

    let moduleId : string = path[path.length - 1];
    useEffect(() => {
        console.log("Module ID is: " + moduleId);
        fetch('http://localhost:3001/modules/get/' + moduleId , {credentials : 'include'}).then(response => response.json()).then(dataJson => {
            setData(dataJson);
            console.log("data is: " + dataJson);
        });
        fetch('http://localhost:3001/notes/getAll' , {credentials : 'include'}).then(response => response.json()).then(dataJson => {
            setNotes(dataJson);
            console.log("Notes are: " + dataJson);
        });

        setRefresh(false);
    }, [refresh]);

    const downloadFile = (fileName: string) => {
        redirect("http://localhost:3001/modules/download/" + moduleId + "/" + fileName);
    }

    console.log("Data is: " + JSON.stringify(data));
    return (

        <div className="flex min-h-screen bg-gray-50">
        <ModuleSidebar courseId={data.course_id} />
        <main className="flex-1 p-8">
        {data.statusCode? 
        <> <div className="flex flex-col items-center justify-center pt-5">
        <h1 className="mb-4 text-3xl font-bold text-gray-800">Module does not exist or you are not authorized to view it</h1></div></> :
        <>
        <div className="flex flex-col items-left justify-left pl-3 pt-3">
        <h1 className="text-3xl font-bold text-gray-800">{data.title}</h1>
        <h3 className="mb-4 text-2xl font text-gray-600">Description: </h3>
        <p className="text-1xl font-italic text-gray-600">{data.content}</p>
        </div>

        <div className="h-screen dark:bg-gray-800">

        <div className="py-6 px-3 lg:grid lg:grid-cols-2 lg:gap-8">

        {
            
            data ? <ModuleContent moduleId={moduleId} data={data.resources} /> : <p>No Data Found</p>
        }
        </div>
        </div>
        <CourseNotes data={notes} userId={userId} courseId={data.course_id} setRefresh={setRefresh} />
        </> }
        </main>
        </div>
    );
}