import Piece from '../Models/Piece.js'; 


export default class MoveRangeGenerator{

	constructor(){
	}


	setPlayers(currentPlayer, oppositePlayer){
		this.currentPlayer = currentPlayer;
		this.players = [currentPlayer, oppositePlayer];
	}

	getCurrentPlayer(){
		return this.currentPlayer;
	}


	getOppositePlayer(){

		let opp =  this.players.filter(player => {
			if (player.name !== this.currentPlayer.name){
				return player;
			}
		});
	return opp.pop();
	}


	switchPlayer(){
		this.currentPlayer = this.getOppositePlayer(); 
	}


	computeRange(board, currentPlayer, oppositePlayer, checkStatus){
		this.board = board; 

		this.setPlayers(currentPlayer, oppositePlayer);

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
			if (!this.isKingChecked()) {
				this.removeMovesCausesCheck(piece);
			}
			else{
				this.kingChecked(piece, this.isKingChecked());
			}
			if (this.isCheckMate()){
				console.log('You are fucked!');
				return new Set();
			}
		}
		return this.moveRange; 
	}


	reComputeRangeForPieces(pieces){
		this.realRange = this.moveRange; 

		pieces.forEach(piece => { 
			this.switchPlayer(); 
			piece.range = this.getRangeForPiece(piece);
			this.board.updateElement(piece);
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
					if (oppRangePiece.dataProp === kingRangePiece.dataProp){
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

		let pieceThatCanCheckMe = this.findPiecesCanCheckMe(piecesThatCanEatMe);

		this.undoTemporaryRemove(piece);

		this.updateRange(piece, pieceThatCanCheckMe);

		this.reComputeRangeForPieces(piecesThatCanEatMe);

	}

	findPiecesCanEatMyPiece(piece){
		let PiecesCanEatMyPiece = [];
		this.getOppositePlayer().getPieces().filter(oppPiece =>{ // get only pieces that has a range matching our pieces
				oppPiece.range.forEach(oppRange => {
					if (oppRange.dataProp === piece.dataProp){
						PiecesCanEatMyPiece.push(oppPiece);
					}
				});
			});
		return PiecesCanEatMyPiece;
	}


	findPiecesCanCheckMe(piecesThatCanEatMe){
		let myKing = this.getCurrentPlayer().getKing();

		return piecesThatCanEatMe.filter(oppPiece => {
			for (let oppRange of oppPiece.range){
				if (oppRange.dataProp === myKing.dataProp){
					return  oppRange;
				}
			}
		});
	}

	isKingChecked(){
		let myKing = this.getCurrentPlayer().getKing();
		const oppPiecesCausingCheck = this.findPiecesCanEatMyPiece(myKing);
		if (!oppPiecesCausingCheck.length){
			return false;
		}
		return oppPiecesCausingCheck;
	}


	kingChecked(piece,oppPiecesCausingCheck){
		if (piece.name === 'king'){

		}
		else{
			this.allowPieceToBlockCheck(oppPiecesCausingCheck);
		}
	}


	allowPieceToBlockCheck(oppPieceCausingCheck){
		this.moveRange.forEach(pieceRange => {
			oppPieceCausingCheck.forEach(oppPiece => {
				if (pieceRange.dataProp !== oppPiece.dataProp) {
					pieceRange.belongsTo = this.getCurrentPlayer().name;
					this.reComputeRangeForPieces([oppPiece]);
					pieceRange.belongsTo = undefined;
					if (this.findPiecesCanEatMyPiece(this.getCurrentPlayer().getKing()).length) {
						this.moveRange.delete(pieceRange);
					}
					this.reComputeRangeForPieces([oppPiece]);
				}
			});
		});

	}




	updateRange(piece, pieceThatCanCheckMe){
		if (!pieceThatCanCheckMe.length){
			return; 
		}

		pieceThatCanCheckMe.forEach(oppPiece => {
			for (let rangeMove of this.moveRange){
				if (rangeMove.dataProp !== oppPiece.dataProp){
					this.moveRange.delete(rangeMove);
				}
				else if (piece.name === 'king'){
					if (this.pieceHasBackup(oppPiece)){
						this.moveRange.delete(rangeMove);
					}
				}
			}
		});
	}

	pieceHasBackup(piece){
		this.switchPlayer();
		const tempProp = piece.dataProp;
		this.temporaryRemovePiece(piece);
		this.reComputeRangeForPieces(this.getCurrentPlayer().getPieces());
		var foundIt = false;
		this.getCurrentPlayer().getPieces().some(currPiece =>{
				currPiece.range.forEach(rangePiece =>{
					if (rangePiece.dataProp === tempProp){
						foundIt = true;
					}
				});
		});
		this.undoTemporaryRemove(piece);
		this.reComputeRangeForPieces(this.getCurrentPlayer().getPieces());
		this.switchPlayer();

		return foundIt;
	}

	isCheckMate(){
		let checkMate = false;
		this.getCurrentPlayer().getPieces().some(currPiece =>{
				if (currPiece.range.length > 0){
					checkMate = true;
				}
		});
		console.log('checkMate', checkMate);
		return checkMate;
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