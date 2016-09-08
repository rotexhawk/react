export default class Piece{

	constructor(name,image,belongsTo,dataProp,ascii,numeric){
		this.name = name; 
		this.image = image; 
		this.dataProp = dataProp; 
		this.ascii = this.setAscii(ascii); 
		this.numeric = this.setNumeric(numeric);
		this.belongsTo = belongsTo;
	}

	setAscii(ascii){
		if (ascii === undefined){
			return parseInt(this.dataProp.split('')[0].charCodeAt());
		}
		return ascii; 
	}

	setNumeric(numeric){
		if (numeric === undefined){
			return parseInt(this.dataProp.split('')[1]);
		}
		return numeric; 
	}
	setBackground(color){
		this.background = color; 
	}


}