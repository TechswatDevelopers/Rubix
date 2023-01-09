import React, { useContext } from "react";
import { connect } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from "../../assets/images/logo-white.svg";
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import InstagramLogin from "react-instagram-login";
import { FaFacebook, FaGoogle, FaInstagram } from "react-icons/fa";
import axios from "axios";
import {Helmet} from "react-helmet";
import {Grid, Row, Col, Button} from "react-bootstrap";
import MContext from "../../App";
import MyProvider from "../../App";
import navigationReducer from "../../reducers/navigationReducer";
import {updateEmail, updatePassword, updateUserID,
  updateClientBackG, updatePlatformID, updateClientID, onPresPopUpEvent, updateLoadingController, updateLoadingMessage } from "../../actions";
import PopUpModal from "../../components/PopUpModal"

class Registration extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      popMessage: '',
      myFunction: null,
      errorMessage: '',
      userGender: 'Male',
    }
  }

    //Google response for testing
 responseGoogle = (response) => {
  localStorage.setItem('platformID', "2")
  this.props.updateEmail(response.profileObj.email);
  localStorage.setItem('studentEmail', response.profileObj.email)
  localStorage.setItem('userplatformID', response['googleId'])
  this.props.updatePlatformID("2");
   this.props.updateUserID(response['googleId'])
   this.props.history.push("/logInformation")
}
  //Facebook response for testing
   responseFacebook = (response) => {
    this.props.updatePlatformID("3");
    localStorage.setItem('platformID', "3")
    localStorage.setItem('userplatformID', response['id'])
    this.props.updateUserID(response['id'])
    this.props.history.push("/logInformation")
  }
  //Instagram response
 responseInstagram = (response) => {
  this.props.updatePlatformID("4");
  localStorage.setItem('platformID', "4")
  localStorage.setItem('userplatformID', response['id'])
  this.props.updateUserID(response['id'])
  this.props.history.push("/logInformation")
}



  ///Validate ID numbers
  Validate() {
    var idNumber = document.getElementById("idNumber").value;
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
    ////console.log(id_date, id_month, id_year)

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
  //Submit Email
      Submit(e){
        e.preventDefault();
        //Set Loading Screen ON
     this.props.updateLoadingController(true);
     localStorage.setItem('userplatformID', ' ')
     this.props.updateLoadingMessage("Submitting Information...");
        const email = document.getElementById('email').value;
        const idNumber = document.getElementById('idNumber').value;
        localStorage.setItem('idNumber', idNumber)
        localStorage.setItem('studentEmail', email)
        ////console.log(email)

        // PingRequest data
        const pingData = {
          'Emailcheck': email,
      };
        //Ping Request Headers
        const requestOptions = {
          title: 'Email Check Details',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: pingData
      };

        // User Exists Request data
        const userExistsData = {
          'UserEmail': email,
          'IDNumber': idNumber,
          'RubixClientID': localStorage.getItem('clientID'),
      };
      ////console.log("The Call: ", userExistsData)

      //Check user exists
      const checkUser = async()=>{
        //Send email to DB
        await axios.post('https://jjprest.rubix.mobi:88/api/RubixRegisterUserExists', userExistsData, requestOptions)
            .then(response => {
                ////console.log("The response: ",response.data)
                /*If User exists on DB:
                1. If Response is equal to Zero and Rubix User ID is null, then the user does not exist on DB
                2. If Response is equal to Zero and Rubix User ID exists, then the user exists but has incomplete information on DB
                3. If Response is equal to One, then the user exists on the DB
                */
                if(response.data.PostRubixUserData[0].Response === '0' && response.data.PostRubixUserData[0].RubixRegisterUserID == null ){
                  postData()
                 } else if(response.data.PostRubixUserData[0].Response === '0' && response.data.PostRubixUserData[0].RubixRegisterUserID != null){
                  localStorage.setItem('userID', response.data.PostRubixUserData[0].RubixRegisterUserID)
                    //Set timer for loading screen
                  setTimeout(() => {
                    this.props.updateLoadingController(false);
                  }, 3000);
                  this.props.history.push("/logInformation")
                 } else {
                  this.setState({
                    title: "Error",
                    popMessage: 'User Already Exists',
                  })
                  //Set timer for loading screen
                setTimeout(() => {
                  this.props.updateLoadingController(false);
                }, 3000);
                  this.props.onPresPopUpEvent()
                 }
            })
      }
      if(this.Validate()){
        checkUser()
      } else {
        this.setState({
          title: "Error",
          popMessage: 'Invalid ID',
        })
        //Set timer for loading screen
      setTimeout(() => {
        this.props.updateLoadingController(false);
      }, 3000);
        this.props.onPresPopUpEvent()
       }

      const postData = async()=>{
        //Ping email address
        await axios.post('https://jjprest.rubix.mobi:88/api/RubixEmailCheck', pingData, requestOptions)
            .then(response => {
                ////console.log(response.data.EmailResult )
                if(response.data.EmailResult){
                  this.props.updateEmail(email);
                  this.props.updatePlatformID("1");
                  localStorage.setItem('platformID', "1")
                  //Set timer for loading screen
                setTimeout(() => {
                  this.props.updateLoadingController(false);
                }, 3000);
                 this.props.history.push("/logInformation")
                 } else{
                  this.setState({
                    title: "Email validation failed",
                    popMessage: 'Invalid email, please enter a valid email address',
                  })
                  //Set timer for loading screen
                setTimeout(() => {
                  this.props.updateLoadingController(false);
                }, 3000);
                  this.props.onPresPopUpEvent()
                 }
            })
          }
      }


  componentDidMount(){
    document.body.classList.remove("theme-cyan");
    document.body.classList.remove("theme-purple");
    document.body.classList.remove("theme-blue");
    document.body.classList.remove("theme-green");
    document.body.classList.remove("theme-orange");
    document.body.classList.remove("theme-blush");

    this.props.updateClientBackG(localStorage.getItem('clientBG'))
    ////console.log("client logo", this.props.clientBG)
  }
  render() {
    //const user = useContext(MyProvider);
    return (
      <div className={ "theme-grey"/* this.props.rubixThemeColor */}>
      <Helmet>
              <meta charSet="utf-8" />
              <title>Register Email</title>
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
        <PopUpModal 
        Title= {this.state.title}
        Body = {this.state.popMessage}
        Function = {()=>this.state.myFunction}
        />
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
                  <img src={localStorage.getItem('clientLogo')} alt="" style={{height: "40%",  width:"44%", display: "block", margin: "auto" }} />
                </div>
                  <div className="header">
                    <p className="lead">Registration</p>
                  </div>
                  <div className="body">
                    <form onSubmit = {(e) => this.Submit(e)}>
                      <div className="form-group">
                        <label className="control-label sr-only" >
                          Email
                            </label>
                        <input
                          className="form-control"
                          id="email"
                          placeholder="Your email"
                          type="email"
                        />
                      </div>
                      <div className="form-group">
                        <label className="control-label sr-only" >
                          ID Number
                        </label>
                        <input type='number' name="idNumber" className="form-control" id='idNumber'
                          required='' maxLength='13' minLength='13' placeholder='Enter your ID Number' ></input>
                        <p id="error" style={{ color: 'red' }}>{this.state.errorMessage}</p>
                      </div>
                      
                      <button className="btn btn-primary btn-lg btn-block" onClick={(e) => this.Submit(e)}>
                        Continue
                        </button>
                  <br></br>
                      <div className="bottom">
                        <span className="helper-text">
                          Already have an account?{" "}
                          <a href={"/login/"+ localStorage.getItem('clientID')}>Login</a>
                        </span>
                      </div>
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

 Registration.propTypes = {
};
const mapStateToProps = ({ navigationReducer, loginReducer, mailInboxReducer }) => ({
  rubixUserID: navigationReducer.userID,
  rubixPlatformID: navigationReducer.rubixPlatformID,
  email: loginReducer.email,
  password: loginReducer.password,
  rubixClientID: navigationReducer.clientID,
  rubixThemeColor: navigationReducer.themeColor,
  isPopUpModal: mailInboxReducer.isPopUpModal,
  MyloadingController: navigationReducer.loadingController,
  loadingMessage: navigationReducer.loadingMessage,

  clientBG: navigationReducer.backImage,
});

export default connect(mapStateToProps, {
  updateUserID,
  updatePlatformID,
  updatePassword,
  updateEmail,
  onPresPopUpEvent,
  updateClientBackG,
  updateLoadingController,
  updateLoadingMessage,
})(Registration);