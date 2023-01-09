import React from "react";
import { connect } from "react-redux";
import { onPresAddEvent , onPresPopUpEvent} from "../actions";
import { Form } from 'react-bootstrap';
import axios from "axios";

class AddEventModal extends React.Component {
    //Initial State
constructor(props) {
  super(props)
  this.state = {
    startDate: '',
    endDate: '',
    role: localStorage.getItem('role'),
    eventTypes: [],
    eventType: null
  }
}

componentDidMount() {
  window.scrollTo(0, 0);

  //Get Events Type Data
  this.getEventsData()
  ////console.log('userCode', localStorage.getItem('userCode'))
}

//Get Events Types List
getEventsData() {
  const fetchData = async() =>{
    await fetch('https://jjprest.rubix.mobi:88/api/RubixEventTypess')
        .then(response => response.json())
        .then(data => {
            ////console.log("data is ", data.data)
            this.setState({eventTypes: data.data})
            });
  }
  fetchData()
}

  //On Date Select
  handleChange = e =>{
    const DATE_OPTIONS = { year: 'numeric', month: 'numeric', day: 'numeric', time: 'long' };
    const myDate = new Date(e.target.value).toISOString().replace(/T.*/,'').split('-').join('-')
    const myTime = new Date(e.target.value).toLocaleTimeString('en-ZA')
    //console.log('Date', myTime)
    this.setState({startDate: myDate + ' ' + myTime})
  }
  //On Date Select
  handleEndChange = e =>{
    const DATE_OPTIONS = { year: 'numeric', month: 'numeric', day: 'numeric', time: 'long' };
    const myDate = new Date(e.target.value).toISOString().replace(/T.*/,'').split('-').join('-')
    const myTime = new Date(e.target.value).toLocaleTimeString('en-ZA')
    //console.log('Date', myTime)
    this.setState({endDate: myDate + ' ' + myTime})
  }


  //Post Event to DB:
  postEvent(e, resID) {
    if(this.state.role == 'admin'){
      this.postResEvent(e, resID)
    } else {
      this.postStudentEvent(e)
    }
  }

  postResEvent(e, resID) {
    e.preventDefault()

    //Convert Date Information
    const DATE_OPTIONS = { year: 'numeric', month: 'numeric', day: 'numeric', time: 'long' };
    const startDate = document.getElementById('start').value
    //const endDate = document.getElementById('end').value.toLocaleDateString('en-ZA', DATE_OPTIONS)

    //console.log('Start Date', startDate)

    //Populate form data
    const form = document.getElementById('add-event');
  
    //Populate Posting Data
    const data = {
      'RubixResidenceID': resID,
      'UserCode': localStorage.getItem('userCode'),
      'ResidenceEventStartDate': this.state.startDate,
      'ResidenceEventEndDate': this.state.endDate,
      'ResidenceEventTypeID': document.getElementById('desc').value,
      'ResidenceEventTypeID': this.state.eventType
    }
    for (let i = 0; i < form.elements.length; i++) {
      const elem = form.elements[i];
      data[elem.name] = elem.value
    }

    //Post Parameters
    const requestOptions = {
      title: 'Add Event Request',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    }
    //console.log("Post info", data)

    //Make Post
    const postData = async()=>{
      await axios.post('https://jjprest.rubix.mobi:88/api/RubixResidenceEventsAddData', data, requestOptions)
      .then(response => {
        //console.log("Add Event Response", response)
      })
    }
    postData()
    .then(()=>{
      this.props.onPresAddEvent()
      window.location.reload()
    })

  }


  //Post Event to DB:
  postStudentEvent(e) {
    e.preventDefault()

    //Convert Date Information
    const DATE_OPTIONS = { year: 'numeric', month: 'numeric', day: 'numeric', time: 'long' };
    const startDate = document.getElementById('start').value
    //const endDate = document.getElementById('end').value.toLocaleDateString('en-ZA', DATE_OPTIONS)

    //console.log('Start Date', startDate)

    //Populate form data
    const form = document.getElementById('add-event');
  
    //Populate Posting Data
    const data = {
      'RubixRegisterUserID': localStorage.getItem('userID'),
      'StudentEventStartDate': this.state.startDate,
      'StudentEventEndDate': this.state.endDate,
      'StudentEventName': document.getElementById('title').value,
      'StudentEventDescription': document.getElementById('desc').value,
      'StudentEventTypeID': this.state.eventType
    }

    //Post Parameters
    const requestOptions = {
      title: 'Add Student Event Request',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    }
    //console.log("Post info", data)

    //Make Post
    const postData = async()=>{
      await axios.post('https://jjprest.rubix.mobi:88/api/RubixStudentEventsAddData', data, requestOptions)
      .then(response => {
        //console.log("Add Student Event Response: ", response)
      })
    }
    if(this.state.eventType == null || this.state.startDate == null || this.state.startDate == '' || this.state.endDate == '' || this.state.endDate == null  || document.getElementById('title').value == '' || document.getElementById('title').value == null  || document.getElementById('desc').value == '' ||document.getElementById('desc').value == null){
      alert("Please Fill Out All the information")
    } else {
      postData()
      .then(()=>{
        this.props.onPresAddEvent()
        window.location.reload()
      })
    }
    

  }


  render() {
    const { isEventModal, resID, StartDate } = this.props;
    return (
      <div
        className={isEventModal ? "modal fade show" : "modal fade"}
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="title" id="defaultModalLabel">
                Add Event
              </h4>
            </div>
            <div className="modal-body">
              <form id="add-event" onSubmit={(e)=> this.postEvent(e, resID)}>
              <div className="form-group">
                <div className="form-line">
                  <label>Event Start Date</label>
                  <input
                    required
                    id="start"
                    type="datetime-local"
                    className="form-control"
                    placeholder="Event Date"
                    //name= "ResidenceEventStartDate"
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="form-line">
                  <label>Event End Date</label>
                  <input
                    required
                    id="end"
                    type="datetime-local"
                    className="form-control"
                    placeholder="Event Date"
                    //name= "ResidenceEventEndDate"
                    onChange={this.handleEndChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="form-line">
                <label>Event Name</label>
                  <input
                    required
                  id="title"
                    type="text"
                    className="form-control"
                    placeholder="Event Title"
                    name="ResidenceEventName"
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="form-line">
                <label>Event Type</label>

                <select className="form-control" onChange={(e)=>this.setState({eventType: e.target.value})} value={this.state.eventType}>
        {
            
         this.state.eventTypes.map((event, index)=> (
            <option key={index} name='ResidenceEventTypeID' value = {event.RubixResidenceEventTypeID}>{event.ResidenceEventTypeDescription}</option>
        ))   
        }
    </select>
                </div>
              </div>
              <div className="form-group">
                <div className="form-line">
                <label>Event Description</label>
                  <textarea
                    required
                  id="desc"
                    className="form-control no-resize"
                    placeholder="Event Description..."
                    name="ResidenceEventDescription"
                  ></textarea>
                </div>
              </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={(e)=> this.postEvent(e, resID)}>
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  this.props.onPresAddEvent();
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
});

export default connect(mapStateToProps, { onPresAddEvent })(AddEventModal);
