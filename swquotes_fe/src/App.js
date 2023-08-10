import { useState, useEffect } from "react";

export default function App() {
  const [darkoVader, setDarkoVader] = useState("");
  useEffect(() => {
    fetch(
      "https://ib45t18xif.execute-api.us-west-2.amazonaws.com/prod/quotes"
    )
      .then((res) => res.json())
      .then((data) => {
        setDarkoVader(data.quote);
      });

  }, []);
  function refreshPage(){
    window.location.reload(false);
  }
  const mystyle = {
      color: "yellow",
      backgroundColor: "blue",
      padding: "10px",
      fontFamily: "Verdana"
    };
  const buttonstyle = {
      color: "red",
      backgroundColor: "black",
      padding: "10px",
      fontFamily: "Verdana",
      margin:"auto",
      textAlign: "center"
    };
  return (
    <div className="App">
      <div id="quote" style={mystyle}>
        <h1>{darkoVader}</h1>
      </div>
      <div style={buttonstyle}>
        <button onClick={refreshPage}>Click to get new quote!</button>
      </div>
    </div>
  );
}
