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
              <form>
              <div className="form-group">
                <div className="form-line">
                  <label>Announcement Title</label>
                  <input
                    required
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
            <button type="button" className="btn btn-primary" >
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
