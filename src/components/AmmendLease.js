import React from "react";
import { connect } from "react-redux";
import { onPresAddEvent , onPresPopUpEvent, onToggleLeaseAmmend, 
  updateLoadingMessage,
  updateLoadingController,} from "../actions";
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
    userIPAddress: '',
    dateAndTime: null,
    isLoad: false,
    payMethods: ['Please Select your Payment Method', 'NSFAS', 'External Bursary', 'Student Loan', 'Self Funded'],
  }
}

componentDidMount() {
  window.scrollTo(0, 0);
  this.getUserWitnessData()
}


  //Post File Using Mongo
  onPressUpload(image, filetype, currentActiveKey, userID) {
    const postDocument = async () => {
      const data = new FormData()
      data.append('image', image)
      data.append('FileType', filetype)
      data.append('RubixRegisterUserID', userID)
      const requestOptions = {
        title: 'Student Document Upload',
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data', },
        body: data
      };
      for (var pair of data.entries()) {
        //console.log(pair[0], ', ', pair[1]);
      }
      await axios.post('https://rubixdocuments.cjstudents.co.za:86/feed/post?image', data, requestOptions)
        .then(response => {
          //console.log("Upload details:", response)
          this.setState({ mongoID: response.data.post._id })
        })
    }
    postDocument().then(() => {
       //Set timer for loading screen
    setTimeout(() => {
      this.props.updateLoadingController(false);
      window.location.reload()
    }, 2000);
      
    })
  }

 //Converts base64 to file
 dataURLtoFile(dataurl, filename) {

  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

    //Coleect User Signing Info
getUserWitnessData() {
      //Fetch IP Address
      const getData = async () => {
        const res = await axios.get('https://geolocation-db.com/json/')
        //console.log("my IP", res.data);
        this.setState({userIPAddress: res.data.IPv4 })
      }
      getData()
    }

postLeaseData1(link, userID) {
  //Set Loading Screen ON
  this.props.updateLoadingController(true);
  this.props.updateLoadingMessage("Ammending Lease Information...");
  
  const form = document.getElementById('ammend');
const data = {
  "PDFDocumentUrl" :link,
  "LeaseStartDate" : this.state.leaseStart,
  "LeaseEndDate" : this.state.leaseEnd,
  "LeaseAmount" : document.getElementById('amount').value,
  'PaymentMethod': this.state.payment,
  "AdminUserID": localStorage.getItem('adminID'),
  'RubixClientID': localStorage.getItem('clientID')

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
//console.log("Data: ", data)

//Http Post Request
const postData = async () => {
  await axios.post('https://rubixpdf.cjstudents.co.za:94/PDFLeaseAdd', data, requestOptions)
  .then(response => {
    console.log("Post Response: ", response)
    if(response.data != null && response.data != undefined){
      const dataUrl = 'data:application/pdf;base64,' + response.data.Base
      const temp = this.dataURLtoFile(dataUrl, 'Lease Agreement') //this.convertBase64ToBlob(response.data.Base)
      //console.log("temp file:", temp)
      this.onPressUpload(temp, 'lease-agreement', 'signing',userID)
    } else {
     
      
    }

    
  })
}
postData().then(()=>{
  this.props.onToggleLeaseAmmend()
  //window.location.reload()
})
}

  //Load Documents
  loadDocuments(e, userID) {
    e.preventDefault()
    //Set Loading Screen ON
    this.props.updateLoadingController(true);
    this.props.updateLoadingMessage("Loading Documents...");
    var tempList
    const fetchData = async () => {
      //Get documents from DB
      await fetch('https://rubixdocuments.cjstudents.co.za:86/feed/post/' + userID)
        .then(response => response.json())
        .then(data => {
          //console.log("documents data:", data)
          //Get Lease Documented stdents
           tempList = data.post.filter(doc => doc.FileType == 'lease-agreement')

           if(tempList.length != 0){
             this.postLeaseData1("https://rubiximages.cjstudents.co.za:449/" + tempList[0].filename, userID)
           } else {
             
      this.props.updateLoadingController(false);
      alert("No Lease Available")
           }
        });

    };
    fetchData().then(()=> {
      this.setState({
        isLoad: false
      })
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
        <div
          className="page-loader-wrapper"
          style={{ display: this.props.MyloadingController ? "block" : "none" }}
        >
          <div className="loader">
            <div className="m-t-30">
              <img
                src={localStorage.getItem('clientLogo')}
                width="20%"
                height="20%"
                alt=" "
              />
            </div>
            <p>{this.props.loadingMessage}</p>
          </div>
        </div>

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

const mapStateToProps = ({ mailInboxReducer, navigationReducer }) => ({
  isEventModal: mailInboxReducer.isAmmendLease,

  MyloadingController: navigationReducer.loadingController,
  loadingMessage: navigationReducer.loadingMessage,
});

export default connect(mapStateToProps, { onPresAddEvent, onToggleLeaseAmmend,
  updateLoadingMessage,
  updateLoadingController, })(AmmendLease);
