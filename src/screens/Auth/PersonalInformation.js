import React from "react";
import { connect } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css';
import axios from "axios";
import {updateEmail, updatePassword, updateUserID, updatePlatformID, updateStudentID } from "../../actions";

class PersonalInformation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        userGender: 'Male',
        medicalConditions: 'None',
        errorMessage: '',
        countryList: [],
        value: 0

    };
  }
 Validate() {
    
    var idNumber = document.getElementById("IDNumber").value;

    // store the error div, to save typing
    var error = document.getElementById('error');
    //console.log("ID number is ",idNumber);

    // assume everything is correct and if it later turns out not to be, just set this to false
    var correct = true;

    //Ref: http://www.sadev.co.za/content/what-south-african-id-number-made
    // SA ID Number have to be 13 digits, so check the length
    if (idNumber.length != 13 ) {
        //error.append('ID number does not appear to be authentic - input not a valid number.');
        correct = false;
    }

    //Extract first 6 digits
    var year = idNumber.substring(0, 2);
    var month = idNumber.substring(2, 4);
    var day = idNumber.substring(4, 6);
    //console.log(year, month, day)

    // get first 6 digits as a valid date
    var tempDate = new Date(year, month - 1, day);

    var id_date = tempDate.getDate();
    var id_month = tempDate.getMonth();
    var id_year = tempDate.getFullYear();
    var right_month = id_month + 1;
    //console.log(id_date, id_month, id_year)

    var fullDate = id_date + "-" + right_month + "-" + id_year;

    if (!((tempDate.getYear() == idNumber.substring(0, 2)) && (id_month == idNumber.substring(2, 4) - 1) && (id_date == idNumber.substring(4, 6)))) {
        //error.append('ID number does not appear to be authentic - date part not valid. ');
        correct = false;
    }

    // get the gender
    var genderCode = idNumber.substring(6, 10);
    var gender = parseInt(genderCode) < 5000 ? "Female" : "Male";
    this.setState({userGender: gender})
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
      this.setState({errorMessage: "Invalid ID Number, please enter a valid ID Number"})
    }
    return correct
}
//final submit check
 Submit(e){
    e.preventDefault();
    //console.log("User email:", this.props.email)
    var idNumber = document.getElementById("IDNumber").value;
    const form = document.getElementById('register');
    const data = {
        'ClientID': '1',
        'PlatformID': '1',
        'RubixUserPlatformID': this.props.rubixUserID,
        'RubixRegisterUserID': '',
        'MedicalConditions': this.state.medicalConditions,
        'Gender': this.state.userGender,
    };
    for (let i=0; i < form.elements.length; i++) {
        const elem = form.elements[i];
        data[elem.name] = elem.value
    }
    const requestOptions = {
        title: 'Student Personal Details',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data
    };
    console.log(data)
    const postData = async()=>{
        if (this.Validate() && this.state.userGender != null  && document.getElementById('register').checkValidity() == true){
            await axios.post('http://192.168.88.10:3300/api/RubixRegisterUsers', data, requestOptions)
            .then(response => {
                console.log(response)
                this.props.updateStudentID(idNumber)
                localStorage.setItem('studentIDNo', idNumber)
                this.props.updateUserID(response.data.PostRubixUserData[0].RubixRegisterUserID)
                this.props.history.push("/addresses")
            })
                
        } else{
          alert("Please ensure that you entered all required information")
        }
    }
    postData()
}
  componentDidMount(){
    document.body.classList.remove("theme-cyan");
    document.body.classList.remove("theme-purple");
    document.body.classList.remove("theme-blue");
    document.body.classList.remove("theme-green");
    document.body.classList.remove("theme-orange");
    document.body.classList.remove("theme-blush");

    //Fetch Data
    const fetchData = async() =>{
      //Fetch Countries List
      await fetch('http://192.168.88.10:3300/api/RubixCountries')
      .then(response => response.json())
      .then(data => {
          //console.log("data is ", data.data)
          this.setState({countryList: data.data})
          //console.log("this is the countryList:", this.state.countryList)
          //setCountryList(data.data)
          });
        }
        fetchData()
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
                    <p className="lead">Student User Details</p>
                  </div>
                  
                  <div className="body">
                    <form id='register' onSubmit={(e) => this.Submit(e) }>
                      <div className="form-group">
                        <label className="control-label sr-only" >
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
                        <label className="control-label sr-only" >
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
                        <label className="control-label sr-only" >
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
                        <label className="control-label sr-only" >
                        Country:
                            </label>
                            <select className="form-control" onChange={(e)=>this.setState({country: e.target.value})} value={this.state.country}>
        {
         this.state.countryList.map((country, index)=> (
            <option key={index} name='Nationality ' value = {country.Country_Name}>{country.Country_Name}</option>
        ))   
        }
        </select> 
                      </div>

                      <div className="form-group">
                        <label className="control-label sr-only" >
                          ID Number
                            </label>
                            <input type='number' name="IDNumber" className="form-control" id='IDNumber' 
                    required='' maxLength = '13' minLength='13' placeholder='Enter your ID Number'></input>
                    <p id="error" style={{color: 'red'}}>{this.state.errorMessage}</p>
                      </div>
                      <div className="form-group">
                        <label className="control-label sr-only" >
                         Your Email
                            </label>
                        <input
                          className="form-control"
                          name="UserEmail"
                          id="email"
                          value = {this.props.email}
                          readOnly
                          placeholder="Enter your email"
                          type="email"/>
                      </div>

                      <div className="form-group">
                        <label className="control-label sr-only" >
                          Password
                            </label>
                        <input
                          className="form-control"
                          name="Password"
                          id="signup-password"
                          defaultValue = {this.props.password}
                          placeholder="Password"
                          type="password"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="control-label sr-only" >
                          Phone Number
                            </label>
                            <PhoneInput id = 'register-page-phone-number' placeholder="+27 123 15348" name="PhoneNumber"  required='' 
                    value={this.state.value}
                    onChange={()=> this.setState({value: this.state.value})} />
                      </div>
                      <div className="form-group">
                        <label className="control-label sr-only" >
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
                        <label className="control-label sr-only" >
                          Medical Conditions:
                            </label>
                        <input
                          className="form-control"
                          //name="MedicalConditions"
                          id="middle-name"
                          placeholder="Enter your Medical Condition"
                          type="text"
                          //defaultValue='none'
                          onChange ={(e)=>this.setState({medicalConditions: e.target.value})}
                        />
                      </div>
                      <button className="btn btn-primary btn-lg btn-block" type="submit" onClick={(e) => this.Submit(e) }>
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
  password: loginReducer.password
});
 
export default connect(mapStateToProps, {
  updateUserID,
  updateStudentID,
  updatePlatformID,
  updatePassword,
  updateEmail,
})(PersonalInformation);
