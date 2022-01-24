import React from "react";
import { connect } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from "../../assets/images/logo-white.svg";
import axios from "axios";
import {onPresPopUpEvent, updateEmail, updatePassword,onLoggedin, updateUserID, 
  updateClientID,onPressThemeColor,updateClientName, updateClientLogo } from "../../actions";
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
  componentDidMount() {
    window.scrollTo(0, 0);
    this.setThemeColor(this.props.match.params.clientID )
    localStorage.setItem('clientID', this.props.match.params.clientID)
    console.log("client ID:")
  }
  
  
  //Set Theme Color
  setThemeColor(client){
    switch(client){
      case '1':{
        this.props.updateClientLogo('CJ-Logo4.png')
        this.props.updateClientName('CJ Students')
        this.props.onPressThemeColor('orange')
        this.setState({
          backImage: 'cj_bg.png'
        })

        localStorage.setItem('clientLogo', 'CJ-Logo4.png')
        localStorage.setItem('clientName', 'CJ Students')
        localStorage.setItem('clientTheme', 'orange')
      }
        break
      case '2': { 
      this.props.onPressThemeColor('purple')
      this.props.updateClientLogo('opal.png')
      this.props.updateClientName('Opal Students')
      this.setState({
        backImage: 'https://github.com/TechSwat/ResidencesImages/raw/main/Outside%20Building%201-min.jpg'

      })


      localStorage.setItem('clientLogo', 'opal.png')
      localStorage.setItem('clientName', 'Opal Students')
      localStorage.setItem('clientTheme', 'purple')
    }
    }
    console.log('client:', this.state.backImage)
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
                  <img src={localStorage.getItem('clientLogo')} alt="Lucid" style={{ height: "40px", margin: "10px" }} />
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
  onPresPopUpEvent,
  updateUserID,
  updateClientID,
  onPressThemeColor,
  updateEmail,
  updateClientLogo,
  updateClientName,
})(ForgotPasswordPage);
