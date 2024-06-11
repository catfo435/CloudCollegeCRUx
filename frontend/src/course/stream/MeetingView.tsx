import { useMeeting } from "@videosdk.live/react-sdk";
import { useEffect, useState } from "react";
import { Controls } from "./Controls";
import { ParticipantView } from "./ParticipantView";

export function MeetingView({
    onMeetingLeave,
    meetingId,
    isJoin
  }: {
    onMeetingLeave: () => void,
    meetingId: string,
    isJoin : boolean
  }) {
    const [joined, setJoined] = useState<string | null>();
    //Get the method which will be used to join the meeting.
    //We will also get the participants list to display all participants
    const { join, participants } = useMeeting({
      //callback for when meeting is joined successfully
      onMeetingJoined: () => {
        setJoined("JOINED");
      },
      //callback for when meeting is left
      onMeetingLeft: () => {
        onMeetingLeave();
      },
    });
    const joinMeeting = () => {
      setJoined("JOINING");
      join();
    };

    useEffect(() => {
      joinMeeting()
    },[])
  
    return (
      <div className="container">
        <h3>Meeting Id: {meetingId}</h3>
        {joined && joined == "JOINED" ? (
          <div>
            <Controls isJoin={isJoin} />
            //For rendering all the participants in the meeting
            {[...participants.keys()].map((participantId) => (
              <ParticipantView
                participantId={participantId}
                key={participantId}
              />
            ))}
          </div>
        ) : joined && joined == "JOINING" ? (
          <p>Joining the meeting...</p>
        ) : (
          <button onClick={joinMeeting}>Join</button>
        )}
      </div>
    );
  }