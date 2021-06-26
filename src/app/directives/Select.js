import React from 'react';
import { Form } from 'react-bootstrap';

class Select extends React.Component {

  constructor(props) {
    super(props);
    this.placeholder = props.placeholder;
    this.required = props.required || false;
    this.value = props.value;
    this.onChange = props.onChange;
    this.options = props.options;
    this.name = props.name;
    this.property = props.property;

    if (this.required) {
      this.onChange({
        target: { value: this.options[0].id, name: this.name }, required: true
      });
    }
  }

  state = {
    value: this.value
  };

  clear = () => {
    this.change('');
  };

  change = (e) => {
    this.setState({ value: e.target.value });
    if (this.onChange) {
      this.onChange({
        target: { value: e.target.value, name: this.name }
      });
    }
  }

  componentWillReceiveProps(props) {
    if (typeof props.value === 'object') {
      const propValue = props.value || {};
      const stateValue = this.state.value || {};
      if (propValue.id !== stateValue.id) {
        this.setState({ value: propValue.id });
        return;
      }
    }
    
    if (props.value !== this.state.value) {
      this.setState({ value: props.value });
      return;
    }
  }

  render() {
    return (
      <div style={{ position: 'relative' }}>
        <Form.Control as="select" placeholder={this.placeholder} name={this.name}
          onChange={this.onChange} required={this.required} value={this.state.value}>
          {!this.required &&
            <option value=""></option>
          }
          {this.options.map((item, index) => (
            <option key={index} value={item.id}>{item[this.property]}</option>
          ))}
        </Form.Control>

        {(!this.required && this.state.value) &&
          <button type="button" className="close" onClick={this.clear}
            style={{ position: 'absolute', top: '0.25rem', right: '1.5rem' }}>
            <span aria-hidden="true">×</span>
            <span className="sr-only">Close</span>
          </button>
        }
      </div>
    );
  }
}

export default Select;