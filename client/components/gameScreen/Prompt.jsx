import React from 'react';

// Recieves props from: 
  // GameFrame
// Gives props to: 
  // none

const Prompt = (props) => (
  <div>
    <blockquote>
      <h3>{props.name}</h3>
    </blockquote>
    <div>{props.promptDetails}</div>
  </div>
);

export default Prompt;