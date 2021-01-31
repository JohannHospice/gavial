import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import Reader from "./components/Reader";

function App() {
  const [url, setURL] = useState(
    "https://one-piece-scan.com/manga/scan-shingeki-no-kyojin-82-vf/amp/#top"
  );
  const [query, setQuery] = useState(".lol amp-img");
  const [links, setLinks] = useState();
  const [number, setNumber] = useState();
  // defaultValue="https://one-piece-scan.com/manga/scan-shingeki-no-kyojin-82-vf/amp/#top"
  // defaultValue=".i-amphtml-fill-content.i-amphtml-replaced-content"
  const selectInput = (number) =>
    `https://one-piece-scan.com/manga/scan-shingeki-no-kyojin-${number}-vf/amp/#top`;

  const loadURL = async () => {
    // console.log(url);
    const response = await fetch(
      "https://cors-anywhere.herokuapp.com/" + selectInput(number)
    );
    console.log(response);
    // When the page is loaded convert it to text
    const html = await response.text();
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, "text/html");
    const nodeList = doc.body.querySelectorAll(query);
    const links = Array.from(nodeList).map((selected) =>
      selected.getAttribute("src")
    );
    setLinks(links);
  };
  useEffect(() => {
    if (number) loadURL(number);
  }, [number]);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            loadURL();
          }}
        >
          <input
            placeholder="Scan number"
            className="form-control"
            type="number"
            value={number}
            onChange={({ target: { value } }) => setNumber(value)}
          ></input>
          {/* <input
            placeholder="URL"
            className="form-control"
            type="text"
            value={url}
            onChange={({ target: { value } }) => setURL(value)}
          ></input>
          <input
            placeholder="Selectors"
            className="form-control"
            type="text"
            value={query}
            onChange={({ target: { value } }) => setQuery(value)}
          ></input> */}
        </form>
      </header>
      {links && <Reader links={links} />}
    </div>
  );
}

export default App;
