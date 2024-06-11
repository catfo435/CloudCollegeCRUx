import NavBar from "./home/NavBar";

function App() {
  return (
    <>
      <div className="flex flex-col w-screen h-screen bg-blue-100">
        <NavBar />
        <div className="flex justify-center items-center w-screen grow">
          <div className="w-[70%] h-[700px]">
            <div className="grid grid-cols-2 grid-flow-col h-full">
              <div className="flex flex-col h-full pl-5 pt-5">
                <div className="flex flex-col text-8xl font-bold">
                  <span className="mb-4">Transform</span>
                  <span className="mb-4">your learning</span>
                  <span className="mb-10">with</span>
                  <span className="flex text-blue-600 mb-4">CloudCollege</span>
                </div>
                <div className="grid grid-cols-2 grid-flow-col h-full w-[70%] mt-4 gap-x-10">
                <div className="flex justify-end items-center">
                <button
                  onClick={() => {window.location.href = "/login"}}
                  className="w-[80%] h-14 py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-transform duration-200 ease-in-out transform hover:scale-105">
                  Sign Up 
                </button>
                </div>
                <div className="flex justify-start items-center">
                <button
                  className="w-[80%] h-14 py-2 px-4 bg-white text-blue-500 font-semibold rounded-md shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform duration-200 ease-in-out transform hover:scale-105">
                  Learn More 
                </button>
                </div>
                </div>
              </div>
              <div className="flex justify-center items-start h-full">
                <div className="w-[80%] h-[80%]">
                  <img className="rounded-full mx-auto shadow-2xl transform hover:-translate-y-2 transition-all duration-300" src="/logo.png" alt="Company Logo" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
