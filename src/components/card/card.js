import React, { Component } from 'react';

import './card.css';

class Card extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: props.title,
      value: props.value,
      color: props.color
    }
  }

  changeValue(newValue) {
    this.setState({value: new Intl.NumberFormat().format(newValue)})
  }

  render() {
    return (
      <div className="px-4 col-lg-3">
        <div
        className="card text-center my-3 row border-0" 
        style={{
          borderRadius: 35
        }}>
          <div className="card-body row align-items-center">
            <h3 className="col-12 my-0" style={{fontSize: 20, color: '#1A1053'}}>{this.state.title}</h3>
            <h1 className="col-12 my-0" style={{fontSize: 45, color: this.state.color}}>{this.state.value}</h1>
          </div>
        </div>
      </div>
    );
  }
}

export default Card;
