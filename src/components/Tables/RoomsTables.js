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

class RoomsTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentRoom: {},
      dateAndTime: '',
      signature: '',
      blank: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+P///38ACfsD/QVDRcoAAAAASUVORK5CYII='
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getUserWitnessData()

    
  const DATE_OPTIONS = { year: 'numeric', month: 'long', day: 'numeric', time: 'long' };
  const myDate = new Date().toLocaleDateString('en-ZA', DATE_OPTIONS)
  const myTime = new Date().toLocaleTimeString('en-ZA')
  this.setState({ dateAndTime: myDate + myTime })

  this.loadDocuments(localStorage.getItem('userID'))
  }

     //Fetch All documents from DB
     loadDocuments(userID) {
      const fetchData = async () => {
        //Get documents from DB
        await fetch('https://jjpdocument.rubix.mobi:86/feed/post/' + userID)
          .then(response => response.json())
          .then(data => {
            console.log("Usrt ID: ", userID)
           console.log("documents data:", data)
            //Set Documents list to 'docs'
            this.setState({ docs: data.post })
  
            ///Set signature
            var myList = data.post.filter(doc => doc.FileType == "signature")
            ////////console.log("My signature: ", myList)
              if (myList.length != 0){
                //Convert signature to base 64
                var dataUrl =  'data:image/png;base64,' + data.post.filter(doc => doc.FileType == "signature")[0].image
                const temp = this.dataURLtoFile(dataUrl, 'signature') 
                //////console.log("My signature: ", temp)
                this.setState({
                  signature: dataUrl
                  })
              } /* else {
                this.setState({
                  signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+P///38ACfsD/QVDRcoAAAAASUVORK5CYII='
                })
              } */
            
          });
  
      };
      fetchData()
      .then(()=>{
        setTimeout(() => {
        //this.props.updateLoadingController(false);
      }, 1000)
   
        //Set timer for loading screen
    ;
        
      })
      
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

    ////console.log("Posted Vetting Data: ", data)
    const postData = async () => {
      await axios.post('https://jjprest.rubix.mobi:88/api/RubixAdminAudits', data, requestOptions)
      .then(response=>{
        ////console.log("DB response: ", response)
      })
    }
    postData().then(()=>{
      //window.location.reload()
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
        data.append('RubixRegisterUserID', localStorage.getItem('userID'))
        const requestOptions = {
          title: 'Student Document Upload',
          method: 'POST',
          headers: { 'Content-Type': 'multipart/form-data', },
          body: data
        };
        for (var pair of data.entries()) {
          ////console.log(pair[0], ', ', pair[1]);
        }
        await axios.post('https://jjpdocument.rubix.mobi:86/feed/post?image', data, requestOptions)
          .then(response => {
            ////console.log("Upload details:", response)
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

    //Populate Booking Form
    postBookingForm(signature, userid) {
      const postDocument = async () => {
        const data = {
          'RubixRegisterUserID': userid,
          'ClientId': localStorage.getItem('clientID'),
          'Time_and_Date': this.state.dateAndTime,
          'Signature': signature
        }
  
        const requestOptions = {
          title: 'Student Signature Upload',
          method: 'POST',
          headers: { 'Content-Type': 'application/json', },
          body: data
        };
        //console.log("Posted 2nd Data:", data)
        await axios.post('https://jjprest.rubix.mobi:88/api/RubixGenerateBookingFormPDF', data, requestOptions)
          .then(response => {
            //console.log("testing: ", response.data)
            const dataUrl = 'data:application/pdf;base64,' + response.data.PostRubixUserData
            const temp = this.dataURLtoFile(dataUrl, 'Booking Form') //this.convertBase64ToBlob(response.data.Base)
            ////console.log("temp file:", temp)
            this.onPressUpload(temp, 'booking-doc', 'signing')
            ////console.log("Signature upload details:", response)
            this.setState({ docUrl: response.data.PostRubixUserData })
            this.setState({
              isLoad: false
            })
            alert("Documents created successfully")
            
          })
      }
      postDocument()
    }
  
    //Function to post signature to API
    postSignature(signature, userid, tryval) {
     // this.props.updateLoadingMessage("Generating Lease...");
      //console.log("I am called incorrectly")

      let mySignature
      if(this.state.signature != null){
        ////console.log("This is it: ", this.state.signature)
        mySignature = this.state.signature
      } else {
        mySignature = signature
      }
      const postDocument = async () => {
        const data = {
          'RubixRegisterUserID': userid,
          'ClientId': localStorage.getItem('clientID'),
          'Time_and_Date': this.state.dateAndTime,
          'Signature': mySignature
        }
        const requestOptions = {
          title: 'Student Signature Upload',
          method: 'POST',
          headers: { 'Content-Type': 'application/json', },
          body: data
        };
        //console.log("Posted Data:", data)
        await axios.post('https://jjprest.rubix.mobi:88/api/RubixGeneratePDF', data, requestOptions)
          .then(response => {
            //console.log("Signature upload details:", response)
            this.setState({ docUrl: response.data.Base })
            if (tryval === 1) {
              const dataUrl = 'data:application/pdf;base64,' + response.data.PostRubixUserData
              const temp = this.dataURLtoFile(dataUrl, 'Lease Agreement') //this.convertBase64ToBlob(response.data.Base)
              console.log("temp file:", temp)
              this.onPressUpload(temp, 'lease-agreement', userid)
            } else if (tryval === 0) {
              const dataUrl = 'data:application/pdf;base64,' + response.data.PostRubixUserData
              const temp = this.dataURLtoFile(dataUrl, 'unsigned Agreement') //this.convertBase64ToBlob(response.data.Base)
              console.log("temp file:", temp)
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
          ////console.log("my IP", res.data);
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

      await axios.post('https://jjppdf.rubix.mobi:94/PDFRoomAmend', data, requestOptions)
      .then(response => {
        ////console.log('Response: ', response)
        const dataUrl = 'data:application/pdf;base64,' + response.data.Base
              const temp = this.dataURLtoFile(dataUrl, 'Lease Agreement') //this.convertBase64ToBlob(response.data.Base)
              ////console.log("temp file:", temp)
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
        {/* <PopUpAssign 
        roomID = {this.state.currentRoom.RubixResidenceRoomsID}
        Title= "Confirm Room Assigning"
        Body = {"You are about to assign " + this.props.currentStudentname + " to a room: " }
     
        /> */}
        
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
                  <th>Res Code</th>
                  <th>Building Number</th>
                  <th>Floor Number</th>
                  <th>Room Number</th>
                  <th>Bed Number</th>
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
                  <td>{room.BuildingNumber}</td>
                  <td>{room.FloorNumber}</td>
                  <td>{room.RoomNumber}</td>
                  <td>{room.BedNumber}</td>
                  <td>
                    <>
                  
                  
                  { RoomList.length == 1 && room.RubixRegisterUserID != 0
                    ? <>
                    
                    <button className="btn btn-sm btn-outline-danger" 
                    onClick={(e)=>{
                      e.preventDefault()
                      //this.props.onPresRooms(e)
                      this.props.onPresPopUpRemove()
                      
                      }}>
                      <span>
                        <i className=" icon-logout"></i> 
                           Remove from Room
                        </span>
                      </button>

                    <button className="btn btn-sm btn-outline-primary ml-2" 
                    onClick={(e)=>{
                      e.preventDefault()
                      //this.props.onPresRooms(e)
                      this.postSignature('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+P///38ACfsD/QVDRcoAAAAASUVORK5CYII=', Student, 0)
                      setTimeout(() => {
      
                        this.postBookingForm('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+P///38ACfsD/QVDRcoAAAAASUVORK5CYII=', localStorage.getItem('userID'),)
                  }, 3000);
                      
                      }}>
                      <span>
                        <i className=" icon-refresh"></i> 
                           Regenerate Lease
                        </span>
                      </button>
                      
                      </>


                    : <button className="btn btn-sm btn-outline-success" 
                  onClick={(e)=>{
                    e.preventDefault()
                    this.setState({
                    currentRoom: room
                  })
                    //console.log("The selcted room: ", room.RubixResidenceRoomsID)
                    localStorage.setItem('roomID', room.RubixResidenceRoomsID)
                    //this.props.onPresRooms(e)
                    this.props.onPresPopUpAssign()
                   
                    
                    }}>
                    <span>
                      <i className=" icon-key"></i> 
                         Assign to Room
                      </span>
                    </button>
                    }
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
})(RoomsTable);
