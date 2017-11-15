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
  <div >
    <div > 
        <ReactCountdownClock 
          seconds={500}
          color="#FF0000"
          alpha={0.9}
          size={100}
          onComplete={() => console.log('time\'s up!')}
        /> 
     </div>
  </div>
);

export default Timer;