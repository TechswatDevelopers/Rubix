import React from "react";
import { connect } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from "../../assets/images/logo-white.svg";
import axios from "axios";

class ForgotPasswordPage extends React.Component {
  
  //Reset Password
  resetPassword(e){
    e.preventDefault();
    const form = document.getElementById('forgot-pass');
    const data = {
      'UID': this.props.match.params.uid,
    };
    /* for (let i=0; i < form.elements.length; i++) {
        const elem = form.elements[i];
        data[elem.name] = elem.value
    } */
    
    const requestOptions = {
        title: 'Forgot Password Form',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data
    };
    console.log(data)
    const postData = async() => {
              await axios.post('http://197.242.69.18:3300/api/RubixUpdateForgetPasswordEmail', data, requestOptions)
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
                  <img src={this.props.rubixClientLogo} alt="Lucid" style={{ height: "40px", margin: "10px" }} />
                </div>
                    <p className="lead">Password Reset</p>
                  </div>
                  <div className="body">
                    <p>Please enter your new password below</p>
                    <form id='forgot-pass' className="form-auth-small ng-untouched ng-pristine ng-valid">
                      <div className="form-group">
                        <input className="form-control" placeholder="Your New Password" type="password" name='UserPass' required='' />
                      </div>
                      <button className="btn btn-primary btn-lg btn-block" type="submit" onClick={(e) => { this.resetPassword(e) }}>
                        Go to Login
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

ForgotPasswordPage.propTypes = {
};

const mapStateToProps = ({ navigationReducer }) => ({
  rubixThemeColor: navigationReducer.themeColor,
  rubixClientName: navigationReducer.clientName,
  rubixClientLogo: navigationReducer.clientLogo,
});

export default connect(mapStateToProps, {
})(ForgotPasswordPage);
