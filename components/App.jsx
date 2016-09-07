import React from 'react'; 

import Chess from '../Models/Chess.js'; 

import Square from 'Square.jsx';



export default class App extends React.Component {
  constructor(){ // constructor(props)
  	super(); 	// super(props) 
  	this.state = {
  		chessBoard:[]
  	}
  	
  }

/** some initial state -> don't use for ajax. **/
  componentWillMount(){
      const chess = new Chess();
      this.setState({
          chessBoard: chess.getBoard(), 
      });
    
  }

  componentDidMount(){
 	 

  }

  componentWillUnmount(){
    console.log('component unmount called');
  }


 
  render(){
  	console.log(this.state);
  	 let squares = this.state.chessBoard.getSquares().map(square =>{
  	 	return(
  	 			<Square 
  	 				name = {square.name}
  	 				image = {square.image} 
  	 				belongsTo = {square.belongsTo}
  	 				dataProp = {square.dataProp}
  	 				numeric = {square.numeric}
  	 				ascii = {square.ascii}
  	 			/>
  	 		);

  	 	});	 

  	 	return(
  	 		<div>
  	 			<ul>
  	 				{squares}
  	 			</ul>
  	 		</div>
  	 	);
  }


}