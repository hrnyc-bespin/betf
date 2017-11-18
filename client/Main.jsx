import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Landing from './components/landing/landing.jsx';
import GamesView from './components/gamesList/GamesView.jsx';
import { Route, Redirect } from 'react-router';
import { BrowserRouter, Link, Switch } from 'react-router-dom'
import LeaderBoard from './components/leaderboard/LeaderBoard.jsx';
import Profile from './components/profile/Profile.jsx';
import NavBar from './components/navbar/NavBar.jsx';
import PublicProfile from './components/profile/PublicProfile.jsx';

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
    this.setUser = this.setUser.bind(this);
    this.logout = this.logout.bind(this);
    this.checkUser.bind(this);
  }

  setUser(user) {
    this.setState({ user });
  }

  logout() {
    axios.get('/logout')
    .then((response) => {
      this.setState({ user: null });
    })
    .catch((error) => {
      this.setState({ user: null });
    });
  }

  checkUser() {
    axios.get('/users/auth')
    .then((response) => {
      this.setState({ user: response.data });
    })
    .catch((error) => {
      console.log('User session expired');
    });
  }

  componentDidMount() {
    this.checkUser();
  }

  render(props) {
    // only render the gamesView if this.state.user is defined.
    // this.state.user gets defined by the setUser function in Lander.
    return (
      <BrowserRouter>
        <div className="outerbox">
          <NavBar logout={this.logout} show={this.state.user !== null}/>
          {this.state.user === null ?
          (<h6>
            <Landing setUser={this.setUser} />
            </h6>
          ) : (
          <div>
            <Switch>
              <Redirect exact from='/' to='/gameList'/>
              <Route path='/gameList' render={() => <GamesView setUser={this.setUser} user={this.state.user} />} />
              <Route path='/leaderboard' render={() => <LeaderBoard user={this.state.user} />} />
              <Route exact path='/profile' render={() => <Profile setUser={this.setUser} user={this.state.user} />} />
              <Route path='/profile/:userid' component={PublicProfile} />
            </Switch>
          </div>)}
        </div>
      </BrowserRouter>
    );
  }
}

ReactDOM.render(<Page />, document.getElementById('mount'));
