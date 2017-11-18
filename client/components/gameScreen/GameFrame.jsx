import React from 'react';
import axios from 'axios';
import Prompt from './Prompt.jsx'; 
import Timer from './Timer.jsx'; 
import CodeEntryForm from './CodeEntryForm.jsx';
import Result from './Result.jsx';

class GameFrame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      algorithm: null, 
      prompt: null, 
      seedCode: null, 
      testSuite: null,
      value: '',
      timerExpired: false,
      result: {},
      isComplete: false
    };
    this.algorithmID = this.props.gameObject.algorithmID;
    this.getAlgorithm = this.getAlgorithm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onTimerExpired = this.onTimerExpired.bind(this);
  }

  handleChange(value) {
    this.state.value = value;
  }

  onTimerExpired() {
    this.handleSubmit(true);
  }

  // Initial fetch
  getAlgorithm(algoId) {
    axios.get('/algos/' + algoId) 
    .then((response) => {
      this.setState({
        algorithm: response.data,
        prompt: response.data.prompt,
        seedCode: response.data.seedCode,
        value: response.data.seedCode,
        testSuite: response.data.testingSuite
      });
    });
  }

  // Managing user code state here means we can submit at any time, including when timer expires
  // timerExpired is an optional argument used for when the timer actually expires
  // SJK 11/18/2017 this logic is poorly flowing, if time, fix this
  handleSubmit(timerExpired = false) {
    let newState = { timerExpired };
    axios.post('/test', {
      value: this.state.value,
      testSuite: this.state.testSuite,
      algo: this.props.gameObject.algorithmID
    })
    .then((response) => {
      newState.result = response.data;
      if (!timerExpired && Number(newState.result.failing) !== 0) {
        this.setState(newState);
        return false;
      } else  {
        newState.isComplete = true;
        return this.props.user.gameHistory.includes(this.props.gameObject.name) ? false :
        axios.post('/users/points', {
          result: newState.result,
          value: this.state.value,
          timerExpired: timerExpired,
          user: this.props.user,
          length: this.props.gameObject.lenth
        });
      }
    })
    .then((response) => {     
      if (response === false) { return response; }
      let user = response.data;
      return axios.put('/gamehistory', { params: { username: this.props.user.username, gamename: this.props.gameObject.name } });
    })
    .then((response) => {
      let callback = () => this.props.setUser(response.data);
      response === false ? this.setState(newState) : this.setState(newState, callback);
    })
    .catch((error) => {
      console.log(error);
      this.setState({
        result: { testResults: 'Unable to parse code' },
        timerExpired: timerExpired
      });
    });
  }

  // Initial fetch
  componentDidMount() {
    this.getAlgorithm(this.algorithmID);
  }

  // Check if user is changing
  // componentWillUpdate(nextProps, nextState) {
  //   if (nextProps.user.points === this.props.user.points) {
  //     nextState = this.state;
  //   }
  // }

  render() {
    return (this.state.testSuite === null || this.state.prompt === null || this.state.seedCode === null || this.state.algorithm === null) ? 
    <div className="loading"> Loading Game... </div> : 
    <div className="container">
      <div className="gameview">
        <div className="col s9 container">
          <div className="col s3 container">
            {<Timer isComplete={this.state.isComplete} onTimerExpired={this.onTimerExpired} />}
          </div>
          <Prompt 
            promptDetails={this.state.prompt} 
            name={this.props.gameObject.name} />
          <br/>
          <CodeEntryForm
            seedCode={this.state.seedCode} 
            testSuite={this.state.testSuite}
            algo={this.props.gameObject.algorithmID}
            value={this.state.value}
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
            timerExpired={this.state.timerExpired} 
            result={this.state.result}
            isComplete={this.state.isComplete} /> 
          <Result result={this.state.result} />
        </div>
      </div> 
    </div>
  }
}

export default GameFrame; 
