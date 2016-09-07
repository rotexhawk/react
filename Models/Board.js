import Player from '../Models/Player.js'; 
import Piece from '../Models/Piece.js'; 

export default class Board{

	constructor(player1,player2){

		this.squarePosition = {num: 8, alpha:97};  
		this.labelPosition = {num: 8, alpha: 97};

		this.squares = player1.getPieces().concat(player2.getPieces());


		for (let i = 0; i < 64; i++){
			
			let dataProp = this.getDataProp(i);

			if (player1.getPieceAt(dataProp) === undefined && player2.getPieceAt(dataProp) === undefined){
				this.squares.push(new Piece(undefined,undefined,undefined,dataProp));
			}
		}
		
	}


	getSquares(){
		return this.squares; 
	}


	// set the data-square index ie a8, b7, etc so we know which item is on which square
	getDataProp(index){
		if (index % 8 === 0){
			this.squarePosition.num--; 
			this.squarePosition.alpha = 97;
		}
		var str = String.fromCharCode(this.squarePosition.alpha) + this.squarePosition.num; 
		this.squarePosition.alpha++; 
		return str; 
	}


	/**
	setLabels(index){
		var label;
		
		if (index % 8 === 0){
			label = new Label('number',labelPosition.num); 
			labelPosition.num--;
		}
		if (index >=56){
			label = new Label('alphabet', String.fromCharCode(labelPosition.alpha)); 
			labelPosition.alpha++;
		}
		return label; 
	}
	**/



}