import React from "react";
import { Dropdown } from "react-bootstrap";
import { connect } from "react-redux";
import axios from "axios";
import PageHeader from "../../components/PageHeader";
import RoomsTable from "../../components/Tables/RoomsTables";
import PopUpAssign from "../../components/PopUpAssignRoom";
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
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    this.getStudentRoomDetails(this.props.currentStudentiD)
    const scrollToElement = () => this.testRef.current.scrollIntoView();
    scrollToElement()
  }

  //Fetch User Res Data
  getStudentRoomDetails(studentID){
    const pingData = {
        'UserCode': localStorage.getItem('userCode'),
        'RubixClientID': localStorage.getItem('clientID'),
        'ResidenceName': "",
        'RubixResidenceID': localStorage.getItem('resID'),
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
      console.log('Posted:', pingData)
      const postData = async () => {
        await axios.post('https://rubixapi.cjstudents.co.za:88/api/RubixAdminStudentRoomAvailable', pingData, requestOptions)
        .then(response => {
          console.log("Students Rooms List:", response)
          if (response.data.PostRubixUserData){
            //Show available rooms
            this.setState({
              availableRooms: response.data.PostRubixUserData
            })

            //Populate Lists
            //this.populate('BuildingNumber', response.data.PostRubixUserData, this.state.buildingNumberList)
            this.setState({
              buildingNumberList:  this.populate('BuildingNumber', response.data.PostRubixUserData),
              floorNumberList: this.populate('FloorNumber', response.data.PostRubixUserData),
              roomNumberList: this.populate('RoomNumber', response.data.PostRubixUserData)

            })
            //this.populate('FloorNumber', response.data.PostRubixUserData, this.state.floorNumberList)
            //this.populate('RoomNumber', response.data.PostRubixUserData, this.state.roomNumberList)

          } else {
            //Show Room Details
            this.getStudentRoomDetails(' ')
            /* this.setState({
              studentRoomDetails: response.data.PostRubixUserData
            }) */
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

    //console.log('New List: ', newList)
    /* this.setState({
      destination: newList
    }) */
    return newList
  }

  //Get Romms Filters
  getRoomsFilters(buildingNumber, floorNumber, roomNumber, studentID){
    const pingData = {
        'UserCode': localStorage.getItem('userCode'),
        'RubixClientID': localStorage.getItem('clientID'),
        'ResidenceName': "",
        'RubixResidenceID': localStorage.getItem('resID'),
        'BuildingNumber': buildingNumber,
        'FloorNumber': floorNumber,
        'RoomNumber': roomNumber,
        'RubixRegisterUserID': studentID

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
        await axios.post('https://rubixapi.cjstudents.co.za:88/api/RubixAdminStudentRoomAvailableDropdown', pingData, requestOptions)
        .then(response => {
          console.log("Students Rooms Dropdown:", response)
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
            //this.getStudentRoomDetails(' ')
            /* this.setState({
              studentRoomDetails: response.data.PostRubixUserData
            }) */
          }
          

        })
      }
      postData()
  }
  render() {
    const { Student } = this.props;
    return (
      <div ref={this.testRef}
        style={{ flex: 1 }}
        onClick={() => {
          document.body.classList.remove("offcanvas-active");
        }}
      >
        
        <div>
          <div className="container-fluid">
           
            <div className="row clearfix">
              <div className="col-lg-12 col-md-12">
                <div className="card planned_task">
                
                  <div className="body">
                    <RoomsTable
              RoomList= {this.state.availableRooms}
              Body = {
                this.state.availableRooms.length === 1
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

const mapStateToProps = ({ ioTReducer, navigationReducer }) => ({
  isSecuritySystem: ioTReducer.isSecuritySystem,
  currentStudentiD: navigationReducer.studentID,
  currentResID: navigationReducer.studentResID,
});

export default connect(mapStateToProps, {})(RoomAllocation);
