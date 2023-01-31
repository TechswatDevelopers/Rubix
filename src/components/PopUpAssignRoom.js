import React from "react";
import { connect } from "react-redux";
import { onPresAddEvent, onPresPopUpEvent, 
  onPresPopUpAssign, onPresRooms, 
  onPresPopUpRemove,updateLoadingMessage,
  updateLoadingController} from "../actions";
import { Form } from 'react-bootstrap';
import axios from "axios";


class PopUpAssign extends React.Component {
    //Initial State
constructor(props) {
  super(props)
  this.state = {
    dateAndTime: '',
    done: false,
  }
}
componentDidMount() {
  window.scrollTo(0, 0);
 
  this.getUserWitnessData()
  const DATE_OPTIONS = { year: 'numeric', month: 'long', day: 'numeric', time: 'long' };
    const myDate = new Date().toLocaleDateString('en-ZA', DATE_OPTIONS)
    const myTime = new Date().toLocaleTimeString('en-ZA')
    this.setState({ dateAndTime: myDate + myTime })
}

//Send Vetted status
  assignRoom(roomID){
    
    this.props.updateLoadingController(true);
    this.props.updateLoadingMessage("Assigning to room...");
   
    const data = {
      'UserCode':  localStorage.getItem('userCode'),
      'RubixRegisterUserID': this.props.currentStudentiD,
      'RubixClientID': localStorage.getItem('clientID'),
      'RubixResidenceRoomsID': localStorage.getItem('roomID'),
    }
    
    const requestOptions = {
      title: 'Sending Vetted Status Form',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    };

   //console.log("Room assign Data: ", data)
    const postData = async () => {
      await axios.post('https://adowarest.rubix.mobi:88/api/RubixAdminAddRubixUserResidencesRoom', data, requestOptions)
      .then(response=>{
        //console.log("Room response: ", response)
      })
    }
    postData().then(()=>{
      this.sendAuttingStatus(roomID)
    })
  }

    //Send Auditted status
    sendAuttingStatus(roomID){
      this.props.updateLoadingMessage("Sending Audit Data..");
      const data = {
        'UserCode':  localStorage.getItem('userCode'),
        'RubixRegisterUserID': this.props.currentStudentiD,
        'RubixDocumentType': '',
        'RubixDocumentID': '',
        'RubixVetted': '',
        'RubixVettedResult': '',
        'RubixRoomAllocationResult': 'Assign',
        'RubixRoomID': roomID,
        'RubixDocumentVettedResultComment': ''
      }
      
      const requestOptions = {
        title: 'Sending Auditted Status Form',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data
      };
  
      ////console.log("Posted Vetting Data: ", data)
      const postData = async () => {
        await axios.post('https://adowarest.rubix.mobi:88/api/RubixAdminAudits', data, requestOptions)
        .then(response=>{
          ////console.log("DB response: ", response)
        })
      }
      postData().then(()=>{
        //this.props.updateLoadingController(false);
        this.postSignature('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+P///38ACfsD/QVDRcoAAAAASUVORK5CYII=', this.props.currentStudentiD, 0)
        //window.location.reload()
      })
    }

  //Post File Using Mongo
  onPressUpload(image, filetype, currentActiveKey) {
    this.props.updateLoadingMessage("Uploading Lease Document...");
    
    const postDocument = async () => {
      const data = new FormData()
      data.append('image', image)
      data.append('FileType', filetype)
      data.append('RubixRegisterUserID', this.props.currentStudentiD)
      const requestOptions = {
        title: 'Student Document Upload',
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data', },
        body: data
      };
      for (var pair of data.entries()) {
        ////console.log(pair[0], ', ', pair[1]);
      }
      await axios.post('https://adowadocuments.rubix.mobi:86/feed/post?image', data, requestOptions)
        .then(response => {
          ////console.log("Upload details:", response)
          this.setState({
            done: true
          })
          //this.setState({ mongoID: response.data.post._id })
        })
    }
    postDocument()
  }

 //Converts base64 to file
 dataURLtoFile(dataurl, filename) {

  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

  //Function to post signature to API
  postSignature(signature, userid, tryval) {
    this.props.updateLoadingMessage("Generating Lease...");
    ////console.log("I am called incorrectly")
    const postDocument = async () => {
      const data = {
        'RubixRegisterUserID': parseInt(userid),
        'ClientId': 1,
        'Time_and_Date': this.state.dateAndTime,
        'Signature': signature,
      }
      const requestOptions = {
        title: 'Student Signature Upload',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: data
      };
      ////console.log(" mY Posted Data:", data)
      await axios.post('https://adowarest.rubix.mobi:88/api/RubixGeneratePDF', data, requestOptions)
        .then(response => {
          ////console.log("Signature upload details:", response)
          this.setState({ docUrl: response.data.Base })
          if (tryval === 1) {
            const dataUrl = 'data:application/pdf;base64,' + response.data.PostRubixUserData
            const temp = this.dataURLtoFile(dataUrl, 'Lease Agreement') //this.convertBase64ToBlob(response.data.Base)
            ////console.log("temp file:", temp)
            this.onPressUpload(temp, 'lease-agreement', 'signing')
          } else if (tryval === 0) {
            const dataUrl = 'data:application/pdf;base64,' + response.data.PostRubixUserData
            const temp = this.dataURLtoFile(dataUrl, 'unsigned Agreement') //this.convertBase64ToBlob(response.data.Base)
            ////console.log("temp file:", temp)
            this.onPressUpload(temp, 'unsigned-agreement', 'signing')
          }
        })
    }
    postDocument()
  }
    //Coleect User Signing Info
    getUserWitnessData() {
      //Fetch IP Address
      const getData = async () => {
        const res = await axios.get('https://geolocation-db.com/json/')
        ////console.log("my IP", res.data);
        this.setState({userIPAddress: res.data.IPv4 })
      }
      getData()
    }
  

  render() {
    const {isPopUpAssign, Title, Body, roomID, Function} = this.props;
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
              
                  //this.sendVettingStatus(FileType, DocID, 'correct')
                  this.assignRoom(roomID)
                  //this.props.onPresRooms();
                  //window.location.reload()
                      this.props.onPresPopUpAssign()
                      setTimeout(() => {
                        ////console.log("this is it: ", this.state.done)
                        if(this.state.done){
                    
                          this.props.updateLoadingController(false);
                          Function()
                        }
                      }, 5000);
                  
                }}>
                Assign
              </button>
              <button
                type="button"
                onClick={(e) => {
                  //Remove from room assign room cancel
                  this.props.onPresPopUpAssign()
                  //this.removeStudent(roomID)
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
  isPopUpAssign: mailInboxReducer.isShowAssignModal,
  isPopUpRemove: mailInboxReducer.isShowRemoveModal,
  currentStudentiD: navigationReducer.studentID,

  MyloadingController: navigationReducer.loadingController,
  loadingMessage: navigationReducer.loadingMessage,
});

export default connect(mapStateToProps, { 
  onPresAddEvent, 
  onPresPopUpEvent, 
  onPresPopUpAssign, 
  onPresRooms, 
  onPresPopUpRemove,
  updateLoadingMessage,
  updateLoadingController,
  })(PopUpAssign);
