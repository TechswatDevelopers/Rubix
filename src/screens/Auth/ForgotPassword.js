import React from "react";
import { connect } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from "../../assets/images/logo-white.svg";
import axios from "axios";

class ForgotPassword extends React.Component {
  
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
              await axios.post('http://192.168.88.10:3300/api/RubixForgetPasswordEmail', data, requestOptions)
            .then(response => {
                console.log(response)
                //alert(response.data.PostRubixUserData[0].ResponceMessage)
            })
    }
    postData()
    
      }
    
  render() {
    return (
      <div className="theme-cyan">
        <div >
          <div className="vertical-align-wrap">
            <div className="vertical-align-middle auth-main">
              <div className="auth-box">
                <div className="top">
                  <img src="CJ-Logo.png" alt="Lucid" style={{ height: "40px", margin: "10px" }} />
                </div>
                <div className="card">
                  <div className="header">
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

const mapStateToProps = ({ loginReducer }) => ({
});

export default connect(mapStateToProps, {
})(ForgotPassword);
