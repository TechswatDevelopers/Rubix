import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css";
import Logo from "../assets/images/logo-white.svg";
import {
  updateEmail,
  updatePassword,
  onLoggedin,
  updateUserID,
  updateClientID,
  onPressThemeColor,
  updateClientName,
  updateClientLogo,
  updateLoadingMessage,
  updateLoadingController,
  updateClientBackG,
  updateStudentName,
} from "../actions";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Grid, Row, Col, Button } from "react-bootstrap";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login";
import InstagramLogin from "react-instagram-login";
import { FaFacebook, FaGoogle, FaInstagram } from "react-icons/fa";
import { Helmet } from "react-helmet";

class Login extends React.Component {
  //Initial State
  constructor(props) {
    super(props);
    this.state = {
      isLoad: true,
      currentClientId: "1",
      errorMessage: "",
      isAdmin: false,
      backImage: "cj_bg.png",
      pageTitle: "Login",
    };
  }

  //Initial Loading
  componentDidMount() {
    //Set Loading Screen ON
    this.props.updateLoadingController(true);
    this.props.updateLoadingMessage("Setting everything up...");

    //Set timer for loading screen
    setTimeout(() => {
      this.props.updateLoadingController(false);
    }, 3000);

    //Add redirect
    if (
      this.props.match.params.clientID != null ||
      this.props.match.params.clientID != undefined
    ) {
      this.setState({
        currentClientId: this.props.match.params.clientID,
      });
      localStorage.setItem("clientID", this.props.match.params.clientID);
      this.setThemeColor(this.props.match.params.clientID);
    } else {
      localStorage.setItem("clientID", this.state.currentClientId);
      this.setThemeColor(this.state.currentClientId);
      //this.props.history.push('/login/1')
    }

    document.body.classList.remove("theme-cyan");
    document.body.classList.remove("theme-purple");
    document.body.classList.remove("theme-blue");
    document.body.classList.remove("theme-green");
    document.body.classList.remove("theme-orange");
    document.body.classList.remove("theme-blush");
  }

  //final submit check
  Submit(e) {
    e.preventDefault();

    //Set Loading Screen ON
    this.props.updateLoadingController(true);
    this.props.updateLoadingMessage("Logging In...");

    const form = document.getElementById("login");
    const data = {
      RubixClientID: localStorage.getItem("clientID"),
    };
    for (let i = 0; i < form.elements.length; i++) {
      const elem = form.elements[i];
      data[elem.name] = elem.value;
    }

    const requestOptions = {
      title: "Login Form",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: data,
    };
    console.log(data);
    const postData = async () => {
      if (document.getElementById("login").checkValidity() == true) {
        await axios
          .post(
            "https://rubixapi.cjstudents.co.za:88/api/RubixLogin",
            data,
            requestOptions
          )
          .then((response) => {
            console.log(response);
            if (response.data.PostRubixUserData["0"]["Response"] == 1) {
              this.props.updateUserID(
                response.data.PostRubixUserData["0"]["RubixRegisterUserID"]
              );
              localStorage.setItem(
                "userID",
                response.data.PostRubixUserData["0"]["RubixRegisterUserID"]
              );
              localStorage.setItem("role", "student");
              localStorage.setItem(
                "resID",
                response.data.PostRubixUserData["0"]["RubixResidenceID"]
              );
              this.props.updateStudentName(response.data.PostRubixUserData["0"]["Name"] + " " + response.data.PostRubixUserData["0"]["Surname"])
              localStorage.setItem("studentName", response.data.PostRubixUserData["0"]["Name"] + " " + response.data.PostRubixUserData["0"]["Surname"])
              //Set timer for loading screen
              setTimeout(() => {
                this.props.updateLoadingController(false);
                this.props.history.push("/dashboard");
              }, 2000);
            } else {
              //Set timer for loading screen
              setTimeout(() => {
                this.props.updateLoadingController(false);
                this.props.history.push("/login/" + this.state.currentClientId);
              }, 2000);
              this.setState({
                errorMessage: response.data.PostRubixUserData["0"].Message,
              });
            }
          });
      } else {
        console.log(
          "checkValidity ",
          document.getElementById("login").checkValidity()
        );
      }
    };
    postData();
  }
  //final submit check
  LoginToAdmin(e) {
    e.preventDefault();

    //Set Loading Screen ON
    this.props.updateLoadingController(true);
    this.props.updateLoadingMessage("Logging In...");

    const form = document.getElementById("login");
    const data = {};
    for (let i = 0; i < form.elements.length; i++) {
      const elem = form.elements[i];
      data[elem.name] = elem.value;
    }

    const requestOptions = {
      title: "Login Form",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: data,
    };
    console.log(data);
    const postData = async () => {
      if (document.getElementById("login").checkValidity() == true) {
        await axios
          .post(
            "https://rubixapi.cjstudents.co.za:88/api/RubixAdminUserLogin",
            data,
            requestOptions
          )
          .then((response) => {
            console.log("Logging info: ", response);
            if (response.data.PostRubixUserData["0"]["Response"] == 1) {
              this.props.updateUserID(
                response.data.PostRubixUserData["0"]["RubixRegisterUserID"]
              );
              localStorage.setItem(
                "userCode",
                response.data.PostRubixUserData["0"]["UserCode"]
              );
              localStorage.setItem(
                "adminLevel",
                response.data.PostRubixUserData["0"]["AdminUserLevel"]
              );
              localStorage.setItem("role", "admin");
              localStorage.setItem(
                "resID",
                response.data.PostRubixUserData["0"]["RubixResidenceID"]
              );
              //Set timer for loading screen
              setTimeout(() => {
                this.props.updateLoadingController(false);
                this.props.history.push("/dashboard");
              }, 3000);
            } else {
              //Set timer for loading screen
              setTimeout(() => {
                this.props.updateLoadingController(false);
                this.props.history.push("/login/" + this.state.currentClientId);
              }, 3000);
              this.setState({
                errorMessage: response.data.PostRubixUserData["0"]["message"],
              });
            }
          });
      } else {
        console.log(
          "checkValidity ",
          document.getElementById("login").checkValidity()
        );
      }
    };
    postData();
  }

