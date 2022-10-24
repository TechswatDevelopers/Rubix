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
  //Submit Email
      Submit(e){
        e.preventDefault();
        //Set Loading Screen ON
     this.props.updateLoadingController(true);
     this.props.updateLoadingMessage("Submitting Information...");
        const email = document.getElementById('email').value;
        localStorage.setItem('studentEmail', email)
        //console.log(email)

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
          'RubixClientID': localStorage.getItem('clientID'),
      };

      //Check user exists
      const checkUser = async()=>{
        //Send email to DB
        await axios.post('https://rubixapi.cjstudents.co.za:88/api/RubixRegisterUserExists', userExistsData, requestOptions)
            .then(response => {
                //console.log(response.data)
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
                  }, 1000);
                  this.props.history.push("/logInformation")
                 } else {
                  this.setState({
                    title: "Error",
                    popMessage: 'User Already Exists',
                  })
                  //Set timer for loading screen
                setTimeout(() => {
                  this.props.updateLoadingController(false);
                }, 1000);
                  this.props.onPresPopUpEvent()
                 }
            })
      }
      checkUser()

      const postData = async()=>{
        //Ping email address
        await axios.post(' https://rubixpdf.cjstudents.co.za:94/validEmailCheck', pingData, requestOptions)
            .then(response => {
                //console.log(response.data.EmailResult )
                if(response.data.EmailResult){
                  this.props.updateEmail(email);
                  this.props.updatePlatformID("1");
                  localStorage.setItem('platformID', "1")
                  //Set timer for loading screen
                setTimeout(() => {
                  this.props.updateLoadingController(false);
                }, 1000);
                 this.props.history.push("/logInformation")
                 } else{
                  this.setState({
                    title: "Email validation failed",
                    popMessage: 'Invalid email, please enter a valid email address',
                  })
                  //Set timer for loading screen
                setTimeout(() => {
                  this.props.updateLoadingController(false);
                }, 1000);
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
    //console.log("client logo", this.props.clientBG)
  }
  render() {
    //const user = useContext(MyProvider);
    return (
      <div className={this.props.rubixThemeColor}>
      <Helmet>
              <meta charSet="utf-8" />
              <title>Register Email</title>
          </Helmet>
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
                    <div className="separator-linethrough">
                      <span>OR</span>
                    </div>
                    <GoogleLogin as={Col}
                        render={renderProps => (
                          <button className="btn btn-signin-social" onClick={renderProps.onClick} disabled={renderProps.disabled}><FaGoogle style = {{ color: "#EA4335 ", fontSize: "1.5em", paddingRight: "4px"}}/>Google</button>
                        )}
                          clientId="256115085565-b3k2c8gsuqc40vstp06r4cu0sb7kc5qs.apps.googleusercontent.com"
                          buttonText="Google"
                          onSuccess={this.responseGoogle}
                          cookiePolicy={'single_host_origin'}/>
                          
                    <FacebookLogin
                        appId="552332679301004"
                        fields="name,email,picture, first_name, about"
                        height='10'
                        textButton='Facebook'
                        size= 'medium'
                        icon = {<FaFacebook style = {{ color: "#1877f2 ", fontSize: "1.5em", paddingRight: "4px"}}/>}
                        callback={this.responseFacebook}
                        cssClass = "btn btn-signin-social" />

                        <InstagramLogin
                        clientId="552332679301004"
                        buttonText="Instagram"
                        width = '10px'
                        onSuccess={this.responseInstagram}
                        cssClass= "btn btn-signin-social"
                        >
                          <FaInstagram style = {{ color: "#cd486b", fontSize: "1.5em", paddingRight: "4px"}}/> Instagram
                          </InstagramLogin>
                    
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