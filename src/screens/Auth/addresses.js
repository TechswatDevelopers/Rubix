import React from "react";
import { connect } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from "../../assets/images/logo-white.svg";
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css';
import axios from "axios";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

class Addresses extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            provList:[],
            countryList: [],
            location: '',
            prov: "Gauteng",
            country: '',
            value: 0

        };
      }
     //final submit check
 AddressSubmit(e){
    e.preventDefault();
    //console.log(location['value']['structured_formatting']['secondary_text'])
    const form = document.getElementById('addresses');
    const street_address = this.state.location['value']['structured_formatting']['main_text']
    const city = this.state.location['value']['structured_formatting']['secondary_text']
    const data = {
        'RubixRegisterUserID': '78',
        'RegisterUserStreetNameAndNumer': street_address,
        'RegisterUserProvince': this.state.prov,
        'RegisterUserCountry': this.state.country,
    };
    for (let i=0; i < form.elements.length; i++) {
        const elem = form.elements[i];
        data[elem.name] = elem.value
    }

    const requestOptions = {
        title: 'Address Form',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data
    };
    console.log(data)
    const postData = async() => {

        if (this.state.location !=null && document.getElementById('addresses').checkValidity() == true){
            await axios.post('http://197.242.69.18:3300/api/RubixRegisterUserAddesss', data, requestOptions)
            .then(response => {
                console.log(response)
                this.props.history.push("/unidetails/" + '78')
            })
                
        } else{
            
            console.log("checkValidity ", document.getElementById('nof').checkValidity())
        }
    }
    postData()
}


async componentDidMount(){
    document.body.classList.remove("theme-cyan");
    document.body.classList.remove("theme-purple");
    document.body.classList.remove("theme-blue");
    document.body.classList.remove("theme-green");
    document.body.classList.remove("theme-orange");
    document.body.classList.remove("theme-blush");

    const fetchData = async() =>{
        await fetch('http://197.242.69.18:3300/api/RubixProvinces')
        .then(response => response.json())
        .then(data => {
            //console.log("data is ", data.data)
            //this.state.provList = data.data
            this.setState({provList: data.data})
            //console.log("this is the provList:", this.state.provList)
            //setProvList(data.data)
            });
    
    //Fetch Countries List
            await fetch('http://197.242.69.18:3300/api/RubixCountries')
        .then(response => response.json())
        .then(data => {
            //console.log("data is ", data.data)
            this.setState({countryList: data.data})
            //console.log("this is the countryList:", this.state.countryList)
            //setCountryList(data.data)
            });
    
    }
    fetchData();
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
                    <form id='addresses'>
                      <div className="form-group">
                        <label className="control-label sr-only" >
                          Home Address
                            </label>
                            <GooglePlacesAutocomplete
apiKey="AIzaSyBoqU4KAy_r-4XWOvOiqj0o_EiuxLd9rdA" id='location' selectProps={{
location: this.state.location,
onChange: this.state.setLocation,
placeholder: "Enter your home Address"
}}
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
                          placeholder="Enter your Complex Number"
                          type="text"
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
                        Postal Code:
                            </label>
                        <input
                          className="form-control"
                          name="PostCode"
                          id="post-code"
                          placeholder="Enter your post code"
                          type="email"/>
                      </div>

                      <div className="form-group">
                        <label className="control-label sr-only" >
                        Province:
                            </label>
                            {  
        <select className="form-control" onChange={(e)=>this.state.prov= e.target.value} value={this.state.prov}>
        {
         this.state.provList.map((province, index)=> (
            <option key={index} name='RegisterUserProvince' value = {province.Province}>{province.Province}</option>
        ))  
        }
        </select> }
                      </div>

                      <div className="form-group">
                        <label className="control-label sr-only" >
                        Country:
                            </label>
                            <select className="form-control" onChange={(e)=>this.state.country= e.target.value} value={this.state.country}>
        {
         this.state.countryList.map((country, index)=> (
            <option key={index} name='RegisterUserCountry' value = {country.Country_Name}>{country.Country_Name}</option>
        ))   
        }
        </select> 
                      </div>
                     
                      <button className="btn btn-primary btn-lg btn-block" type="submit" onClick={(e) => this.Submit(e) }>
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

/* PersonalInformation.propTypes = {
};

const mapStateToProps = ({ loginReducer }) => ({
  email: loginReducer.email,
  password: loginReducer.password
});
 */
export default Addresses;
