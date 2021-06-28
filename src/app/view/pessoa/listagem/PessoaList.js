import React from 'react';
import { Button, Table, Badge, OverlayTrigger, Tooltip, Popover, ListGroup } from 'react-bootstrap';
import { BsTrash, BsPencil } from 'react-icons/bs';
import FormatterUtils from '../../../utils/FormatterUtils';
import PessoaService from '../../../service/pessoa/PessoaService';
import Notification from '../../../directives/Notification';
import ModalConfirm from '../../../directives/ModalConfirm';
import PessoaCad from '../cadastro/PessoaCad';

class PessoaList extends React.Component {

  constructor(props) {
    super(props);
    this.service = new PessoaService();
    this.page = props.page;
    this.reload = props.reload;

    this.columns = [
      { label: 'Código', model: 'id', width: '100', show: true },
      { label: 'Nome', model: 'nome', show: true },
      { label: 'CPF', model: 'cpf', width: '180', show: true },
      { label: 'Data de nascimento', width: '180', model: 'dataNascimento', show: true },
      { label: 'Quantidade de contatos', width: '210', model: 'contatos', show: true }
    ];
  }

  state = {
    page: this.page || { content: [], empty: true },
    modalAdicionar: false,
    modalConfirmarRemover: false,
    itemToManipulate: {}
  };

  static getDerivedStateFromProps(props, state) {
    if (props.page && state.page && props.page.content.length !== state.page.content.length) {
      return { page: props.page };
    }
    return null;
  }

  deletar = () => {
    const item = this.state.itemToManipulate;
    this.service.deletar(item.id)
      .then(() => {
        Notification.show('success', 'A pessoa ' + item.nome + ' foi removida.');
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
    }, this.reload);
  };

  onCloseModalConfirm = () => {
    this.setState({
      modalConfirmarRemover: false,
      itemToManipulate: {}
    }, this.reload);
  };

  render() {
    return (
      <>
        <ModalConfirm title="Confirmar exclusão"
          show={this.state.modalConfirmarRemover}
          onConfirm={this.deletar}
          onClose={this.onCloseModalConfirm}>
          Deseja realmente remover esta pessoa?
        </ModalConfirm>

        <PessoaCad item={this.state.itemToManipulate}
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
                  <td>{FormatterUtils.formatCpf(item.cpf)}</td>
                  <td>{FormatterUtils.formatDataToBr(item.dataNascimento)}</td>
                  <td className="text-center">
                    {item.contatos.length ?
                      <OverlayTrigger
                        placement="bottom"
                        overlay={
                          <Popover id={`popover-contatos-${index}`}>
                            <ListGroup>
                              {item.contatos.map((contato, index) => (
                                <ListGroup.Item key={index}>{contato.nome}</ListGroup.Item>
                              ))}
                            </ListGroup>
                          </Popover>
                        }>
                        <Badge pill variant="secondary">{item.contatos.length}</Badge>
                      </OverlayTrigger>
                      :
                      <Badge pill variant="secondary">{item.contatos.length}</Badge>
                    }
                  </td>
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

export default PessoaList;