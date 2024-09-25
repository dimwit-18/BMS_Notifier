import { useState, useEffect } from 'react'
import {isHttpLink, isValidEmail} from './utilities/validityCheckers.js'
import axios from 'axios';
import './App.css'

function SubscriptionForm() {
  const [userDetails, setUserDetails] = useState({
    movieURL: '',
    email: '',
    theatreName: '',
    bookingURL: '',
  })

  const handleSubmit = async() => {
    console.log(userDetails);
    if(!isHttpLink(userDetails.movieURL)){
      alert('Please enter a valid movie/booking link');
      return;
    }
    if(!isValidEmail(userDetails.email)){
      alert('Please enter a valid email');
      return;
    }

    try {
      console.log("HELLOOOOO")
      const response = await axios.post('/api/subscribe', {
                                        movieURL: userDetails.theatreName ? '' : userDetails.movieURL,
                                        theatreName: userDetails.theatreName,
                                        bookingURL: userDetails.theatreName ? userDetails.movieURL : '',
                                        email: userDetails.email,
                                      }, {
                                        headers: {
                                          'Content-Type': 'application/json'
                                        }
                                    })
      console.log(response);
      setUserDetails({
        movieURL: '',
        email: '',
        theatreName: '',
        bookingURL: '',
      });
      alert("Successfully subscribed!!");
      
    } catch(err){
      alert('Something went wrong, try again')
      console.log(err);
    }
  }

  return (
    <>
      <div>Enter movie details</div>
      <div style={{display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', marginTop: '8px', minWidth: '240px'}}>
        <input placeholder='BMS movie/booking link' value={userDetails.movieURL} onChange={(e) => setUserDetails({...userDetails, movieURL: e.target.value})} style={{height: '24px', minWidth: '100%'}} />
        <input placeholder='Theatre Name (only for booking link)' value={userDetails.theatreName} onChange={(e) => setUserDetails({...userDetails, theatreName: e.target.value})} style={{height: '24px', minWidth: '100%'}} />
        <input placeholder='Email' value={userDetails.email} onChange={(e) => setUserDetails({...userDetails, email: e.target.value})} style={{height: '24px', minWidth: '100%'}} />
        <button onClick={handleSubmit} style={{textAlign: 'center', margin: 'auto', marginTop: '8px'}}>Submit</button>
      </div>
    </>
  )
}

function App() {

  return (
    <>
      <SubscriptionForm />
    </>
  )
}

export default App
