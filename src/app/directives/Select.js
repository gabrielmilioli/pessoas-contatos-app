import React from 'react';
import { Form } from 'react-bootstrap';

class Select extends React.Component {

  constructor(props) {
    super(props);
    this.placeholder = props.placeholder;
    this.required = props.required || false;
    this.value = props.value;
    this.onChange = props.onChange;
    this.values = props.values;
    this.name = props.name;
    this.property = props.property;

    if (this.required) {
      this.onChange({
        target: { value: this.values[0].id, name: this.name }
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

  render() {
    return (
      <div style={{ position: 'relative' }}>
        <Form.Control as="select" placeholder={this.placeholder} name={this.name}
          onChange={this.change} required={this.required} value={this.state.value}>
          {!this.required &&
            <option value=""></option>
          }
          {this.values.map((item, index) => (
            <option key={index} value={item.id}>{item[[this.property]]}</option>
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