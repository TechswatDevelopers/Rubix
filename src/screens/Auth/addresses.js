import React from "react";
import { connect } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-phone-number-input/style.css';
import axios from "axios";
import {Helmet} from "react-helmet";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import {updateClientBackG,
  updateLoadingController,
  updateLoadingMessage,} from "../../actions";

class Addresses extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      provList: [],
      countryList: [],
      location: null,
      prov: null,
      myUserID: null,
      country: null,
      showSearch: false,
      value: 0

    };
  }

  //final submit check
  AddressSubmit(e) {
    e.preventDefault();
    //Set Loading Screen ON
 this.props.updateLoadingController(true);
 this.props.updateLoadingMessage("Submitting Information...");
    const form = document.getElementById('addresses');
    if (this.state.location != null ) {
      const locations = document.getElementById('location');
      const street_address = this.state.location['value']['structured_formatting']['main_text']
      const data = {
        'RubixRegisterUserID': this.state.myUserID,
        'RegisterUserStreetNameAndNumer': street_address,
        'RegisterUserProvince': this.state.prov,
        'RegisterUserCountry': this.state.country,
      };
      for (let i = 0; i < form.elements.length; i++) {
        const elem = form.elements[i];
        data[elem.name] = elem.value
      }

      const requestOptions = {
        title: 'Address Form',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data
      };
      //console.log(data)
      const postData = async () => {

        if (this.state.location != null && this.state.prov != null && this.state.country != null /* && document.getElementById('addresses').checkValidity() == true */) {
          await axios.post('https://adowarest.rubix.mobi:88/api/RubixRegisterUserAddesss', data, requestOptions)
            .then(response => {
              //console.log(response)
              //Set timer for loading screen
    setTimeout(() => {
      this.props.updateLoadingController(false);
    }, 1000);
              this.props.history.push("/varsityDetails")
            })

        } else {
          //Set timer for loading screen
    setTimeout(() => {
      this.props.updateLoadingController(false);
    }, 1000);
          alert("Please ensure that you entered all required information")
          //console.log("checkValidity ", document.getElementById('addresses').checkValidity())
        }
      }
      postData()
    } else if( document.getElementById('streetAddress') != null) {
      const data = {
        'RubixRegisterUserID': this.state.myUserID,
        'RegisterUserProvince': this.state.prov,
        'RegisterUserCountry': this.state.country,
      };

      for (let i = 0; i < form.elements.length; i++) {
        const elem = form.elements[i];
        data[elem.name] = elem.value
      }

      //console.log("posted Data: ", data)
      const requestOptions = {
        title: 'Address Form',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data
      };

      const postData = async () => {
        if ( this.state.prov != null && this.state.country != null /* && document.getElementById('addresses').checkValidity() == true */) {
          await axios.post('https://adowarest.rubix.mobi:88/api/RubixRegisterUserAddesss', data, requestOptions)
            .then(response => {
              //console.log("The response: ",response)
              //Set timer for loading screen
    setTimeout(() => {
      this.props.updateLoadingController(false);
    }, 1000);
              this.props.history.push("/varsityDetails")
            })

        } else {
          //Set timer for loading screen
    setTimeout(() => {
      this.props.updateLoadingController(false);
    }, 1000);
          alert("Please ensure that you entered all required information")
          //console.log("checkValidity ", document.getElementById('addresses').checkValidity())
        }
      }
      postData()
    }
    
    else {
      //Set timer for loading screen
    setTimeout(() => {
      this.props.updateLoadingController(false);
    }, 1000);
      alert("Please enter a valid home address")
    }

  }



  async componentDidMount() {
    document.body.classList.remove("theme-cyan");
    document.body.classList.remove("theme-purple");
    document.body.classList.remove("theme-blue");
    document.body.classList.remove("theme-green");
    document.body.classList.remove("theme-orange");
    document.body.classList.remove("theme-blush");
    const userID = localStorage.getItem('userID');
    this.props.updateClientBackG(localStorage.getItem('clientBG'))
    this.setState({ myUserID: userID });
    this.props.updateLoadingController(true);
    this.props.updateLoadingMessage("Loading Details...");

    //console.log("This is the ID: ", localStorage.getItem('userID'))

    const fetchData = async () => {
      await fetch('https://adowarest.rubix.mobi:88/api/RubixProvinces')
        .then(response => response.json())
        .then(data => {
          this.setState({ provList: data.data })
          //console.log("this is the provList:", this.state.provList)
          //setProvList(data.data)
        });

      //Fetch Countries List
      await fetch('https://adowarest.rubix.mobi:88/api/RubixCountries')
        .then(response => response.json())
        .then(data => {
          //console.log("data is ", data.data)
          this.setState({ countryList: data.data })
          //console.log("this is the countryList:", this.state.countryList)
          //setCountryList(data.data)
        });

    }
    fetchData().then(() => {
      setTimeout(() => {
        this.props.updateLoadingController(false);
      }, 2000);
      //this.postStatus()
    });

  }

  //Show Search
  showSearch(e){
    e.preventDefault() 
    this.setState({showSearch: !this.state.showSearch})
  }

  render() {
    return (
      <div className={ "theme-grey"/* this.props.rubixThemeColor */}>
        <Helmet>
              <meta charSet="utf-8" />
              <title>Residential Information</title>
          </Helmet>

          <div
          className="page-loader-wrapper"
          style={{ display: this.props.MyloadingController ? "block" : "none" }}
        >
          <div className="loader">
            <div className="m-t-30">
              <img
                src={localStorage.getItem('clientLogo')}
                width="10%"
                height="10%"
                alt=" "
              />
            </div>
            <p>{this.props.loadingMessage}</p>
          </div>
        </div>
        <div >
          <div className="vertical-align-wrap">
            <div className="vertical-align-middle auth-main"
            style={{
              backgroundImage: "url(" + this.props.clientBG + ")",
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              width: "100% !important",
              height: "100% !important",
            }}>
              <div className="auth-box">
                <div className="card">
                  <div className="top">
                    <img src={localStorage.getItem('clientLogo')} alt="" style={{ height: "40%",  width:"44%", display: "block", margin: "auto" }} />
                  </div>
                  <div className="header">
                    <h1 className="lead">Address Details</h1>
                    <p className="text-secondary">Please fill in the following informaion regarding the home address for the person occupying the property.</p>
                  
                  </div>

                  <div className="body">
                    <form id='addresses' onSubmit={(e) => this.AddressSubmit(e)}>
                      <div className="form-group">
                        <label className="control-label" >
                          Home Address
                        </label>
                        { this.state.showSearch
                        ?  <GooglePlacesAutocomplete
                          apiKey="AIzaSyBoqU4KAy_r-4XWOvOiqj0o_EiuxLd9rdA" id='location' onChange={(e) => this.setState({ location: e.target.value })}
                          selectProps={{
                            location: this.state.location,
                            onChange: (e) => this.setState({ location: e }),
                            placeholder: "Search Address"
                          }}
                        />
                      : <input
                      className="form-control"
                      name= "RegisterUserStreetNameAndNumer"
                      id="streetAddress"
                      placeholder="Enetr your Physical Address"
                      type="text"
                    />
                      }
                      <button className="btn btn-primary btn-sm mt-1" onClick={(e)=>this.showSearch(e)}><i className={this.state.showSearch ?"icon-note pr-2" :"icon-magnifier pr-2"}/>
                      {
                      this.state.showSearch 
                      ?'Type Address'
                      
                    : 'Search Address'}</button>
                      
                      </div>

                      <div className="form-group">
                        <label className="control-label" >
                          Complex/Building Name
                        </label>
                        <input
                          className="form-control"
                          name="RegisterUserComplexorBuildingName"
                          id="complex-name"
                          placeholder="Enter your Complex Name"
                          type="text"
                        />
                      </div>

                      <div className="form-group">
                        <label className="control-label" >
                          Complex/Apartnment Unit Number
                        </label>
                        <input
                          className="form-control"
                          name="RegisterUserComplexorBuildingNumber"
                          id="complex-number"
                          placeholder="Enter your Apartment Number"
                          type="text"
                        />
                      </div>

                      <div className="form-group">
                        <label className="control-label" >
                          Postal Code
                        </label>
                        <input
                          className="form-control"
                          name="PostCode"
                          id="post-code"
                          placeholder="Enter your post code"
                          type="text"
                          required />
                      </div>

                      <div className="form-group">
                        <label className="control-label" >
                          Province
                        </label>
                        {
                          <select className="form-control" onChange={(e) => this.setState({ prov: e.target.value })} value={this.state.prov}>
                            {
                              this.state.provList.map((province, index) => (
                                <option key={index} name='RegisterUserProvince' value={province.Province} >{province.Province}</option>
                              ))
                            }
                          </select>}
                      </div>

                      <div className="form-group">
                        <label className="control-label" >
                          Country
                        </label>
                        <select className="form-control" onChange={(e) => this.setState({ country: e.target.value })} value={this.state.country}>
                          {
                            this.state.countryList.map((country, index) => (
                              <option key={index} name='RegisterUserCountry' value={country.Country_Name}>{country.Country_Name}</option>
                            ))
                          }
                        </select>
                      </div>

                      <button className="btn btn-primary btn-lg btn-block" type="submit" onClick={(e) => this.AddressSubmit(e)}>
                        NEXT
                      </button>
                    </form>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Addresses.propTypes = {
};

const mapStateToProps = ({ navigationReducer, loginReducer }) => ({
  email: loginReducer.email,
  password: loginReducer.password,
  rubixUserID: navigationReducer.userID,
  clientBG: navigationReducer.backImage,

  MyloadingController: navigationReducer.loadingController,
  loadingMessage: navigationReducer.loadingMessage,
});

export default connect(mapStateToProps, {
  updateClientBackG,
  updateLoadingController,
  updateLoadingMessage,
})(Addresses);
