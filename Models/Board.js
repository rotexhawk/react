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


	highlight(piece){
		this.removeHighLight(); 
		piece.range.forEach(rangePiece => {
			rangePiece.isHighLighted = true;
			this.squares[rangePiece.index] = rangePiece;  
		});
		piece.isHighLighted = true; 
		this.squares[piece.index] = piece; 
	}

	removeHighLight(){
		this.squares.forEach(piece => {
			piece.isHighLighted = false; 
			this.squares[piece.index] = piece; 
		});
	}




	getPieceAtSquare(dataProp){
		return this.squares.find(piece => {
				return piece.dataProp === dataProp; 
		}); 
	}

	getPieceAtAsciiNumeric(ascii,numeric){
		return this.squares.find(piece => piece.ascii === ascii && piece.numeric === numeric);
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