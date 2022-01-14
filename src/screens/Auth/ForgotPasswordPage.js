import React from "react";
import { connect } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from "../../assets/images/logo-white.svg";
import axios from "axios";
import {onPresPopUpEvent} from "../../actions";
import PopUpModal from "../../components/PopUpModal"

class ForgotPasswordPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      popMessage: '',
      myFunction: null,
    }
  }

  
  //Reset Password
  resetPassword(e){
    e.preventDefault();
    const form = document.getElementById('forgot-pass');
    
    const data = {
      'UID': this.props.match.params.uid,
    };
    const requestOptions = {
        title: 'Forgot Password Form',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data
    };
    for (let i = 0; i < form.elements.length; i++) {
      const elem = form.elements[i];
      data[elem.name] = elem.value
    }
    console.log(data)
    const postData = async() => {
              await axios.post('https://rubixapi.cjstudents.co.za:88/api/RubixUpdateForgetPassword', data, requestOptions)
            .then(response => {
                console.log(response)
                //Go to login screen
                this.setState({
                  title: "Password Reset",
                  popMessage: "Password Reset successfully, you will be redirected to login.",
                  //myFunction: this.props.history.push("/login/" + localStorage.getItem('clientID'))
                })
                this.props.onPresPopUpEvent()
                //alert(response.data.PostRubixUserData[0].ResponceMessage)
            })
    }
    postData()
    
      }
    
  render() {
    return (
      <div className={this.props.rubixThemeColor}>
        <div >
        <PopUpModal 
        Title= {this.state.title}
        Body = {this.state.popMessage}
        Function = {()=>this.props.history.push("/login/" + localStorage.getItem('clientID'))}
        />
          <div className="vertical-align-wrap">
            <div className="vertical-align-middle auth-main">
              <div className="auth-box">
                <div className="card">
                  <div className="header">
                <div className="top">
                  <img src={'CJ-Logo4.png'} alt="Lucid" style={{ height: "40px", margin: "10px" }} />
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
                        Submit
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

const mapStateToProps = ({ navigationReducer, mailInboxReducer }) => ({
  rubixThemeColor: navigationReducer.themeColor,
  rubixClientName: navigationReducer.clientName,
  rubixClientLogo: navigationReducer.clientLogo,
  isPopUpModal: mailInboxReducer.isPopUpModal,
});

export default connect(mapStateToProps, {
  onPresPopUpEvent
})(ForgotPasswordPage);
