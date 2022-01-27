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
    
  }
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
        window.location.reload()
      })
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
