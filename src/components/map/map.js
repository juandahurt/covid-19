import React, { Component } from 'react';

import worldMap from '../../assets/world-map.png';
import data from '../../data/countries.csv';
import * as d3 from 'd3';
import './map.css'

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = { data: null }
    
    this.canvas = React.createRef();
    this.img = React.createRef();
  }

  componentDidMount() {
    this.drawWorldMap();
    this.loadCountriesFile();
  }

  drawWorldMap() {
    const ctx = this.canvas.current.getContext("2d");
    const img = this.img.current;

    img.onload = () => {
      ctx.drawImage(img, 0, 0);
    }
  }

  async loadCountriesFile() {
    let dataJson = await d3.csv(data);
    this.setState({data: dataJson});
  }

  drawCases(data) {
    data.countries.map(c => {
      let countryGeoData = this.state.data.find(element => { return element.country === c.CountryCode });
      if (countryGeoData) {
        let lat = countryGeoData.latitude;
        let lon = countryGeoData.longitude;
        this.drawCasesAt(lon, lat, c.TotalConfirmed)
      }
    });
  }

  drawCasesAt(lon, lat, cases) {
    const ctx = this.canvas.current.getContext("2d");
    ctx.beginPath();
    let zoom = 2;
    let x = this.getX(lon, zoom) + (2483 / 2) - 40;
    let y = this.getY(lat, zoom) + (1193 / 2) - 420;
    ctx.ellipse(x, y, cases * 0.0002, cases * 0.0002, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#CD372D";
    ctx.closePath();
    ctx.fill();
  }

  getX(lon, zoom) {
    // lon = lon * (Math.PI / 180);
    // var a = (256 / Math.PI) * Math.pow(2, zoom);
    // var b = lon + Math.PI;
    // return a * b;
    return (lon + 180) * (2483 / 360);
  }
  
  getY(lat, zoom) {
    return (1193/2)-(2483* Math.log(Math.tan((Math.PI/4)+((lat*Math.PI/180)/2)))/(2*Math.PI))
  }

  render() {
    return (
      <div style={{
      borderRadius: 35, 
      backgroundColor: '#edeffb'}} 
      className="py-1">
        <canvas style={{
        borderRadius: 35, 
        backgroundColor: '#edeffb'}} 
        ref={this.canvas} 
        width={2483} 
        height={1193}/>
        <img className="worldMap" ref={this.img} src={worldMap} alt="world map" style={{display: 'none'}} />
      </div>
    );
  }
}

export default Map;
