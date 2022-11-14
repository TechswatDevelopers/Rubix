import React from "react";
import { Dropdown } from "react-bootstrap";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import {onPresPopUpEvent, updateEmail, updatePassword,onLoggedin, updateUserID, 
  updateClientID,onPressThemeColor,updateClientName, updateClientLogo } from "../../actions";

class VerifyEmail extends React.Component {
  //Initial State
constructor(props) {
  super(props)
  this.state = {
    isLoad: true,
    activationCode: null,
    errorMessage: '',
    errorMessage: '',
    rubixClientLogo: this.props.match.params.clientID,
    currentClientId: '1',
    userData: {}
  }
}

  componentDidMount() {
    window.scrollTo(0, 0);
    this.setThemeColor(this.props.match.params.clientID )
    localStorage.setItem('clientID', this.props.match.params.clientID)
     //Set timer for loading screen
  setTimeout(() => {
    this.setState({
      isLoad: false,
      activationCode: this.props.match.params.activeCode
    })
  }, 2000);

  //console.log("client ID:", localStorage.getItem('clientID'))
  //Send verification
  const verify = async() => {
    await fetch('https://jjprest.rubix.mobi:88/api/RubixVerifyEmails/'  + this.props.match.params.activeCode)
      .then(response => response.json())
      .then(data => {
        //console.log("response data:", data)
        this.setState({userData: data.PostEmailVerification})
          alert("Account verified successfully!")
          });
  }
  verify()
  }
    
  
  //Set Theme Color
  setThemeColor(client){
    switch(client){
      case '1':{
        this.props.updateClientLogo("jjp-logo.png");
          this.props.updateClientName("Varsity Lodge");
          this.props.onPressThemeColor("blush");
//          this.props.updateClientBackG("https://github.com/TechswatDevelopers/Media/raw/main/jjpback.jpg")
          this.setState({
            backImage:
              "https://github.com/TechswatDevelopers/Media/raw/main/jjpback.jpg",
            pageTitle: "Varsity Lodge",
          });

          localStorage.setItem("clientLogo", "jjp-logo.png");
          localStorage.setItem("clientName", "Varsity Lodge");
          localStorage.setItem("clientTheme", "blush");
          localStorage.setItem("clientBG", "https://github.com/TechswatDevelopers/Media/raw/main/jjpback.jpg");
    
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
    //console.log('client:', this.state.backImage)
  }
  
  render() {
    return (
      <div className={  "theme-grey"/* localStorage.getItem('clientTheme') */}
      >
        <div className="page-loader-wrapper" style={{ display: this.state.isLoad ? 'block' : 'none' }}>
          <div className="loader">
            <div className="m-t-30"><img src={localStorage.getItem('clientLogo')} width="10%" height="10%" alt="" /></div>
            <p>Please wait...</p>
          </div>
        </div>
        <div>
          <div className="container-fluid">
            <div className="row clearfix">
              <div className="col-lg-12 col-md-12">
                <div className="card planned_task">
                  <div className="header">
                  <img src={localStorage.getItem('clientLogo')} width="110" height="50" alt="Lucid" />
                    <h2>Email Verification</h2>
                    <p>Thank you so much {this.state.userData.Name} {this.state.userData.Lastname} your email has been verified successfully!</p>
                  </div>
                  <span>You can now login with your new password <a href={'/login/' + localStorage.getItem('clientID')}>here.</a></span>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ ioTReducer }) => ({
  isSecuritySystem: ioTReducer.isSecuritySystem,
});

export default connect(mapStateToProps, {
  
  updateUserID,
  updateClientID,
  onPressThemeColor,
  updateEmail,
  updateClientLogo,
  updateClientName,
})(VerifyEmail);
