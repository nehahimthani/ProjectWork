import React from 'react'
import { Switch, Route } from 'react-router-dom'
import HomePage from './../homePage'
import DetailsPage from './../detailsPage'
const Routes = () => (
  <Switch>
     <Route exact path='/' component={HomePage}/>
     <Route exact path='/detailsPage' component={DetailsPage}/>
  </Switch>
)
export default Routes;