  //Login Using Social Media
  SocialMediaLogin(userId) {
    //Set Loading Screen ON
    this.props.updateLoadingController(true);
    const data = {
      RubixUserPlatformID: userId,
      RubixClientID: localStorage.getItem("clientID"),
    };
    const requestOptions = {
      title: "Login Form",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: data,
    };
    const postData = async () => {
      await axios
        .post(
          "https://rubixapi.cjstudents.co.za:88/api/RubixLogin",
          data,
          requestOptions
        )
        .then((response) => {
          console.log(response);
          console.log("checking data", response.data);
          if (response.data.PostRubixUserData["0"]["Response"] == 1) {
            this.props.updateUserID(
              response.data.PostRubixUserData["0"]["RubixRegisterUserID"]
            );
            localStorage.setItem(
              "userID",
              response.data.PostRubixUserData["0"]["RubixRegisterUserID"]
            );
            localStorage.setItem(
              "resID",
              response.data.PostRubixUserData["0"]["RubixResidenceID"]
            );
            localStorage.setItem("role", "student");
            //Set timer for loading screen
            setTimeout(() => {
              this.props.updateLoadingController(false);
              this.props.history.push("/dashboard");
            }, 3000);
          } else {//Set timer for loading screen
            setTimeout(() => {
              this.props.updateLoadingController(false);
              this.props.history.push("/logInformation");
            }, 3000);
            this.setState({
              errorMessage:
                "The email entered does not exist or has not been valdated.",
            });
          }
        });
    };
    postData();
  }

  //Google response for testing
  responseGoogle = (response) => {
    //console.log("I am called")
    localStorage.setItem("platformID", "2");
    this.props.updateEmail(response.profileObj.email);
    localStorage.setItem("studentEmail", response.profileObj.email);
    localStorage.setItem("userplatformID", response["googleId"]);
    this.SocialMediaLogin(response["googleId"]);
  };
  //Facebook response for testing
  responseFacebook = (response) => {
    this.props.updatePlatformID("3");
    localStorage.setItem("platformID", "3");
    localStorage.setItem("userplatformID", response["id"]);
    this.SocialMediaLogin(response["id"]);
  };
  //Instagram response
  responseInstagram = (response) => {
    localStorage.setItem("platformID", "4");
    localStorage.setItem("userplatformID", response["id"]);
    this.SocialMediaLogin(response["id"]);
  };

