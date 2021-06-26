import React from 'react';
import { Col, Form, Button, Modal } from 'react-bootstrap';
import ContatoPessoaService from '../../../../service/pessoa/contato/ContatoPessoaService';
import PessoaService from '../../../../service/pessoa/PessoaService';
import ModalConfirm from '../../../../directives/ModalConfirm';
import Notification from '../../../../directives/Notification';
import FormatterUtils from '../../../../utils/FormatterUtils';
import Select from '../../../../directives/Select';
import InputMask from 'react-input-mask';

class ContatoPessoaCad extends React.Component {

  constructor(props) {
    super(props);

    this.show = props.show || false;
    this.onClose = props.onClose;

    this.service = new ContatoPessoaService();
    this.pessoaService = new PessoaService();
  }

  state = {
    show: this.show,
    item: {
      nome: '',
      pessoa: '',
      telefone: '',
      email: ''
    },
    modalConfirmarRemover: false,
    editando: false,
    title: 'Adicionando contato',
    select: { pessoa: [] }
  };

  componentWillReceiveProps(props) {
    if (props.show !== this.state.show) {
      this.setState({ show: props.show });
      if (!props.show) {
        return;
      }
    }

    if (props.item !== this.state.item) {
      const item = props.item || {};

      if (item.telefone) {
        item.telefone = item.telefone.replace(/\D/g, '');
      }

      this.pessoaService.buscar()
        .then((response) => {
          this.setState({
            select: {
              pessoa: response.data.content
            }
          });
        })

      this.setState({
        item: item || {},
        editando: !!item.id,
        title: (!!item.id ? 'Editando' : 'Adicionando') + ' contato'
      });
    }
  }

  salvar = () => {
    const item = this.state.item;

    if (!this.service.validar(item)) {
      Notification.show('warning', 'Preencha corretamente os campos');
      return;
    }

    const params = {
      id: item.id,
      nome: item.nome,
      pessoa: this.state.select.pessoa.find((p) => { return p.id = item.pessoa; }),
      telefone: item.telefone.replace(/\D/g, ''),
      email: item.email
    };

    this.service.salvar(params)
      .then(() => {
        Notification.show('success', 'O contato foi ' + (this.state.editando ? 'alterado' : 'adicionado') + '.');
        this.close();
      }).catch(error => {
        Notification.show('error', error);
      });
  };

  deletar = () => {
    const item = this.state.item;

    this.service.deletar(item.id)
      .then(() => {
        Notification.show('success', 'O contato ' + item.nome + ' foi removido.');
        this.close();
      }).catch(error => {
        Notification.show('error', error);
      });

    this.setState({
      modalConfirmarRemover: false
    });
  };

  openModalConfirm = () => {
    this.setState({
      modalConfirmarRemover: true
    });
  };

  close = () => {
    if (this.onClose) {
      this.onClose();
    }
  }

  onChangeCampo = (e) => {
    let value = e.target.value;
    const name = e.target.name;
    let item = this.state.item || {};

    if (name === 'telefone') {
      value = value.replace(/\D/g, '');
    }

    item[name] = value;
    this.setState({ item: item });
  };

  render() {
    return (
      <>
        <ModalConfirm title="Confirmar exclusão"
          show={this.state.modalConfirmarRemover}
          onConfirm={this.deletar}>
          Deseja realmente remover este contato?
        </ModalConfirm>

        <Modal show={this.state.show} size="lg" onHide={this.close}>
          <Form>
            <Modal.Header closeButton>
              <Modal.Title as="h5">{this.state.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Row>
                <Form.Group as={Col} controlId="fgNome">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control type="text" placeholder="Nome" name="nome"
                    onChange={this.onChangeCampo}
                    defaultValue={this.state.item.nome}
                    required={true} />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} controlId="fgPessoa">
                  <Form.Label>Pessoa</Form.Label>
                  {this.state.select.pessoa.length &&
                    <Select placeholder="Pessoa" name="pessoa"
                      onChange={this.onChangeCampo} defaultValue={this.state.item.pessoa}
                      required={true}
                      values={this.state.select.pessoa}
                      property="nome" />
                  }
                </Form.Group>
                <Form.Group as={Col} controlId="fgTelefone">
                  <Form.Label>Telefone</Form.Label>
                  <InputMask mask="(99) 99999-9999"
                    defaultValue={FormatterUtils.formatTelefone(this.state.item.telefone)}
                    onChange={this.onChangeCampo}>
                    {
                      (inputProps) => (
                        <Form.Control type="text" placeholder="Telefone" name="telefone"
                          {...inputProps}
                          required={true}
                          maxLength="23" />
                      )
                    }
                  </InputMask>
                </Form.Group>
                <Form.Group as={Col} controlId="fgEmail">
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control type="email" placeholder="E-mail" name="email"
                    defaultValue={this.state.item.email}
                    onChange={this.onChangeCampo}
                    required={true}
                    maxLength="100" />
                </Form.Group>
              </Form.Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="dark" onClick={this.salvar}>
                Salvar
              </Button>
              {this.state.editando &&
                <Button variant="danger" onClick={this.openModalConfirm}>
                  Remover
                </Button>
              }
              <Button variant="light" onClick={this.close}>
                Cancelar
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </>
    );
  }
};

export default ContatoPessoaCad;