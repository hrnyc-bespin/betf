var React = require('React');
var axios = require('axios');
import GameFrame from '../gameScreen/GameFrame.js'

export class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			rendered: false,
		};
	};

	handleClick (){
		console.log('this is getting clicked')
		this.setState({
	 		rendered : !this.state.rendered
		})
	};

	render(){
		return (this.state.rendered) ? 
		(<div onClick= {this.handleClick.bind(this)} >{this.props.game.name}</div>) :
		(<GameFrame gameObject = {this.props.game.name}/>)
	};
}

export default Game; 

