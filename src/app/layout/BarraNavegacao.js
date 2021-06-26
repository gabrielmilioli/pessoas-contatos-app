import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

class BarraNavegacao extends React.Component {

  render() {
    return (
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#">
          Pessoas
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="barra-navegacao" />
        <Navbar.Collapse id="barra-navegacao">
          <Nav className="mr-auto">
            <NavDropdown title="Cadastros" id="barra-navegacao-dropdown">
              <NavDropdown.Item href="#/pessoas">Pessoas</NavDropdown.Item>
              <NavDropdown.Item href="#/pessoas/contatos">Contatos</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  };

};

export default BarraNavegacao;