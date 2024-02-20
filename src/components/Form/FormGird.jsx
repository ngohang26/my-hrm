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
    this.setState({
      data: {
        ...this.state.data,
        [event.target.name]: event.target.value
      }
    });
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
              <input type={column.type} name={column.field} onChange={this.handleInputChange} className='form-control1' />
            )}
          </div>
        ))}
      </form>
    );
  }
}

export default FormGrid;
