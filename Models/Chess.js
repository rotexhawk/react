import Player from '../Models/Player.js'; 
import Board from '../Models/Board.js'; 
import MoveRangeGenerator from '../controllers/MoveRangeGenerator.js'; 

export default class Chess{

	constructor(){
		this.players = [new Player('player1'), new Player('player2')]; 

		this.currentPlayer = this.players[0]; 

		this.board = new Board(this.getCurrentPlayer(),this.getOppositePlayer()); 

		this.isSecondClick = false; 

		this.rangeGenerator = new MoveRangeGenerator(); 

	}

	getBoard(){
		return this.board; 
	}

	getBoardPieces(){
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
			this.selectedPiece = null; 
		}
		else if (this.isPlayersTurn(clickedPiece)){

			this.rangeGenerator.computeRange(this.getBoard(), this.getOppositePlayer(), this.getCurrentPlayer());

			this.rangeGenerator.computeRange(this.getBoard(), this.getCurrentPlayer(), this.getOppositePlayer(), true);

			this.selectedPiece = clickedPiece;  
 
			this.board.highlight(clickedPiece); 

			this.isSecondClick = true; 
		}

		return this; 
	}
	

	movePiece(clickedPiece){
	
		if (this.moveInRange(clickedPiece)){
			this.board.movePiece(this.selectedPiece, clickedPiece);
			this.switchPlayer();
		}

	}

	moveInRange(piece){
		return this.selectedPiece.range.has(piece);
	}




}