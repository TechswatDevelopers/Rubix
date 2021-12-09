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
    userData: {}
  }
}

  componentDidMount() {
    window.scrollTo(0, 0);
     //Set timer for loading screen
  setTimeout(() => {
    this.setState({
      isLoad: false,
      activationCode: this.props.match.params.activeCode
    })
  }, 2000);

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

  goToLogin(e){
    console.log("calledd")
    this.props.history.push("/login/" + this.state.userData.RubixClientID)
  }
  render() {
    return (
      <div
        style={{ flex: 1 }}
        onClick={() => {
          document.body.classList.remove("offcanvas-active");
        }}
      >
        <div className="page-loader-wrapper" style={{ display: this.state.isLoad ? 'block' : 'none' }}>
          <div className="loader">
            <div className="m-t-30"><img src={this.props.rubixClientLogo} width="170" height="70" alt="Lucid" /></div>
            <p>Please wait...</p>
          </div>
        </div>
        <div>
          <div className="container-fluid">
          
            <div className="row clearfix">
              <div className="col-lg-12 col-md-12">
                <div className="card planned_task">
                  <div className="header">
                    <h2>Email Verification</h2>
                    <p>Thenk you so much {this.state.userData.Name} {this.state.userData.Lastname} your email has been verified successfully!</p>
                  {/* <button type="button" className="btn btn-primary btn-lg btn-block" onclick={(e)=>{ this.goToLogin()}}>Go to Login</button>
                   */}</div>
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
