import React from 'react';
import {MdCancel} from 'react-icons/md'
import './FormComponent.css'
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

class FormComponent extends React.Component {
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

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onSubmit(this.state.data);
  }

  render() {
    const { fields } = this.props;
    return (
      <form onSubmit={this.handleSubmit}>
        <div className='modal-header'>
          <h2>Add department</h2>
          <button type='cancel' className='btn-cancel'><MdCancel className='md-cancel'/></button>
        </div>
        {fields.map((column) => (
          <div className="item" key={column.field}>
            {column.type === 'select' ? (
              <FormControl>
                <InputLabel id={`${column.field}-label`}>{column.headerName}</InputLabel>
                <Select
                  labelId={`${column.field}-label`}
                  name={column.field}
                  value={this.state.data[column.field] || ''}
                  onChange={this.handleInputChange}
                >
                  {column.options.map((option) => (
                    <MenuItem key={option.id} value={option.name}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <input type={column.type} name={column.field} placeholder={column.headerName} onChange={this.handleInputChange} className='form-control'/>
            )}
          </div>
        ))}
        <hr></hr>
        <div className='btn-control'>
          <button type="cancel">Close</button>
          <button type="submit">Send</button>
        </div>
      </form>
    );
  }
}

export default FormComponent;
