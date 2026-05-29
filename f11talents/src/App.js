import './App.css';
import React, { useContext } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import Home from './components/pages/Home';
import Search from './components/pages/Search';
import Register from './components/pages/Register';
import Login from './components/pages/Login';
import AboutUs from './components/pages/AboutUs';
import ContactUs from './components/pages/ContactUs';
import MyAccount from './components/pages/MyAccount';

import { AuthTokenContext } from '.';

function App() {
  const auth = useContext(AuthTokenContext);

  const token = auth?.token;
  const logout = auth?.logout;

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Inicio</Link>
            </li>

            <li>
              <Link to="/buscar">Búsqueda</Link>
            </li>

            <li>
              <Link to="/micuenta">Mi Cuenta</Link>
            </li>

            <li>
              <Link to="/about">Sobre esta página</Link>
            </li>

            <li>
              <Link to="/contact">Contacto</Link>
            </li>
          </ul>

          <div>
            {token ? (
              <p>
                Estás logueado{' '}
                <button onClick={logout}>Log out</button>
              </p>
            ) : (
              <ul>
                <li>
                  <Link to="/login">Login</Link>
                </li>

                <li>
                  <Link to="/register">Registro</Link>
                </li>
              </ul>
            )}
          </div>
        </nav>

        <Switch>
          <Route exact path="/">
            <Home />
          </Route>

          <Route path="/buscar">
            <Search />
          </Route>

          <Route path="/micuenta">
            <MyAccount />
          </Route>

          <Route path="/register">
            <Register />
          </Route>

          <Route path="/login">
            <Login />
          </Route>

          <Route path="/about">
            <AboutUs />
          </Route>

          <Route path="/contact">
            <ContactUs />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
