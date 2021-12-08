import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from "../assets/images/logo-white.svg";
import { updateEmail, updatePassword,onLoggedin, updateUserID, 
  updateClientID,onPressThemeColor,updateClientName, updateClientLogo } from "../actions";
import { useHistory } from "react-router-dom";
import axios from "axios";
import {Grid, Row, Col, Button} from "react-bootstrap";
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import InstagramLogin from "react-instagram-login";
import { FaFacebook, FaGoogle, FaInstagram } from "react-icons/fa";

class Login extends React.Component {

//Initial State
constructor(props) {
  super(props)
  this.state = {
    isLoad: true,
    currentClientId: null,
    errorMessage: '',
  }
}

//Initial Loading
componentDidMount() {
  //Set timer for loading screen
  setTimeout(() => {
    this.setState({
      isLoad: false,
      currentClientId: this.props.match.params.clientID
    })
  }, 2000);

  //Save client ID to local Storage
  localStorage.setItem('clientID', this.props.match.params.clientID)
  this.setThemeColor(this.props.match.params.clientID)
  document.body.classList.remove("theme-cyan");
  document.body.classList.remove("theme-purple");
  document.body.classList.remove("theme-blue");
  document.body.classList.remove("theme-green");
  document.body.classList.remove("theme-orange");
  document.body.classList.remove("theme-blush");
}

//final submit check
     Submit(e){
      e.preventDefault();
      const form = document.getElementById('login');
      const data = {
      };
      for (let i=0; i < form.elements.length; i++) {
          const elem = form.elements[i];
          data[elem.name] = elem.value
      }
  
      const requestOptions = {
          title: 'Login Form',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: data
      };
      console.log(data)
      const postData = async() => {

          if (document.getElementById('login').checkValidity() == true){
              await axios.post('https://rubixapidev.cjstudents.co.za:88/api/RubixLogin', data, requestOptions)
              .then(response => {
                  console.log(response)
                  if(response.data.PostRubixUserData['0']['Response'] == 1){
                    this.props.updateUserID(response.data.PostRubixUserData['0']['RubixRegisterUserID'])
                    localStorage.setItem('userID', response.data.PostRubixUserData['0']['RubixRegisterUserID'])
                    this.props.history.push("/dashboard")
                  } else {
                    this.props.history.push("/login/" +  this.props.match.params.clientID)
                    this.setState({errorMessage: 'You have entered an incorrect Email/Pasword.'})
                  }
              })
          } else{
              
              console.log("checkValidity ", document.getElementById('nof').checkValidity())
          }
      }
      postData()
  }

  //Login Using Social Media
   SocialMediaLogin(userId){
    const data = {
      'RubixUserPlatformID': userId
    };
    const requestOptions = {
      title: 'Login Form',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
  };
    const postData = async() => {
      await axios.post('https://rubixapidev.cjstudents.co.za:88/api/RubixLogin', data, requestOptions)
      .then(response => {
        console.log(response)
        console.log("checking data",response.data)
          if(response.data.PostRubixUserData['0']['Response'] == 1){
            console.log("This is the data:", response.data)
            localStorage.setItem('userID', response.data.PostRubixUserData['0']['RubixRegisterUserID'])
            this.props.history.push("/dashboard" )
          } else {
            alert("The email is not registered. Please use registration portal to create account")
            this.props.history.push("/login/" + this.props.match.params.clientID )
          }
          
      })
     
    }
    postData();
  }

    //Google response for testing
 responseGoogle = (response) => {
   //console.log("I am called")
  this.SocialMediaLogin(response['googleId'])
}
  //Facebook response for testing
   responseFacebook = (response) => {
    this.SocialMediaLogin(response['id'])
  }
  //Instagram response
 responseInstagram = (response) => {
  this.SocialMediaLogin(response['id'])
}

