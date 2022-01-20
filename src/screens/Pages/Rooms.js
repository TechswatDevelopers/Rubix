import React from "react";
import { Dropdown } from "react-bootstrap";
import { connect } from "react-redux";
import axios from "axios";
import PageHeader from "../../components/PageHeader";
import RoomsTable from "../../components/Tables/RoomsTables";
import PopUpAssign from "../../components/PopUpAssignRoom";

class RoomAllocation extends React.Component {
  //Initial State
  constructor(props) {
    super(props)
    this.state = {
      studentRoomDetails: {},
      availableRooms: []
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    this.getStudentRoomDetails(this.props.currentStudentiD)
  }

  //Fetch User Res Data
  getStudentRoomDetails(studentID){
    const pingData = {
        'UserCode': localStorage.getItem('userCode'),
        'RubixClientID': localStorage.getItem('clientID'),
        'ResidenceName': "",
        'RubixResidenceID': this.props.currentResID,
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
  render() {
    const { Student } = this.props;
    return (
      <div
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
                  <div className="header">
                    <h2>Room Allocation</h2>
                  </div>
                  <div className="body">
                    <RoomsTable
              RoomList= {this.state.availableRooms}
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
