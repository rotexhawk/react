import Player from '../Models/Player.js'; 
import Piece from '../Models/Piece.js'; 

export default class Board{

	constructor(player1,player2){


		this.defaultSettings = {
			selectors: ['#chessBoard'],
			colors:['#B58863', '#F0D9B5'],
			showlabels: true, 
			sideBars: true, 
			animate: true, 
			showPath: true
		};

		this.squarePosition = {num: 8, alpha:97};  
		this.labelPosition = {num: 8, alpha: 97};

		this.setupSquares(player1,player2);
		
	}

	setupSquares(player1,player2){
		this.squares = []
		let count = 0; 
		for (let i = 1; i < 65; i++){
			
			let dataProp = this.getDataProp(i);
			
			let piece = player1.getPieceAt(dataProp) || player2.getPieceAt(dataProp);
			if (!piece){
				piece = new Piece(undefined,undefined,undefined,dataProp); 
			} 
			
			piece.setBackground(this.getPieceBackground(count));
			this.squares.push(piece);
			count++; 
		}

	}



	getSquares(){
		return this.squares; 
	}

	getPieceBackground(index){
	if (index > 0 &&index % 8 === 0){
		this.defaultSettings.colors.reverse();
	}
	return this.defaultSettings.colors[index % 2];
}


	// set the data-square index ie a8, b7, etc so we know which item is on which square
	getDataProp(index){
		var str = String.fromCharCode(this.squarePosition.alpha) + this.squarePosition.num; 
		this.squarePosition.alpha++; 

		if (index % 8 === 0){
			this.squarePosition.num--; 
			this.squarePosition.alpha = 97;
		}
		
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