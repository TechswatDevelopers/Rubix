import React, { useContext } from "react";
import { connect } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from "../../assets/images/logo-white.svg";
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import InstagramLogin from "react-instagram-login";
import { FaFacebook, FaGoogle, FaInstagram } from "react-icons/fa";
import axios from "axios";
import {Grid, Row, Col, Button} from "react-bootstrap";
import MContext from "../../App";
import MyProvider from "../../App";

class Registration extends React.Component {
  //const [emailError, setEmailError] = useState();
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
      await axios.post('http://197.242.69.18:3300/api/RubixLogin', data, requestOptions)
      .then(response => {
        console.log(response)
        console.log("checking data",response.data)
          if(response.data['0']['Response'] == 1){
            //console.log("I am also called")
            console.log(response)
            this.props.history.push("/logInformation" )
          } else {
            this.props.history.push("/" )
          }
          
      })
     
    }
    postData();
  }

    //Google response for testing
 responseGoogle = (response) => {
   console.log("I am called")
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
  //Submit Email
      Submit(e){
        console.log("Submit function is called")
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
  
       if(email != null && password != null){
         //this.MyProvider.setEmail(email)
         //console.log("this is the email", this.context.email)
        this.props.history.push("/logInformation")
        } else{
          //setEmailError('Enter valid Email!')
      console.log('Email validation failed')
        }
      }
  componentDidMount(){
    document.body.classList.remove("theme-cyan");
    document.body.classList.remove("theme-purple");
    document.body.classList.remove("theme-blue");
    document.body.classList.remove("theme-green");
    document.body.classList.remove("theme-orange");
    document.body.classList.remove("theme-blush");
  }
  render() {
    //const user = useContext(MyProvider);
    return (
      <div className="theme-purple">
        <div >
          <div className="vertical-align-wrap">
            <div className="vertical-align-middle auth-main">
              <div className="auth-box">
                
                <div className="card">
                <div className="top">
                  <img src="CJ-Logo.png" alt="Lucid" style={{ height: "50px", margin: "10px", display: "block", margin: "auto" }} />
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
                          Password
                            </label>
                        <input
                          className="form-control"
                          id="password"
                          placeholder="Password"
                          type="password"
                        />
                      </div>
                      <button className="btn btn-primary btn-lg btn-block" onClick={(e) => this.Submit(e)}>
                        Continue
                        </button>
                      <div className="bottom">
                        <span className="helper-text">
                          Already have an account?{" "}
                          <a href="/studentInfo">Login</a>
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
                        appId="284158963537717"
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

/* Registration.propTypes = {
};

const mapStateToProps = ({ loginReducer }) => ({
  email: loginReducer.email,
  password: loginReducer.password
}); */

export default Registration;
