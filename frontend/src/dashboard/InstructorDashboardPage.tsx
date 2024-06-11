import { useEffect, useState } from 'react';
import CourseList from './CourseList';
import LooksEmpty from './LooksEmpty';
import { AddCourseModal } from '../course/AddCourseModal';

const StudentDashboardPage: React.FC = () => {

  const [courses,setCourses] = useState([])
  const [openModal,setOpenModal] = useState(false)

  const fetchCourses = () => {
    fetch(import.meta.env.VITE_BACKEND_URL + `/instructors/${window.localStorage.getItem("userEmail")}/courses`)
    .then((res) => (res.json()).then(setCourses))
    .catch(console.error)
  }

  useEffect(fetchCourses,[])

  return (
    <div className="flex flex-col items-center grow w-screen">
      <div className='absolute top-18 right-2'>
        <button>
          <div onClick={() => {setOpenModal(true)}} className="flex justify-center items-center absolute right-2 top-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md p-3 w-36 h-10">Add Course</div>
        </button>
      </div>
      <AddCourseModal openModal={openModal} setOpenModal={setOpenModal} handleSubmit={fetchCourses} />
      <span className='text-4xl text-center font-bold mt-20 mb-10'>Your Courses</span>
      <div className="flex w-[90%] items-center justify-center">
      {!courses.length?<LooksEmpty /> :<CourseList courses={courses} />}
      </div>
    </div>
  );
};

export default StudentDashboardPage;
