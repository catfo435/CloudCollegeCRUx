// src/ImageDropdown.js
import { useEffect, useState } from 'react';
import { ViewWallet } from './ViewWallet';

const ImageDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [wallet,setWallet] = useState("0")
  const [openModal,setOpenModal] = useState(false)

  const toggleDropdown = () => {
    if (localStorage.getItem("userType") === "student"){
      fetch(`${import.meta.env.VITE_BACKEND_URL}/students/${localStorage.getItem("userId")}/wallet`)
    .then((res) => (res.json()).then((data) => {setWallet(data.wallet)}));
    }
    setIsOpen(!isOpen);
  };

  const viewWallet = () => {
    setOpenModal(true)
  }

  useEffect(() => {
    if (localStorage.getItem("userType") === "student"){
      fetch(`${import.meta.env.VITE_BACKEND_URL}/students/${localStorage.getItem("userId")}/wallet`)
    .then((res) => (res.json()).then((data) => {setWallet(data.wallet)}));
    }
  },[])

  return (
    <div className="relative inline-block text-left">
      <div>
        <button 
          type="button" 
          className="inline-flex justify-center w-full rounded-md px-4 py-2" 
          id="options-menu" 
          aria-expanded="true" 
          aria-haspopup="true" 
          onClick={toggleDropdown}
        >
          <img 
            src={window.localStorage.getItem("pfp")!}
            alt="Profile Picture"
            className="rounded-full w-12 h-12"
          />
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <ViewWallet openModal={openModal} setOpenModal={setOpenModal} wallet={wallet} addBalance={(amount : string) => {
            fetch(`${import.meta.env.VITE_BACKEND_URL}/students/${localStorage.getItem("userId")}/addWallet`,{
              method : "PATCH",
              headers :{
                "Content-Type":"application/json"
              },
              body : JSON.stringify({amount})
            })
            .then((res) => (res.json()).then((data) => {setWallet(data.wallet)}))
          }}/>
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">My Account</button>
            {localStorage.getItem("userType") === "student"?<button onClick={viewWallet} className="flex relative px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full" role="menuitem">Wallet <span className='flex justify-center items-center absolute w-fit top-2 right-6'>{wallet} Credits</span></button>:""}
            <button onClick={() => {
              window.localStorage.clear()
              window.location.href = "/login"
            }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Sign Out</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageDropdown;
