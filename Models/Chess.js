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

	switchPlayer(){
		this.currentPlayer = this.getOppositePlayer(); 
	}

	isPlayersTurn(clickedPiece){
		if (!clickedPiece || clickedPiece.belongsTo === this.getCurrentPlayer().name){
			return true; 
		}
		return false; 
	}

	notify(clickedPiece){
		clickedPiece = this.board.getPieceAtSquare(clickedPiece.dataset.square); 
			
		if (this.isSecondClick && clickedPiece.belongsTo !== this.getCurrentPlayer().name){
			this.board.removeHighLight(); 
			this.movePiece(clickedPiece); 
			this.isSecondClick = false; 
			this.selectedPiece = undefined; 
		}
		else if (this.isPlayersTurn(clickedPiece)){
			this.selectedPiece = clickedPiece;  
			this.setHighlightArea(this.selectedPiece); 
			this.board.highlight(this.moveRange); 
			this.isSecondClick = true; 
		}

		return this; 
	}

	setHighlightArea(piece){
		this.board.removeHighLight(); 
		this.moveRange = [];
		if (piece.name === 'pawn'){
			this.setPawnRange(piece); 
		}
		if (piece.name === 'rook'){
			this.computeVerticalRange(piece);
		}
	}

	setPawnRange(piece){
		var range = this.getCurrentPlayer().hasMadeFirstMove === true ? 1 : 2; 

		if (this.getCurrentPlayer().name === 'player1'){
			this.computeVerticalUp(piece,range);
		}
		else{
			console.log(range);
			this.computeVerticalDown(piece,range);
		}	

	}


	computeVerticalRange(piece){
		this.computeVerticalUp(piece); 
		this.computeVerticalDown(piece);
	}



	computeVerticalUp(piece,range = 8){

		for (let i = 1; i <= range; i++){

			 let returnPiece = this.board.getPieceAtSquare(piece.alpha + (piece.numeric + i)); 

			 if (!returnPiece){
			 	continue; 
			 }

			 if (returnPiece.belongsTo === this.getCurrentPlayer().name){
			 	break; 
			 }
			 else if (returnPiece.belongsTo === this.getOppositePlayer().name){
			 	this.moveRange.push(returnPiece); 
			 	break; 
			 }

			this.moveRange.push(returnPiece); 
		}

		this.moveRange.push(piece); 
	}


	computeVerticalDown(piece,range = 8){

		for (let i = 1; i <= range; i++){

			 let returnPiece = this.board.getPieceAtSquare(piece.alpha + (piece.numeric - i)); 

			 if (!returnPiece){
			 	continue; 
			 }

			 if (returnPiece.belongsTo === this.getCurrentPlayer().name){
			 	break; 
			 }
			 else if (returnPiece.belongsTo === this.getOppositePlayer().name){
			 	this.moveRange.push(returnPiece); 
			 	break; 
			 }

			this.moveRange.push(returnPiece); 
		}

		this.moveRange.push(piece); 

	}




	movePiece(clickedPiece){
	
		if (this.moveInRange(clickedPiece)){
			this.board.movePiece(this.selectedPiece, clickedPiece);
			this.switchPlayer();
		}

	}

	moveInRange(piece){
		
		return this.moveRange.find(elm => elm.index === piece.index);
	}



}