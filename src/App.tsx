import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import "./App.css";

import { EarthQuakesPage } from "./pages/EarthQuakes";

const App = () => {
  return (
    <div className="App">
      <Router>
        <Route path="/" component={EarthQuakesPage} />
      </Router>
    </div>
  );
};

export default App;
