import React from 'react';
import { Col, Form, Button, Modal } from 'react-bootstrap';
import PessoaService from '../../../service/pessoa/PessoaService';
import ModalConfirm from '../../../directives/ModalConfirm';
import Notification from '../../../directives/Notification';
import FormatterUtils from '../../../utils/FormatterUtils';
import InputMask from 'react-input-mask';

class PessoaCad extends React.Component {

  constructor(props) {
    super(props);

    this.show = props.show || false;
    this.onClose = props.onClose;

    this.service = new PessoaService();
  }

  state = {
    show: this.show,
    item: {},
    modalConfirmarRemover: false,
    itemToDelete: {},
    editando: false,
    title: 'Adicionando pessoa'
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

      if (item.dataNascimento) {
        const data = item.dataNascimento.replace(/\D/g, '');
        item.dataNascimento = data.substring(6, 8) + data.substring(4, 6) + data.substring(0, 4);
      }

      this.setState({
        item: item || {},
        editando: !!item.id,
        title: (!!item.id ? 'Editando' : 'Adicionando') + ' pessoa'
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
      cpf: item.cpf.replace(/\D/g, ''),
      dataNascimento: FormatterUtils.formatDataToUs(item.dataNascimento)
    };

    this.service.salvar(params)
      .then(() => {
        Notification.show('success', 'A pessoa foi ' + (this.state.editando ? 'alterada' : 'adicionada') + '.');
        this.close();
      }).catch(error => {
        Notification.show('error', error);
      });
  };

  deletar = () => {
    this.service.deletar(this.state.itemToDelete.id)
      .then(() => {
        Notification.show('success', 'A pessoa ' + this.state.itemToDelete.descricao + ' foi removida.');
        this.close();
      }).catch(error => {
        Notification.show('error', error);
      });

    this.setState({
      modalConfirmarRemover: false,
      itemToDelete: {}
    });
  };

  openModalConfirm = () => {
    this.setState({
      modalConfirmarRemover: true,
      itemToDelete: this.state.item
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

    if (name === 'cpf') {
      value = FormatterUtils.formatCpf(value);
    }

    if (name === 'dataNascimento') {
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
          Deseja realmente remover esta pessoa?
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
                    value={this.state.item.nome}
                    required={true} />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} controlId="fgCpf">
                  <Form.Label>CPF</Form.Label>
                  <InputMask mask="999.999.999-99"
                    value={FormatterUtils.formatCpf(this.state.item.cpf)}
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
                    value={this.state.item.dataNascimento}
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

export default PessoaCad;