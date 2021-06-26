import React from 'react';
import { Button, Table, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { BsTrash, BsPencil } from 'react-icons/bs';
import FormatterUtils from '../../../../utils/FormatterUtils';
import ContatoPessoaService from '../../../../service/pessoa/contato/ContatoPessoaService';
import Notification from '../../../../directives/Notification';
import ModalConfirm from '../../../../directives/ModalConfirm';
import ContatoPessoaCad from '../cadastro/ContatoPessoaCad';

class ContatoPessoaList extends React.Component {

  constructor(props) {
    super(props);
    this.service = new ContatoPessoaService();
    this.page = props.page;
    this.reload = props.reload;

    this.columns = [
      { label: 'Código', model: 'id', width: '100', show: true },
      { label: 'Nome', model: 'nome', show: true },
      { label: 'Telefone', model: 'telefone', width: '180', show: true },
      { label: 'E-mail', model: 'email', width: '180', show: true },
      { label: 'Pessoa', model: 'pessoa', show: true }
    ];
  }

  state = {
    page: this.page || { content: [], empty: true },
    modalAdicionar: false,
    modalConfirmarRemover: false,
    itemToManipulate: {}
  };

  static getDerivedStateFromProps (props, state) {
    if (props.page && state.page && props.page.content.length !== state.page.content.length) {
      return { page: props.page };
    }
    return null;
  }

  deletar = () => {
    this.service.deletar(this.state.itemToManipulate.id)
      .then(() => {
        Notification.show('success', 'O contato ' + this.state.itemToManipulate.nome + ' foi removido.');
        this.onCloseModalConfirm();
        this.reload();
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
    this.reload();
  };

  onCloseModalConfirm = () => {
    this.reload();
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
          onConfirm={this.deletar}
          onClose={this.onCloseModalConfirm}>
          Deseja realmente remover este contato?
        </ModalConfirm>

        <ContatoPessoaCad item={this.state.itemToManipulate}
          show={this.state.modalAdicionar} onClose={this.onCloseModalAdicionar} />

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
    )
  }

};

export default ContatoPessoaList;