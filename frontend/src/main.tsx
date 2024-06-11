import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import SignUpPage from './login/SignUpPage.tsx';
import App from './App.tsx';
import {createBrowserRouter,RouterProvider,} from "react-router-dom";
import Selector from './dashboard/Selector.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Explore from './dashboard/explore/Explore.tsx';
import Dashboard from './dashboard/Dashboard.tsx';
import CoursePage from './course/CoursePage.tsx';
import LiveStream from './course/stream/LiveStream.tsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "login",
    element: <GoogleOAuthProvider clientId={import.meta.env.VITE_OAUTH_CLIENT_ID}><SignUpPage /></GoogleOAuthProvider>,
  },
  {
    path: "dashboard",
    element : <Selector />,
    children : [
      {
        path : "",
        element : <Dashboard />
      },
      {
        path : "explore",
        element : <Explore />
      }
    ]
  },
  {
    path: "courses/:courseId",
    element: <CoursePage />
  },
  {
    path: "courses/:courseId/livestream/:action",
    element : <LiveStream />
  }
]);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
