import React from 'react';
import RankBoard from './RankBoard.jsx';
import axios from 'axios';

class LeaderBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allUsers: [],
      filteredUsers: [],
      defaultPhoto: 'https://harvardgazette.files.wordpress.com/2017/03/mark-zuckerberg-headshot-11.jpg',
      currentSearch: '',
      userRank: null
    };
    this.onChange = this.onChange.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
  };

  componentDidMount() {
    axios.get('/users').then((res) => {
      let users = res.data.sort((a, b) => b.totalPoints - a.totalPoints)
      this.setState({ 
        allUsers: users,
        filteredUsers: users
      });
    }).catch((error) => {
      console.log('user fetch error', error)
    });
  }

  getUserRank() {
    for (var i = 0; i < this.state.allUsers.length; i++) {
      if (this.state.allUsers[i].username === this.props.user.username) {
        return i +1;
      }
    }
  }

  onChange(e) {
    let newSearch = e.target.value;
    let newUsers = this.state.allUsers.filter((a) => a.username.includes(newSearch));
    this.setState({
      filteredUsers: newUsers,
      currentSearch: newSearch
    });
  }

  clearSearch() {
    this.setState({
      currentSearch: '',
      filteredUsers: this.state.allUsers
    });
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return nextState !== this.state;
  // }

  render() {
    return(
      <div className="myRank">
        <div className="profile-pic">
          <img className="circle" src={this.props.user.profilePicture}/>
          <div>
            <h3>{this.props.user.username}</h3>
            <h4>Rank: {this.state.allUsers.length > 0 ? this.getUserRank() : 'loading'}</h4>
          </div>
        </div>
        <div className="input-field">
          {/* <label className="label-icon" id="search_icon"><i className="material-icons">search</i></label> */}
          <div className="search_wrapper">
            <input className="search_bar" id="search" type="search" value={this.state.currentSearch} onChange={this.onChange} placeholder="Search..." />
            <i className="material-icons" id="search_close" onClick={this.clearSearch}>close</i>
          </div>
        </div>
        <RankBoard filteredUsers={this.state.filteredUsers}/>
      </div>
    );
  }
}
export default LeaderBoard; 