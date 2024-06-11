import { useEffect, useState } from 'react';
import StudentDashboardPage from './StudentDashboardPage';
import InstructorDashboardPage from './InstructorDashboardPage';

const Dashboard = () => {
  const [isStudent, setIsStudent] = useState(false);

  useEffect(() => {
    setIsStudent(window.localStorage.getItem("userType") === "student")
  },[])

  return (
    <>
        {isStudent ? (
          <StudentDashboardPage />
        ) : (
          <InstructorDashboardPage />
        )}
    </>
  );
};

export default Dashboard;
