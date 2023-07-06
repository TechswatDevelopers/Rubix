import React, { useContext } from "react";
import { connect } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import {Helmet} from "react-helmet";
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import {onPresPopUpEvent,
  updateClientBackG,
  updateLoadingMessage,
  updateLoadingController} from "../../actions";
import PopUpModal from "../../components/PopUpModal";
import { Tabs, Tab, Row, Col } from "react-bootstrap";

class NextOfKin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        userGender: 'Male',
        errorMessage: '',
        location: null,
        myUserID: null,
        userIPAddress: null,
        dateAndTime: null,
        isLoad: false,
        showSearch: false,
        consent: '0',
        value: 0

    };
  }
 Validate() {
    
  var idNumber = document.getElementById("IDNumber").value;

  // store the error div, to save typing
  var error = document.getElementById('error');

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
  ////console.log(year, month, day)

  // get first 6 digits as a valid date
  var tempDate = new Date(year, month - 1, day);

  var id_date = tempDate.getDate();
  var id_month = tempDate.getMonth();
  var id_year = tempDate.getFullYear();
  var right_month = id_month + 1;
  ////console.log(id_date, id_month, id_year)

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
      //error.append('ID number does not appear to be authentic - check digit is not valid');
      correct = false;
  }
  if (correct) {
      // and put together a result message
      //document.getElementById('result').append('<p>South African ID Number:   ' + idNumber + '</p><p>Birth Date:   ' + fullDate + '</p><p>Gender:  ' + gender + '</p><p>SA Citizen:  ' + citzenship + '</p>');
   } else {
    alert("Invalid ID Number, please correct ID Number and try again")
    this.setState({errorMessage: "Invalid ID Number, please enter a valid ID Number"})
  }
  return correct
}

