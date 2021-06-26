import React from 'react';
import { Card, Form, Button, Table, Badge, OverlayTrigger, Tooltip, Container } from 'react-bootstrap';
import { BsTrash, BsPencil } from 'react-icons/bs';
import ContatoPessoaService from '../../../service/pessoa/contato/ContatoPessoaService';
import FormatterUtils from '../../../utils/FormatterUtils';
import ModalConfirm from '../../../directives/ModalConfirm';
import Notification from '../../../directives/Notification';
import ContatoPessoaCad from './cadastro/ContatoPessoaCad';

class ContatoPessoa extends React.Component {

  constructor() {
    super();
    this.service = new ContatoPessoaService();

    this.columns = [
      { label: 'Código', model: 'id', width: '100', show: true },
      { label: 'Nome', model: 'nome', show: true },
      { label: 'Telefone', model: 'telefone', width: '180', show: true },
      { label: 'E-mail', model: 'email', width: '180', show: true },
      { label: 'Pessoa', model: 'pessoa', show: true }
    ];
  }

  state = {
    page: {
      content: [],
      empty: true
    },
    modalAdicionar: false,
    modalConfirmarRemover: false,
    itemToManipulate: {}
  };

  buscar = () => {
    const params = {};

    this.service.buscar(params)
      .then(response => {
        console.log(response.data);
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
    this.service.deletar(this.state.itemToManipulate.id)
      .then(() => {
        Notification.show('success', 'O contato ' + this.state.itemToManipulate.nome + ' foi removido.');
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
    });
    this.buscar();
  };

  onCloseModalConfirm = () => {
    this.setState({
      modalConfirmarRemover: false,
      itemToManipulate: {}
    });
  };

  render() {
    return (
      <>
        <ModalConfirm title="Confirmar exclusão"
          show={this.state.modalConfirmarRemover}
          onConfirm={this.deletar}>
          Deseja realmente remover este contato?
        </ModalConfirm>

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
          <>
            {this.state.page.empty ?
              <h5 className="text-center">Nenhum item encontrado</h5>
              :
              <Table hover>
                <thead>
                  <tr>
                    {this.columns.map((column, index) => (
                      column.show &&
                      <th key={index} width={column.width}>{column.label}</th>
                    ))}
                    <th width="120"></th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.page.content.map((item, index) => (
                    <tr key={index}>
                      <td><Badge pill variant="primary" className="full-width">{item.id}</Badge></td>
                      <td>{item.nome}</td>
                      <td>{FormatterUtils.formatTelefone(item.telefone)}</td>
                      <td>{item.email}</td>
                      <td>{item.pessoa.nome}</td>
                      <td className="space-evenly">
                        <OverlayTrigger placement="bottom"
                          overlay={<Tooltip>Editar</Tooltip>}>
                          <Button size="sm" variant="dark" onClick={() => this.openModalAdicionar(item)}>
                            <BsPencil />
                          </Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="bottom"
                          overlay={<Tooltip>Remover</Tooltip>}>
                          <Button size="sm" variant="danger" onClick={() => this.openModalConfirm(item)}>
                            <BsTrash />
                          </Button>
                        </OverlayTrigger>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            }
          </>
        </Container>

      </>
    );
  };

};

export default ContatoPessoa;