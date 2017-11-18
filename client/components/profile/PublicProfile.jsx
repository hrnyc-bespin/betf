import React from 'react';
import axios from 'axios';

class PublicProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: 'username',
      profilePicture: '',
      aboutMe: '',
      gameHistory: []
    };
  }

  componentDidMount() {
    let username = this.props.location.pathname.split('/').pop();
    axios.get(`/api/profile/${username}`)
    .then((response) => {
      this.setState({
        username: response.data.username,
        profilePicture: response.data.profilePicture,
        aboutMe: response.data.aboutMe,
        gameHistory: response.data.gameHistory
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }

  render() {
    return (
      this.state.username ?
      <div>
        <div className="profile_public">
          <img className="circle" src={this.state.profilePicture} alt={this.state.profilePicture}></img>
          <div>
            <h3>{this.state.username}</h3>
            <h6>{this.state.aboutMe}</h6>
          </div>
        </div> 
        <div className="profile_public profile_public_games">
          <h4>Completed Games</h4>
          {this.state.gameHistory.map((game, i) => 
            <div key={i}>{game}</div>)}
        </div>
      </div> :
      <div className="no_user">
        User not found?
      </div>
    );
  }
}

export default PublicProfile;