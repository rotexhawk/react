import React from 'react';

export default class AddProfile extends React.Component{
	constructor(){
		super(); 
		this.state = {
			name: '', 
			bio: '', 
			hobby: ''
		}
		this.handlename = this.handlename.bind(this); 
		this.handleBio = this.handleBio.bind(this); 
		this.handleHobby = this.handleHobby.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}
	
	handlename(e){
		this.setState({
			name: e.target.value
		});
	}


	handleBio(e){
		this.setState({
			bio: e.target.value
		});
	}


	handleHobby(e){
		this.setState({
			hobby: e.target.value
		});
	}

	handleClick(e){
		let newProfile = {
			name: this.state.name, 
			bio: this.state.bio, 
			hobbies: [this.state.hobby]
		}
		this.props.addUser(newProfile);

	}

	render(){
		return(
			<div>
				<p>Add a new Profile</p>	
				<input onChange={this.handlename} value={this.state.name} />
				<input onChange={this.handleBio} value={this.state.bio} />
				<input onChange={this.handleHobby} value={this.state.hobby} />
				<button onClick={this.handleClick}>Add</button>
			</div>
			);
	}		
}
