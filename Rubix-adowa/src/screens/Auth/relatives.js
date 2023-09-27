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
        value: 0,
        myProfile: {}

    };
  }

//final submit check
 Submit(e){
   ////console.log("called")
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
  ////console.log(data)
  const postData = async() => {
    await axios.post('https://adowarest.rubix.mobi:88/api/RubixUserNextOfKins', data, requestOptions)
    .then(response => {
     
        setTimeout(() => {
          this.postStatus()
         
        }, 2000);
        this.props.history.push("/addresses")
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
    //console.log("User ID: ", localStorage.getItem('userID'))
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
    //console.log('User data:', data)
    const postData = async () => {
      await axios.post('https://adowarest.rubix.mobi:88/api/RubixUpdateStatus', data, requestOptions)
        .then(response => {
          if(response != null || response != undefined){
      //Set timer for loading screen
    setTimeout(() => {
     
      this.setState({
        isLoad: false
      });
    }, 1000);
          }
          //this.props.history.push("/addresses")
          ////console.log("Verify email status", response)
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
            <title>Surety Information</title>
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
        
      

      
        <div className="page-loader-wrapper" style={{ display: this.state.isLoad ? 'block' : 'none' }}>
          <div className="loader">
            <div className="m-t-30"><img src={localStorage.getItem('clientLogo')} width="150" height="150" alt="Lucid" /></div>
            <p>submitting please wait...</p>
             
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
                    <p className="lead">Surerty Information</p>
                  </div>
                  <div className="body">
                    <form id='nof' onSubmit={(e) => this.Submit(e)}>
                   
                    <div className="form-group">
                  <label>
                    First Name:
                  </label>
                  <input
                    className="form-control"
                    disabled=""
                    placeholder="First Name"
                    id="NextOfKinFirstName"
                    name='RubixUserNextOfKinFirstName'
                    type="text"
                    defaultValue={this.state.myProfile.RubixUserNextOfKinFirstName}
                    onChange={() => { }}
                  />
                </div>
                     
                <div className="form-group">
                  <label>
                    Last Name:
                  </label>
                  <input
                    className="form-control"
                    placeholder="Last Name"
                    id="NextOfKinLastName"
                    name='RubixUserNextOfKinLastName'
                    type="text"
                    defaultValue={this.state.myProfile.RubixUserNextOfKinLastName}
                    onChange={() => { }}
                  />
                </div>
                <div className="form-group">
                  <label>
                    Email Address:
                  </label>
                  <input
                    className="form-control"
                    disabled=""
                    placeholder="Email"
                    id="NextOfKinEmail"
                    name='RubixUserNextOfKinEmail'
                    type="text"
                    defaultValue={this.state.myProfile.RubixUserNextOfKinEmail}
                    onChange={() => { }}
                  />
                </div>

                <div className="form-group">
                        <label className="control-label" >
                        ID/Passport Number
                            </label>
                            <input type='number' name="RubixUserNextOfKinID" className='form-control' id='IDNumber' 
                    required=''  placeholder='Enter your ID Number' defaultValue={this.state.myProfile.RubixUserNextOfKinID}></input>
                    <p id="error" style={{color: 'red'}}>{this.state.errorMessage}</p>
                      </div>


                     
                      <div className="form-group">
                        <label className="control-label" >
                        Vat Number
                            </label>
                        <input
                          className="form-control"
                          id="RubixNextOfKinVat"
                          name='RubixNextOfKinVat'
                          placeholder="Enter Surety VAT number (optional)"
                          type="number"
                          defaultValue={this.state.myProfile.RubixNextOfKinVat}
                        />
                      </div>

                      <div className="form-group">
                  <label className=" control-label">
                    Mobile Number:
                  </label>
                  <PhoneInput id='register-page-phone-number' placeholder="+27 123 15348"
                    defaultValue={this.state.myProfile.RubixUserNextOfKinPhoneNumber} name="RubixUserNextOfKinPhoneNumber" required=''
                    value={this.state.myProfile.RubixUserNextOfKinPhoneNumber}
                    onChange={() => this.setState({ value: this.state.value })} />
                </div>
                <div className="form-group">
                        <label className="control-label">
                        Home Tellephone Number
                            </label>
                            <PhoneInput id='register-page-phone-number' placeholder="Surety Home Tellephone Number" 
                            defaultValue={this.state.myProfile.RubixUserNextOfKinHomeTell}
                            value={this.state.myProfile.RubixUserNextOfKinHomeTell}
                            name="RubixUserNextOfKinHomeTell" className='RubixUserNextOfKinHomeTell' required='' 
                    onChange={()=> this.setState({value: this.state.value})}/>
                      </div>

                      <div className="form-group">
                        <label className="control-label" >
                        Work Number
                            </label>
                            <PhoneInput placeholder="Surety Work number" name="RubixUserNextOfKinWorkNumber" className='RubixUserNextOfKinWorkNumber' required='' 
                   value={this.state.myProfile.RubixUserNextOfKinHomeTell}
                    defaultValue={this.state.myProfile.RubixUserNextOfKinWorkNumber}
                    onChange={()=> this.setState({value: this.state.value})}/>
                      </div>
                <div className="form-group">
                  <label>
                    Relationship:
                  </label>
                  <input
                    className="form-control"
                    placeholder="Relationship"
                    name='RubixUserNextOfKiniRelationship'
                    defaultValue={this.state.myProfile.RubixUserNextOfKiniRelationship}
                    type="text"
                  />
                </div>
                 <div className="form-group">
                  <label>
                    Home Address:
                  </label>
                  <input
                    className="form-control"
                    placeholder="Address"
                    name='RubixUserNextOfKinAddress'
                    defaultValue={this.state.myProfile.RubixUserNextOfKinAddress}
                    type="text"
                  />
                </div>
                <div className="form-group">
                        <label className="control-label" >
                        Postal Code
                            </label>
                        <input
                          className="form-control"
                          name="RubixUserNextOfKinPostalcode"
                          id="post-code"
                          placeholder="Post Code"
                          defaultValue={this.state.myProfile.RubixUserNextOfKinPostalcode}
                          type="text"
                          required/>
                      </div>
                      <button className="btn btn-primary btn-lg btn-block" onClick={(e) => this.Submit(e)}>
                        Next
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
