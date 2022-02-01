import React from "react";
import { connect } from "react-redux";
import { onPresAddEvent, onPresPopNewNotice } from "../actions";
import { Form } from 'react-bootstrap';
import axios from "axios";

class PopUpAddNewNotice extends React.Component {
    //Initial State
constructor(props) {
  super(props)
  this.state = {
    
  }
}

  //Admin Post new notice
  postNoticies() {
    const form = document.getElementById('add-event');
    const data = {
      'RubixClientID': localStorage.getItem('clientID'),
      'UserCode': localStorage.getItem('userCode'),
      "Name": '',
      "Surname": '',
      "ResidenceID": localStorage.getItem('resID'),
    }
    for (let i=0; i < form.elements.length; i++) {
        const elem = form.elements[i];
        data[elem.name] = elem.value
    }
    const requestOptions = {
      title: 'Login Form',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
  };
    const getData = async () => {
      const res = await axios.post('https://rubixapi.cjstudents.co.za:88/api/RubixRegisterUserMessages', data, requestOptions)
      console.log("Add notice response data", res.data.PostRubixUserData);
      this.setState({ notices: res.data.PostRubixUserData })
      this.loadComments(res.data.PostRubixUserData[0].RubixRegisterUserMessageID)
    }
    getData().then(()=>{
      window.location.reload()
    })
  }

  render() {
    const { isPopUpModal, Title, Body, Function} = this.props;
    return (
      <div
        className={isPopUpModal ? "modal fade show" : "modal fade"}
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="title" id="defaultModalLabel">
               Add New Announcement
              </h4>
            </div>
            <div className="modal-body">
              <form id="add-event">
              <div className="form-group">
                <div className="form-line">
                  <label>Announcement Title</label>
                  <input
                    required
                    name="Title"
                    id="start"
                    type="text"
                    className="form-control"
                    placeholder="Announcement Title"
                    //name= "ResidenceEventStartDate"
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="form-line">
                  <label>Announcement Body</label>
                  <input
                    required
                    name="UserMessage"
                    id="start"
                    type="text"
                    className="form-control"
                    placeholder="Announcement body"
                    //name= "ResidenceEventStartDate"
                  />
                </div>
              </div>
              </form>
            </div>
            <div className="modal-footer">
            <button onClick={(e) => {
                  this.postNoticies()
                  this.props.onPresPopNewNotice();
                }} type="button" className="btn btn-primary" >
                Add Announcement
              </button>
              <button
                type="button"
                onClick={(e) => {
                  this.props.onPresPopNewNotice();
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

const mapStateToProps = ({ mailInboxReducer }) => ({
  isEventModal: mailInboxReducer.isEventModal,
  isPopUpModal: mailInboxReducer.isPopUpNewNotice,
});

export default connect(mapStateToProps, { onPresAddEvent, onPresPopNewNotice  })(PopUpAddNewNotice);
