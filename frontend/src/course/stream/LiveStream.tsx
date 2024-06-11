import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MeetingProvider} from "@videosdk.live/react-sdk"
import { MeetingView } from "./MeetingView";

export const LiveStream = () => {

    const {courseId, action} = useParams()   
    const [authToken,setAuthToken] = useState<string>()
    const [meetingId, setMeetingId] = useState<string | null >()

    const handleMeeting = () => {

        fetch(`${import.meta.env.VITE_BACKEND_URL}/livestreamtoken?courseId=${courseId}&userId=${window.localStorage.getItem("userId")}`)
        .then((res) => (res.json()).then(async (data) => {
          setAuthToken(data.token)

          if (action === "join") {
            fetch(`${import.meta.env.VITE_BACKEND_URL}/courses/${courseId}`)
            .then((res) => (res.json()).then((course) => {setMeetingId(course.roomId)}));
            return;
          }

          const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
                method: "POST",
                headers: {
                authorization: data.token,
                }
        })
            const {roomId} = await res.json()
            setMeetingId(roomId)

            fetch(`${import.meta.env.VITE_BACKEND_URL}/courses/${courseId}/livestream`,{
              method : "POST",
              headers : {
                "Content-Type" : "application/json"
              },
              body : JSON.stringify({roomId})
            })
          
        }))
        }

    const onMeetingLeave = () => {
      setMeetingId(null);
      if (action === "create"){
        fetch(`${import.meta.env.VITE_BACKEND_URL}/courses/${courseId}/livestream`,{
          method : "POST",
          headers : {
            "Content-Type" : "application/json"
          },
          body : JSON.stringify({roomId : "nolive"})
        })
        .then(() => {
        window.location.href = `/courses/${courseId}`
        })
      }
      window.location.href = `/courses/${courseId}`
      }

    useEffect(handleMeeting,[])

    return (authToken || action === "join") && meetingId ? (
        <MeetingProvider
          config={{
            meetingId,
            micEnabled: true,
            webcamEnabled: true,
            name: window.localStorage.getItem("userEmail")!,
            debugMode : false
          }}
          token={authToken!}
        >
          <MeetingView meetingId={meetingId} onMeetingLeave={onMeetingLeave} isJoin={action === "join"}/>
        </MeetingProvider>
      ) : "Loading"
}

export default LiveStream;