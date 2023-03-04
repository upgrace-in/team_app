import Logout from "./Logout";
import User from "./User";
import Forgot from "./Forgot";
import Dashboard from "./Dashboard";
import Console from "./console/Console";
import $ from 'jquery';
import { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

function App() {

  let ENDPOINT
  if (process.env.REACT_APP_LIVE == 1) {
    ENDPOINT = "https://api.teamagentadvantage.com"
  } else {
    ENDPOINT = "http://localhost:4000"
  }

  let sessionData = JSON.parse(localStorage.getItem('session'))
  if (sessionData != null) {
    // Clear the clicks
    $('.loggedIn').attr('href', '/dashboard')
    $('.loggedIn > p').html("Dashboard")

    $('.loginBtn').hide()
  }

  function checkUserExists(session) {
    fetch(ENDPOINT + '/checkUserExists?emailAddress=' + session['emailAddress'], {
      method: 'GET',
      headers: { "Content-Type": "application/json" }
    }).then(function (response) {
      return response.json()
    }).then(function (val) {
      if (val['msg'] === false) {
        // logout
        window.location.href = '/logout'
      } else {
        // update the session
        localStorage.setItem("session", JSON.stringify(val['data'][0]))
        $('.credits_div').text(parseInt(val['data'][0]['credits']));
        $('.username').text(val['data'][0]['name']);
      }
    });
  }

  function calculator(loanAmount, creditDiv) {
    loanAmount.on('input', () => {
      if (loanAmount.val() !== '') {
        let credits = (parseFloat(loanAmount.val()) * process.env.REACT_APP_CALCULATOR) / 100
        creditDiv.html(parseInt(credits))
      } else {
        creditDiv.html('0')
      }
    })
  }

  calculator($('.loanAmount'), $('.credits'))

  return (
    <Router>
      <div className="App">
      </div>
      <Routes>
        <Route exact path='/Logout' element={<Logout />}></Route>
        <Route exact path='/user' element={<User endpoint={ENDPOINT} session={sessionData} />}></Route>
        <Route exact path='/forgot' element={<Forgot endpoint={ENDPOINT} />}></Route>
        <Route exact path='/dashboard' element={<Dashboard calculator={calculator} endpoint={ENDPOINT} session={sessionData} checkUserExists={checkUserExists} />}></Route>
        <Route exact path='/console' element={<Console endpoint={ENDPOINT} session={sessionData} checkUserExists={checkUserExists} />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
