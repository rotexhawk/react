export default class Piece{

	constructor(name,image,belongsTo,dataProp,ascii,numeric,alpha){
		this.name = name; 
		this.image = image; 
		this.dataProp = dataProp; 
		this.belongsTo = belongsTo;
		this.ascii = this.setAscii(ascii); 
		this.numeric = this.setNumeric(numeric);
		this.alpha = this.setAlpha(alpha); 
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

	setAlpha(alpha){
		if (alpha === undefined){
		   return this.dataProp.split('')[0];
		}
		return alpha; 
	}
	
	setBackground(color){
		this.background = color; 
	}

	setIndex(index){
		this.index = index; 
	}


}