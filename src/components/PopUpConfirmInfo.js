import React from "react";
import { connect } from "react-redux";
import { onPresAddEvent, onPresPopConfirmInfo } from "../actions";
import { Form } from 'react-bootstrap';
import axios from "axios";

class PopUpConfirmInfo extends React.Component {
    //Initial State
constructor(props) {
  super(props)
  this.state = {
    
  }
}

  render() {
    const { isPopUpModal, Function} = this.props;
    return (
      <div
        className={isPopUpModal ? "modal fade show" : "modal fade"}
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="title" id="defaultModalLabel">
             Information Submission
              </h4>
            </div>
            <div className="modal-body">
              The information has been submitted successfully.
            </div>
            <div className="modal-footer">
              
              <button
                type="button"
                onClick={(e) => {
                  this.props.onPresPopConfirmInfo();
                }}
                className="btn btn-simple"
                data-dismiss="modal"
              >
                CLOSE
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
  isPopUpModal: mailInboxReducer.isShowConfirmInfo,
});

export default connect(mapStateToProps, { onPresAddEvent, onPresPopConfirmInfo  })(PopUpConfirmInfo);
