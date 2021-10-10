import React from "react";
import {
  BrowserRouter,
  Route,
} from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Dashboard from "./Dashboard";

export default function App(){
  return (
    <BrowserRouter>
          <Route path="/dashboard" component={Dashboard}/>
          <Route path="/register" component={Register}/>
          <Route path="/login" component={Login}/>
    </BrowserRouter>
  );
}
