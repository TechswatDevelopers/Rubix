import React from "react";
import { connect } from "react-redux";
import { onPresAddEvent, 
  onPresPopUpEvent, 
  onPresPopUpConfirm,
  updateLoadingMessage,
  updateLoadingController,
} from "../actions";
import { Form } from 'react-bootstrap';
import axios from "axios";

class PopUpConfirm extends React.Component {
    //Initial State
constructor(props) {
  super(props)
  this.state = {
    dateAndTime: '',
    userIPAddress: '',
    runFunc: null,
    
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

  //Post File Using Mongo
  onPressUpload(image, filetype, currentActiveKey) {
    //Set Loading Screen OFF
    this.props.updateLoadingController(true);
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
    /*   for (var pair of data.entries()) {
        console.log(pair[0], ', ', pair[1]);
      } */
      await axios.post('https://jjpdocument.rubix.mobi:86/feed/post?image', data, requestOptions)
        .then(response => {
          //console.log("Upload details:", response)
          this.setState({ mongoID: response.data.post._id })
        })
    }
    postDocument().then(() => {
      this.setState({
        isLoad: false
      })
      this.props.updateLoadingController(false);
    })
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
    //console.log("I am called incorrectly")
    const postDocument = async () => {
      const data = {
        'RubixRegisterUserID': userid,
        'ClientIdFronEnd': localStorage.getItem('clientID'),
        'IP_Address': this.state.userIPAddress,
        'Time_and_Date': this.state.dateAndTime,
        'image': signature,
      }
      const requestOptions = {
        title: 'Student Signature Upload',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: data
      };
      //console.log("Posted Data:", data)
      await axios.post('https://jjppdf.rubix.mobi:94/PDFSignature', data, requestOptions)
        .then(response => {
          //console.log("Signature upload details:", response)
          this.setState({ docUrl: response.data.Base })
          if (tryval === 1) {
            const dataUrl = 'data:application/pdf;base64,' + response.data.Base
            const temp = this.dataURLtoFile(dataUrl, 'Lease Agreement') //this.convertBase64ToBlob(response.data.Base)
            //console.log("temp file:", temp)
            this.onPressUpload(temp, 'lease-agreement', 'signing')
          } else if (tryval === 0) {
            const dataUrl = 'data:application/pdf;base64,' + response.data.Base
            const temp = this.dataURLtoFile(dataUrl, 'unsigned Agreement') //this.convertBase64ToBlob(response.data.Base)
            //console.log("temp file:", temp)
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
    //console.log("my IP", res.data);
    this.setState({userIPAddress: res.data.IPv4 })
  }
  getData()
}

  //Send Lease for Signing
  sendFinalLease(filename){
    //Set Loading Screen ON
    this.props.updateLoadingController(true);
    this.props.updateLoadingMessage("Generating Lease...");
    //Request Data
    const data = {
   "PDFDocumentUrl" : filename,
   "UserCode" : localStorage.getItem('userCode'),
   "ClientId" : localStorage.getItem('clientID'),
   "IP_Address" :'102.65.77.244' /* this.state.userIPAddress */,
   "Time_and_Date" : this.state.dateAndTime,
   "Browser" : ""
    }

    const requestOptions = {
      title: 'Sending Final Signature Form',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    };
    //console.log('My data: ', data)
    const postData = async () => {
      await axios.post('https://jjppdf.rubix.mobi:94/PDFFinalSignature', data, requestOptions)
      .then(response=>{
        //console.log("Final Lease Response: ", response)
        
        //Send documents API
        const dataUrl = 'data:application/pdf;base64,' + response.data.Base
        const temp = this.dataURLtoFile(dataUrl, 'Lease Agreement')
        //Set Loading Screen OFF
        this.props.updateLoadingController(false);
        this.onPressUpload(temp, 'lease-agreement', 'signing')
      })
    }
    postData()
  }


  //Send Vetted status
  sendVettingStatus(filetype, docID, vet){
    this.props.updateLoadingController(true);
    let vettedStatus
    if(vet == 'correct') {
      vettedStatus = 1
    } else {
      vettedStatus = 0
    }
    const data = {
      'UserCode':  localStorage.getItem('userCode'),
      'RubixRegisterUserID': this.props.currentStudentiD,
      'RubixDocumentType': filetype,
      'RubixDocumentID': docID,
      'RubixVetted': vettedStatus,
      'RubixVettedResult': vet,
      'RubixVettedComment': document.getElementById('comment').value
    }
    
    const requestOptions = {
      title: 'Sending Vetted Status Form',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    };

    //console.log("Posted Vetting Data: ", data)
    const postData = async () => {
      await axios.post('https://jjprest.rubix.mobi:88/api/RubixAdminVettings', data, requestOptions)
      .then(response=>{
        //console.log("DB response: ", response)
        setTimeout(() => {
          this.sendAuttingStatus(filetype, docID, vet)
        }, 2000);
      })
    }
    postData().then(()=>{
      
    })
  }


  //Send Auditted status
  sendAuttingStatus(filetype, docID, vet, call){
    let vettedStatus
    if(vet == 'correct') {
      vettedStatus = 1
    } else {
      vettedStatus = 0
    }
    const data = {
      'UserCode':  localStorage.getItem('userCode'),
      'RubixRegisterUserID': this.props.currentStudentiD,
      'RubixDocumentID': docID,
      'RubixDocumentType': filetype,
      'RubixDocumentVettedResult': vettedStatus,
      'RubixRoomAllocationResult': '',
      'RubixRoomID': '',
      'RubixDocumentVettedResultComment': document.getElementById('comment').value
    }
    
    const requestOptions = {
      title: 'Sending Auditted Status Form',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    };

    //console.log("Posted Vetting Data: ", data)
    const postData = async () => {
      await axios.post('https://jjprest.rubix.mobi:88/api/RubixAdminAudits', data, requestOptions)
      .then(response=>{
        //console.log("DB response: ", response)
      })
    }
    postData().then(()=>{
      this.props.updateLoadingController(false);
      //this.state.runFunc()
      //window.location.reload()
    })
  }

  render() {
    const { isPopUpConfirm, Title, Body, FileType, DocID, Filename, Function} = this.props;
    return (
      <div
        className={isPopUpConfirm ? "modal fade show" : "modal fade"}
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="title" id="defaultModalLabel">
               {Title}
              </h4>
            </div>
            <div className="modal-body">
              {Body}
              <label className="control-label sr-only" >
                          Vet Comment
                            </label>
                        <input
                          className="form-control"
                          id="comment"
                          placeholder="Vetting comment..."
                          type="email"
                        />
            </div>
            <div className="modal-footer">
            <button type="button" className="btn btn-primary" onClick={(e) => {
            Function()
                  this.sendVettingStatus(FileType, DocID, 'correct')
                  if(FileType == 'lease-agreement'){
                    
                    setTimeout(() => {
                      this.sendFinalLease(Filename)
                    }, 3000);
                  }
                  this.props.onPresPopUpConfirm();

                }
                }>
                Vet as Correct
              </button>
              <button
                type="button"
                onClick={(e) => {
                  Function()
                  this.sendVettingStatus(FileType, DocID, 'incorrect')
                  if(FileType == 'lease-agreement'){
                    //Set timer for loading screen
                    setTimeout(() => {
                      this.postSignature('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+P///38ACfsD/QVDRcoAAAAASUVORK5CYII=', this.props.currentStudentiD, 0)
                      //this.resetLease(Filename)
                    }, 3000);
                  }
                  this.props.onPresPopUpConfirm();
                }}
                className="btn btn-simple"
                data-dismiss="modal"
              >
                Vet as Incorrect
              </button>
              <button
                type="button"
                onClick={(e) => {
                  console.log('pressed')
                  this.props.onPresPopUpConfirm();
                }}
                className="btn btn-danger"
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
  currentStudentiD: navigationReducer.studentID,

  MyloadingController: navigationReducer.loadingController,
  loadingMessage: navigationReducer.loadingMessage,
});

export default connect(mapStateToProps, {
   onPresAddEvent, 
   onPresPopUpEvent, 
   onPresPopUpConfirm,
   updateLoadingMessage,
   updateLoadingController,
  })(PopUpConfirm);
