import React from "react";
import "./App.css";
import { Button } from "@material-ui/core";

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    fetch("http://localhost:1234")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.setState({ where: data.where });
      });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>Welcome to world.</p>
          <Button>Click me</Button>
        </header>
      </div>
    );
  }
}

export default App;
