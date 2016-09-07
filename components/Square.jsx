import React from 'react';

let Square = props =>{
	console.log(props);
	return (
		<li className={props.dataProp} data-square={props.dataProp}>
			<img className={props.belongTo} src={props.image}></img>
		</li>
	);
};

export default Square;

