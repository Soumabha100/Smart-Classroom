import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Because of the proxy, we can just use a relative path
    axios
      .get("/api/test")
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, []); // The empty array ensures this effect runs only once

  return (
    <div className="App">
      <header className="App-header">
        <h1>Smart Classroom System</h1>
        <p>A message from our backend server:</p>
        <h2>{message || "Loading..."}</h2>
      </header>
    </div>
  );
}

export default App;
