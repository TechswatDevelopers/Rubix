import React from "react";
import { Dropdown } from "react-bootstrap";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";

class VerifyEmail extends React.Component {
  //Initial State
constructor(props) {
  super(props)
  this.state = {
    isLoad: true,
    activationCode: null,
    errorMessage: '',
    errorMessage: '',
    rubixClientLogo: localStorage.getItem('clientLogo'),
    currentClientId: '1',
    userData: {}
  }
}

  componentDidMount() {
    window.scrollTo(0, 0);
    localStorage.setItem('clientID', this.state.currentClientId)
    this.setThemeColor(this.state.currentClientId)
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
    await fetch('https://rubixapidev.cjstudents.co.za:88/api/RubixVerifyEmails/'  + this.props.match.params.activeCode)
      .then(response => response.json())
      .then(data => {
        console.log("response data:", data)
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
        /* this.props.updateClientLogo('CJ-Logo.png')
        this.props.updateClientName('CJ Students')
        this.props.onPressThemeColor('orange') */

        localStorage.setItem('clientLogo', 'CJ-Logo.png')
        localStorage.setItem('clientName', 'CJ Students')
        localStorage.setItem('clientTheme', 'orange')
      }
        break
      case '2': {
      /* this.props.onPressThemeColor('purple')
      this.props.updateClientLogo('opal.png')
      this.props.updateClientName('Opal Students') */

      localStorage.setItem('clientLogo', 'opal.png')
      localStorage.setItem('clientName', 'Opal Students')
      localStorage.setItem('clientTheme', 'purple')
    }
    }
    //console.log('client:', this.props.rubixClientLogo)
  }


  render() {
    return (
      <div className={localStorage.getItem('clientTheme')}
      >
        <div className="page-loader-wrapper" style={{ display: this.state.isLoad ? 'block' : 'none' }}>
          <div className="loader">
            <div className="m-t-30"><img src={localStorage.getItem('clientLogo')} width="170" height="70" alt="Lucid" /></div>
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

export default connect(mapStateToProps, {})(VerifyEmail);
