import React from "react";
import { connect } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-phone-number-input/style.css';
import axios from "axios";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

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
      value: 0

    };
  }

  //final submit check
  AddressSubmit(e) {
    e.preventDefault();
    const form = document.getElementById('addresses');
    if (this.state.location != null) {
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
          await axios.post('https://rubixapi.cjstudents.co.za:88/api/RubixRegisterUserAddesss', data, requestOptions)
            .then(response => {
              console.log(response)
              this.props.history.push("/varsityDetails")
            })

        } else {
          alert("Please ensure that you entered all required information")
          console.log("checkValidity ", document.getElementById('addresses').checkValidity())
        }
      }
      postData()
    } else {
      alert("Please a valid home address")
    }

  }

  //Posting Update status
  postStatus() {
    const data = {
      'Status': 'Email Verify',
      'RubixRegisterUserID': this.state.myUserID,
    };
    const requestOptions = {
      title: 'Verify Status Form',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    };
    console.log('User data:', data)
    const postData = async () => {
      await axios.post('http://192.168.88.10:3300/api/RubixUpdateStatus', data, requestOptions)
        .then(response => {
          console.log("Verify email status", response)
          //this.props.history.push("/" )
        })
    }
    postData()
  }

  async componentDidMount() {
    document.body.classList.remove("theme-cyan");
    document.body.classList.remove("theme-purple");
    document.body.classList.remove("theme-blue");
    document.body.classList.remove("theme-green");
    document.body.classList.remove("theme-orange");
    document.body.classList.remove("theme-blush");
    const userID = localStorage.getItem('userID');
    this.setState({ myUserID: userID });

    const fetchData = async () => {
      await fetch('https://rubixapi.cjstudents.co.za:88/api/RubixProvinces')
        .then(response => response.json())
        .then(data => {
          this.setState({ provList: data.data })
          //console.log("this is the provList:", this.state.provList)
          //setProvList(data.data)
        });

      //Fetch Countries List
      await fetch('https://rubixapi.cjstudents.co.za:88/api/RubixCountries')
        .then(response => response.json())
        .then(data => {
          //console.log("data is ", data.data)
          this.setState({ countryList: data.data })
          //console.log("this is the countryList:", this.state.countryList)
          //setCountryList(data.data)
        });

    }
    fetchData().then(() => {
      this.postStatus()
    });

  }

  render() {
    return (
      <div className="theme-green">
        <div >
          <div className="vertical-align-wrap">
            <div className="vertical-align-middle auth-main">
              <div className="auth-box">
                <div className="card">
                  <div className="top">
                    <img src="CJ-Logo.png" alt="Logo" style={{ height: "50px", margin: "10px", display: "block", margin: "auto" }} />
                  </div>
                  <div className="header">
                    <p className="lead">Student Address Details</p>
                  </div>

                  <div className="body">
                    <form id='addresses' onSubmit={(e) => this.AddressSubmit(e)}>
                      <div className="form-group">
                        <label className="control-label sr-only" >
                          Home Address
                        </label>
                        <GooglePlacesAutocomplete
                          apiKey="AIzaSyBoqU4KAy_r-4XWOvOiqj0o_EiuxLd9rdA" id='location' onChange={(e) => this.setState({ location: e.target.value })}
                          selectProps={{
                            location: this.state.location,
                            onChange: (e) => this.setState({ location: e }),
                            placeholder: "Enter your home Address"
                          }}
                        />
                      </div>

                      <div className="form-group">
                        <label className="control-label sr-only" >
                          Complex/Building Name:
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
                        <label className="control-label sr-only" >
                          Complex/Apartnment Unit Number:
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
                        <label className="control-label sr-only" >
                          Postal Code:
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
                        <label className="control-label sr-only" >
                          Province:
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
                        <label className="control-label sr-only" >
                          Country:
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
});

export default connect(mapStateToProps, {
})(Addresses);
