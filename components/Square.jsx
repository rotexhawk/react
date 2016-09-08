import React from 'react';

let Square = props =>{
	
	return (
		<li className={'square item-' + props.index} data-square={props.dataProp}
		style={{background: props.background }}
		>
			{ 
			props.image ?
			<img className={props.belongTo} src={'/images/' + props.image}></img>
			: ''
			}
		</li>
	);
};

export default Square;

