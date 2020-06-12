import React, { Component } from 'react';

import worldMap from '../../assets/world-map.png';
import data from '../../data/countries.csv';
import * as d3 from 'd3';
import './map.css'

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      data: null,
      mapWidth: 2483,
      mapHeight: 1193
    }
    
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
  
    ctx.drawImage(img, 0, 0);
    this.clearMap();
  }

  clearMap() {
    const ctx = this.canvas.current.getContext("2d");
    var imgData = ctx.getImageData(0, 0, this.state.mapWidth, this.state.mapHeight);
    var data = imgData.data;
    for (var i=0; i<data.length; i++) {
      if (data[i] > 0 && data[i] < 255) {
        data[i] = 255;
      }
    }
    ctx.putImageData(imgData,0,0);
  }

  async loadCountriesFile() {
    let dataJson = await d3.csv(data);
    this.setState({data: dataJson});
  }

  drawCases(data) {
    let ctx = this.canvas.current.getContext("2d");

    ctx.clearRect(0, 0, this.canvas.current.width, this.canvas.current.height);
    this.drawWorldMap(); // It only draws the map when this function is called!
    data.countries.map(c => {
      let countryGeoData = this.state.data.find(element => { return element.country === c.CountryCode });
      if (countryGeoData) {
        let lat = countryGeoData.latitude;
        let lon = countryGeoData.longitude;
        this.drawCasesAt(lon, lat, c.TotalConfirmed, c.selected)
      }
    });
  }

  drawCasesAt(lon, lat, cases, selected) {
    const ctx = this.canvas.current.getContext("2d");
    ctx.beginPath();
    let x = this.getX(lon) + (2483 / 2) - 40;
    let y = this.getY(lat) - 420;
    let r = cases * 0.00018;

    if (r > 65) { r = 65; }
    if (selected) { 
      ctx.fillStyle = "#F9345E";
      ctx.globalAlpha = 0.57; 
    }
    else { 
      ctx.fillStyle = "#FA6400"; 
      ctx.globalAlpha = 0.27;
    }
    
    
    ctx.ellipse(x, y, r, r, 0, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }

  getX(lon) {
    return (lon + 180) * (this.state.mapWidth / 360);
  }
  
  getY(lat) {
    let a = this.state.mapHeight;
    let b = (Math.PI / 4 ) + (lat * Math.PI / 180) / 2;
    return a - (this.state.mapWidth * Math.log(Math.tan(b)) / (2 * Math.PI))
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
