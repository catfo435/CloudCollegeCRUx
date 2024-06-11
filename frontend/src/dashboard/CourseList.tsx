//@ts-ignore
const CourseList = ({ courses }) => {
  return (
    <div className="grid grid-cols-4 p-4 h-[600px] w-full overflow-scroll">
      {//@ts-ignore
      courses.map((course, index) => (
        <button className="w-[350px] h-[180px]">
          <div key={index} onClick={() => {window.location.href = `/courses/${course._id}`}} className="flex flex-col w-full h-full items-start bg-gray-100 border border-gray-200 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">{course.name}</h2>
          <p className="text-gray-700 mb-6">{course.courseId}</p>
          <p className="text-gray-500">Instructor(s): {//@ts-ignore
          (course.instructors.map((instructor) => (instructor.name))).join(",")}</p>
        </div>
        </button>
      ))}
    </div>
  );
};

export default CourseList;
