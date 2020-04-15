import React, { Component } from 'react';

import Card from '../card';
import { getSummary } from '../../actions/covidActions';
import Map from '../map';

import './main.css';

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
        countries: []
      }
    }
    this.aggregatedCard = React.createRef();
    this.activeCard = React.createRef();
    this.recoveredCard = React.createRef();
    this.deathsCard = React.createRef();
    this.map = React.createRef();
  }

  async componentDidMount() {
    try {
      let res = await getSummary();
      this.aggregatedCard.current.changeValue(res.Global.TotalConfirmed);
      this.activeCard.current.changeValue(res.Global.TotalConfirmed - res.Global.TotalRecovered - res.Global.TotalDeaths);
      this.recoveredCard.current.changeValue(res.Global.TotalRecovered);
      this.deathsCard.current.changeValue(res.Global.TotalDeaths);

      await res.Countries.sort((c1, c2) => c2.TotalConfirmed - c1.TotalConfirmed);
      this.setState({data: {countries: res.Countries}});

      this.map.current.drawCases(this.state.data);
    } catch (err) {
      console.log(err.message);
    }
  }

  render() {
    return (
      <div style={{backgroundColor: '#F1F3FB'}} className="col-12 py-3 px-0 mx-0">
        <div className="row col-12 mx-auto">
          <div className="px-2 col-lg-3">
            <Card 
            ref={this.aggregatedCard}
            title="Aggregated Confirmed" 
            value={0}
            color='#F9345E'/>
          </div>
          <div className="px-2 col-lg-3">
            <Card 
            ref={this.activeCard}
            title="Active Confirmed" 
            value={0}
            color='#FA6400'/>
          </div>
          <div className="px-2 col-lg-3">
            <Card 
            ref={this.recoveredCard}
            title="Recovered" 
            value={0}
            color='#1CB142'/>
          </div>
          <div className="px-2 col-lg-3">
            <Card 
            ref={this.deathsCard}
            title="Death" 
            value={0}
            color='#6236FF'/>
          </div>
        </div>
        <div style={{borderRadius: 35}} className="countries-container mt-2 mx-4">
          <div className="row px-4 py-3 align-items-center">
            <div className="scrollbar col-lg-4 my-3" id="scrollbar-style">
              {this.state.data.countries.map(c => {
                return <div className="row">
                  <h6 className="col-4 text-right pt-1" style={{color: '#1A1053'}}>{new Intl.NumberFormat().format(c.TotalConfirmed)}</h6>
                  <span className="col-8 text-muted text-left">{c.Country}</span>
                </div>
              })}
            </div>
            <div className="col-lg-8 pl-4">
              <Map ref={this.map}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
