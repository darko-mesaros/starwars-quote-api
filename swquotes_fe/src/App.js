import { useState, useEffect } from "react";
import './App.css';
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
      color: "cyan",
      backgroundColor: "green",
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

    // display the loading screen when I run the generateQuote function
    if (loading) {
      return <div>Getting GenAI to do its thing, please wait...</div>;
    }

  return (
    <div className="App">
      <div id="quote" style={mystyle}>
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
  );
}
