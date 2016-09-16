import Piece from '../Models/Piece.js'; 


export default class MoveRangeGenerator{

	constructor(){
	}

	getCurrentPlayer(){
		return this.currentPlayer;
	}

	getOppositePlayer(){
		return this.oppositePlayer; 
	}

	computeRange(board, currentPlayer, oppositePlayer){
		this.board = board; 
		this.currentPlayer = currentPlayer; 
		this.oppositePlayer = oppositePlayer; 

		let newPieces = this.currentPlayer.getPieces().map(piece =>{
			piece.range = this.getRangeForPiece(piece); 
			return piece; 
		});
		this.currentPlayer.setPieces(newPieces); 
	}

	getRangeForPiece(piece){
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

		return this.moveRange; 
	}


	computeKingMove(piece){
		this.computeRookRange(piece,1); 
		this.computeBishopMove(piece,1);
		this.removeKingCheckPiecesFromRange(piece); 
	}

	removeKingCheckPiecesFromRange(kingPiece){

		if (kingPiece.range.length === 0){
			return; 
		}
			this.getOppositePlayer().getPieces().forEach(oppositePiece =>{
				kingPiece.range.forEach(rangePiece =>{
				oppositePiece.range.forEach(oppRange =>{
					if (oppRange.dataProp === rangePiece.dataProp){
						console.log('found it', oppRange);
						kingPiece.range.delete(rangePiece); 
						this.moveRange.delete(rangePiece);
					}
				});	
				
			});
		}); 

	}

	pieceInRange(range,piece){
		for (let rangePiece of range){
			if (rangePiece.dataProp === piece.dataProp){
				return true; 
			}
		}
		return false; 
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