import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';

import { useAuthenticator, withAuthenticator, Button, Heading, Authenticator, TextField } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import { useState, useEffect } from "react";
import './App.css';

// Configure Amplify in index file or root file
Amplify.configure({
    Auth: {
        region: awsExports.REGION,
        userPoolId: awsExports.USER_POOL_ID,
        userPoolWebClientId: awsExports.USER_POOL_APP_CLIENT_ID
    }
})

export default function App() {
  const [darkoVader, setDarkoVader] = useState("");
  const [genData, setGenData] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    
    fetch(
      "https://np99p7re91.execute-api.us-west-2.amazonaws.com/prod/quotes"
    )
      .then((res) => res.json())
      .then((data) => {
        setDarkoVader(data.quote);
      });

  }, []);
  function refreshPage(){
    window.location.reload(false);
  }
  const generateQuote = () => {
    const genUrl = "https://np99p7re91.execute-api.us-west-2.amazonaws.com/prod/quotes/generate"
    
    setLoading(true);
    fetch(genUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
      body: JSON.stringify({ 'foo':'bar' }), // Sending description as a JSON object
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then((fetchedData) => {
        console.log("Invoked Model, and this is what we got", fetchedData);
        // Process the fetched data, e.g., appending to a list, displaying in a modal, etc.
        setLoading(false);
        setGenData(fetchedData);
        //setShowModal(true);
    })
    .catch((error) => {
        //setError(error);
        setLoading(false);
        console.log(error);
    });
  };
  const mystyle = {
      color: "yellow",
      backgroundColor: "blue",
      padding: "10px",
      fontFamily: "Verdana"
    };
  const genstyle = {
      color: "red",
      backgroundColor: "black",
      padding: "10px",
      fontFamily: "Verdana",
      fontSize: "12px"
    };
  const buttonstyle = {
      color: "red",
      backgroundColor: "black",
      padding: "10px",
      fontFamily: "Verdana",
      margin:"auto",
      textAlign: "center"
    };
  const headingstyle = {
    width: "100%",
    textAlign: "left",
    fontSize: "12px",
    fontFamily: "Verdana"
  };

    // display the loading screen when I run the generateQuote function
    if (loading) {
      return <div>Getting GenAI to do its thing, please wait...</div>;
    }

  return (
    <Authenticator
      initialState ="signUp"
      signUpAttributes = {['email']}
      components={{
        SignUp: {
          FormFields() {
            const {validationErrors}  = useAuthenticator();
            return (
              <>
              <Authenticator.SignUp.FormFields />
                <TextField
                  placeholder="Zone Info"
                  name="zoneinfo"
                  label="Zone Info"
                  type="text"
                />
             </>
            );
          },
        },
      }}
    >
    {({ signOut, user }) => (
      <div className="App">
        <Heading style={headingstyle} level={1}>Hello Build On User: {user.username}</Heading>
        <Button style={buttonstyle} onClick={signOut}>Sing Out</Button> <div id="quote" style={mystyle}>
          <h1 style={{height: "200px"}}>{darkoVader}</h1>
        </div>
        <div id="quote" style={genstyle}>
          <h1 style={{height: "200px"}}>{genData.message}</h1>
        </div>
        <div style={buttonstyle}>
          <button onClick={refreshPage}>Click to get new quote!</button>
        </div>
        <div style={buttonstyle}>
          <button onClick={generateQuote}>How about GENERATED quote!</button>
        </div>
      </div>
    )}
  </Authenticator>
  );
}

