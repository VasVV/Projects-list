
import './App.css';
import About from './about';
import Dashboard from './dashboard';
import ProjectDetails from './projectdetails';

import {Button, Modal, TextField, Card,  CardContent} from '@material-ui/core/';
import AddIcon from '@material-ui/icons/Add';
import ContactForm from './contactform';

import {useState, useEffect} from 'react';

import {db} from './firebase';
import axios from 'axios';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

export default function App() {
 

  return (
    <Router>

    <div className="app">
      <div className="app__nav">
      <Link to="/dashboard"><Button>Главная страница</Button></Link>
      <Link to='/about'><Button>Цели и ценности</Button></Link>
      <Button>Команды</Button>
      <Link to='/contactform'><Button>Форма обратной связи</Button></Link>
      </div>
      <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path='/projectdetails'>
            <ProjectDetails />
          </Route>
          <Route path='/contactform'>
              <ContactForm />
          </Route>
          <Route exact path="/">
            <Dashboard />
          </Route>
        </Switch>

      


    </div>
    </Router>
   
  );
}

 
