import React from 'react';
import { Col, Card, Form, Button, Container, Spinner } from 'react-bootstrap';
import PessoaService from '../../service/pessoa/PessoaService';
import FormatterUtils from '../../utils/FormatterUtils';
import ModalConfirm from '../../directives/ModalConfirm';
import Notification from '../../directives/Notification';
import PessoaCad from './cadastro/PessoaCad';
import InputMask from 'react-input-mask';
import PessoaList from './listagem/PessoaList';

class Pessoa extends React.Component {

  constructor() {
    super();
    this.service = new PessoaService();
  }

  state = {
    page: {
      content: [],
      empty: true
    },
    filtro: {
      nome: '',
      cpf: '',
      dataNascimento: ''
    },
    modalAdicionar: false,
    modalConfirmarRemover: false,
    itemToManipulate: {}
  };

  buscar = () => {
    const filtro = this.state.filtro;
    
    const params = {
      nome: filtro.nome,
      cpf: filtro.cpf.replace(/\D/g, ''),
      dataNascimento: FormatterUtils.formatDataToUs(filtro.dataNascimento)
    };

    this.service.buscar(params)
      .then(response => {
        this.setState({
          page: {
            content: response.data.content,
            empty: response.data.empty
          }
        });
      }).catch(error => {
        Notification.show('error', error);
      });
  };

  componentDidMount() {
    this.buscar();
  }

  deletar = () => {
    const item = this.state.itemToManipulate;
    this.service.deletar(item.id)
      .then(() => {
        Notification.show('success', 'A pessoa ' + item.nome + ' foi removida.');
        this.onCloseModalConfirm();
        this.buscar();
      }).catch(error => {
        Notification.show('error', error);
      });
  };

  openModalConfirm = (item) => {
    this.setState({
      modalConfirmarRemover: true,
      itemToManipulate: item
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
    }, this.buscar);
  };

  onCloseModalConfirm = () => {
    this.setState({
      modalConfirmarRemover: false,
      itemToManipulate: {}
    }, this.buscar);
  };

  onChangeCampo = (e) => {
    let value = e.target.value;
    const name = e.target.name;
    let filtro = this.state.filtro || {};

    if (name === 'cpf') {
      value = FormatterUtils.formatCpf(value);
    }

    if (name === 'dataNascimento') {
      value = value.replace(/\D/g, '');
    }

    filtro[name] = value;
    this.setState({ filtro: filtro });
  };

  limpar = () => {
    const filtro = {
      nome: '',
      cpf: '',
      dataNascimento: ''
    }
    this.setState({ filtro: filtro }, this.buscar);
  };

  render() {
    return (
      <>
        <ModalConfirm title="Confirmar exclusão"
          show={this.state.modalConfirmarRemover}
          onConfirm={this.deletar}>
          Deseja realmente remover esta pessoa?
        </ModalConfirm>

        <PessoaCad item={this.state.itemToManipulate}
          show={this.state.modalAdicionar} onClose={this.onCloseModalAdicionar} />

        <Card className="full-width">
          <Card.Header as="h5">Pessoas</Card.Header>
          <Card.Body>
            <Form noValidate>
              <Form.Row>
                <Form.Group as={Col} controlId="fgNome">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control type="text" placeholder="Nome" name="nome"
                    onChange={this.onChangeCampo}
                    value={this.state.filtro.nome}
                    required={true} />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} controlId="fgCpf">
                  <Form.Label>CPF</Form.Label>
                  <InputMask mask="999.999.999-99"
                    value={FormatterUtils.formatCpf(this.state.filtro.cpf)}
                    onChange={this.onChangeCampo}>
                    {
                      (inputProps) => (
                        <Form.Control type="text" placeholder="CPF" name="cpf"
                          {...inputProps}
                          required={true}
                          maxLength="28" />
                      )
                    }
                  </InputMask>
                </Form.Group>
                <Form.Group as={Col} controlId="fgDataNascimento">
                  <Form.Label>Data de nascimento</Form.Label>
                  <InputMask mask="99/99/9999"
                    value={this.state.filtro.dataNascimento}
                    onChange={this.onChangeCampo}>
                    {
                      (inputProps) => (
                        <Form.Control type="text" placeholder="Data de nascimento" name="dataNascimento"
                          {...inputProps}
                          required={true}
                          maxLength="20" />
                      )
                    }
                  </InputMask>
                </Form.Group>
              </Form.Row>
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
            <PessoaList page={this.state.page} reload={this.buscar} />
          }
        </Container>

      </>
    );
  };

};

export default Pessoa;