const NavBar = () => {
    return (
        <div className="navBar flex justify-center items-center w-screen h-16 bg-white rounded-b-lg">
            <div className="contentContainer relative flex w-[70%] h-16">
                <button onClick={() => (window.location.href = "/")}>
                <div className="flex justify-center items-center logo ml-5 my-2">
                    <img className="w-12 h-12 rounded-full mr-2" src="/logo.png" />
                    <span className="text-blue-600 text-2xl font-bold">CloudCollege</span>
                </div>
                </button>
                <div className="absolute flex justify-end items-center w-[60%] h-full right-0 text-gray-600">
                    <span className="ml-4">About Us</span>
                    <span className="ml-4">Contact</span>
                </div>
            </div>
        </div>
    );
}

export default NavBar;