  //Set Theme Color
  setThemeColor(client){
    switch(client){
      case '1':{
        this.props.updateClientLogo('CJ-Logo.png')
        this.props.updateClientName('CJ Students')
        this.props.onPressThemeColor('orange')

        localStorage.setItem('clientLogo', 'CJ-Logo.png')
        localStorage.setItem('clientName', 'CJ Students')
        localStorage.setItem('clientTheme', 'orange')
      }
        break
      case '2': {
      this.props.onPressThemeColor('purple')
      this.props.updateClientLogo('opal.png')
      this.props.updateClientName('Opal Students')

      localStorage.setItem('clientLogo', 'opal.png')
      localStorage.setItem('clientName', 'Opal Students')
      localStorage.setItem('clientTheme', 'purple')
    }
    }
    console.log('client:', this.props.rubixClientLogo)
  }

  
  render() {
    const { navigation } = this.props;
    const { email, password } = this.props;
    return (
      <div className={this.props.rubixThemeColor}>
        <div className="page-loader-wrapper" style={{ display: this.state.isLoad ? 'block' : 'none' }}>
          <div className="loader">
            <div className="m-t-30"><img src={this.props.rubixClientLogo} width="170" height="70" alt="Lucid" /></div>
            <p>Please wait...</p>
          </div>
        </div>
        <div className="hide-border">
          <div className="vertical-align-wrap">
            <div className="vertical-align-middle auth-main">
              <div className="auth-box">

                <form id='login' onSubmit = {(e) => this.Submit(this)}>
                <div className="card">
                <div className="top">
                  <img src={this.props.rubixClientLogo} alt="Lucid" style={{ height: "40px", margin: "10px" }} />
                </div>
                  <div className="header">
                    <p className="lead">Login to your {this.props.rubixClientName} account</p>
                    </div>
                  <div className="body">
                    <div className="form-auth-small" action="index.html">
                      <div className="form-group">
                        <label className="control-label sr-only">Email</label>
                        <input
                          className="form-control"
                          id="UserEmail"
                          placeholder="UserEmail"
                          type="email"
                          name = 'UserEmail'
                          required = ''
                        />
                      </div>
                      <div className="form-group">
                        <label className="control-label sr-only">
                          Password
                        </label>
                        <input
                          className="form-control"
                          id="UserPass"
                          placeholder="Password"
                          type="password"
                          name = 'UserPass'
                          required = ''
                        />
                      </div>
                      <p id="error" style={{color: 'red'}}>{this.state.errorMessage}</p>
                      <button onClick = {(e) => this.Submit(e)} className="btn btn-primary btn-lg btn-block" >Login Now</button>
                      <p className="helper-text m-b-10 bottom">Or Login Using:</p>

                      <GoogleLogin as={Col}
                        render={renderProps => (
                          <button className="btn btn-signin-social" onClick={renderProps.onClick} disabled={renderProps.disabled}><FaGoogle style = {{ color: "#EA4335 ", fontSize: "1.5em", paddingRight: "4px"}}/>Google</button>
                        )}
                          clientId="256115085565-b3k2c8gsuqc40vstp06r4cu0sb7kc5qs.apps.googleusercontent.com"
                          buttonText="Google"
                          onSuccess={this.responseGoogle}
                          cookiePolicy={'single_host_origin'}/>
                          
                          <FacebookLogin
                        appId=  "552332679301004"  //"284158963537717"
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

                      <div className="bottom">
                        <span className="helper-text m-b-10">
                          <i className="fa fa-lock"></i>{" "}
                          <a href={`${process.env.PUBLIC_URL}/forgotpassword`} 
                          >
                            Forgot password?
                          </a>
                        </span>
                        
                        <span>
                          Don't have an account?{" "}
                          <a href="registration" >Register</a>
                        </span>

                        {/* <button type="button" onClick={()=>{this.props.onPressThemeColor("blue"); this.props.history.push("/registration")}}>Login with C-Ges</button>
                        <br></br>
                  <button type="button" onClick={()=>{this.props.onPressThemeColor("orange"); this.props.history.push("/registration")}}>Login with Opal</button>
                       */}</div>
                    </div>
                  </div>
                </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  // updateEmail: PropTypes.func.isRequired,
  // updatePassword: PropTypes.func.isRequired,
  // email: PropTypes.string.isRequired,
  // password: PropTypes.string.isRequired
};

const mapStateToProps = ({navigationReducer, loginReducer}) => ({
  rubixUserID: navigationReducer.userID,
  myMessage: loginReducer.customMessageOnLogin,
  rubixThemeColor: navigationReducer.themeColor,
  rubixClientName: navigationReducer.clientName,
  rubixClientLogo: navigationReducer.clientLogo,
});

export default connect(mapStateToProps, {
  updateUserID,
  updateClientID,
  onPressThemeColor,
  updateClientLogo,
  updateClientName,
})(Login);