//final submit check
 Submit(e){
   //Set timer for loading screen
  this.setState({
    isLoad: true
  })
  e.preventDefault();

  
  const form = document.getElementById('nof');
  //var idNumber = document.getElementById("IDNumber").value;
  var nextofKinEmail = document.getElementById("NextOfKinEmail").value;
  const studentID =  localStorage.getItem('studentIDNo')
  const studentEmail =  localStorage.getItem('email')

  if(this.state.location !=null){
    const locations = document.getElementById('location');
    const postCode = document.getElementById('post-code').value;
    const street_address = this.state.location['value']['structured_formatting']['main_text'] + ', ' + postCode
  
  const data = {
      'RubixRegisterUserID': this.state.myUserID,
      'RubixUserNextOfKinAddress': street_address,
      'Consent': this.state.consent,
  };

  for (let i=0; i < form.elements.length; i++) {
      const elem = form.elements[i];
      data[elem.name] = elem.value
  }

  const requestOptions = {
      title: 'Next of Kin Form',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
  };
  
  ////console.log("I am empty",data)
  const postData = async() => {
      if (studentEmail != nextofKinEmail){
          await axios.post('https://adowarest.rubix.mobi:88/api/RubixUserNextOfKins', data, requestOptions)
          .then(response => {
              ////console.log(response)
              if(response.data[0]['ResponceMessage'] == "Successfully Update Record"){
                
                setTimeout(() => {
                  this.props.updateLoadingController(false);
                }, 1000);
                //this.props.history.push("/relatives")
              //this.props.history.push("/relatives")
              setTimeout(() => {
                this.postStatus()
              }, 2000);
              }
              this.setState({
                isLoad: false
              })
          })
              
      } else{
        alert("Next of kin ID Number/Email cannot be the same as student Id Number/Email")
        this.setState({
          isLoad: false
        })
      }
  }
  postData().then(() => {

    //this.props.onPresPopUpEvent()
    //this.props.history.push("/login/" + localStorage.getItem('clientID'))
  })
} else if(document.getElementById('streetAddress') != null)  {
  ////console.log("called", )
  const data = {
    'RubixRegisterUserID': this.state.myUserID,
    'RubixNextOfKiniConsent': this.state.consent,
};
for (let i=0; i < form.elements.length; i++) {
    const elem = form.elements[i];
    data[elem.name] = elem.value
}

const requestOptions = {
    title: 'Next of Kin Form',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data
};

//console.log("I am empty",data)
const postData = async() => {
  if (studentEmail != nextofKinEmail){
      await axios.post('https://adowarest.rubix.mobi:88/api/RubixUserNextOfKins', data, requestOptions)
      .then(response => {
          ////console.log("Data returned: ", response)
            setTimeout(() => {
              this.props.updateLoadingController(false);
            }, 1000);
            //this.props.history.push("/relatives")
          //this.props.history.push("/relatives")
          setTimeout(() => {
            this.postStatus()
          }, 2000);
      })
          
  } else if(this.state.consent == '0'){
    alert("Please approve Credit Check Consent to continue")
    this.setState({
      isLoad: false
    })
  } 
  else{
    alert("Next of kin ID Number/Email cannot be the same as student Id Number/Email")
    this.setState({
      isLoad: false
    })
  }
}
postData().then(() => {
 
  //this.props.history.push("/login/" + localStorage.getItem('clientID'))
})
}

else{
  alert("Please a valid home address")
  this.setState({
    isLoad: false
  })
}
}


  //Posting Update status
  postStatus() {
    //Set Loading Screen ON
 this.props.updateLoadingController(true);
 this.props.updateLoadingMessage("Adding Status...");
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
    ////console.log('User data:', data)
    const postData = async () => {
      await axios.post('https://adowarest.rubix.mobi:88/api/RubixUpdateStatus', data, requestOptions)
        .then(response => {
          if(response != null || response != undefined){
      //Set timer for loading screen
    setTimeout(() => {
      this.props.updateLoadingController(false);
      this.setState({
        isLoad: false
      });
    }, 2000);
          }
          this.props.history.push("/login/" + localStorage.getItem('clientID') )
        })
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
    const userID = localStorage.getItem('userID');
    this.props.updateClientBackG(localStorage.getItem('clientBG'))
    this.setState({myUserID: userID});
    const DATE_OPTIONS = { year: 'numeric', month: 'long', day: 'numeric', time: 'long' };
    const myDate = new Date().toLocaleDateString('en-ZA', DATE_OPTIONS)
    const myTime = new Date().toLocaleTimeString('en-ZA')
    this.setState({ dateAndTime: myDate + myTime })

    this.props.updateLoadingController(true);
    this.props.updateLoadingMessage("Loading Details...");

    setTimeout(() => {
      this.props.updateLoadingController(false);
    }, 2000)

  }
  setLoadingPage(time,) {
    this.setState({ isLoad: true, })
    setTimeout(() => {
      this.setState({
        isLoad: false,
      })
    }, time);
  }
  //Show Search
  showSearch(e){
    e.preventDefault() 
    this.setState({showSearch: !this.state.showSearch})
  }
  //Change Consent
  changeConsent(e){
    ////console.log("My consent: ", e.target.value)
    if (e.target.value == 'on'){
      this.setState({
        consent: "1"
      })
    } else {
      this.setState({
        consent: "0"
      })
    }
  }

  render() {
    //const user = useContext(MyProvider);
    return (
      <div className="theme-grey">
      <Helmet>
            <meta charSet="utf-8" />
            <title>Parent/Guardian Details</title>
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
        
        <PopUpModal 
        Title= "Registration Complete!"
        Body = "Thank you for registering with Us. We have sent you an email to verify your account, please check your emails."
        Function ={()=>this.props.history.push("/login/" + localStorage.getItem('clientID'))}
        />
        <div className="page-loader-wrapper" style={{ display: this.state.isLoad ? 'block' : 'none' }}>
          <div className="loader">
            <div className="m-t-30"><img src={localStorage.getItem('clientLogo')} width="170" height="70" alt="Lucid" /></div>
            <p>Registering please wait...</p>
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
              }}
            >
              <div className="auth-box">
                <div className="card">
                <div className="top">
                  <img src={localStorage.getItem('clientLogo')} alt="" style={{ height: "40%",  width:"44%",  display: "block", margin: "auto" }} />
                </div>
                  <div className="header">
                    <h1 className="lead">Surety Details</h1>
                    <p className="text-secondary">Please fill in the following informaion regarding the person/organisation who stand surety for the tenant.</p>
                  
                  </div>
                  <div className="body">
                    <form id='nof' onSubmit={(e) => this.Submit(e)}>
                      <div className="form-group">
                        <label className="control-label" >
                        First Name(s)
                            </label>
                        <input
                          className="form-control"
                          id="RubixUserNextOfKinFirstName"
                          name='RubixUserNextOfKinFirstName'
                          placeholder="Enter Surety first name(s)"
                          type="text"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="control-label" >
                        Surname
                            </label>
                        <input
                          className="form-control"
                          id="RubixUserNextOfKinLastName"
                          name='RubixUserNextOfKinLastName'
                          placeholder="Enter Surety Surnme"
                          type="text"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="control-label" >
                        ID/Passport Number
                            </label>
                            <input type='number' name="RubixUserNextOfKinID" className='form-control' id='IDNumber' 
                    required=''  placeholder='Enter your ID Number'></input>
                    <p id="error" style={{color: 'red'}}>{this.state.errorMessage}</p>
                      </div>
                      
                      <div className="form-group">
                        <label className="control-label" >
                        Email
                            </label>
                        <input
                          className="form-control"
                          id="RubixUserNextOfKinEmail"
                          name='RubixUserNextOfKinEmail'
                          placeholder="Enter Surety Email Address"
                          type="email"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="control-label">
                        Next of kin Home Tellephone Number
                            </label>
                            <PhoneInput placeholder="Surety Home Tellephone Number" name="RubixUserNextOfKinHomeTell" className='RubixUserNextOfKinHomeTell' required='' 
                    value={this.state.value}
                    onChange={()=> this.setState({value: this.state.value})}/>
                      </div>

                      <div className="form-group">
                        <label className="control-label" >
                        Next of Kin Mobile Number
                            </label>
                            <PhoneInput placeholder="Surety Cell Phone Number" name="RubixUserNextOfKinPhoneNumber" className='NextOfKinPhoneNumber' required='' 
                    value={this.state.value}
                    onChange={()=> this.setState({value: this.state.value})}/>
                      </div>
                      <div className="form-group">
                        <label className="control-label" >
                          Home Address
                            </label>
                         {
                              !this.state.showSearch
                              ? <input
                              className="form-control"
                              name= "RubixUserNextOfKinAddress"
                              id= "streetAddress"
                              placeholder="Enter Surety Physical Address"
                              type="text"
                            />
                              :<GooglePlacesAutocomplete
apiKey="AIzaSyBoqU4KAy_r-4XWOvOiqj0o_EiuxLd9rdA" id='location' onChange = {(e)=>this.setState({location: e.target.value})}
selectProps={{
location: this.state.location,
onChange: (e)=>this.setState({location: e}),
placeholder: "Search Address"
}}
/>}
<button className="btn btn-primary btn-sm m-2" onClick={(e)=>this.showSearch(e)}><i className={this.state.showSearch ?"icon-note pr-2" :"icon-magnifier pr-2"}/>
{
                      this.state.showSearch 
                      ?'Type Address'
                      
                    : 'Search Address'}</button>
                            
<br/>
<div className="form-group">
                        <label className="control-label" >
                        Postal Code
                            </label>
                        <input
                          className="form-control"
                          name="RubixUserNextOfKinPostalcode"
                          id="post-code"
                          placeholder="Post Code"
                          type="text"
                          required/>
                      </div>
                      <div className="form-group">
                        <label className="control-label" >
                        Work Number
                            </label>
                            <PhoneInput placeholder="Surety Work number" name="RubixUserNextOfKinWorkNumber" className='RubixUserNextOfKinWorkNumber' required='' 
                    value={this.state.value}
                    onChange={()=> this.setState({value: this.state.value})}/>
                      </div>
                      </div>

                      <div className="form-group">
                        <label className="control-label" >
                        Relationship
                            </label>
                        <input
                          className="form-control"
                          id="NextOfKinEmail"
                          name='RubixUserNextOfKiniRelationship'
                          placeholder="Enter Surety's relation to you"
                          type="text"
                          required
                        />
                      </div>

                      <div className="form-group">
                          <input
                          className="form-check"
                          id="NextOfKiniConsent"
                          //name='NextOfKiniConsent'
                          onChange={(e)=>{this.changeConsent(e)}}
                          //placeholder="Enter Next of kin relation to you"
                          type="checkbox"
                          required
                        />
                        <p>I consent to a credit check.</p>
                      </div>
                      <button className="btn btn-primary btn-lg btn-block" onClick={(e) => this.Submit(e)}>
                        Register
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

NextOfKin.propTypes = {
};

const mapStateToProps = ({ navigationReducer,  loginReducer, mailInboxReducer }) => ({
  rubixStudentIDNo: navigationReducer.studentIDNo,
  rubixUserID: navigationReducer.userID,
  email: loginReducer.email,
  password: loginReducer.password,
  isPopUpModal: mailInboxReducer.isPopUpModal,
    
  clientBG: navigationReducer.backImage,

  MyloadingController: navigationReducer.loadingController,
  loadingMessage: navigationReducer.loadingMessage,
});

export default connect(mapStateToProps, {
  onPresPopUpEvent,
  updateClientBackG,
  updateLoadingMessage,
  updateLoadingController
})(NextOfKin);
