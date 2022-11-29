import React from "react";
import { connect } from "react-redux";
import { onPresAddEvent, onPresRooms } from "../actions";
import { Form } from 'react-bootstrap';
import axios from "axios";
import RoomsTable from "../components/Tables/RoomsTables";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

class PopUpRooms extends React.Component {
    //Initial State
constructor(props) {
  super(props)
  this.state = {
    
  }
}

componentDidMount() {
  window.scrollTo(0, 0);
  //this.getColors()
  console.log("I am called")
}

  render() {
    const { isPopUpModal, Title, Body, Function} = this.props;
    return (
     /*  <div
        className={isPopUpModal ? "modal fade show " : "modal fade"}
        role="dialog"
      > */
      <>
        <Modal 
        className="w-93"
        show={isPopUpModal}
        //onHide={this.props.onPresRooms()}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{Title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {Body}
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
      </>
       
      //</div>
    );
  }
}

const mapStateToProps = ({ mailInboxReducer }) => ({
  isEventModal: mailInboxReducer.isEventModal,
  isPopUpModal: mailInboxReducer.isRoomshowing,
});

export default connect(mapStateToProps, { onPresAddEvent, onPresRooms  })(PopUpRooms);
