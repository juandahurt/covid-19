import React, { Component } from 'react';
import { FaHeart, FaCircle } from 'react-icons/fa';
import { LineChart, Line, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';

import Card from '../card';
import { getSummary, getAllByCountry } from '../../actions/covidActions';
import Map from '../map';

import './main.css';

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
        countries: [],
        chartData: {
          country: "",
          data: []
        }
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
      res.Countries.forEach(country => {
        country['selected'] = false;
        country['hover'] = false;
      });
      res.Countries[0].selected = true;
      this.setState({
        data: {
          countries: res.Countries,
          chartData: { country: "", data: [] }
        }
      });

      this.map.current.drawCases(this.state.data);

      res = await getAllByCountry(this.state.data.countries[0].Slug);
      let countries = this.state.data.countries;
      this.setState({
        data: {
          countries: countries,
          chartData: {
            country: res[0].Country,
            data: res
          }
        }
      });
    } catch (err) {
      console.log(err.message);
    }
  }

  async countryOnClick(country, index) {
    this.state.data.countries.map(country => country.selected = false);
    this.state.data.countries[index].selected = true;
    this.state.data.chartData.country = country.Country;

    let res = await getAllByCountry(country.Slug);
    this.state.data.chartData.data = res;
    
    this.forceUpdate();
    this.map.current.drawCases(this.state.data);
  }

  render() {
    return (
      <div style={{backgroundColor: '#F1F3FB'}} className="col-12 py-3 px-0 mx-0">
        <div className="row pl-5">
          <h2 style={{color: '#1A1053', fontSize: 30}}>Covid-19</h2>
          <span style={{fontSize: 25}} className="text-muted ml-3">Global Trend</span>
        </div>
        {/* Cards */}
        <div className="row col-12 mx-auto">
          <Card 
          ref={this.aggregatedCard}
          title="Aggregated Confirmed" 
          value={0}
          color='#F9345E'/>
          <Card 
          ref={this.activeCard}
          title="Active Confirmed" 
          value={0}
          color='#FA6400'/>
          <Card 
          ref={this.recoveredCard}
          title="Recovered" 
          value={0}
          color='#1CB142'/>
          <Card 
          ref={this.deathsCard}
          title="Death" 
          value={0}
          color='#6236FF'/>
        </div>
        {/* Countries */}
        <div style={{borderRadius: 35}} className="countries-container mt-2 mx-4">
          <div className="row px-4 py-3 align-items-center">
            <div className="scrollbar col-lg-4 my-3" id="scrollbar-style">
              {this.state.data.countries.map((country, index) => {
                let backgroundColor = '#ffffff';
                if (country.selected) {
                  backgroundColor = '#F1F3FB';
                }
                if (!country.selected && country.hover) {
                  backgroundColor = '#f6f6f6';
                }
                return <div className="row pt-1 mx-1 country"
                  onMouseEnter={() => {
                    this.state.data.countries[index].hover = true; 
                    this.forceUpdate();
                  }} 
                  onMouseLeave={() => {
                    this.state.data.countries[index].hover = false; 
                    this.forceUpdate();
                  }}
                  onClick={() => {this.countryOnClick(country, index)}} 
                  style={{
                    backgroundColor: backgroundColor, 
                    borderRadius: 35,
                    cursor: 'pointer'
                  }}>
                  <h6 className="col-4 text-right pt-1" style={{color: '#1A1053'}}>{new Intl.NumberFormat().format(country.TotalConfirmed)}</h6>
                  <span className="col-8 text-muted text-left">{country.Country}</span>
                </div>
              })}
            </div>
            {/* Map */}
            <div className="col-lg-8 pl-4">
              <div className="row">
              <h5 style={{color: '#1A1053'}} className="text-center ml-3">{this.state.data.chartData.country}</h5>
              <p className="text-muted ml-auto mr-3"><FaCircle className="mr-2" style={{color: "#F9345E", opacity: 0.57}} />Selected country</p>
              </div>
              <Map ref={this.map}/>
              <div>
                <div className="row mt-3">
                  <span className="text-muted ml-auto mr-4">
                    <FaCircle className="mr-2" style={{color: "#F9345E"}}/>
                    Aggr. Confirmed
                  </span>
                  <span className="text-muted mr-4">
                    <FaCircle className="mr-2" style={{color: "#1CB142"}}/>
                    Recovered
                  </span>
                  <span className="text-muted mr-4">
                    <FaCircle className="mr-2" style={{color: "#6236FF"}}/>
                    Deaths
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={this.state.data.chartData.data}>
                    <Line type="natural" strokeWidth={2} dataKey="Confirmed" stroke="#F9345E" dot={false}/>
                    <Line type="natural" strokeWidth={2} dataKey="Deaths" stroke="#6236FF" dot={false}/>
                    <Line type="natural" strokeWidth={2} dataKey="Recovered" stroke="#1CB142" dot={false}/>
                    <Tooltip />
                    <CartesianGrid opacity={0.2} strokeDasharray="8 8"/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center pt-4">
          <code className="text-muted" style={{color: 'black'}}>
            Made with <FaHeart /> by <a href="https://github.com/juandahurt">juandahurt </a>
            / Design taken from Dribbble
          </code>
        </div>
      </div>
    );
  }
}

export default Main;
