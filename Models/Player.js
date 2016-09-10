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

	movePiece(prev,next){
		this.hasMadeFirstMove = true; 

		next.belongsTo = prev.belongsTo; 
		next.image = prev.image; 
		next.name = prev.name; 
		
		prev.belongsTo = undefined; 
		prev.image = undefined; 
		prev.name = undefined; 

		this.updateElement(prev,next);

		return([prev,next]);
	}


	updateElement(prev,next){
		const index = this.pieces.indexOf(this.getPieceAt(prev.dataProp));
		
		this.pieces[index] = next;
		
	}

	pieceEaten(piece){
		const index = this.pieces.indexOf(this.getPieceAt(piece.dataProp));
		this.pieces.splice(index,1);
		return this.pieces; 
	}


}