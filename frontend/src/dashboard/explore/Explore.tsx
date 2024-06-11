import { useEffect, useState } from 'react';
import CourseList from '../CourseList';

const StudentDashboardPage: React.FC = () => {

  const [courses,setCourses] = useState([])

  useEffect( () => {
    fetch(import.meta.env.VITE_BACKEND_URL + `/courses`)
    .then((res) => (res.json()).then(setCourses))
    .catch(console.error)

  },[])

  return (
    <div className="flex flex-col items-center grow w-screen">
      <span className='text-4xl text-center font-bold mt-20 mb-10'>Courses Offered</span>
      <div className="flex w-[90%] items-center justify-center">
      <CourseList courses={courses} />
      </div>
    </div>
  );
};

export default StudentDashboardPage;
