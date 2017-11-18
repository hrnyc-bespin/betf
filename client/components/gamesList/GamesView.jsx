//This is the highest level view of the page that will include a list of all available challenges

import React from 'react';
import { Route, Redirect } from 'react-router';
import { BrowserRouter, Link, Switch } from 'react-router-dom'
import createBrowserHistory from 'history/createBrowserHistory'

const customHistory = createBrowserHistory()
import axios from 'axios';

import UserInfo from './UserInfo.jsx';
import Profile from '../profile/Profile.jsx'
import GamesList from './GamesList.jsx';
import GameFrame from '../gameScreen/GameFrame.jsx';
//GamesView -> GamesList
//      \----> GameFrame
//       \---> UserInfo

class GamesView extends React.Component {
  constructor(props) {
    super(props);
    // Sets default/dummy values for points and level -> replace with user data
    this.state = {
      games: [],
      selectedGame: null
    };
    this.onGameSelect = this.onGameSelect.bind(this);
  };

// Upon the GamesView mounting, we are making a get request to the /games route which will return an array of games to render on the page
// Will also need to replace user data, should Main.jsx handle this?
  componentDidMount() {
    axios.get('/games')
    .then((response) => {
      let games = response.data.map((game) => {
        game.completed = this.props.user.gameHistory.includes(game.name);
        return game;
      });
      this.setState({ games });
    })
    .catch((err) => {
      throw(err);
    });
  };

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    let games = this.state.games.map((game) => {
      game.completed = nextProps.user.gameHistory.includes(game.name);
      return game;
    });
    this.setState({ games });
  }

  onGameSelect(idx) {
    this.setState({
      selectedGame: this.state.games[idx]
    });
  }

  //<Redirect from="/" exact to="/gameList" />
//renders two components: UserInfo with dummy user date and GamesList with a list of available games.
//The username prop is coming from main.js in the public folder
  render(){
    return (
        <div>
         <div className="red lighten-4 center">
           <UserInfo username={this.props.user.username} points={this.props.user.totalPoints} level={this.props.user.level} />
         </div>
         <Switch>
           <Route exact path='/gameList' render={() => <GamesList gamesList={this.state.games} onGameSelect={this.onGameSelect} />}/>
           {this.state.games.map((game, i) => <Route key={i} path={'/gameList/' + (game.name ? game.name.replace(/ /g,'') : game.name)} render={() => <GameFrame setUser={this.props.setUser} user={this.props.user} key={i} gameObject={game} />} />)}
         </Switch>
       </div>
    );
  }
}

export default GamesView;
