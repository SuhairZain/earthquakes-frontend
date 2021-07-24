import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import DateFnsUtils from "@date-io/date-fns";

import { MuiPickersUtilsProvider } from "@material-ui/pickers";

import "./App.css";

import { EarthQuakesPage } from "./pages/EarthQuakes";

const App = () => {
  return (
    <div className="App">
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Router>
          <Route path="/" component={EarthQuakesPage} />
        </Router>
      </MuiPickersUtilsProvider>
    </div>
  );
};

export default App;