  //Set Theme Color
  setThemeColor(client) {
    switch (client) {
      case "1":
        {
          this.props.updateClientLogo("CJ-Logo4.png");
          this.props.updateClientName("CJ Students");
          this.props.onPressThemeColor("orange");
          this.props.updateClientBackG("https://github.com/TechSwat/ResidencesImages/raw/main/cj_bg.png")
          this.setState({
            backImage:
              "https://github.com/TechSwat/ResidencesImages/raw/main/cj_bg.png",
            pageTitle: "CJ Students",
          });

          localStorage.setItem("clientLogo", "CJ-Logo4.png");
          localStorage.setItem("clientName", "CJ Students");
          localStorage.setItem("clientTheme", "orange");
          localStorage.setItem("clientBG", "https://github.com/TechSwat/ResidencesImages/raw/main/cj_bg.png");
      
        }
        break;
      case "2": {
        this.props.onPressThemeColor("purple");
        this.props.updateClientLogo("opal.png");
        this.props.updateClientName("Opal Students");
        this.props.updateClientBackG("https://github.com/TechSwat/ResidencesImages/raw/main/Outside%20Building%201-min.jpg")
        this.setState({
          backImage:
            "https://github.com/TechSwat/ResidencesImages/raw/main/Outside%20Building%201-min.jpg",
          pageTitle: "Opal Students",
        });

        localStorage.setItem("clientLogo", "opal.png");
        localStorage.setItem("clientName", "Opal Students");
        localStorage.setItem("clientTheme", "purple");
        localStorage.setItem("clientBG", "https://github.com/TechSwat/ResidencesImages/raw/main/Outside%20Building%201-min.jpg");
      }
    }

    //console.log("client:", this.props.clientBG);
  }

  //Admin Toggle
  changeToAdmin(e) {
    e.preventDefault();

    this.setState({
      isAdmin: true,
    });
  }

