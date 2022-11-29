import React from "react";
import { connect } from "react-redux";
import "bootstrap/dist/js/bootstrap.min.js";
import {
  updateStudentID,
  onUpdateStudentRubixID,
  onPresShowProfile,
  onPresRooms,
  onPresPopUpAssign,
  onPresPopUpRemove,
  onToggleLeaseAmmend} from "../../actions";
import PopUpAssign from "../../components/PopUpAssignRoom"
import PopUpRemove from "../../components/PopUpRemoveFromRoom"
import AmmendLease from "../../components/AmmendLease"
import axios from "axios";

class RoomsTableStudent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentRoom: {},
      dateAndTime: '',
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getUserWitnessData()

    
  const DATE_OPTIONS = { year: 'numeric', month: 'long', day: 'numeric', time: 'long' };
  const myDate = new Date().toLocaleDateString('en-ZA', DATE_OPTIONS)
  const myTime = new Date().toLocaleTimeString('en-ZA')
  this.setState({ dateAndTime: myDate + myTime })

console.log("I am called with: ", this.props.RoomList )
  }
   //Send Auditted status
   sendAuttingStatus(studentID){
    const data = {
      'UserCode':  localStorage.getItem('userCode'),
      'RubixRegisterUserID': studentID,
      'RubixDocumentID': '',
      'RubixDocumentType': 'unsigned-agreement',
      'RubixDocumentVettedResult': 0,
      'RubixRoomAllocationResult': '',
      'RubixRoomID': '',
      'RubixDocumentVettedResultComment': 'Lease regenerated'
    }
    
    const requestOptions = {
      title: 'Sending Auditted Status Form',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    };

    console.log("Posted Vetting Data: ", data)
    const postData = async () => {
      await axios.post('https://adowarest.rubix.mobi:88/api/RubixAdminAudits', data, requestOptions)
      .then(response=>{
        //console.log("DB response: ", response)
      })
    }
    postData().then(()=>{
      window.location.reload()
    })
  }

  ///Tobe deleted
    //Post File Using Mongo
    onPressUpload(image, filetype, studentiD) {
      //this.props.updateLoadingMessage("Uploading Lease Document...");
      
      const postDocument = async () => {
        const data = new FormData()
        data.append('image', image)
        data.append('FileType', filetype)
        data.append('RubixRegisterUserID', studentiD)
        const requestOptions = {
          title: 'Student Document Upload',
          method: 'POST',
          headers: { 'Content-Type': 'multipart/form-data', },
          body: data
        };
        for (var pair of data.entries()) {
          //console.log(pair[0], ', ', pair[1]);
        }
        await axios.post('https://adowadocument.rubix.mobi:86/feed/post?image', data, requestOptions)
          .then(response => {
            //console.log("Upload details:", response)
            this.setState({ mongoID: response.data.post._id })
          })
      }
      postDocument().then(()=>{
        this.sendAuttingStatus(studentiD)
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
     // this.props.updateLoadingMessage("Generating Lease...");
      //console.log("I am called incorrectly")
      const postDocument = async () => {
        const data = {
          'RubixRegisterUserID': userid,
          'ClientIdFronEnd': localStorage.getItem('clientID'),
          'IP_Address': '',
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
        await axios.post('https://adowapdf.rubix.mobi:94/PDFSignature', data, requestOptions)
          .then(response => {
            console.log("Signature upload details:", response)
            this.setState({ docUrl: response.data.Base })
            if (tryval === 1) {
              const dataUrl = 'data:application/pdf;base64,' + response.data.Base
              const temp = this.dataURLtoFile(dataUrl, 'Lease Agreement') //this.convertBase64ToBlob(response.data.Base)
              //console.log("temp file:", temp)
              this.onPressUpload(temp, 'lease-agreement', userid)
            } else if (tryval === 0) {
              const dataUrl = 'data:application/pdf;base64,' + response.data.Base
              const temp = this.dataURLtoFile(dataUrl, 'unsigned Agreement') //this.convertBase64ToBlob(response.data.Base)
              //console.log("temp file:", temp)
              this.onPressUpload(temp, 'unsigned-agreement', userid)
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
      
    ///Change room
    changeRoom(document, roomCode, roomNumber, userid){
      const data = {
        'PDFDocumentUrl': document,
        'RoomCode': roomCode,
        'RoomNumber': roomNumber,
      }

      const requestOptions = {
        title: 'Student Lease Room Update',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: data
      }

      const postDocument = async () => {

      await axios.post('https://adowapdf.rubix.mobi:94/PDFRoomAmend', data, requestOptions)
      .then(response => {
        console.log('Response: ', response)
        const dataUrl = 'data:application/pdf;base64,' + response.data.Base
              const temp = this.dataURLtoFile(dataUrl, 'Lease Agreement') //this.convertBase64ToBlob(response.data.Base)
              //console.log("temp file:", temp)
              this.onPressUpload(temp, 'lease-agreement', userid)
      })
    }
    postDocument()
  }
  
  render() {
    const { RoomList, Student, Body } = this.props;
    return (
      <div className="col-lg-12">
        <div className="card">
      
        <AmmendLease 
        StudentID= {Student}
        />
          <div className="header">
            <h2>
              Available Room{" "}
              <small>
               List of all Rooms Available
              </small>
            </h2>
            {Body}
          </div>
          <div className="body table-responsive table-hover">
            <table className="table">
              <thead>
                <tr>
                  <th>Building Number</th>
                  <th>Floor Number</th>
                  <th>Room Number</th>
                  <th>QUICK ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {RoomList.map((room, index) => (
                  <>
                  <tr data-toggle="collapse" 
                  aria-expanded="false"
                  aria-controls={"collapseComment" + index}
                  href={"#collapseComment" + index}
                  onClick={(e)=>{
                    localStorage.setItem('roomID', room.RubixResidenceRoomsID)
                    this.setState({
                    currentRoom: room
                  })}
                
                }
                  >
                  <th scope="row">
                  {room.ResidenceName}
                    </th>
                  <td>{room.FloorNumber}</td>
                  <td>{room.RoomNumber}</td>
                  <td>
                    <>
                  
                  <button className="btn btn-sm btn-outline-success" 
                  onClick={(e)=>{
                    e.preventDefault()
                    localStorage.setItem("roomID", room.RubixResidenceRoomsID)
                    this.props.onPresRooms()
                    //this.props.onPresPopUpAssign()
                    
                    }}>
                    <span>
                      <i className="icon-check"></i> 
                           Choose Room
                      </span>
                    </button>
                  </></td>
                </tr>
                <tr className="collapse multi-collapse m-t-10" id={"collapseComment" + index} >
                      <th scope="row"> </th>
                    
                      <td><span><strong>Room Capacity: </strong>{room.Capacity} </span></td>
                      <td><span><strong>Occupancy: </strong>{room.AvaibaleBeds}</span></td>
                      </tr>
              </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ mailInboxReducer, navigationReducer, }) => ({
  currentStudentiD: navigationReducer.studentID,
  currentStudentname: navigationReducer.studentName,
  showProfile: mailInboxReducer.isProfileShowing,
  showRooms: mailInboxReducer.isRoomshowing,

});

export default connect(mapStateToProps, {
  updateStudentID,
  onUpdateStudentRubixID,
  onPresShowProfile,
  onPresRooms,
  onPresPopUpAssign,
  onPresPopUpRemove,
  onToggleLeaseAmmend
})(RoomsTableStudent);
