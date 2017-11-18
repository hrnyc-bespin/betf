import React from 'react';
import axios from 'axios'; 
import ReactCountdownClock from 'react-countdown-clock';

// Recieves props from: 
  // nowhere.
// Gives props to: 
  // none, but could be the submitButton. 

// SAM 11/14/2017 - This will need a handler to inform GamesView to
// make a submit request. Submit button will need the same.

const Timer = (props) => (
  <div className="time"> 
    <ReactCountdownClock 
      seconds={600}
      color="#FF0000"
      alpha={0.9}
      size={100}
      paused={props.isComplete}
      onComplete={props.onTimerExpired} /> 
  </div>
);

export default Timer;
