import React from 'react'
import { Link, Switch, Route } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      <h1>Home</h1>
      <div>You are on Home page</div>
    </div>
  )
}

const About = () => {
  return (
    <div>
      <h1>About</h1>
      <div>You are on About page</div>
    </div>
  )
}

const FileNotFound = () => {
  return (
    <div>
      <h1>404</h1>
      <div>File not found</div>
    </div>
  )
}

const ReactRoutes = () => {
  return (
    <div>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/about" component={About} />
        <Route component={FileNotFound} />
      </Switch>
    </div>
  )
}

export default ReactRoutes
