import React from "react";
import { connect } from "react-redux";
import { onPresAddEvent, onPresPopUpEvent, onPresPopUpAssign, onPresRooms, onPresPopUpRemove } from "../actions";
import { Form } from 'react-bootstrap';
import axios from "axios";


class PopUpAssign extends React.Component {
    //Initial State
constructor(props) {
  super(props)
  this.state = {
    dateAndTime: ''
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
   
    const data = {
      'UserCode':  localStorage.getItem('userCode'),
      'RubixRegisterUserID': this.props.currentStudentiD,
      'RubixClientID': localStorage.getItem('clientID'),
      'RubixResidenceRoomsID': roomID,
    }
    
    const requestOptions = {
      title: 'Sending Vetted Status Form',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    };

   // console.log("Posted Vetting Data: ", data)
    const postData = async () => {
      await axios.post('https://rubixapi.cjstudents.co.za:88/api/RubixAdminAddRubixUserResidencesRoom', data, requestOptions)
      .then(response=>{
        console.log("DB response: ", response)
      })
    }
    postData().then(()=>{
      this.sendAuttingStatus(roomID)
    })
  }

    //Send Auditted status
    sendAuttingStatus(roomID){
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
  
      console.log("Posted Vetting Data: ", data)
      const postData = async () => {
        await axios.post('https://rubixapi.cjstudents.co.za:88/api/RubixAdminAudits', data, requestOptions)
        .then(response=>{
          console.log("DB response: ", response)
        })
      }
      postData().then(()=>{
        this.postSignature('https://github.com/TechSwat/CGES-Rubix-ClientPDF/raw/main/Frame%201%20(1).png', this.props.currentStudentiD, 0)
        //window.location.reload()
      })
    }

    
  //Post File Using Mongo
  onPressUpload(image, filetype, currentActiveKey) {
    
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
        console.log(pair[0], ', ', pair[1]);
      }
      await axios.post('https://rubixdocuments.cjstudents.co.za:86/feed/post?image', data, requestOptions)
        .then(response => {
          console.log("Upload details:", response)
          this.setState({ mongoID: response.data.post._id })
        })
    }
    postDocument().then(() => {
      //alert("Document uploaded successfully")
      this.setState({
        isLoad: false
      })
      this.props.onPresPopUpEvent()
      window.location.reload()
      
      
      /* setTimeout(() => {
        
        this.props.history.push("/login/" + localStorage.getItem('clientID'))
      }, 5000); */
      
      //document.getElementById('uncontrolled-tab-example').activeKey = currentActiveKey
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
    //console.log("I am called incorrectly")
    const postDocument = async () => {
      const data = {
        'RubixRegisterUserID': userid,
        'ClientIdFronEnd': localStorage.getItem('clientID'),
        'IP_Address': this.state.userIPAddress,
        'Time_and_Date': this.state.dateAndTime,
        'image': signature
      }
      const requestOptions = {
        title: 'Student Signature Upload',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: data
      };
      console.log("Posted Data:", data)
      await axios.post('https://rubixpdf.cjstudents.co.za:94/PDFSignature', data, requestOptions)
        .then(response => {
          console.log("Signature upload details:", response)
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
  

  render() {
    const {isPopUpAssign, Title, Body, roomID} = this.props;
    return (
      <div
        className={isPopUpAssign ? "modal fade show" : "modal fade"}
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
              
            </div>
            <div className="modal-footer">
            <button type="button" className="btn btn-primary" onClick={(e) => {
                  //this.sendVettingStatus(FileType, DocID, 'correct')
                  this.assignRoom(roomID)
                  this.props.onPresRooms();
                  this.props.onPresPopUpAssign()
                  //window.location.reload()
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
});

export default connect(mapStateToProps, { onPresAddEvent, onPresPopUpEvent, onPresPopUpAssign, onPresRooms, onPresPopUpRemove  })(PopUpAssign);
