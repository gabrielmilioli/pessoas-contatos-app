import './App.css';
import React from 'react';
import Container from 'react-bootstrap/Container';
import Rotas from './config/Rotas';
import BarraNavegacao from './layout/BarraNavegacao';

class App extends React.Component {
  render() {
    return (
      <>
        <BarraNavegacao />
        <Container fluid className="main-container">
          <Rotas />
        </Container>
      </>
    )
  };
}

export default App;
