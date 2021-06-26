import React from 'react';
import { Card, Form, Button, Container, Spinner } from 'react-bootstrap';
import ContatoPessoaService from '../../../service/pessoa/contato/ContatoPessoaService';
import Notification from '../../../directives/Notification';
import ContatoPessoaCad from './cadastro/ContatoPessoaCad';
import ContatoList from './listagem/ContatoList';

class ContatoPessoa extends React.Component {

  constructor() {
    super();
    this.service = new ContatoPessoaService();
  }

  state = {
    page: {
      content: [],
      empty: true
    },
    modalAdicionar: false,
    itemToManipulate: {},
    loading: true
  };

  buscar = () => {
    const params = {};

    this.setState({ loading: true });

    this.setState({
      page: {
        content: [],
        empty: true
      }
    });

    this.service.buscar(params)
      .then(response => {
        this.setState({
          page: {
            content: response.data.content,
            empty: response.data.empty
          },
          loading: false
        });
      }).catch(error => {
        Notification.show('error', error);
      });
  };

  componentDidMount() {
    this.buscar();
  }

  deletar = () => {
    this.service.deletar(this.state.itemToManipulate.id)
      .then(() => {
        Notification.show('success', 'O contato ' + this.state.itemToManipulate.nome + ' foi removido.');
        this.onCloseModalConfirm();
        this.buscar();
      }).catch(error => {
        Notification.show('error', error);
      });
  };

  openModalAdicionar = (item) => {
    this.setState({
      modalAdicionar: true,
      itemToManipulate: item
    });
  };

  onCloseModalAdicionar = () => {
    this.setState({
      modalAdicionar: false,
      itemToManipulate: {}
    });
    this.buscar();
  };

  render() {
    return (
      <>
        <ContatoPessoaCad item={this.state.itemToManipulate}
          show={this.state.modalAdicionar} onClose={this.onCloseModalAdicionar} />

        <Card className="full-width">
          <Card.Header as="h5">Contatos</Card.Header>
          <Card.Body>
            <Form noValidate>
              <Form.Group controlId="fgNome">
                <Form.Label>Nome</Form.Label>
                <Form.Control type="text" placeholder="Filtrar pelo nome"
                  onChange={this.onChangeNome} />
              </Form.Group>
            </Form>
          </Card.Body>
          <Card.Footer>
            <Button variant="dark" onClick={this.buscar}>Buscar</Button>
            <Button variant="light" onClick={this.limpar} style={{ marginLeft: '8px' }}>Limpar filtros</Button>
            <Button variant="dark" className="float-right" onClick={() => this.openModalAdicionar()}>Adicionar</Button>
          </Card.Footer>
        </Card>

        <Container fluid className="list-container">
          {this.state.loading ?
            <Spinner animation="border" variant="primary" />
            :
            <ContatoList page={this.state.page} reload={this.buscar} />
          }
        </Container>

      </>
    );
  };

};

export default ContatoPessoa;