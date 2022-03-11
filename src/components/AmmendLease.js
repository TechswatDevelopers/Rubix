import React from "react";
import { connect } from "react-redux";
import { onPresAddEvent , onPresPopUpEvent, onToggleLeaseAmmend} from "../actions";
import { Form } from 'react-bootstrap';
import axios from "axios";

class AmmendLease extends React.Component {
    //Initial State
constructor(props) {
  super(props)
  this.state = {
    startDate: '',
    endDate: '',
    role: localStorage.getItem('role'),
    eventTypes: [],
    eventType: null,
    payment: '',
    leaseStart: '',
    leaseEnd: '',
    payMethods: ['Please Select your Payment Method', 'NSFAS', 'External Bursary', 'Student Loan', 'Self Funded'],
  }
}

componentDidMount() {
  window.scrollTo(0, 0);
  //console.log('userCode', localStorage.getItem('userCode'))
}

postLeaseData1(link) {
  
  const form = document.getElementById('ammend');
const data = {
  "PDFDocumentUrl" :link,
  "LeaseStartDate" : this.state.leaseStart,
  "LeaseEndDate" : this.state.leaseEnd,
  "LeaseAmount" : document.getElementById('amount').value,
  'PaymentMethod ': this.state.payment

}
for (let i = 0; i < form.elements.length; i++) {
  const elem = form.elements[i];
  data[elem.name] = elem.value
}
const requestOptions = {
  title: 'Update Lease Information',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: data
}
console.log("Data: ", data)

//Http Post Request
const postData = async () => {
  await axios.post('https://rubixpdf.cjstudents.co.za:94/PDFLeaseAdd', data, requestOptions)
  .then(response => {
    console.log("Post Response: ", response)
    if(response.data.PostRubixUserData == null || response.data.PostRubixUserData.length == 0){

    } else {
     
      
    }

    
  })
}
postData().then(()=>{
  this.props.onToggleLeaseAmmend()
  //window.location.reload()
})
}


  //Post Event to DB:
  postStudentEvent(e) {
    e.preventDefault()

    //Convert Date Information
    const DATE_OPTIONS = { year: 'numeric', month: 'numeric', day: 'numeric', time: 'long' };
    const startDate = document.getElementById('start').value
    //const endDate = document.getElementById('end').value.toLocaleDateString('en-ZA', DATE_OPTIONS)

    console.log('Start Date', startDate)

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
    console.log("Post info", data)

    //Make Post
    const postData = async()=>{
      await axios.post('https://rubixapi.cjstudents.co.za:88/api/RubixStudentEventsAddData', data, requestOptions)
      .then(response => {
        console.log("Add Student Event Response: ", response)
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

  //Load Documents
  loadDocuments(e, userID) {
    e.preventDefault()
    var tempList
    const fetchData = async () => {
      //Get documents from DB
      await fetch('https://rubixdocuments.cjstudents.co.za:86/feed/post/' + userID)
        .then(response => response.json())
        .then(data => {
          console.log("documents data:", data)
          //Get Lease Documented stdents
           tempList = data.post.filter(doc => doc.FileType == 'lease-agreement')

           if(tempList.length != 0){
             this.postLeaseData1("https://rubiximages.cjstudents.co.za:449/" + tempList[0].filename)
           } else {
             this.setState({
               index: this.state.index + 1
             })
             this.getStudents()
           }
        });

    };
    fetchData().then(()=> {
    })
    
  }
     //On Date Select
     handleChange(e, timeVar){
      const DATE_OPTIONS = { year: 'numeric', month: 'numeric', day: 'numeric', time: 'long' };
      const myDate = new Date(e.target.value).toISOString().replace(/T.*/,'').split('-').join('-')
      const myTime = new Date(e.target.value).toLocaleTimeString('en-ZA')
      //console.log('Date', myTime)
      if (timeVar == 'start'){
          this.setState({
              leaseStart: myDate + ' ' + myTime
          })
      } else if (timeVar == 'end'){
          this.setState({
              leaseEnd: myDate + ' ' + myTime
          })
      }
      return myDate + ' ' + myTime
    }

  render() {
    const { isEventModal, StudentID } = this.props;
    return (
      <div
        className={isEventModal ? "modal fade show" : "modal fade"}
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="title" id="defaultModalLabel">
                Ammend Lease Information
              </h4>
            </div>
            <div className="modal-body">
              <form id="ammend" >
              <div className="form-group">
                <div className="form-line">
                  <label>Lease Start Date</label>
                  <input
                    required
                    id="start"
                    type="datetime-local"
                    className="form-control"
                    //name= "ResidenceEventStartDate"
                    onChange={(e) => this.handleChange(e, 'start')}
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="form-line">
                  <label>Lease End Date</label>
                  <input
                    required
                    id="end"
                    type="datetime-local"
                    className="form-control"
                    placeholder="Lease Date"
                    //name= "ResidenceEventStartDate"
                    onChange={(e) => this.handleChange(e, 'end')}
                  />
                </div>
              </div>

              <div className="form-group">
                        <label className="" >
                        Payment Method: 
                            </label>
                            {  
        <select className="form-control" onChange={(e)=>this.setState({payment: e.target.value})} value={this.state.payment}>
        {
            
            this.state.payMethods.map((payment, index)=> (
            <option key={index} name='PaymentMethod' value={payment}>{payment}</option>
        ))   
        }
    </select> }
                      </div>
                      <div className="form-group">
                <div className="form-line">
                  <label>Amount</label>
                  <input
                    required
                    id="amount"
                    type="number"
                    className="form-control"
                    placeholder="Monthly Amount"
                  />
                </div>
              </div>
              <button onClick={(e)=>{ this.loadDocuments(e, StudentID)}} className="btn btn-primary">Update</button>
              <button
                type="button"
                onClick={() => {
                  this.props.onToggleLeaseAmmend();
                }}
                className="btn btn-simple"
                data-dismiss="modal"
              >
                CLOSE
              </button>
              </form>
            </div>
            
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ mailInboxReducer }) => ({
  isEventModal: mailInboxReducer.isAmmendLease,
});

export default connect(mapStateToProps, { onPresAddEvent, onToggleLeaseAmmend })(AmmendLease);
