import React from "react";
import { connect } from "react-redux";
import { onPresAddEvent, onPresPopUpEvent } from "../actions";
import { Form } from 'react-bootstrap';
import axios from "axios";

class PopUpModal extends React.Component {
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
               {Title}
              </h4>
            </div>
            <div className="modal-body">
              {Body}
            </div>
            <div className="modal-footer">
              
              <button
                type="button"
                onClick={(e) => {
                  this.props.onPresPopUpEvent();
                  Function()
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
  isPopUpModal: mailInboxReducer.isPopUpModal,
});

export default connect(mapStateToProps, { onPresAddEvent, onPresPopUpEvent  })(PopUpModal);
