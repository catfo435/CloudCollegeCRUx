import { useMeeting } from "@videosdk.live/react-sdk";

export function Controls({isJoin} :{isJoin : boolean}) {
    const { leave,end, toggleMic, toggleWebcam } = useMeeting();
    return (
      <div>
        <button onClick={() => isJoin?leave():end()}>{isJoin?"Leave":"End"}</button>
        <button onClick={() => toggleMic()}>toggleMic</button>
        <button onClick={() => toggleWebcam()}>toggleWebcam</button>
      </div>
    );
  }