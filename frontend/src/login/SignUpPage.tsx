import React, { useEffect, useReducer, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { Button } from 'flowbite-react';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes } from 'firebase/storage';

const SignUpPage: React.FC = () => {
  const [isStudent, setIsStudent] = useState(true);
  const [googleOAuthSuccess,setGoogleOAuthSuccess] = useState(false);
  const [loading,setLoading] = useState(false)


  //@ts-ignore
  const reducer = (state,action) => {
    switch (action.type) {
      case "name":
          return {...state,name: action.value};
      case "email":
          return {...state,email: action.value};
      case "id":
          return {...state,instituteId: action.value};
      case "phone":
          return {...state,phone: action.value};
      case "college":
          return {...state,college: action.value};
      case "pfp":
          return {...state,profile_pic: action.value};
  }
  
  }

  useEffect(() => {
    if (window.localStorage.getItem("userType") !== null){
      window.location.href = "/dashboard"
    }
  },[])
  
  const [form,setForm] = useReducer(reducer,{email:"",name:"",instituteId:"",phone:"",college:"",profile_pic:""})

  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(true);

  //@ts-ignore
  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    fetch(import.meta.env.VITE_BACKEND_URL + `/${isStudent?"students":"instructors"}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({...form,profile_picture:"dummystring"}), // body data type must match "Content-Type" header
    })
    .then(async (res) => {

      const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG)
      initializeApp(firebaseConfig)

      const storage = getStorage()
      const picRef = ref(storage,`${form.email}/profile.png`)

      try{
        console.log(form.profile_pic)
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL!}/profile-pic/?url=${form.profile_pic}`)
        uploadBytes(picRef,await response.blob())
      }
      catch (e){
        console.error(e)
      }

      window.localStorage.setItem("userEmail",form.email)
      window.localStorage.setItem("userType",isStudent?"student":"instructor")
      window.localStorage.setItem("userId",(await res.json())._id)
      window.localStorage.setItem("pfp",form.profile_pic)
      if (res.status === 201) alert("Signed up Succesfully")
      window.location.href = "/dashboard"
    })
    .catch((e) => {
      alert("Error!")
      console.error(e)
    })
    .finally(() => {
      setLoading(false)
    })
  }

  const handleGoogleLogin = async (res: any) => {

    const Data: any = jwtDecode(res.credential!)

    try{
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + `/${isStudent?"students":"instructors"}/${Data.email}`)

    if (response.status === 200) {
      window.location.href = "/dashboard"
      window.localStorage.setItem("userEmail",Data.email)
      window.localStorage.setItem("userType",isStudent?"student":"instructor")
      window.localStorage.setItem("userId",(await response.json())._id)
      window.localStorage.setItem("pfp",Data.picture)
      return;
    }

    }
    catch(e){
      console.log(e);
      alert("Something went wrong!")
      return;
    }3

    setForm({type:"email",value : Data.email});
    setForm({type:"name",value : Data.name});
    setForm({type:"pfp",value : Data.picture});
    setGoogleOAuthSuccess(true)
  };

  const handleGoogleLoginFailure = () => {
    setGoogleOAuthSuccess(false)
    console.error('Google Login Error:');
  };

  const phoneNumberRegex = /^[1-9]\d{9}$/;

  const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({type : "phone",value : event.target.value})
    setIsValidPhoneNumber(phoneNumberRegex.test(event.target.value));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md transition-transform duration-300 ease-in-out">
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setIsStudent(true)}
            className={`px-4 py-2 rounded-l-lg transition-colors duration-300 ${isStudent ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Student
          </button>
          <button
            onClick={() => setIsStudent(false)}
            className={`px-4 py-2 rounded-r-lg transition-colors duration-300 ${!isStudent ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Instructor
          </button>
        </div>

        <h2 className="text-2xl font-bold text-center mb-8">
          {isStudent ? 'Student Sign Up' : 'Instructor Sign Up'}
        </h2>
        
        <form className="space-y-4 w-full" onSubmit={handleSignUp}>
          <div className='flex justify-center items-center'>
          <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={handleGoogleLoginFailure}
        />
          </div>
        {(googleOAuthSuccess)?(
          <div>
          <div>
            <label className="flex text-sm font-medium">Email</label>
            <input
              type="email"
              disabled
              value={form.email}
              className='mt-1 flex w-full px-3 py-2 border bg-gray-200 border-gray-300 rounded-md shadow-sm transition-transform duration-200 ease-in-out transform'/>
          </div>
          <div>
            <label className="flex text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => {setForm({type : "name",value : e.target.value})}}
              className="mt-1 flex w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm transition-transform duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="flex text-sm font-medium text-gray-700">Institute ID</label>
            <input
              type="text"
              value={form.instituteId}
              onChange={(e) => {setForm({type : "id",value : e.target.value})}}
              className="mt-1 flex w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm transition-transform duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {isStudent && (
            <>
              <div>
                <label className="flex text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={handlePhoneNumberChange}
                  className={`mt-1 flex w-full px-3 py-2 border ${isValidPhoneNumber ? 'border-gray-300' : 'border-red-500'} rounded-md shadow-sm transition-transform duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
                <p className={`text-sm text-red-500 ${isValidPhoneNumber ? 'hidden' : 'flex'}`}>Please enter a valid phone number.</p>
              </div>
              <div>
                <label className="flex text-sm font-medium text-gray-700">College</label>
                <input
                  type="text"
                  value={form.college}
                  onChange={(e) => {setForm({type : "college",value : e.target.value})}}
                  className="mt-1 flex w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm transition-transform duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </>
          )}
          <div className='h-5'></div> 
          <div className='flex justify-center w-full'>
            <Button type='submit' color="blue" size="lg" isProcessing={loading}>
              Submit
            </Button>
          </div>
          </div>
        ):""}
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;

