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

		
		this.labelPosition = {num: 8, alpha: 97};
		this.player1 = player1; 
		this.player2 = player2; 

		this.highlightedPieces = [];

		this.setupSquares();
		
	}

	setupSquares(){
		this.squarePosition = {num: 8, alpha:97};  
		this.squares = []
		let count = 0; 
		for (let i = 1; i < 65; i++){
			
			let dataProp = this.getDataProp(i);
			
			let piece = this.player1.getPieceAt(dataProp) || this.player2.getPieceAt(dataProp);
			if (!piece){
				piece = new Piece(undefined,undefined,undefined,dataProp); 
			} 
			
			piece.setBackground(this.getPieceBackground(count));
			piece.setIndex(count); 
			this.squares.push(piece);
			count++; 
		}

	}


	getSquares(){
		return this.squares; 
	}

	getElement(index){
		return this.squares[index];
	}

	updateElement(...elements){
		elements.forEach(element => { this.squares[element.index] = element} );
	}


	movePiece(prev,next){
		
		if (next.belongsTo){
			this[next.belongsTo].pieces = this[next.belongsTo].pieceEaten(next);
		}

		var swappedArray = this[prev.belongsTo].movePiece(prev,next);
		this.updateElement(...swappedArray);
	}


	getPieceBackground(index){
	if (index > 0 && index % 8 === 0){
		this.defaultSettings.colors.reverse();
	}
	return this.defaultSettings.colors[index % 2];
	}

	getOppositeBackground(color){
		const oppIndex = this.defaultSettings.colors.indexOf(color) === 0 ? 1 : 0;  
		return this.defaultSettings.colors[oppIndex];
	}

	getBackgroundByNeighbor(piece){
		let index = -1; // get left piece 
		if (piece.index % 8 === 0){
			index = 1; 
		}
		
		return this.getOppositeBackground(this.squares[piece.index + index].background); 
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


	highlight(pieceArray){
		this.highlightedPieces = pieceArray; 
		this.highlightedPieces.forEach(piece => {
			piece.setBackground('blue');
			this.squares[piece.index] = piece;  
		});
	}

	removeHighLight(){
		this.highlightedPieces.forEach(piece => {
			piece.setBackground(this.getBackgroundByNeighbor(piece)); 
			this.squares[piece.index] = piece; 
		});
	}




	getPieceAtSquare(dataProp){
		return this.squares.find(piece => {
				return piece.dataProp === dataProp; 
		}); 
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