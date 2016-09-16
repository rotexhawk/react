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
	// if moving this piece causes the king to be checked, don't allow the move unless it's to eat that piece
			// if (this.willBeChecked(clickedPiece)){
			// 	console.log('this is working');
			// }
			
			this.rangeGenerator.computeRange(this.getBoard(), this.getOppositePlayer(), this.getCurrentPlayer()) 

			this.rangeGenerator.computeRange(this.getBoard(), this.getCurrentPlayer(), this.getOppositePlayer()); 

			this.board.highlight(clickedPiece); 

			this.selectedPiece = clickedPiece;  

			this.isSecondClick = true; 
		}

		return this; 
	}

	


	computeKingMove(piece,testLoop){
		this.computeRookRange(piece,1); 
		this.computeBishopMove(piece,1);
		if (!testLoop){
			this.removeKingCheckPiecesFromRange(); 
		}
	}

	/** This method is called to remove the pieces where king can be checked from the moveRange set so King is not 
	* allowed to move to a place where it can be checked. 
	**/
	removeKingCheckPiecesFromRange(){
		this.currentPlayerMoveRange = this.moveRange; 

		this.getOppositePlayer().pieces.forEach(piece =>{
			this.setHighlightArea(piece,true); 
			this.moveRange.forEach(movePiece =>{
				this.currentPlayerMoveRange.forEach(currentPiece =>{
					if (movePiece.dataProp === currentPiece.dataProp){
						this.currentPlayerMoveRange.delete(currentPiece);
					}
				});
			});
		});
		
		this.moveRange = this.currentPlayerMoveRange; 
	}

	willBeChecked(piece){
		this.setHighlightArea(piece,true); 
		this.currentPlayerMoveRange = this.moveRange; 



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