  render() {
    const { navigation } = this.props;
    const { email, password } = this.props;
    return (
      <div className={this.props.rubixThemeColor}>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{this.state.pageTitle}</title>
        </Helmet>
        <div
          className="page-loader-wrapper"
          style={{ display: this.props.MyloadingController ? "block" : "none" }}
        >
          <div className="loader">
            <div className="m-t-30">
              <img
                src={this.props.rubixClientLogo}
                width="20%"
                height="20%"
                alt=" "
              />
            </div>
            <p>{this.props.loadingMessage}</p>
          </div>
        </div>
        <div className="hide-border">
          <div className="vertical-align-wrap">
            <div
              className="vertical-align-middle auth-main"
              style={{
                backgroundImage: "url(" + this.state.backImage + ")",
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                width: "100% !important",
                height: "100% !important",
              }}
            >
              <div className="auth-box">
                <form id="login" onSubmit={(e) => this.Submit(this)}>
                  <div className="card">
                    <div className="top">
                      <img
                        src={this.props.rubixClientLogo}
                        alt=""
                        style={{
                          height: "10%",
                          width: "55%",
                          display: "block",
                          margin: "auto",
                        }}
                      />
                    </div>
                    <div className="header">
                      <p className="lead">
                        Login to your {this.props.rubixClientName}{" "}
                        {this.state.isAdmin ? "Admin" : ""} account 
                      </p>
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
                            name={
                              this.state.isAdmin
                                ? "AdminUserEmail"
                                : "UserEmail"
                            }
                            required=""
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
                            name="UserPass"
                            required=""
                          />
                        </div>
                        <p id="error" style={{ color: "red" }}>
                          {this.state.errorMessage}
                        </p>
                        <button
                          onClick={(e) => {
                            this.state.isAdmin
                              ? this.LoginToAdmin(e)
                              : this.Submit(e);
                          }}
                          className="btn btn-primary btn-lg btn-block"
                        >
                          Login Now
                        </button>

                        <p
                          className="helper-text m-b-10 bottom"
                          style={{
                            display: this.state.isAdmin ? "none" : "block",
                          }}
                        >
                          Or Login Using:
                        </p>

                        <div
                          style={{
                            display: this.state.isAdmin ? "none" : "block",
                          }}
                        >
                          <GoogleLogin
                            as={Col}
                            render={(renderProps) => (
                              <button
                                className="btn btn-signin-social"
                                onClick={renderProps.onClick}
                                disabled={renderProps.disabled}
                              >
                                <FaGoogle
                                  style={{
                                    color: "#EA4335 ",
                                    fontSize: "1.5em",
                                    paddingRight: "4px",
                                  }}
                                />
                                Google
                              </button>
                            )}
                            clientId="256115085565-b3k2c8gsuqc40vstp06r4cu0sb7kc5qs.apps.googleusercontent.com"
                            buttonText="Google"
                            onSuccess={this.responseGoogle}
                            cookiePolicy={"single_host_origin"}
                          />

                          <FacebookLogin
                            appId="552332679301004" //"284158963537717"
                            fields="name,email,picture, first_name, about"
                            height="10"
                            textButton="Facebook"
                            size="medium"
                            icon={
                              <FaFacebook
                                style={{
                                  color: "#1877f2 ",
                                  fontSize: "1.5em",
                                  paddingRight: "4px",
                                }}
                              />
                            }
                            callback={this.responseFacebook}
                            cssClass="btn btn-signin-social"
                          />

                          <InstagramLogin
                            clientId="552332679301004"
                            buttonText="Instagram"
                            width="10px"
                            onSuccess={this.responseInstagram}
                            cssClass="btn btn-signin-social"
                          >
                            <FaInstagram
                              style={{
                                color: "#cd486b",
                                fontSize: "1.5em",
                                paddingRight: "4px",
                              }}
                            />{" "}
                            Instagram
                          </InstagramLogin>
                          <span className=" bottom helper-text m-b-10">
                            <i className="fa fa-lock"></i>{" "}
                            <a
                              href={`${process.env.PUBLIC_URL}/forgotpassword`}
                            >
                              Forgot password?
                            </a>
                          </span>
                        </div>

                        <span
                          className="bottom"
                          style={{
                            display: this.state.isAdmin ? " block" : "none",
                          }}
                        >
                          For Student Login Click{" "}
                          <a
                            href={"login/" + this.props.match.params.clientID}
                            onClick={(e) => {
                              this.setState({
                                isAdmin: false,
                              });
                            }}
                          >
                            HERE
                          </a>
                        </span>

                        <div className="bottom">
                          

                          <span
                            style={{
                              display: this.state.isAdmin ? "none" : "block",
                            }}
                          >
                            Don't have an account?{" "}
                            <a href="registration">Register</a>
                          </span>

                          <span
                            style={{
                              display: this.state.isAdmin ? "none" : "block",
                            }}
                          >
                            For Admins, please log in{" "}
                            <a
                              href="login"
                              onClick={(e) => {
                                this.changeToAdmin(e);
                              }}
                            >
                              here.
                            </a>
                          </span>

                          {/* <button type="button" onClick={()=>{this.props.onPressThemeColor("blue"); this.props.history.push("/registration")}}>Login with C-Ges</button>
                        <br></br>
                  <button type="button" onClick={()=>{this.props.onPressThemeColor("orange"); this.props.history.push("/registration")}}>Login with Opal</button>
                       */}
                        </div>
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

const mapStateToProps = ({
  navigationReducer,
  loginReducer,
  mailInboxReducer,
}) => ({
  rubixUserID: navigationReducer.userID,
  myMessage: loginReducer.customMessageOnLogin,
  rubixThemeColor: navigationReducer.themeColor,
  rubixClientName: navigationReducer.clientName,
  rubixClientLogo: navigationReducer.clientLogo,

  MyloadingController: navigationReducer.loadingController,
  loadingMessage: navigationReducer.loadingMessage,
  
  clientBG: navigationReducer.backImage,
});

export default connect(mapStateToProps, {
  updateUserID,
  updateClientID,
  onPressThemeColor,
  updateEmail,
  updateClientLogo,
  updateClientName,
  updateLoadingMessage,
  updateLoadingController,
  updateClientBackG,
  updateStudentName,
})(Login);
