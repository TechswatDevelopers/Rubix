import React from "react";
import {connect} from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css';
import axios from "axios";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Helmet} from "react-helmet";
import {
  updateEmail, 
  updatePassword, 
  updateUserID, updatePlatformID,
  updateStudentID,
  updateLoadingMessage,
  updateLoadingController,
  updateClientBackG
  } from "../../actions";

class PersonalInformation extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userGender: 'Male',
      medicalConditions: 'None',
      yearOfRes: '2022',
      errorMessage: '',
      countryList: [],
      genterList: ['Please select your Gender', 'Male', 'Female'],
      myGender: '',
      value: 0,
      MarketingConsent: "0"

    };
  }

    //Change Marketing Consent
    changeMarketingConsent(e){
      //////console.log("My consent: ", e.target.value)
      if (e.target.value == 'on'){
        this.setState({
          MarketingConsent: "1"
        })
      } else {
        this.setState({
          MarketingConsent: "0"
        })
      }
    }

  ///Validate ID numbers
  Validate() {
    var idNumber = document.getElementById("IDNumber").value;
    // store the error div, to save typing
    var error = document.getElementById('error');

    // assume everything is correct and if it later turns out not to be, just set this to false
    var correct = true;

    //Ref: http://www.sadev.co.za/content/what-south-african-id-number-made
    // SA ID Number have to be 13 digits, so check the length
    if (idNumber.length != 13) {
      correct = false;
    }

    //Extract first 6 digits
    var year = idNumber.substring(0, 2);
    var month = idNumber.substring(2, 4);
    var day = idNumber.substring(4, 6);

    // get first 6 digits as a valid date
    var tempDate = new Date(year, month - 1, day);

    var id_date = tempDate.getDate();
    var id_month = tempDate.getMonth();
    var id_year = tempDate.getFullYear();
    var right_month = id_month + 1;
    //////console.log(id_date, id_month, id_year)

    var fullDate = id_date + "-" + right_month + "-" + id_year;

    if (!((tempDate.getYear() == idNumber.substring(0, 2)) && (id_month == idNumber.substring(2, 4) - 1) && (id_date == idNumber.substring(4, 6)))) {
      //error.append('ID number does not appear to be authentic - date part not valid. ');
      correct = false;
    }

    // get the gender
    var genderCode = idNumber.substring(6, 10);
    var gender = parseInt(genderCode) < 5000 ? "Female" : "Male";
    this.setState({ userGender: gender })
    //setGender(gender)

    // get country ID for citzenship
    var citzenship = parseInt(idNumber.substring(10, 11)) == 0 ? "Yes" : "No";

    // apply Luhn formula for check-digits
    var tempTotal = 0;
    var checkSum = 0;
    var multiplier = 1;
    for (var i = 0; i < 13; ++i) {
      tempTotal = parseInt(idNumber.charAt(i)) * multiplier;
      if (tempTotal > 9) {
        tempTotal = parseInt(tempTotal.toString().charAt(0)) + parseInt(tempTotal.toString().charAt(1));
      }
      checkSum = checkSum + tempTotal;
      multiplier = (multiplier % 2 == 0) ? 1 : 2;
    }
    if ((checkSum % 10) != 0) {

      correct = false;
    }
    if (correct) {
      // and put together a result message
      //document.getElementById('result').append('<p>South African ID Number:   ' + idNumber + '</p><p>Birth Date:   ' + fullDate + '</p><p>Gender:  ' + gender + '</p><p>SA Citizen:  ' + citzenship + '</p>');
    } else {
      alert("Invalid ID Number, please correct ID Number and try again")
      //error.append("Invalid ID Number, please enter a valid ID Number")
      this.setState({ errorMessage: "Invalid ID Number, please enter a valid ID Number" })
    }
    return correct
  }

  //final submit check
  Submit(e) {
    e.preventDefault();
    //Set Loading Screen ON
 this.props.updateLoadingController(true);
 this.props.updateLoadingMessage("Submitting Information..."); 
    //////console.log("User email:", this.props.email)
    var idNumber = document.getElementById("IDNumber").value;
    var email = document.getElementById("email").value;
    //var year = document.getElementById("email").value;
    const form = document.getElementById('register');
    const data = {
        'ClientID': localStorage.getItem('clientID'),
        'PlatformID': localStorage.getItem('platformID'),
        'RubixUserPlatformID': localStorage.getItem('userplatformID') == null ? " " : localStorage.getItem('userplatformID'),
        'RubixRegisterUserID': '',
        'MedicalConditions': this.state.medicalConditions,
        'Gender': this.state.myGender,
        'Nationality': localStorage.getItem('country'),
        'RegistrationYear': "2023",
        'MarketingConcent': this.state.MarketingConsent,
    };
    for (let i = 0; i < form.elements.length; i++) {
      const elem = form.elements[i];
      data[elem.name] = elem.value
    }
    const requestOptions = {
      title: 'Student Personal Details',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    };
    ////console.log("Sent: ", data)
    const postData = async()=>{
        if (/* this.Validate() && this.state.userGender != null  &&  */document.getElementById('register').checkValidity() == true && this.state.myGender != '' && this.state.myGender != 'Please select your Gender' ){
            await axios.post('https://adowarest.rubix.mobi:88/api/RubixRegisterUsers', data, requestOptions)
            .then(response => {
                ////console.log("Response: ",response)

                //Check if successful 
                if(response.data.PostRubixUserData[0].ResponceMessage != undefined && response.data.PostRubixUserData[0].ResponceMessage != null && response.data.PostRubixUserData[0].ResponceMessage == "Record successfully inserted"  || response.data.PostRubixUserData[0].ResponceMessage == "Record successfully Updated"){

                  this.props.updateStudentID(idNumber)
                  localStorage.setItem('studentIDNo', idNumber)
                  //localStorage.setItem('idNumber', " ")
                  localStorage.setItem('studentEmail', email)
                  localStorage.setItem('userID', response.data.PostRubixUserData[0].RubixRegisterUserID)
                  this.props.updateUserID(response.data.PostRubixUserData[0].RubixRegisterUserID)
                  //Set timer for loading screen
                  setTimeout(() => {
                    this.props.updateLoadingController(false);
                    this.props.history.push("/relatives")
                  }, 1000);
                } else {
                  setTimeout(() => {
                    this.props.updateLoadingController(false);
                  }, 1000)
                  alert("There was an error in submitting your information, please try again")
                }
            })
                
        } else{
            this.props.updateLoadingController(false)
          alert("Please ensure that you entered all required information")
        }
    }

    postData()
  }

  //On Page load complete
  componentDidMount() {
    this.props.updateClientBackG(localStorage.getItem('clientBG'))
    //////console.log('platform ID', localStorage.getItem('platformID'))
    //Fetch Data
    const fetchData = async () => {
       //Set Loading Screen ON
    this.props.updateLoadingController(true);
    this.props.updateLoadingMessage("Loading Countries List...");
      //Fetch Countries List
      await fetch('https://adowarest.rubix.mobi:88/api/RubixCountries')
      .then(response => response.json())
      .then(data => {
          //////console.log("data is ", data.data)
          this.setState({ countryList: data.data })
          //////console.log("this is the countryList:", this.state.countryList)
          //setCountryList(data.data)
        });
    }
    fetchData().then(()=>{
      //Set timer for loading screen
    setTimeout(() => {
      this.props.updateLoadingController(false);
    }, 1000);
    })
  }

  onValueChange(e){

    this.setState({
      yearOfRes: e.target.value
    })
  }
  
  render() {
    return (
      <div className={ "theme-grey"/* this.props.rubixThemeColor */}>
        <Helmet>
                <meta charSet="utf-8" />
                <title>Personal Information</title>
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

        <div>
          <div className="vertical-align-wrap">
            <div className="vertical-align-middle auth-main"
            style={{
                backgroundImage: "url(" + this.props.clientBG + ")",
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                width: "10% !important",
                height: "10% !important",
              }}
            >
              <div className="auth-box">
                <div className="card">
                  <div className="top">
                    <img src={localStorage.getItem('clientLogo')} alt="" style={{ 
                      height: "40%",  width:"44%",  display: "block", margin: "auto" }} />
                  </div>
                  <div className="header">
                    <h1 className="lead">Student Details</h1>
                    <p className="text-secondary">Please fill in the following informaion regarding the person that will be living in the property.</p>
                  </div>
                  
                  <div className="body">
                   
                    <form id='register' onSubmit={(e) => this.Submit(e)}>
                      
                      
                      <div className="form-group">
                        <label className="control-label" >
                          First Name
                        </label>
                        <input
                          className="form-control"
                          name="Name"
                          id="Name"
                          placeholder="Enter your full name"
                          type="text"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="control-label" >
                          Middle Name
                        </label>
                        <input
                          className="form-control"
                          name="MiddleName"
                          id="middle-name"
                          placeholder="Enter your middle name"
                          type="text"
                        />
                      </div>

                      <div className="form-group">
                        <label className="control-label" >
                          Last Name
                        </label>
                        <input
                          className="form-control"
                          name="Surname"
                          id="last-name"
                          placeholder="Enter your surname"
                          type="text"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="control-label" >
                          Password
                        </label>
                        <input
                          className="form-control"
                          name="Password"
                          id="signup-password"autoComplete="off"
                         // defaultValue={this.props.password}
                          placeholder="Password"
                          type="password"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="control-label" >
                          Gender
                        </label>
                        <select className="form-control" onChange={(e) => this.setState({ myGender: e.target.value })} value={this.state.myGender}>
                          {
                            this.state.genterList.map((gender, index) => (
                              <option key={index} name='Gender ' value={gender}>{gender}</option>
                            ))
                          }
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="control-label d-none" >
                          Country
                        </label>
                        <select className="form-control d-none" onChange={(e) => this.setState({ country: e.target.value })} value={this.state.country}>
                          {
                            this.state.countryList.map((country, index) => (
                              <option key={index} name='Nationality ' value={country.Country_Name}>{country.Country_Name}</option>
                            ))
                          }
                        </select>
                      </div>

                      <div className="form-group d-none">
                        <label className="control-label sr-only" >
                          ID Number
                        </label>
                        <input type='text' name="IDNumber" className="form-control" id='IDNumber'
                          required='' placeholder='Enter your ID Number' value= {localStorage.getItem('idNumber')}></input>
                        <p id="error" style={{ color: 'red' }}>{this.state.errorMessage}</p>
                      </div>
                      <div className="form-group d-none">
                        <label className="control-label sr-only" >
                          Your Email
                        </label>
                        <input
                          className="form-control"
                          name="UserEmail"
                          id="email"autoComplete="off"
                          required
                          value={localStorage.getItem('studentEmail')}
                          placeholder="Enter your email"
                          type="email" />
                      </div>

                      <div className="form-group">
                        <label className="control-label" >
                          Phone Number
                        </label>
                        <PhoneInput id='register-page-phone-number'required='' maxLength='15' minLength='15' placeholder="+27 123 15348" name="PhoneNumber" 
                          value={this.state.value}
                          onChange={() => this.setState({ value: this.state.value })} />
                      </div>
                      <div className="form-group">
                        <label className="control-label" >
                          Your Student Number
                        </label>
                        <input
                          className="form-control"
                          name="StudentNumber"
                          id="middle-name"
                          placeholder="Enter your Student Number"
                          type="text"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="control-label" >
                          Emergency Phone Number
                        </label>
                        <PhoneInput id='register-page-phone-number' placeholder="Emergency Contact No." name="EmergencyNumber" required=''
                          value={this.state.value}
                          onChange={() => this.setState({value: this.state.value })} />
                      </div>
                      <div className="form-group">
                        <label className="control-label" >
                          Medical Conditions
                        </label>
                        <input
                          className="form-control"
                          id="middle-name"
                          placeholder="Enter your Medical Condition"
                          type="text"
                          //defaultValue='none'
                          onChange={(e) => this.setState({ medicalConditions: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <input
                        className="form-check"
                        id="MarketingConcent"
                        //name='Concent'
                        onChange={(e)=>{this.changeMarketingConsent(e)}}
                        //placeholder="Enter Next of kin relation to you"
                        type="checkbox"
                        required
                      />
                      <p>I consent to receiving marketing content from Adowa Living.</p> 
                    </div>
                      <button className="btn btn-primary btn-lg btn-block" type="submit" onClick={(e) => this.Submit(e)}>
                        Continue
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
PersonalInformation.propTypes = {
};

const mapStateToProps = ({ navigationReducer, loginReducer }) => ({
  rubixUserID: navigationReducer.userID,
  rubixPlatformID: navigationReducer.rubixPlatformID,
  email: loginReducer.email,
  password: loginReducer.password,

  MyloadingController: navigationReducer.loadingController,
  loadingMessage: navigationReducer.loadingMessage,

  clientBG: navigationReducer.backImage,
});

export default connect(mapStateToProps, {
  updateUserID,
  updateStudentID,
  updatePlatformID,
  updatePassword,
  updateEmail,
  updateLoadingMessage,
  updateLoadingController,
  updateClientBackG,
})(PersonalInformation);
