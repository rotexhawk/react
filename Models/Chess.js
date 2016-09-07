import Player from '../Models/Player.js'; 
import Board from '../Models/Board.js'; 

export default class Chess{

	constructor(){
		this.players = [new Player('player1'), new Player('player2')]; 

		this.currentPlayer = this.players[0]; 

		this.board = new Board(this.getCurrentPlayer(),this.getOppositePlayer()); 
	}

	getBoard(){
		return this.board; 
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


}