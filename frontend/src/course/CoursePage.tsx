import { useEffect, useState } from "react";
import CourseNavBar from "./CourseNavBar";
import { useParams } from "react-router-dom";
import { AddContentModal } from "./AddContentModal";
import { getStorage, ref } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { Button } from "flowbite-react";

const CoursePage = () => {

    
    const [course,setCourse] = useState<any>()
    const [databaseId,setDataBaseId] = useState<string>()
    const [openModal, setOpenModal] = useState(false);
    const [isStudent, setIsStudent] = useState(true);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [loading, setLoading] = useState(false);
    const {courseId} = useParams()

    const fetchCourse = () => {
        fetch(import.meta.env.VITE_BACKEND_URL + `/courses/${courseId}`)
        .then((res) => (res.json()).then((course) => {
            setCourse(course)
        }))
        .catch(() => {
            alert("Error Occured")
            window.location.href = "/dashboard"
            return;
        })
    }

    const fileDownload = async (url : any) => {
        //@ts-ignore
        const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG)
        initializeApp(firebaseConfig)

        const file = ref(getStorage(),url)

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = blobUrl;
                a.download = file.name;
                document.body.appendChild(a);
                a.click();
                URL.revokeObjectURL(blobUrl);
                document.body.removeChild(a);
            } catch (error) {
                console.error('There was an error downloading the file:', error);
            }        
    }

    const handleEnroll = () => {
        setLoading(true)

        fetch(import.meta.env.VITE_BACKEND_URL + `/students/${window.localStorage.getItem("userEmail")}/addCourse`,{
            method : "PATCH",
            headers: {
                "Content-Type": "application/json",
              },
            body: JSON.stringify({_id:course!._id})
        })
        .then((res) => {
            if (res.status == 406) {
                alert ("Insufficient Funds");
            }
            else {
                res.json().then(() => {
                    setIsEnrolled(true)
                })
            }
        })
        .catch(console.error)
        .finally(() => {setLoading(false)})
    }

    useEffect(() => {

        setDataBaseId(window.localStorage.getItem("userId")!)
        if(window.localStorage.getItem("userType") === "student"){
            fetch(import.meta.env.VITE_BACKEND_URL + `/students/${window.localStorage.getItem("userEmail")}/courses`)
        .then((res) => (res.json()).then((courses) => {          
            setIsEnrolled(courses.some((course : any) => (course._id === courseId)))
        }))
        .catch(console.error)
        }

        setIsStudent(window.localStorage.getItem("userType") === "student")
        fetchCourse()
        
    },[])

    return (
        <>
        {
            course?(
            <div className="flex flex-col w-screen h-screen bg-blue-100">
                <AddContentModal openModal={openModal} setOpenModal={setOpenModal} handleSubmit={fetchCourse} courseId={courseId!}/>
                <CourseNavBar course={course} isEnrolled={isEnrolled} setIsEnrolled={setIsEnrolled} />
                
                {(!isStudent || isEnrolled)?(
                    <>
                    <div className="flex relative items-center mt-10 ml-5">
                    <span className="font-semibold text-3xl">Course Content</span>
                    {
                    (course.roomId !== "nolive")?((isStudent || !(course.instructors.includes(databaseId)))?<button onClick={() => {window.location.href += "/livestream/join"}} className="flex justify-center items-center animate-pulse rounded-full">
                        <div className="w-3 h-3 ml-3 bg-red-600 rounded-full"></div>
                        <span className="ml-2 text-red-600 text-xl">Live </span> 
                    </button>:<button onClick={() => {window.location.href += "/livestream/create"}} className="h-10 w-20 ml-5 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg">
                        Go Live</button>):""}
                    {/* check if live stream exists then put live button */}
                    {(!isStudent && (course.instructors.includes(databaseId)))?<button onClick={() => {setOpenModal(true)}}>
                    <div className="flex justify-center items-center absolute right-5 top-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md p-3 w-fit h-10">Add Content</div>
                    </button>:""}
                </div>
                <div className="flex flex-col courseContent mt-5 ml-4 w-screen">
                    <div className="flex flex-col p-4 w-[80%] mb-2 h-28">
                        {
                            //@ts-ignore
                            course.content.map((topic,idx) => (
                                <div className="mb-4">
                                    <span className="text-2xl ml-2">• {topic.heading}</span>
                                    <div className="divider my-2 w-80 h-0.5 bg-gray-400"></div>
                                    <div className="ml-2 text-lg mb-4">{topic.description}</div>
                                    {topic.file?<div className="ml-2">Uploaded File: <button className="hover:underline" onClick={() => {fileDownload(topic.file)}}>Click to Open Attachment</button></div>:""}
                                </div>
                            ))
                        }
                    </div>  
                    </div>
                    </>
                ):<div className="w-screen grow flex flex-col items-center">
                    <span className="text-5xl font-semibold mt-48">You are not enrolled in this course</span>
                    <span className="text-3xl font-semibold mt-5 mb-10">This course costs {course.price}</span>
                    <Button onClick={handleEnroll} color="blue" size="xl" isProcessing={loading} >Enroll</Button>
                </div>}
            </div>
        ):""
        }
        </>
    );
}

export default CoursePage;