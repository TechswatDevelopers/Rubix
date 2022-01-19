import React from "react";
import { connect } from "react-redux";
import { onPresAddEvent, onPresPopUpEvent } from "../actions";
import { Form } from 'react-bootstrap';
import axios from "axios";

class PopUpConfirm extends React.Component {
    //Initial State
constructor(props) {
  super(props)
  this.state = {
    
  }
}

  //Send Vetted status
  sendVettingStatus(filetype, docID, vet){
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

    console.log("Posted Vetting Data: ", data)
    const postData = async () => {
      await axios.post('https://rubixapi.cjstudents.co.za:88/api/RubixAdminVettings', data, requestOptions)
      .then(response=>{
        console.log("DB response: ", response)
      })
    }
    postData()
  }


  render() {
    const { isPopUpConfirm, Title, Body, FileType, DocID} = this.props;
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
                  this.sendVettingStatus(FileType, DocID, 'correct')
                  this.props.onPresPopUpEvent();
                }}>
                Vet as Correct
              </button>
              <button
                type="button"
                onClick={(e) => {
                  this.sendVettingStatus(FileType, DocID, 'incorrect')
                  this.props.onPresPopUpEvent();
                }}
                className="btn btn-simple"
                data-dismiss="modal"
              >
                Vet as Incorrect
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
});

export default connect(mapStateToProps, { onPresAddEvent, onPresPopUpEvent  })(PopUpConfirm);
