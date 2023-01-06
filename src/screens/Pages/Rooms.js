import React from "react";
import { Dropdown } from "react-bootstrap";
import { connect } from "react-redux";
import axios from "axios";
import PageHeader from "../../components/PageHeader";
import RoomsTable from "../../components/Tables/RoomsTables";
import PopUpAssign from "../../components/PopUpAssignRoom";
import PopUpRemove from "../../components/PopUpRemoveFromRoom";
import {Grid, Row, Col, Button} from "react-bootstrap";

class RoomAllocation extends React.Component {
  //Initial State
  constructor(props) {
    super(props)
    this.testRef = React.createRef();
    this.state = {
      studentRoomDetails: {},
      availableRooms: [],

      buildingNumberList: [],
      buildingNumber: '',

      floorNumberList: [],
      floorNumber: '',

      roomNumberList: [],
      roomNumber: '',

      genderRoomList: ['Female', 'Male'],
      roomGender: '',

      
    roomedstudents: [],

    index: 0,
    
    dateAndTime: '',

    showFilters: false,
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    this.getStudentRoomDetails(localStorage.getItem('userID'))
    const scrollToElement = () => this.testRef.current.scrollIntoView();
    scrollToElement()

    
  const DATE_OPTIONS = { year: 'numeric', month: 'long', day: 'numeric', time: 'long' };
  const myDate = new Date().toLocaleDateString('en-ZA', DATE_OPTIONS)
  const myTime = new Date().toLocaleTimeString('en-ZA')
  this.setState({ dateAndTime: myDate + myTime })
  }

  //Fetch User Res Data
  getStudentRoomDetails(studentID){
    const pingData = {
        'UserCode': localStorage.getItem('userCode'),
        'RubixClientID': localStorage.getItem('clientID'),
        'ResidenceName': "",
        'RubixResidenceID': localStorage.getItem('adminLevel') == 2 || localStorage.getItem('adminLevel') == '2' 
        ? this.props.currentRES
        : localStorage.getItem('resID'),
        'BuildingNumber': "",
        'FloorNumber': "",
        'RoomNumber': "",
        'RubixRegisterUserID': localStorage.getItem('userID')

      };
      //Ping Request Headers
      const requestOptions = {
        title: 'Get Students Room Allocation Details',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: pingData
      };
      console.log('Posted:', pingData)
      const postData = async () => {
        await axios.post('https://adowarest.rubix.mobi:88/api/RubixAdminStudentRoomAvailable', pingData, requestOptions)
        .then(response => {
          console.log("Students Rooms List:", response)
          if (response.data.PostRubixUserData){
            //Show available rooms
            this.setState({
              availableRooms: response.data.PostRubixUserData
            })
            this.setState({
              buildingNumberList:  this.populate('BuildingNumber', response.data.PostRubixUserData),
              floorNumberList: this.populate('FloorNumber', response.data.PostRubixUserData),
              roomNumberList: this.populate('RoomNumber', response.data.PostRubixUserData)

            })

          } else {
            //Show Room Details
            this.getStudentRoomDetails(' ')
          }
          

        })
      }
      postData()
  }

  //Populate Lists
  populate(filterType, roomList){
    let newList = []

    //Select Filter
    switch(filterType){
      case 'BuildingNumber':
        {
          for(let i = 0; i<= roomList.length - 1; i++ ){
            
            if(newList.includes(roomList[i].BuildingNumber)){
              //console.log('found', roomList[i].BuildingNumber)
              
            } else {
              newList.push(roomList[i].BuildingNumber)
            }
          }
        }
        break;
      case 'FloorNumber':
        {
          for(let i = 0; i<= roomList.length - 1; i++ ){
            
            if(newList.includes(roomList[i].FloorNumber)){
              //console.log('found')
            } else {
              newList.push(roomList[i].FloorNumber)
            }
          } 
        }
        break;
      case 'RoomNumber':
        {
          for(let i = 0; i<= roomList.length - 1; i++ ){
            
            if(newList.includes(roomList[i].RoomNumber)){
              //console.log('found')
            } else {
              newList.push(roomList[i].RoomNumber)
            }
          }
        }
    }
    return newList
  }

  //Get Romms Filters
  getRoomsFilters(buildingNumber, floorNumber, roomNumber, studentID, gender){
    const pingData = {
        'UserCode': localStorage.getItem('userCode'),
        'RubixClientID': localStorage.getItem('clientID'),
        'ResidenceName': "",
        'RubixResidenceID': localStorage.getItem('adminLevel') == 2 || localStorage.getItem('adminLevel') == '2' 
        ? this.props.currentRES
        : localStorage.getItem('resID'),
        'BuildingNumber': buildingNumber,
        'FloorNumber': floorNumber,
        'RoomNumber': roomNumber,
        'Gender': gender,
        'RubixRegisterUserID': studentID

      };
      //Ping Request Headers
      const requestOptions = {
        title: 'Get Students Room Allocation Details',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: pingData
      };
      //console.log('Posted:', pingData)
      const postData = async () => {
        await axios.post('https://adowarest.rubix.mobi:88/api/RubixAdminStudentRoomAvailableDropdown', pingData, requestOptions)
        .then(response => {
          //console.log("Students Rooms Dropdown:", response)
          if (response.data.PostRubixUserData){
            //Show available rooms
            this.setState({
              availableRooms: response.data.PostRubixUserData,
              showFilters: true
            })

            this.setState({
              buildingNumberList:  this.populate('BuildingNumber', response.data.PostRubixUserData),
              floorNumberList: this.populate('FloorNumber', response.data.PostRubixUserData),
              roomNumberList: this.populate('RoomNumber', response.data.PostRubixUserData)

            })
          } else {
            //Show Room Details
            //this.getStudentRoomDetails(' ')
            /* this.setState({
              studentRoomDetails: response.data.PostRubixUserData
            }) */
          }
          

        })
      }
      postData()
  }

  //Regenerate Leases
  regenerate(e){
    //e.preventDefault()
   
    let roomed = [this.props.Students[0], this.props.Students[1], this.props.Students[2]]
   
    if(this.state.index < this.props.Students.length){
      this.getStudentRoom(this.props.Students[this.state.index].RubixRegisterUserID)
      this.postSignature('https://github.com/TechSwat/CGES-Rubix-ClientPDF/raw/main/Frame%201%20(1).png', this.props.Students[this.state.index].RubixRegisterUserID, 0)

    }
  
  }

  
  //Fetch User Res Data
  getStudentRoom(studentID) {
    let inRoom = false
    const pingData = {
        'UserCode': localStorage.getItem('userCode'),
        'RubixClientID': localStorage.getItem('clientID'),
        'ResidenceName': "",
        'RubixResidenceID': localStorage.getItem('adminLevel') == 2 || localStorage.getItem('adminLevel') == '2' 
        ? this.props.currentRES
        : localStorage.getItem('resID'),
        'BuildingNumber': "",
        'FloorNumber': "",
        'RoomNumber': "",
        'RubixRegisterUserID': studentID

      };
      //Ping Request Headers
      const requestOptions = {
        title: 'Get Students Room Allocation Details',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: pingData
      };
      //console.log('Posted:', pingData)
      const postData = async () => {
        await axios.post('https://adowarest.rubix.mobi:88/api/RubixAdminStudentRoomAvailable', pingData, requestOptions)
        .then(response => {
          console.log("Students Rooms List:", response)
          if (response.data.PostRubixUserData){
            inRoom =  true;
            this.state.roomedstudents.push(response.data.PostRubixUserData)
            
          } else {
            inRoom =  false;
          }
        })
      }
      postData()
  }


  ///Tobe deleted
    //Post File Using Mongo
    onPressUpload(image, filetype, currentActiveKey) {
      //this.props.updateLoadingMessage("Uploading Lease Document...");
      
      const postDocument = async () => {
        const data = new FormData()
        data.append('image', image)
        data.append('FileType', filetype)
        data.append('RubixRegisterUserID', this.props.Students[this.state.index].RubixRegisterUserID)
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
      postDocument().then(() => {
        this.setState({
          index: this.state.index + 1
        })
        setTimeout(() => {
          
          this.regenerate()
        }, 4000); 
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
        //console.log("Posted Data:", data)
        await axios.post('https://adowapdf.rubix.mobi:94/PDFSignature', data, requestOptions)
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

  render() {
    const { Student, Students, Function } = this.props;
    return (
      <div ref={this.testRef}
        style={{ flex: 1 }}
        onClick={() => {
          document.body.classList.remove("offcanvas-active");
        }}
      >
        <PopUpAssign 
        roomID = {localStorage.getItem('roomID')}
        Title= "Confirm Room Assigning"
        Body = {"You are about to assign " + localStorage.getItem('userName') + " to a room " /* + this.state.currentRoom.RoomNumber */}
        Function = {()=>{
          //console.log("Testst: ", this.props.currentStudentiD)
          ///Reload Room List
          this.getStudentRoomDetails(localStorage.getItem('userID'))
          Function()
        }
          
        }
        />
        <PopUpRemove 
        roomID = {localStorage.getItem('roomID')}
        Title= "Confirm Room Removal"
        Body = {"You are about to remove " + localStorage.getItem('userName') + " from a room: " /* + this.state.currentRoom.RoomNumber */}
        Function = {()=>{
          ///Reload Room List
          this.getStudentRoomDetails(localStorage.getItem('userID'))
          Function()
        }
          
        } 
        />

        
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
        
        <div>
          <div className="container-fluid">
           <div><strong>Student:</strong> {this.props.currentStudentName}, <strong>Room Preference: </strong>{localStorage.getItem('roomPref')}</div>
            <div className="row clearfix">
              <div className="col-lg-12 col-md-12">
                <div className="card planned_task">
                  <div className="body">
                    <RoomsTable
                    Student = {this.props.currentStudentiD}
              RoomList= {this.state.availableRooms}
              Body = {
                this.state.availableRooms.length === 1 || this.state.showFilters
                ? null
              :
              <>
              <Row>
              {  <>
              <label>Buiding Number</label>
        <select className="form-control" onChange={(e)=>{
          this.getRoomsFilters(e.target.value, '', '', this.props.currentStudentiD)
          this.setState({buildingNumber: e.target.value})}} value={this.state.buildingNumber}>
        {
            
         this.state.buildingNumberList.map((buidling, index)=> (
            <option key={index} name='BuildingNumber' value = {buidling}>{buidling}</option>
        ))   
        }
    </select> 
    </>}
    { <> 
              <label>Floor Number</label>
        <select className="form-control" onChange={(e)=>{
          this.getRoomsFilters('', e.target.value, '', this.props.currentStudentiD)
          this.setState({floorNumber: e.target.value})}} value={this.state.floorNumberList}>
        {
            
         this.state.floorNumberList.map((floor, index)=> (
            <option key={index} name='FloorNumber' value = {floor}>{floor}</option>
        ))   
        }
    </select>
    
    </> }

    {   <> 
              <label>Room Number</label>
        <select className="form-control" onChange={(e)=>{
          this.getRoomsFilters('', '', e.target.value, this.props.currentStudentiD)
          this.setState({roomNumber: e.target.value})}} value={this.state.roomNumberList}>
        {
            
         this.state.roomNumberList.map((room, index)=> (
            <option key={index} name='RoomNumber' value = {room}>{room}</option>
        ))   
        }
    </select> </>}

    {   <> 
              <label>Room Gender</label>
        <select className="form-control" onChange={(e)=>{
          this.getRoomsFilters('', '', '', this.props.currentStudentiD, e.target.value == 'Female' ? 'F' : 'M')
          this.setState({ roomGender: e.target.value == 'Female' ? 'F' : 'M'})}} value={this.state.roomNumberList}>
        {
            
         this.state.genderRoomList.map((gender, index)=> (
            <option key={index} name='RoomGender' value = {gender}>{gender}</option>
        ))   
        }
    </select> </>}
    
              <button className="btn btn-primary" onClick={(e)=>this.getRoomsFilters('', '', '', this.props.currentStudentiD)}>Reset</button>
              </Row>
              </>}
              />
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

const mapStateToProps = ({ioTReducer, navigationReducer }) => ({
  isSecuritySystem: ioTReducer.isSecuritySystem,
  currentStudentiD: navigationReducer.studentID,
  currentResID: navigationReducer.studentResID,

  currentRES: navigationReducer.studentResID,

  MyloadingController: navigationReducer.loadingController,
  loadingMessage: navigationReducer.loadingMessage,
  currentStudentName: navigationReducer.studentName,
});

export default connect(mapStateToProps, {})(RoomAllocation);
