import React from "react";
import { connect } from "react-redux";
import { onPresAddEvent, onPresPopUpEvent, 
  onPresPopVerify, onPresRooms, 
  onPresPopUpRemove,updateLoadingMessage,
  updateLoadingController} from "../actions";
import { Form } from 'react-bootstrap';
import axios from "axios";


class PopUpVerifyUser extends React.Component {
    //Initial State
constructor(props) {
  super(props)
  this.state = {
    dateAndTime: '',
    activeCode: ''

  }
}

componentDidMount() {
  window.scrollTo(0, 0);
 
  const DATE_OPTIONS = { year: 'numeric', month: 'long', day: 'numeric', time: 'long' };
    const myDate = new Date().toLocaleDateString('en-ZA', DATE_OPTIONS)
    const myTime = new Date().toLocaleTimeString('en-ZA')
    this.setState({ dateAndTime: myDate + myTime })
}

//Send Verification
sendVerifyEmail(code){
  console.log("Look at me", code)
    //Send verification
    const verify = async() => {
      await fetch('https://jjprest.rubix.mobi:88/api/RubixVerifyEmails/'  + code)
        .then(response => response.json())
        .then(data => {
          console.log("response data:", data)
          //this.setState({userData: data.PostEmailVerification})
            alert("Account verified successfully!")
            window.location.reload()
            });
    }
   verify()
}

  //Get Specific User Data
  getStudentData(){
    //console.log('Current Student Rubix ID: ', userID)
    const data = {
      'RubixRegisterUserID': localStorage.getItem('userID'),
      "RubixClientID" : localStorage.getItem('clientID'),
      'UserCode': localStorage.getItem('userCode')
    };
    const requestOptions = {
      title: 'Fetch User Profile Form',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    };
    console.log('Posted student data:', data)
    const postData = async () => {
      await axios.post('https://jjprest.rubix.mobi:88/api/RubixAdminUserData', data, requestOptions)
        .then(response => {
          console.log("All Student data", response.data)
          

         

        })
    }
    postData()
  }
  

  render() {
    const {isPopUpAssign, Title, Body, userActiveCode} = this.props;
    return (
      <div
        className={isPopUpAssign ? "modal fade show" : "modal fade"}
        role="dialog"
      >
        <div
          className="page-loader-wrapper"
          style={{ display: this.props.MyloadingController ? "block" : "none" }}
        >
          <div className="loader">
            <div className="m-t-30">
              <img
                src={localStorage.getItem('clientLogo')}
                width="20%"
                height="20%"
                alt=" "
              />
            </div>
            <p>{this.props.loadingMessage}</p>
          </div>
        </div>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="title" id="defaultModalLabel">
               {Title}
              </h4>
            </div>
            <div className="modal-body">
              {Body}
              
            </div>
            <div className="modal-footer">
            <button type="button" className="btn btn-primary" onClick={(e) => {
                 this.sendVerifyEmail(userActiveCode)
                 
                }}>
                Verify User
              </button>
              <button
                type="button"
                onClick={(e) => {
                 this.props.onPresPopVerify()
                  
                }}
                className="btn btn-simple"
                data-dismiss="modal"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ mailInboxReducer, navigationReducer }) => ({
  isEventModal: mailInboxReducer.isEventModal,
  isPopUpConfirm: mailInboxReducer.isPopUpConfirm,
  isPopUpAssign: mailInboxReducer.isShowVerifyModal,
  isPopUpRemove: mailInboxReducer.isShowRemoveModal,
  currentStudentiD: navigationReducer.studentID,

  MyloadingController: navigationReducer.loadingController,
  loadingMessage: navigationReducer.loadingMessage,
});

export default connect(mapStateToProps, { 
  onPresAddEvent, 
  onPresPopUpEvent, 
  onPresPopVerify, 
  onPresRooms, 
  onPresPopUpRemove,
  updateLoadingMessage,
  updateLoadingController,
  })(PopUpVerifyUser);
