import React from 'react';
import './FormComponent.css'
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

class FormComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.initialValues || {}
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.initialValues !== prevProps.initialValues) {
      this.setState({ data: this.props.initialValues });
    }
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
    const { data } = this.state;
    this.props.onSubmit(data); 
  }
  
  
  render() {
    const { fields } = this.props;
    return (
      <div className="form-component">
        <form onSubmit={this.handleSubmit}>

          {fields.map((column) => (
            <div className="item" key={column.field}>
              {column.type === 'select' ? (
                <FormControl style={{ width: '100%', paddingTop: '10px' }}>
                  <InputLabel id={`${column.field}-label`}>{column.headerName}</InputLabel>
                  <Select
                    labelId={`${column.field}-label`}
                    name={column.field}
                    value={this.state.data[column.field]}
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
                <div className="input-container">
                  <label style={{visibility: column.type === 'date' ? 'visible' : 'hidden'}}>{column.headerName}</label>
                  <input 
                    type={column.type} 
                    name={column.field} 
                    placeholder={column.headerName} 
                    value={this.state.data[column.field]} 
                    onChange={this.handleInputChange} 
                    className='form-control'
                  />
                </div>
              )}
            </div>
          ))}

          <hr></hr>
          <div className='btn-control'>
            <button type="button" onClick={this.props.onCancel}>Close</button>
            <button type="submit">Send</button>
          </div>
        </form>
      </div>
    );
  }
}

export default FormComponent;  
