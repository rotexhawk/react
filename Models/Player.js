import PieceFactory from '../Models/PieceFactory.js'; 
export default class Player{

	constructor(name){
		this.name = name;
		this.pieces = PieceFactory.getMyPieces(this.name); // get all the pieces for player from the piece Factory
	}
	getPieces(){
		return this.pieces;
	}

	getPieceAt(dataProp){
		return this.pieces.reduce((prev,next) => {
			if (next.dataProp === dataProp){
				return next; 
			}
		},this.pieces[0]); 
		
	}

}