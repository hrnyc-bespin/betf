import React from 'react';
import ReactDOM from 'react-dom';
import Landing from './components/landing/Landing.jsx';
import GamesView from './components/gamesList/GamesView.jsx'
//all components will be attached to this Page component. 
//Page component will be rendered to the html file
class Page extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user : null, 
	  }; 
	 this.setUser = this.setUser.bind(this)
  }

 	setUser(user) {
	  this.setState({ user });
  }

  render(props) {
    // only render the gamesView if this.state.user is defined. 
    // this.state.user gets defined by the setUser function in Lander.
    return (this.state.user === null) ?
      <h6>
        <Landing setUser={this.setUser} />
      </h6> : 
      <div>
        <GamesView user={this.state.user} />
      </div>;
    }
  }


ReactDOM.render(<Page />, document.getElementById('mount'))    