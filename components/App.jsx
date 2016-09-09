import React from 'react'; 

import Chess from '../Models/Chess.js'; 

import Square from 'Square.jsx';

import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';

export default class App extends React.Component {
  constructor(){ // constructor(props)
  	super(); 	// super(props) 
    
  	this.state = {
      chess: {},
  	}

   this.handleClick = this.handleClick.bind(this);
  	
  }

/** some initial state -> don't use for ajax. **/
  componentWillMount(){
   
      this.setState({
          chess: new Chess()
      });
    
  }

  componentDidMount(){
 	 

  }

  componentWillUnmount(){
    console.log('component unmount called');
  }

  handleClick(e){
    let targetElm = e.target; 
    if (targetElm.parentElement.nodeName === 'LI'){
      targetElm = e.target.parentElement; 
    }

    this.setState({
        chess: this.state.chess.notify(targetElm)
    });
    
  }


 
  render(){
  	console.log(this.state);

  	 let squares = this.state.chess.getBoard().map(square =>{

  	 	return(
  	 			<Square 
            key = {square.index}
            index = {square.index}
  	 				name = {square.name}
  	 				image = {square.image} 
  	 				belongsTo = {square.belongsTo}
  	 				dataProp = {square.dataProp}
  	 				numeric = {square.numeric}
  	 				ascii = {square.ascii}
            background = {square.background}
            onClick={this.handleClick}
  	 			/>
  	 		);

  	 	});	 

  	 	return(
  	 		<div id="chessBoard">
  	 			<ul>
          <ReactCSSTransitionGroup 
          transitionName="example" 
          transitionEnterTimeout={500} 
          transitionLeaveTimeout={300}>
  	 				{squares}
          </ReactCSSTransitionGroup>  
  	 			</ul>
  	 		</div>
  	 	);
  }


}