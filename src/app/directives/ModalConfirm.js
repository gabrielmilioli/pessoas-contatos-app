import React from 'react';
import { Button, Modal } from 'react-bootstrap';

class ModalConfirm extends React.Component {

  constructor(props) {
    super(props);
    this.title = props.title;
    this.show = props.show || false;
    this.onConfirm = props.onConfirm;
    this.onCancel = props.onCancel;
    this.onClose = props.onClose;
  }

  state = {
    show: this.show
  };

  static getDerivedStateFromProps (props, state) {
    if (props.show !== state.show) {
      return { show: props.show };
    }
    return null;
  }

  close = () => {
    if (this.onClose) {
      this.onClose();
    }
  }

  cancel = () => {
    if (this.onCancel) {
      this.onCancel();
    }
    if (this.onClose) {
      this.onClose();
    }
  }

  confirm = () => {
    if (this.onConfirm) {
      this.onConfirm();
    }
    if (this.onClose) {
      this.onClose();
    }
  }

  render() {
    return (
      <>
        <Modal show={this.state.show} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>{this.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.props.children}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.confirm}>
              Confirmar
            </Button>
            <Button variant="link" onClick={this.cancel}>
              Cancelar
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default ModalConfirm;