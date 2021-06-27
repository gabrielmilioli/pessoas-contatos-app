import React from 'react';
import { Col, Card, Form, Button, Container, Spinner } from 'react-bootstrap';
import ContatoPessoaService from '../../../service/pessoa/contato/ContatoPessoaService';
import PessoaService from '../../../service/pessoa/PessoaService';
import Notification from '../../../directives/Notification';
import ContatoPessoaCad from './cadastro/ContatoPessoaCad';
import ContatoPessoaList from './listagem/ContatoPessoaList';
import FormatterUtils from '../../../utils/FormatterUtils';
import Select from '../../../directives/Select';
import InputMask from 'react-input-mask';

class ContatoPessoa extends React.Component {

  constructor() {
    super();
    this.service = new ContatoPessoaService();
    this.pessoaService = new PessoaService();
    this.pessoaService.buscar()
      .then((response) => {
        this.setState({
          select: {
            pessoa: response.data.content.map((c) => { delete c.contatos; return c; })
          }
        });
      })
  }

  state = {
    page: {
      content: [],
      empty: true
    },
    filtro: {
      nome: '',
      pessoa: '',
      telefone: '',
      email: ''
    },
    select: { pessoa: [] },
    modalAdicionar: false,
    itemToManipulate: {},
    loading: true
  };

  buscar = () => {
    let filtro = this.state.filtro;

    const params = {
      nome: filtro.nome,
      pessoa: filtro.pessoa,
      telefone: filtro.telefone.replace(/\D/g, ''),
      email: filtro.email
    };

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
      pessoa: '',
      telefone: '',
      email: ''
    }
    this.setState({ filtro: filtro }, this.buscar);
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
              <Form.Row>
                <Form.Group as={Col} controlId="fgNome">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control type="text" placeholder="Nome" name="nome"
                    onChange={this.onChangeCampo}
                    value={this.state.filtro.nome}/>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} controlId="fgPessoa">
                  <Form.Label>Pessoa</Form.Label>
                  {this.state.select.pessoa.length &&
                    <Select placeholder="Pessoa" name="pessoa"
                      onChange={this.onChangeCampo} value={this.state.filtro.pessoa}
                      options={this.state.select.pessoa}
                      property="nome" />
                  }
                </Form.Group>
                <Form.Group as={Col} controlId="fgTelefone">
                  <Form.Label>Telefone</Form.Label>
                  <InputMask mask="(99) 99999-9999"
                    value={FormatterUtils.formatTelefone(this.state.filtro.telefone)}
                    onChange={this.onChangeCampo}>
                    {
                      (inputProps) => (
                        <Form.Control type="text" placeholder="Telefone" name="telefone"
                          {...inputProps}
                          maxLength="23" />
                      )
                    }
                  </InputMask>
                </Form.Group>
                <Form.Group as={Col} controlId="fgEmail">
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control type="email" placeholder="E-mail" name="email"
                    value={this.state.filtro.email}
                    onChange={this.onChangeCampo}
                    maxLength="100" />
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
            <ContatoPessoaList page={this.state.page} reload={this.buscar} />
          }
        </Container>

      </>
    );
  };

};

export default ContatoPessoa;