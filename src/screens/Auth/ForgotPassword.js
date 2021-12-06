import React from "react";
import { connect } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from "../../assets/images/logo-white.svg";
import axios from "axios";
import { updateEmail, updatePassword,onLoggedin, updateUserID, 
  updateClientID,onPressThemeColor,updateClientName, updateClientLogo } from "../../actions";

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoad: true,
      currentClientId: null,
      currentLogo: '',
      clientName: '',
      errorMessage: '',
    }
  }

  componentDidMount(){
    console.log("Theme Color:", this.props.rubixThemeColor)

    this.setState({currentLogo: localStorage.getItem('clientLogo')})
    this.setState({clientName: localStorage.getItem('clientName')})
    this.props.onPressThemeColor(localStorage.getItem('clientTheme'))
  }
  
  //Reset Password
  resetPassword(e){
    e.preventDefault();
    const form = document.getElementById('forgot-pass');
    const data = {
    };
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
    console.log(data)
    const postData = async() => {
              await axios.post('https://rubixapi.cjstudents.co.za:88/api/RubixForgetPasswordEmail', data, requestOptions)
            .then(response => {
                console.log(response)
                //alert(response.data.PostRubixUserData[0].ResponceMessage)
            })
    }
    postData()
    
      }
    
  render() {
    return (
      <div className={this.props.rubixThemeColor}>
        <div >
          <div className="vertical-align-wrap">
            <div className="vertical-align-middle auth-main">
              <div className="auth-box">
                <div className="card">
                  <div className="header">
                  <div className="top">
                  <img src={this.state.currentLogo} alt="Lucid" style={{ height: "40px", margin: "10px" }} />
                </div>
                    <p className="lead">Recover my password</p>
                  </div>
                  <div className="body">
                    <p>Please enter your email address below to receive instructions for resetting password.</p>
                    <form id='forgot-pass' className="form-auth-small ng-untouched ng-pristine ng-valid">
                      <div className="form-group">
                        <input className="form-control" placeholder="Your Email" type="email" name='UserEmail' required='' />
                      </div>
                      <button className="btn btn-primary btn-lg btn-block" type="submit" onClick={(e) => { this.resetPassword(e) }}>
                        RESET PASSWORD
                        </button>
                      <button className="btn btn-primary btn-lg btn-block" type="submit" onClick={(e) => { this.props.history.push("/forgotpass/2" ) }}>
                        pass
                        </button>
                      <div className="bottom">
                        <span className="helper-text">Know your password? <a href="login">Login</a></span>
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

const mapStateToProps = ({ navigationReducer, loginReducer }) => ({
  myMessage: loginReducer.customMessageOnLogin,
  rubixThemeColor: navigationReducer.themeColor,
  rubixClientName: navigationReducer.clientName,
  rubixClientLogo: navigationReducer.clientLogo,
});

export default connect(mapStateToProps, {
  onPressThemeColor,
})(ForgotPassword);
