import React from 'react';
import logo from './logo.png';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      where: null,
    }
  }

  componentDidMount() {
    fetch('http://localhost:1234')
      .then(response => response.json())
      .then(data => { console.log(data); this.setState({ where: data.where }) });
  }

  render() {
    const { where }= this.state;

    if (!where) {
      return null;
    }

    return (
      <div className="App">
        <header className="App-header">
          <p>
            Welcome to {where}.
          </p>
          <p>
            <img src={logo} className="App-logo" alt="logo" />
          </p>
        </header>
      </div>
    )
  }
}

export default App;
