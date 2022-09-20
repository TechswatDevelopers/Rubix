import React from "react";
import { connect } from "react-redux";
import { onPresAddEvent, 
  onPresPopUpEvent, 
  onPresPopUpConfirm,
  updateLoadingMessage,
  updateLoadingController,
  onPresPopUpConfirmSupport
} from "../actions";
import { Form } from 'react-bootstrap';
import axios from "axios";

class PopUpConfirmSubmit extends React.Component {
    //Initial State
constructor(props) {
  super(props)
  this.state = {
    
  }
}
componentDidMount() {
  window.scrollTo(0, 0);
}

  render() {
    const { isPopUpConfirm, Title, Body, FileType, DocID, Filename} = this.props;
    return (
      <div
        className={isPopUpConfirm ? "modal fade show" : "modal fade"}
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="title" id="defaultModalLabel">
               Support Confirmation
              </h4>
            </div>
            <div className="modal-body">
              Your support request has been successfully submited.
              
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={(e) => {
                  console.log('pressed')
                  this.props.onPresPopUpConfirmSupport();
                }}
                className="btn btn-danger"
                data-dismiss="modal"
              >
                Close
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
  isPopUpConfirm: mailInboxReducer.isPopUpConfirmSupport,
  currentStudentiD: navigationReducer.studentID,

  MyloadingController: navigationReducer.loadingController,
  loadingMessage: navigationReducer.loadingMessage,
});

export default connect(mapStateToProps, {
   onPresAddEvent, 
   onPresPopUpEvent, 
   onPresPopUpConfirm,
   updateLoadingMessage,
   updateLoadingController,
   onPresPopUpConfirmSupport,
  })(PopUpConfirmSubmit);
