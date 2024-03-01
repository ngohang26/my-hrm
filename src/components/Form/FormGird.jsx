import React from 'react';
import './FormGrid.css'

class FormGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    };
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? !target.checked : target.value;
    const name = target.name;

    this.setState({
      data: {
        ...this.state.data,
        [name]: value
      }
    });
  }
  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onSubmit(this.state.data);
  }
  render() {
    const { fields } = this.props;
    return (
      <form onSubmit={this.handleSubmit} className='form-grid'>
        {fields.map((column) => (
          <div className="item-info" key={column.field}>
            <label>{column.headerName}</label>
            {column.type === 'select' ? (
              <select name={column.field} onChange={this.handleInputChange} className='form-control1'>
                {column.options.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : (
              // <input type={column.type} name={column.field} onChange={this.handleInputChange} className='form-control1' />
              <input type={column.type} name={column.field} value={this.props.data[column.field]} onChange={this.props.onChange} className='form-control1' />


            )}
          </div>
        ))}
      </form>
    );
  }
}

export default FormGrid;
