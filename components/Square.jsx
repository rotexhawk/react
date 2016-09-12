import React from 'react';

export default class Square extends React.Component{
	
	constructor(){
		super();
	}



	render(){


	return (

			<li className={this.props.isHighLighted === true 
				? 'square item-' + this.props.index + ' active' 
				: 'square item-' + this.props.index} 
			data-square={this.props.dataProp}
			style={{ background: this.props.background }}
			
			onClick={this.props.onClick}
			>
				{ 
				this.props.image ?
				<img className={this.props.belongTo} src={'/images/' + this.props.image}></img>
				: ''
				}
			</li>
		);
	}

}
