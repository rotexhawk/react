import Piece from '../Models/Piece.js'; 

export default class PieceFactory{
	

	constructor(){
	}

	static getMyPieces(playerName){
	
	var state = [
			{
				name: 'player2', 
				pieces: [
					{
						name: 'rook', 
						image: 'bR.png', 
						positions: ['a8','h8']
					},
					{
						name: 'knight', 
						images: 'bN.png', 
						positions: ['b8','g8']
					}, 
					{
						name: 'bishop', 
						image:'bB.png', 
						positions: ['c8','f8']
					}, 
					{
						name: 'queen', 
						image:'bQ.png',
						positions: ['d8']
					}, 
					{
						name: 'king', 
						image:'bK.png',
						positions: ['e8']
					}, 
					{
						name: 'pawn', 
						image:'bP.png',
						positions: ['a7','b7','c7','d7','e7','f7','g7','h7']
					}
				]
			}, 
			
			{
				name: 'player1', 
				pieces: [
					{
						name: 'rook', 
						image: 'wR.png', 
						positions: ['a1','h1']
					},
					{
						name: 'knight', 
						images: 'wN.png', 
						positions: ['b1','g1']
					}, 
					{
						name: 'bishop', 
						image:'wB.png', 
						positions: ['c1','f1']
					}, 
					{
						name: 'queen', 
						image:'wQ.png',
						positions: ['d1']
					}, 
					{
						name: 'king', 
						image:'wK.png',
						positions: ['e1']
					}, 
					{
						name: 'pawn', 
						image:'wP.png',
						positions: ['a2','b2','c2','d2','e2','f2','g2','h2']
					}
				]
			}
		];

	return state.reduce(function(prev,next){
    		if (prev.name === playerName){ // Get only current player pieces. 
      			return prev.pieces;
    		}
    		return next.pieces;
  		}) 
  		.map(function(piece){   // Go through pieces array and create new piece
    		return piece.positions
    		.map(function(position){
    			return new Piece(piece.name,piece.image,playerName,position);
      			
    		})
		})
		.reduce(function(prev,next){ // Flatten the array [ [piece,piece],[piece,piece]....] 
			return prev.concat(next);
		});


	}




}








