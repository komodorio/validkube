import React, { useState } from "react";
import { callAPIExample } from "../../services/api-service";

const TestView: React.FC = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const endpoint = `hello?name=${encodeURIComponent(name)}`;
  return (
    <div className="App">
      <header className="App-header">
        <label htmlFor="name">Name:</label>
        <input
          type="input"
          placeholder="Your name (optional)"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <input
          type="button"
          onClick={() => callAPIExample(endpoint, setMessage)}
          value="Call API"
        />
        <p>{message}</p>
      </header>
    </div>
  );
};

export default TestView;
