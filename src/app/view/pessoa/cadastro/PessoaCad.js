import React from 'react';
import { Col, Form, Button, Modal, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { BsTrash, BsPlus } from 'react-icons/bs';
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

    this.columns = [
      { label: 'Nome', model: 'nome', show: true },
      { label: 'Telefone', model: 'telefone', width: '180', show: true },
      { label: 'E-mail', model: 'email', width: '200', show: true }
    ];
  }

  state = {
    show: this.show,
    item: {
      nome: '',
      cpf: '',
      dataNascimento: '',
      contatos: []
    },
    modalConfirmarRemover: false,
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
        item: item || {
          nome: '',
          cpf: '',
          dataNascimento: '',
          contatos: []
        },
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

    const contatos = item.contatos || [];

    const params = {
      id: item.id,
      nome: item.nome,
      cpf: item.cpf.replace(/\D/g, ''),
      dataNascimento: FormatterUtils.formatDataToUs(item.dataNascimento),
      contatos: contatos.map((c) => { c.telefone = c.telefone.replace(/\D/g, ''); return c; })
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
    const item = this.state.item;

    this.service.deletar(item.id)
      .then(() => {
        Notification.show('success', 'A pessoa ' + item.nome + ' foi removida.');
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

    if (name === 'cpf') {
      value = FormatterUtils.formatCpf(value);
    }

    if (name === 'dataNascimento') {
      value = value.replace(/\D/g, '');
    }

    item[name] = value;
    this.setState({ item: item });
  };

  onChangeCampoContato = (e) => {
    const value = e.target.value;
    const id = e.target.id.replace('campoContato-', '');
    const name = e.target.name;
    const item = this.state.item || {};

    const contatos = item.contatos || [];
    contatos[id][name] = value;
    item.contatos = contatos;

    this.setState({ item: item });
  };

  removerContato = (index) => {
    const item = this.state.item || {};
    const contatos = item.contatos || [];
    contatos.splice(index, 1);
    item.contatos = contatos;

    this.setState({ item: item });
  };

  adicionarContato = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const item = this.state.item || {};
    const contatos = item.contatos || [];
    contatos.push({
      nome: '',
      telefone: '',
      email: '',
      pessoa: {
        id: item.id
      }
    });

    this.setState({ item: { ...item, contatos: contatos } });
  };

  hasContatos = () => {
    return this.state.item && this.state.item.contatos && this.state.item.contatos.length;
  }

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

              <Form.Row>
                {!this.hasContatos() ?
                  <h5 style={{ margin: '20px auto' }}>Nenhum contato foi adicionado ainda. <a href="#" onClick={this.adicionarContato}>Adicionar</a></h5>
                  :
                  <>
                    <Table hover>
                      <thead>
                        <tr>
                          {this.columns.map((column, index) => (
                            column.show &&
                            <th key={index} width={column.width}>{column.label}</th>
                          ))}
                          <th width="60"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.item.contatos.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <Form.Control type="text" size="sm"
                                placeholder="Nome" name="nome"
                                onChange={this.onChangeCampoContato}
                                defaultValue={item.nome}
                                id={`campoContato-${index}`}
                                required={true} />
                            </td>
                            <td>
                              <InputMask mask="(99) 99999-9999"
                                value={FormatterUtils.formatTelefone(item.telefone)}
                                onChange={this.onChangeCampoContato}>
                                {
                                  (inputProps) => (
                                    <Form.Control type="text" size="sm"
                                      placeholder="Telefone" name="telefone"
                                      {...inputProps}
                                      required={true}
                                      id={`campoContato-${index}`}
                                      maxLength="23" />
                                  )
                                }
                              </InputMask>
                            </td>
                            <td>
                              <Form.Control type="email" size="sm"
                                placeholder="E-mail" name="email"
                                defaultValue={item.email}
                                onChange={this.onChangeCampoContato}
                                required={true}
                                id={`campoContato-${index}`}
                                maxLength="100" />
                            </td>
                            <td className="space-evenly">
                              <OverlayTrigger placement="bottom"
                                overlay={<Tooltip>Remover</Tooltip>}>
                                <Button size="sm" variant="danger" onClick={() => this.removerContato(index)}>
                                  <BsTrash />
                                </Button>
                              </OverlayTrigger>
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td colspan="3"></td>
                          <td className="space-evenly">
                            <OverlayTrigger placement="bottom"
                              overlay={<Tooltip>Adicionar</Tooltip>}>
                              <Button size="sm" variant="success" onClick={this.adicionarContato}>
                                <BsPlus />
                              </Button>
                            </OverlayTrigger>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </>
                }
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