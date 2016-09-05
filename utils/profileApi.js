
const endPoint = 'http://localhost:3000/'; 

export function getProfiles(){
return fetch(endPoint)
  .then(res => res.json())
  .catch(err =>{
    console.log(err);
  })

}