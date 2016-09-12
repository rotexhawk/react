import Player from '../Models/Player.js'; 
import Board from '../Models/Board.js'; 

export default class Chess{

	constructor(){
		this.players = [new Player('player1'), new Player('player2')]; 

		this.currentPlayer = this.players[0]; 

		this.board = new Board(this.getCurrentPlayer(),this.getOppositePlayer()); 

		this.isSecondClick = false; 

		this.moveRange = new Set();

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
			this.selectedPiece = null; 
		}
		else if (this.isPlayersTurn(clickedPiece)){
	// if moving this piece causes the king to be checked, don't allow the move unless it's to eat that piece
			// if (this.willBeChecked(clickedPiece)){
			// 	console.log('this is working');
			// }
			this.selectedPiece = clickedPiece;  
			this.setHighlightArea(this.selectedPiece); 
			this.board.highlight(this.moveRange); 
			this.isSecondClick = true; 
		}

		return this; 
	}

	setHighlightArea(piece,testLoop){
		
		this.moveRange = new Set();

		if (piece.name === 'pawn'){
			this.setPawnRange(piece); 
		}
		if (piece.name === 'rook'){
			this.computeRookRange(piece);
		}
		if (piece.name === 'knight'){
			this.computeKnightMove(piece);
		}
		if (piece.name === 'bishop'){
			this.computeBishopMove(piece);
		}
		if (piece.name === 'queen'){
			this.computeQueenMove(piece);
		}
		if (piece.name === 'king'){
			this.computeKingMove(piece, testLoop);
		}

		this.moveRange.add(piece);
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


	computeRookRange(piece,range){
		this.computeVerticalUp(piece, range); 
		this.computeVerticalDown(piece, range);
		this.computeHorizontalLeft(piece, range);
		this.computeHorizontalRight(piece, range);
	}

	computeQueenMove(piece){
		this.computeRookRange(piece); 
		this.computeBishopMove(piece);
	}



	computeKnightMove(piece){
		
		let moveArray = [
		this.board.getPieceAtAsciiNumeric(piece.ascii + 2, piece.numeric + 1),
		this.board.getPieceAtAsciiNumeric(piece.ascii - 2, piece.numeric + 1),
		this.board.getPieceAtAsciiNumeric(piece.ascii + 2, piece.numeric - 1),
		this.board.getPieceAtAsciiNumeric(piece.ascii - 2, piece.numeric - 1),
		this.board.getPieceAtAsciiNumeric(piece.ascii + 1, piece.numeric + 2), 
		this.board.getPieceAtAsciiNumeric(piece.ascii + 1, piece.numeric - 2), 
		this.board.getPieceAtAsciiNumeric(piece.ascii - 1, piece.numeric + 2), 
		this.board.getPieceAtAsciiNumeric(piece.ascii - 1, piece.numeric - 2),
		]; 

		moveArray.forEach(returnPiece => this.validMove(returnPiece)); 

	}	

	computeBishopMove(piece, range){
		this.computeDiagonalDownLeft(piece,range);
		this.computeDiagonalUpLeft(piece, range);
		this.computeDiagonalDownRight(piece, range);
		this.computeDiagonalUpRight(piece, range);
	}




	validMove(piece){
		
		if (!piece){
			return false; 
		}
		
		if (piece.belongsTo === this.getCurrentPlayer().name){
			return false; 
		}
		if (piece.belongsTo === this.getOppositePlayer().name){
			this.moveRange.add(piece); 
			return false; 
		}
		this.moveRange.add(piece); 
		return true; 
	}

	setPawnRange(piece){
		var range = this.getCurrentPlayer().hasMadeFirstMove === true ? 1 : 2; 
		let returnPiece; 

		if (this.getCurrentPlayer().name === 'player1'){

			for (let i = 1; i <= range; i++){
			 returnPiece = this.board.getPieceAtAsciiNumeric(piece.ascii, piece.numeric + i); 
				if (returnPiece.belongsTo === undefined){
				 	this.moveRange.add(returnPiece); 
				 }
			}	 

			 	 returnPiece = this.board.getPieceAtAsciiNumeric(piece.ascii - 1, piece.numeric + 1); 
			 	 
			 	 if (returnPiece && returnPiece.belongsTo === this.getOppositePlayer().name){
			 	 	this.moveRange.add(returnPiece); 
			 	 }

			 	 returnPiece = this.board.getPieceAtAsciiNumeric(piece.ascii + 1, piece.numeric + 1); 
			 	 if (returnPiece && returnPiece.belongsTo === this.getOppositePlayer().name){
			 	 	this.moveRange.add(returnPiece); 
			 	 }
		}

		else{

			for (let i = 1; i <= range; i++){
			  returnPiece = this.board.getPieceAtAsciiNumeric(piece.ascii, piece.numeric - i); 
				if (returnPiece.belongsTo === undefined){
				 	this.moveRange.add(returnPiece); 
				 }
			}	 

			 	 returnPiece = this.board.getPieceAtAsciiNumeric(piece.ascii - 1, piece.numeric - 1); 
			 	 
			 	 if (returnPiece && returnPiece.belongsTo === this.getOppositePlayer().name){
			 	 	this.moveRange.add(returnPiece); 
			 	 }

			 	 returnPiece = this.board.getPieceAtAsciiNumeric(piece.ascii + 1, piece.numeric - 1); 

			 	 if (returnPiece && returnPiece.belongsTo === this.getOppositePlayer().name){
			 	 	this.moveRange.add(returnPiece); 
			 	 }
			}

	}





	computeVerticalUp(piece,range = 8){

		for (let i = 1; i <= range; i++){

			 let returnPiece = this.board.getPieceAtSquare(piece.alpha + (piece.numeric + i)); 

			  if (!this.validMove(returnPiece)){
			  	break; 
			  }
		}
	}


	computeVerticalDown(piece,range = 8){

		for (let i = 1; i <= range; i++){

			 let returnPiece = this.board.getPieceAtSquare(piece.alpha + (piece.numeric - i)); 

			 if (!this.validMove(returnPiece)){
			  	break; 
			  }  
		}
	}


	computeHorizontalLeft(piece,range=8){
		for (let i = 1; i <= range; i++){

			let returnPiece = this.board.getPieceAtAsciiNumeric(piece.ascii - i, piece.numeric);

			if (!this.validMove(returnPiece)){
			  	break; 
			  }

		}
	}


	computeHorizontalRight(piece,range=8){
		for (let i = 1; i <= range; i++){

			let returnPiece = this.board.getPieceAtAsciiNumeric(piece.ascii + i, piece.numeric);

			if (!this.validMove(returnPiece)){
			  	break; 
			  }
		}
	}



	computeDiagonalDownLeft(piece, range=8){

		for (let i = 1; i <= range; i++){

			let returnPiece = this.board.getPieceAtAsciiNumeric(piece.ascii - i, piece.numeric -i);

			if (!this.validMove(returnPiece)){
			  	break; 
			  }

		}

	}

	computeDiagonalUpLeft(piece, range=8){

		for (let i = 1; i <= range; i++){

			let returnPiece = this.board.getPieceAtAsciiNumeric(piece.ascii - i, piece.numeric + i);

			if (!this.validMove(returnPiece)){
			  	break; 
			  }

		}

	}


	computeDiagonalDownRight(piece, range=8){

		for (let i = 1; i <= range; i++){

			let returnPiece = this.board.getPieceAtAsciiNumeric(piece.ascii + i, piece.numeric - i);

			if (!this.validMove(returnPiece)){
			  	break; 
			  }

		}

	}

	computeDiagonalUpRight(piece, range=8){

		for (let i = 1; i <= range; i++){

			let returnPiece = this.board.getPieceAtAsciiNumeric(piece.ascii + i, piece.numeric + i);

			if (!this.validMove(returnPiece)){
			  	break; 
			  }

		}

	}




	movePiece(clickedPiece){
	
		if (this.moveInRange(clickedPiece)){
			this.board.movePiece(this.selectedPiece, clickedPiece);
			this.switchPlayer();
		}

	}

	moveInRange(piece){
		return this.moveRange.has(piece);
	}




}