import React from "react";
import { connect } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from "../../assets/images/logo-white.svg";
import axios from "axios";
import {Helmet} from "react-helmet";
import { updateEmail, updatePassword,onLoggedin, updateUserID, 
  updateClientID,onPressThemeColor,updateClientName, 
  updateClientLogo, onPresPopUpEvent,
  updateLoadingMessage,
  updateLoadingController,
  updateClientBackG, } from "../../actions";
  import PopUpModal from "../../components/PopUpModal"

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoad: true,
      currentClientId: null,
      currentLogo: '',
      clientName: '',
      loginLink: '',
      errorMessage: '',
      title: '',
      popMessage: '',
      myFunction: null,
      errorTest: false
    }
  }

  componentDidMount(){
    //console.log("Theme Color:", this.props.rubixThemeColor)
    this.props.updateClientBackG(localStorage.getItem('clientBG'))
    this.setState({currentLogo: localStorage.getItem('clientLogo')})
    this.setState({clientName: localStorage.getItem('clientName')})
    this.setState({loginLink: "login/" + localStorage.getItem('clientID')})
    this.props.onPressThemeColor(localStorage.getItem('clientTheme'))
    
  }
  
  //Reset Password
  resetPassword(e){
    e.preventDefault();
    const form = document.getElementById('forgot-pass');
    const data = {
      'RubixClientID': localStorage.getItem('clientID'),
    }

    for (let i=0; i < form.elements.length; i++) {
        const elem = form.elements[i];
        data[elem.name] = elem.value
    }
    
    const requestOptions = {
        title: 'Forgot Password Form',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data
    };
    ////console.log(data)
    const postData = async() => {
              await axios.post('https://adowarest.rubix.mobi:88/api/RubixForgetPasswordEmail', data, requestOptions)
            .then(response => {
                ////console.log(response.data.PostRubixUserData[0].Response)
                if(response.data.PostRubixUserData[0].Response === "Redirected"){
                  this.setState({
                    title: "Request Received",
                    popMessage: "Your request has been received, please check your email for more information.",
                    errorTest: true
                    //myFunction: this.props.history.push("/login/" + localStorage.getItem('clientID'))
                  })
                  this.props.onPresPopUpEvent()
                  //alert("Your request has been received, please check your email for more information")
                  
                } else {
                  this.setState({
                    title: "Error Loading Request",
                    popMessage: "The email you entered does not exist, please check try again.",
                  })
                  this.props.onPresPopUpEvent()
                  //alert("The email you entered does not exist, please check try again.")
                  this.setState({errorMessage: "Please enter an email that exists."})
                }
            })
    }
    postData()
      }
    

  render() {
    return (
      <div className={ "theme-grey"/* this.props.rubixThemeColor */}>
      <Helmet>
              <meta charSet="utf-8" />
              <title>Forgot Password</title>
          </Helmet>
        <div >
        <PopUpModal 
        Title= {this.state.title}
        Body = {this.state.popMessage}
        Function = {()=>this.state.errorTest ? this.props.history.push("/login/" + localStorage.getItem('clientID')) :null}
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
                  <div className="header">
                  <div className="top">
                  <img src={this.state.currentLogo} alt="" style={{  height: "40%",  width:"44%", }} />
                </div>
                    <p className="lead">Recover my password</p>
                  </div>
                  <div className="body">
                    <p>Please enter your email address below to receive instructions for resetting password.</p>
                    <form id='forgot-pass' className="form-auth-small ng-untouched ng-pristine ng-valid">
                      <div className="form-group">
                        <input className="form-control" placeholder="Your Email" type="email" name='UserEmail' required='' />
                      </div>
                      <p id="error" style={{color: 'red'}}>{this.state.errorMessage}</p>
                      <button className="btn btn-primary btn-lg btn-block" type="submit" onClick={(e) => {this.resetPassword(e)}}>
                        RESET PASSWORD
                        </button>
                        <div className="bottom">
                        <span className="helper-text">
                          Don't have an account yet?{" "}
                          <a href="registration" >Register</a>
                        </span>
                        </div>
                      <div className="bottom">
                        <span className="helper-text">Know your password? <a href={this.state.loginLink}>Login</a></span>
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

ForgotPassword.propTypes = {
};

const mapStateToProps = ({ navigationReducer, loginReducer, mailInboxReducer }) => ({
  myMessage: loginReducer.customMessageOnLogin,
  rubixThemeColor: navigationReducer.themeColor,
  rubixClientName: navigationReducer.clientName,
  rubixClientLogo: navigationReducer.clientLogo,
  isPopUpModal: mailInboxReducer.isPopUpModal,
  

  MyloadingController: navigationReducer.loadingController,
  loadingMessage: navigationReducer.loadingMessage,

  clientBG: navigationReducer.backImage,
});

export default connect(mapStateToProps, {
  onPressThemeColor,
  onPresPopUpEvent,
  updateLoadingMessage,
  updateLoadingController,
  updateClientBackG,
})(ForgotPassword);
