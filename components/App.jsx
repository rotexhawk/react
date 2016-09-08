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
  	 let squares = this.state.chessBoard.getSquares().map((square,index) =>{

  	 	return(
  	 			<Square 
            index = {index}
  	 				name = {square.name}
  	 				image = {square.image} 
  	 				belongsTo = {square.belongsTo}
  	 				dataProp = {square.dataProp}
  	 				numeric = {square.numeric}
  	 				ascii = {square.ascii}
            background = {square.background}
  	 			/>
  	 		);

  	 	});	 

  	 	return(
  	 		<div id="chessBoard">
  	 			<ul>
  	 				{squares}
  	 			</ul>
  	 		</div>
  	 	);
  }


}