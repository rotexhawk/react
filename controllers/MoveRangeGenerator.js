import Piece from '../Models/Piece.js'; 


export default class MoveRangeGenerator{

	constructor(){
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

	computeRange(board, currentPlayer, oppositePlayer, checkStatus){
		this.board = board; 

		this.players = [currentPlayer, oppositePlayer]; 

		this.currentPlayer = currentPlayer; 
		this.oppositePlayer = oppositePlayer; 

		let newPieces = this.currentPlayer.getPieces().map(piece =>{
			piece.range = this.getRangeForPiece(piece, checkStatus); 
			return piece; 
		});

		this.currentPlayer.setPieces(newPieces); 
	}

	getRangeForPiece(piece, checkStatus){
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
			this.computeKingMove(piece);
		}
		if (checkStatus){
			this.removeMovesCausesCheck(piece);  
		}
		return this.moveRange; 
	}


	reComputeRangeForPieces(pieces){
		this.realRange = this.moveRange; 

		pieces.forEach(piece => { 
			this.switchPlayer(); 
			this.getRangeForPiece(piece);
			this.switchPlayer();  
		});

		this.moveRange = this.realRange; 
	}


	computeKingMove(piece){
		this.computeRookRange(piece,1); 
		this.computeBishopMove(piece,1);
		this.removeKingCheckPiecesFromRange(piece); 
	}



	/** This method is called to remove the pieces where king can be checked from the moveRange set so King is not 
	* allowed to move to a place where it can be checked. 
	**/
	removeKingCheckPiecesFromRange(king){
		this.moveRange.forEach(kingRangePiece =>{
			this.getOppositePlayer().getPieces().forEach(oppositePiece =>{
				oppositePiece.range.forEach(oppRangePiece =>{
					if (oppRangePiece.dataProp == kingRangePiece.dataProp){
						this.moveRange.delete(kingRangePiece);
					}
				});
			});
		});
	}



	/** Remove all the moves from a pieces range where moving to that position would cause the king to get checked. Unless 
	the move will eat the opposing piece, that's causing the check. **/
	removeMovesCausesCheck(piece){

		let piecesThatCanEatMe = this.findPiecesCanEatMyPiece(piece);
		
		this.temporaryRemovePiece(piece); 

		this.reComputeRangeForPieces(piecesThatCanEatMe); 

		let pieceThatCanCheckMe = this.findPiecesCanCheckMe(); 

		//console.log(pieceThatCanCheckMe);
		this.undoTemporaryRemove(piece); 

		this.updateRange(pieceThatCanCheckMe);


	}

	findPiecesCanEatMyPiece(piece){
		return this.getOppositePlayer().getPieces().filter(oppPiece =>{ // get only pieces that has a range matching our pieces
				for (let oppRange of oppPiece.range){
					if (oppRange.dataProp === piece.dataProp){
						return piece; 
					}
				}

		});
	}


	findPiecesCanCheckMe(){
		let myKing = this.getCurrentPlayer().getKing(); 
		return this.findPiecesCanEatMyPiece(myKing); 
	}


	updateRange(pieceThatCanCheckMe){
		if (!pieceThatCanCheckMe.length){
			return; 
		}
		this.moveRange = new Set(); 
		this.moveRange.add(pieceThatCanCheckMe);
	}


	temporaryRemovePiece(piece){
		piece.belongsTo = undefined; 
		this.board.updateElement(piece); 
	}

	undoTemporaryRemove(piece){
		piece.belongsTo = this.getCurrentPlayer().name; 
		this.board.updateElement(piece); 
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






}