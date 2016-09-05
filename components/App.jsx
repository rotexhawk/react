import React from 'react'; 
import Profile from 'Profile.jsx';
import AddProfile from 'AddProfile.jsx';

import {getProfiles} from '../utils/profileApi.js'; 

export default class App extends React.Component {
  constructor(){ // constructor(props)
  	super(); 	// super(props) 
  	this.state = {
  		profiles: []
  	}
  	this.addUser = this.addUser.bind(this)
  }

/** some initial state -> don't use for ajax. **/
  componentWillMount(){
    console.log('componenet will mount called');
  }

  componentDidMount(){
   getProfiles()
   .then(profiles=>{
      this.setState({
        profiles: profiles
      })
    })
  }

  componentWillUnmount(){
    console.log('component unmount called');
  }

  addUser(newProfile){
  	this.setState({
      profiles: this.state.profiles.concat([newProfile])
    });

  }


 
  render(){
  	let profiles = this.state.profiles.map(profile =>{
  		return (
	  			<Profile
	  			name={profile.name}
	  			age={profile.age}
	  			bio={profile.bio}
	  			hobbies={profile.hobbies} />
	  			)
  	});
 		return(
 			<div>
	 			{profiles}
	 			<AddProfile addUser={this.addUser} />
	 		</div>			
 		); 
  }

}