import React, { useContext } from "react";
import { connect } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import {Helmet} from "react-helmet";
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css';
import {onPresPopUpEvent,
  updateClientBackG,
  updateLoadingMessage,
  updateLoadingController} from "../../actions";
import PopUpModal from "../../components/PopUpModal"

class Relatives extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        userGender: 'Male',
        errorMessage: '',
        location: null,
        myUserID: null,
        userIPAddress: null,
        dateAndTime: null,
        isLoad: false,
        showSearch: false,
        value: 0

    };
  }

//final submit check
 Submit(e){
   //console.log("called")
   //Set timer for loading screen
  this.setState({
    isLoad: true
  })
  e.preventDefault();
  const form = document.getElementById('nof');

  const data = {
    'RubixRegisterUserID': this.state.myUserID,
  };
  for (let i=0; i < form.elements.length; i++) {
      const elem = form.elements[i];
      data[elem.name] = elem.value
  }

  const requestOptions = {
      title: 'Relatives Form',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
  };
  //console.log(data)
  const postData = async() => {
    await axios.post('https://jjprest.rubix.mobi:88/api/RubixUserNextOfKin2s', data, requestOptions)
    .then(response => {
        //console.log(response)
        setTimeout(() => {
          this.postStatus()
        }, 2000);
        this.setState({
          isLoad: false
        })
    })
  }
  postData().then(() => {

    this.props.onPresPopUpEvent()
    //this.props.history.push("/login/" + localStorage.getItem('clientID'))
  })

}

  //Posting Update status
  postStatus() {
    console.log("User ID: ", localStorage.getItem('userID'))
    //Set Loading Screen ON
 this.props.updateLoadingController(true);
 this.props.updateLoadingMessage("Adding Status...");
    const data = {
      'Status': 'Email Verify',
      'RubixRegisterUserID': localStorage.getItem('userID'),
    };
    const requestOptions = {
      title: 'Verify Status Form',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    };
    console.log('User data:', data)
    const postData = async () => {
      await axios.post('https://jjprest.rubix.mobi:88/api/RubixUpdateStatus', data, requestOptions)
        .then(response => {
          if(response != null || response != undefined){
      //Set timer for loading screen
    setTimeout(() => {
      this.setState({
        isLoad: false
      });
    }, 1000);
          }
          console.log("Verify email status", response)
          //this.props.history.push("/login/" + localStorage.getItem('clientID') )
        })
    }
    postData()
  }


  componentDidMount(){
    document.body.classList.remove("theme-cyan");
    document.body.classList.remove("theme-purple");
    document.body.classList.remove("theme-blue");
    document.body.classList.remove("theme-green");
    document.body.classList.remove("theme-orange");
    document.body.classList.remove("theme-blush");
    const userID = localStorage.getItem('userID');
    this.props.updateClientBackG(localStorage.getItem('clientBG'))
    this.setState({myUserID: userID});

    this.props.updateLoadingController(true);
    this.props.updateLoadingMessage("Loading Details...");

    setTimeout(() => {
      this.props.updateLoadingController(false);
    }, 2000)

  }
  setLoadingPage(time,) {
    this.setState({ isLoad: true, })
    setTimeout(() => {
      this.setState({
        isLoad: false,
      })
    }, time);
  }
  //Show Search
  showSearch(e){
    e.preventDefault() 
    this.setState({showSearch: !this.state.showSearch})
  }


  render() {
    //const user = useContext(MyProvider);
    return (
      <div className="theme-grey">
      <Helmet>
            <meta charSet="utf-8" />
            <title>Relatives Details</title>
        </Helmet>

        <div
          className="page-loader-wrapper"
          style={{ display: this.props.MyloadingController ? "block" : "none" }}
        >
          <div className="loader">
            <div className="m-t-30">
              <img
                src={localStorage.getItem('clientLogo')}
                width="10%"
                height="10%"
                alt=" "
              />
            </div>
            <p>{this.props.loadingMessage}</p>
          </div>
        </div>
        
        <PopUpModal 
        Title= "Registration Complete!"
        Body = "Thank you for registering with Us. We have sent you an email to verify your account, please check your emails."
        Function ={()=>this.props.history.push("/login/" + localStorage.getItem('clientID'))}
        />
        <div className="page-loader-wrapper" style={{ display: this.state.isLoad ? 'block' : 'none' }}>
          <div className="loader">
            <div className="m-t-30"><img src={localStorage.getItem('clientLogo')} width="170" height="70" alt="Lucid" /></div>
            <p>Registering please wait...</p>
          </div>
        </div>
        <div >
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
                <div className="top">
                  <img src={localStorage.getItem('clientLogo')} alt="" style={{ height: "40%",  width:"44%",  display: "block", margin: "auto" }} />
                </div>
                  <div className="header">
                    <p className="lead">Relatives Details</p>
                  </div>
                  <div className="body">
                    <form id='nof' onSubmit={(e) => this.Submit(e)}>
                      <p>1st Relative's Details</p>
                      <div className="form-group">
                        <label className="control-label sr-only" >
                        First Name(s):
                            </label>
                        <input
                          className="form-control"
                          id="NextOfKinFirstName1"
                          name='NextOfKinFirstName1'
                          placeholder="Name"
                          type="text"
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="control-label sr-only" >
                        Surname:
                            </label>
                        <input
                          className="form-control"
                          id="NextOfKinLastName1"
                          name='NextOfKinLastName1'
                          placeholder="Enter Next of kin surnme"
                          type="text"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="control-label sr-only" >
                        Phone Number:
                            </label>
                            <PhoneInput placeholder="Cell Phone Number" name="NextOfKinPhoneNumber1" className='NextOfKinPhoneNumber1' required='' 
                    value={this.state.value}
                    onChange={()=> this.setState({value: this.state.value})}/>
                      </div>

                      <div className="form-group">
                        <label className="control-label sr-only" >
                        Relationship:
                            </label>
                        <input
                          className="form-control"
                          id="NextOfKiniRelationship1"
                          name='NextOfKiniRelationship1'
                          placeholder="Enter Relative's relation to you"
                          type="text"
                          required
                        />
                      </div>

                      <p>2nd Relative's Details</p>
                      <div className="form-group">
                        <label className="control-label sr-only" >
                        First Name(s):
                            </label>
                        <input
                          className="form-control"
                          id="NextOfKinFirstName2"
                          name='NextOfKinFirstName2'
                          placeholder="Name"
                          type="text"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="control-label sr-only" >
                        Surname:
                            </label>
                        <input
                          className="form-control"
                          id="NextOfKinLastName2"
                          name='NextOfKinLastName2'
                          placeholder="Enter Next of kin surnme"
                          type="text"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="control-label sr-only" >
                        Phone Number:
                            </label>
                            <PhoneInput placeholder="Cell Phone Number" 
                            name="NextOfKinPhoneNumber2" 
                            className='NextOfKinPhoneNumber2' required='' 
                    value={this.state.value}
                    onChange={()=> this.setState({value: this.state.value})}/>
                      </div>

                      <div className="form-group">
                        <label className="control-label sr-only" >
                        Relationship:
                            </label>
                        <input
                          className="form-control"
                          id="NextOfKiniRelationship2"
                          name='NextOfKiniRelationship2'
                          placeholder="Enter Relative's relation to you"
                          type="text"
                          required
                        />
                      </div>
                      <button className="btn btn-primary btn-lg btn-block" onClick={(e) => this.Submit(e)}>
                        REGISTER
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

Relatives.propTypes = {
};

const mapStateToProps = ({ navigationReducer,  loginReducer, mailInboxReducer }) => ({
  rubixStudentIDNo: navigationReducer.studentIDNo,
  rubixUserID: navigationReducer.userID,
  email: loginReducer.email,
  password: loginReducer.password,
  isPopUpModal: mailInboxReducer.isPopUpModal,
    
  clientBG: navigationReducer.backImage,

  MyloadingController: navigationReducer.loadingController,
  loadingMessage: navigationReducer.loadingMessage,
});

export default connect(mapStateToProps, {
  onPresPopUpEvent,
  updateClientBackG,
  updateLoadingMessage,
  updateLoadingController
})(Relatives);
