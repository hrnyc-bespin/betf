import React from 'react';

// Recieves props from: 
  // GameFrame
// Gives props to: 
  // none

const Prompt = (props) => (
  <div>
    <h1>
      <h3>{props.name}</h3>
    </h1>
    <div>{props.promptDetails}</div>
  </div>
);

export default Prompt;