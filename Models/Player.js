import PieceFactory from '../Models/PieceFactory.js'; 
export default class Player{

	constructor(name){
		this.name = name;
		this.pieces = PieceFactory.getMyPieces(this.name); // get all the pieces for player from the piece Factory
		this.hasMadeFirstMove = false; 
	}
	getPieces(){
		return this.pieces;
	}

	getPieceAt(dataProp){
		return this.pieces.find(piece => {
				
				return piece.dataProp === dataProp; 
		}); 
	}

}