import Player from '../Models/Player.js'; 
import Board from '../Models/Board.js'; 

export default class Chess{

	constructor(){
		this.players = [new Player('player1'), new Player('player2')]; 

		this.currentPlayer = this.players[0]; 

		this.board = new Board(this.getCurrentPlayer(),this.getOppositePlayer()); 

		this.isSecondClick = false; 

		this.moveRange = [];

	}

	getBoard(){
		return this.board.getSquares(); 
	}


	getPlayers(){
		return this.players; 
	}


	getCurrentPlayer(){
		return this.currentPlayer; 
	}

	getOppositePlayer(){
		if (this.currentPlayer.name === 'player1'){
			return this.players[1];
		}
		return this.players[0];
	}

	notify(start){
		if (!this.isSecondClick){
			this.selectedPiece = this.board.getPieceAtSquare(start.dataset.square); 
			this.setHighlightArea(this.selectedPiece); 
			this.board.highlight(this.moveRange); 
		}
		return this; 
	}

	setHighlightArea(piece){
		if (piece.name === 'pawn'){
			this.setPawnRange(piece); 
		}
	}

	setPawnRange(piece){
		var range = piece.belongsTo === 'player1' ? 1 : -1; 

		if (!this.getCurrentPlayer().hasMadeFirstMove){
			range *= 2; 
		}	
		this.computeVerticalRange(piece,range); 
	}


	computeVerticalRange(piece,range){

		for (let i = piece.numeric+1; i <= piece.numeric + range; i++){

			 let returnPiece = this.board.getPieceAtSquare(piece.alpha + i); 
			 
			 if (returnPiece.belongsTo === this.getCurrentPlayer()){
			 	break; 
			 }

			this.moveRange.push(returnPiece); 
		}

		this.moveRange.push(piece); 
	}




}