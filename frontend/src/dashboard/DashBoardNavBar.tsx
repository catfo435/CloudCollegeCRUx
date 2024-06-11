import ImageDropdown from "./ImageDropDown";

const DashBoardNavBar = () => {
    
    return (
        <div className="navBar flex justify-center items-center w-screen h-16 bg-blue-200">
            <div className="contentContainer relative flex w-full mx-1 h-16">
                <button onClick={() => {window.location.href = "/dashboard"}}>
                <div className="flex justify-center items-center logo ml-5 my-2">
                    <img className="w-12 h-12 rounded-full mr-2" src="/logo.png" />
                </div>
                </button>
                <div className="flex justify-end items-center h-full text-blue-500">
                    <button onClick={() => {window.location.href = "/dashboard"}}><span className="ml-4">My Courses</span></button>
                    <button onClick={() => {window.location.href = "/dashboard/explore"}}><span className="ml-4">Explore</span></button>
                </div>
                <div className="absolute flex justify-end items-center w-[60%] h-full right-0 text-blue-500">
                    <ImageDropdown />
                </div>
            </div>
        </div>
    );
}

export default DashBoardNavBar;