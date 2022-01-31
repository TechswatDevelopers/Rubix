import React from "react";
import { connect } from "react-redux";
import "bootstrap/dist/js/bootstrap.min.js";
import {updateStudentID,onUpdateStudentRubixID, onPresShowProfile, onPresRooms, onPresPopUpAssign, onPresPopUpRemove} from "../../actions";
import PopUpAssign from "../../components/PopUpAssignRoom"
import PopUpRemove from "../../components/PopUpRemoveFromRoom"

class RoomsTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentRoom: {},
    }
  }
  //Select Specific Student
  selectStudent(e){
    //this.props.onUpdateStudentRubixID(this.state.currentStudent.RubixRegisterUserID)
    //this.props.onPresShowProfile()
  }

  
  render() {
    const { RoomList, Student, Body } = this.props;
    return (
      <div className="col-lg-12">
        <div className="card">
        <PopUpAssign 
        roomID = {this.state.currentRoom.RubixResidenceRoomsID}
        Title= "Confirm Room Assigning"
        Body = {"You are about to assign " + this.props.currentStudentname + " to a room: " /* + this.state.currentRoom.RoomNumber */}
        />
        <PopUpRemove 
        roomID = {this.state.currentRoom.RubixResidenceRoomsID}
        Title= "Confirm Room Removal"
        Body = {"You are about to remove " + this.props.currentStudentname + " from a room: " /* + this.state.currentRoom.RoomNumber */}
        />
          <div className="header">
            <h2>
              Available Room{" "}
              <small>
               List of all Rooms Available
              </small>
            </h2>
            {RoomList.length == 1 
            ?Body
          : null}
          </div>
          <div className="body table-responsive table-hover">
            <table className="table">
              <thead>
                <tr>
                  <th>Res Code</th>
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
                  onClick={(e)=>this.setState({
                    currentRoom: room
                  })}
                  >
                  <th scope="row">
                  {room.ResidenceName}
                    </th>
                  <td>{room.BuildingNumber}</td>
                  <td>{room.FloorNumber}</td>
                  <td>{room.RoomNumber}</td>
                  <td>
                    <>
                  
                  
                  { RoomList.length == 1
                    ? <button className="btn btn-sm btn-outline-danger" 
                    onClick={(e)=>{
                      e.preventDefault()
                      //this.props.onPresRooms(e)
                      this.props.onPresPopUpRemove()
                      
                      }}>
                      <span>
                        <i className=" icon-ban"></i> 
                           Remove from Room
                        </span>
                      </button>


                    : <button className="btn btn-sm btn-outline-success" 
                  onClick={(e)=>{
                    e.preventDefault()
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
  onPresPopUpRemove
})(RoomsTable);
