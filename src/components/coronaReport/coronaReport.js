import React, { Component } from "react";
import axios from 'axios'
import './coronaReport.css'
import CovidStateChart from '../coronaReportGraph/coronaReportStateGraph'

export default class coronaReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalStateWiseCase: '',
      totalCityWiseCase: {},
      loader: true
    };
  }
  componentDidMount() {

    axios.all([
      axios.get('https://covid19api.io/api/v1/IndiaCasesByStates'),
      axios.get('https://api.covid19india.org/state_district_wise.json')
    ]).then(axios.spread((stateData, cityWiseData) => {
      this.setState({
        loader: false,
        totalStateWiseCase: stateData.data.data[0].table,
        totalCityWiseCase: cityWiseData.data
      })
    }));
  }
  showCitiwiseDetails(event) {
    let getClosest = event.currentTarget.closest('.corona-item')
    if (getClosest.classList.contains('show-details')) {
      getClosest.classList.remove('show-details')
    } else {
      getClosest.classList.add('show-details')
    }

  }
  render() {
    let totalCases = this.state.totalStateWiseCase && this.state.totalStateWiseCase.slice(0, 1).map((item, index) => {
      return (
        <div className="total-cases" key={index}>
          <p className="active"><span>Active</span>{item.active}</p> <span>+</span>
          <p className="recovered"><span>Recovered</span>{item.recovered}<sub className="new-cases">{item.deltarecovered}</sub></p> <span>+</span>
          <p className="deceased"><span>Deceased</span>{item.deaths}<sub className="new-cases">{item.deltadeaths}</sub></p> <span>=</span>
          <p className="confirmed"><span>Confirmed cases</span>{item.confirmed}<sub className="new-cases">{item.deltaconfirmed}</sub></p>
          <div className="latest-update">Latest update: {item.lastupdatedtime}</div>
        </div>
      )
    })
    let coronaData = this.state.totalStateWiseCase && this.state.totalStateWiseCase.slice(1).map((item, index) => {
      return (
        <div className="corona-item" key={index}>
          <div className="corona-cases-statewise">
            <h2 className="corona-cases-statename">{item.state === 'Total' ? 'India' : item.state}</h2>
            <p className="corona-cases-confirmed">{item.confirmed} {item.deltaconfirmed > 0 ? <sub className="new-cases">{item.deltaconfirmed}</sub> : ''}</p>
            <p className="corona-cases-recovered">{item.recovered}{item.deltarecovered > 0 ? <sub className="new-cases">{item.deltarecovered}</sub> : ''}</p>
            <p className="corona-cases-deceased">{item.deaths} {item.deltadeaths > 0 ? <sub className="new-cases">{item.deltadeaths}</sub> : ''}</p>
            <p className="show-citiwise-list" onClick={(e) => this.showCitiwiseDetails(e)}></p>
          </div>
          {Object.values(this.state.totalCityWiseCase).map((itemdata, index) => {
            return (
              <React.Fragment key={index}>
                {item.statecode === itemdata.statecode ?
                  <div className="corona-cases-citywise-list">
                    <div className="corona-cases-citywise">
                      <p className="corona-cases-cityname">City</p>
                      <p className="corona-cases-confirmed">Confirmed</p>
                      <p className="corona-cases-recovered">Recovered</p>
                      <p className="corona-cases-deceased">Deceased</p>
                    </div>
                    {itemdata && Object.entries(itemdata.districtData).map((state, index) => {
                      return (
                        <div className="corona-cases-citywise" key={index}>
                          <p className="corona-cases-cityname">{state[0]}</p>
                          <p className="corona-cases-confirmed">{state[1].confirmed}</p>
                          <p className="corona-cases-recovered">{state[1].recovered}</p>
                          <p className="corona-cases-deceased">{state[1].deceased}</p>
                        </div>
                      )
                    })}
                  </div>
                  : ''}
              </React.Fragment>
            )
          })}
        </div>
      )
    })

    return (
      this.state.loader && this.state.loader ?
        <div className="loader">
          <p> Loading Covid19 webapp....</p>
          <div className="rect1"></div>
          <div className="rect2"></div>
          <div className="rect3"></div>
          <div className="rect4"></div>
          <div className="rect5"></div>
        </div> :
        <React.Fragment>
          <div className="corona-wrapper" >
            <div className="corona-container">
              <h1>COVID19 Stats in India</h1>
              {totalCases}
              <CovidStateChart />
              <div className="corona-items-list">
                <div className="corona-item corona-items-heading">
                  <div className="corona-cases-statewise">
                    <h2>State</h2>
                    <p className="corona-cases-confirmed">Confirmed</p>
                    <p className="corona-cases-recovered">Recovered</p>
                    <p className="corona-cases-deceased">Deceased</p>
                  </div>
                </div>
                {coronaData}
              </div>
            </div>
          </div>

          <footer>
            <span className="author"><a href="https://voletiswaroop.github.io/">&copy; Swaroop Gupta Voleti</a></span>
            <span className="source"><a href="https://www.covid19india.org/" target="_blank">Source</a></span>
          </footer>
        </React.Fragment >
    )
  }
}