import React from "react";
import { connect } from "react-redux";
import { onPresAddEvent, onPresPopConfirmReq } from "../actions";

class PopUpConfirmReq extends React.Component {
    //Initial State
constructor(props) {
  super(props)
  this.state = {
    
  }
}

//On click
onLoginClick(e){
  e.preventDefault()
  console.log("Client ID: ", localStorage.getItem("clientID"))
 this.props.history.push("/login/" + localStorage.getItem("clientID"));
 this.props.onPresPopConfirmReq();

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
              The information has been submitted successfully. You can now log in.
            </div>
            <div className="modal-footer">
              
              <button
                type="button"
                onClick={(e) => {
                  this.onLoginClick(e)
                }}
                className="btn btn-simple"
                data-dismiss="modal"
              >
                LOGIN NOW
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
  isPopUpModal: mailInboxReducer.isShowConfirmReq,
});

export default connect(mapStateToProps, { onPresAddEvent, onPresPopConfirmReq  })(PopUpConfirmReq);
