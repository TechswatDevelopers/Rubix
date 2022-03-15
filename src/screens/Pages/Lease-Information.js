import React from "react";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown, Nav, Toast } from "react-bootstrap";
import { Component } from "@fullcalendar/core";
import {Helmet} from "react-helmet";
import axios from "axios";
import {updateResidenceID,
    updateLoadingMessage,
    updateLoadingController,
  } from "../../actions";

  
import PageHeader from "../../components/PageHeader";

class LeaseInformation extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          leaseStart: '',
          leaseEnd: '',
          students: '',
          index: 0,
          payMethods: ['Please Select your Payment Method', 'NSFAS', 'External Bursary', 'Student Loan', 'Self Funded'],
        }
      }
      componentDidMount() {
        window.scrollTo(0, 0);
      }

      //Update Lease Information
      postLeaseData(e) {
          console.log("I am called")
          e.preventDefault()
        const data = {
          "PDFDocumentUrl" : "https://rubiximages.cjstudents.co.za:449/37a1fcad-a06d-4dfb-9632-3348dbaf0f19.pdf",
          "LeaseStartDate" : this.state.leaseStart,
          "LeaseEndDate" : this.state.leaseEnd,
          "LeaseAmount" : document.getElementById('amount').value

        }
        const requestOptions = {
          title: 'Update Lease Information',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: data
        }
    
        //Http Post Request
        const postData = async () => {
          await axios.post('https://rubixpdf.cjstudents.co.za:94/PDFLeaseAdd', data, requestOptions)
          .then(response => {
            console.log("Post Response: ", response)
            if(response.data.PostRubixUserData == null || response.data.PostRubixUserData.length == 0){
    
            } else {
             
              //Popolate Events List
              this.populateEvents(response.data.PostRubixUserData)
              this.setState({
                totalResEvents: response.data.PostRubixUserData[0].TotalEvents,
                upcomingResEvents: response.data.PostRubixUserData[0].UpcomingEvents,
                pastEvents:response.data.PostRubixUserData[0].PastEvents
              })
            }
    
            
        this.props.updateLoadingController(false);
            
          })
        }
        postData()
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


  //Function for lease regenration
  //Fetch all students Data
  getStudents(e){
    if(e !== null && e !== undefined){
      e.preventDefault()
    }
    const pingData = {
        'UserCode': localStorage.getItem('userCode'),
        'RubixClientID':  localStorage.getItem('clientID'),
        'RubixResidenceID': 5,
        'Search': 'Blue'
      };
      //Ping Request Headers
      const requestOptions = {
        title: 'Get All Students Details',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: pingData
      };
      console.log('Posted data: ', pingData)
      const postData = async () => {
        await axios.post('https://rubixapi.cjstudents.co.za:88/api/RubixAdminStudentList', pingData, requestOptions)
        .then(response => {
          console.log("Students Data List:", response)
          if(!response.data.PostRubixUserData){
            this.setState({
              students: []
            })
            //Set timer for loading screen
          setTimeout(() => {
            this.props.updateLoadingController(false);
          }, 2000);
          } else {
            this.setState({
              students: response.data.PostRubixUserData
            })
            //Set timer for loading screen
          setTimeout(() => {
            this.props.updateLoadingController(false);
          }, 2000);
          }
        })
      }
      postData().then(()=>{
        //Set timer for loading screen
    setTimeout(() => {
      this.loadDocuments(this.state.students[this.state.index].RubixRegisterUserID);
    }, 3000);
        
      })
  }

  //Load Documents
  loadDocuments(userID) {
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
             this.postLeaseData1("https://rubiximages.cjstudents.co.za:449/" + tempList[0].filename, userID)
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

    //Update Lease Information
    postLeaseData1(link, userID) {
      console.log("I am called")
    const data = {
      "PDFDocumentUrl" :link,
      "LeaseStartDate" : ' ',
      "LeaseEndDate" : ' ',
      "LeaseAmount" : ' '

    }
    const requestOptions = {
      title: 'Update Lease Information',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    }

    //Http Post Request
    const postData = async () => {
      await axios.post('https://rubixpdf.cjstudents.co.za:94/PDFLeaseAdd', data, requestOptions)
      .then(response => {
        console.log("Post Response: ", response)
        if(response.data == null || response.data == undefined){

        } else {
          const dataUrl = 'data:application/pdf;base64,' + response.data.Base
      const temp = this.dataURLtoFile(dataUrl, 'Lease Agreement') //this.convertBase64ToBlob(response.data.Base)
      console.log("temp file:", temp)
      this.onPressUpload(temp, 'lease-agreement', 'signing',userID)
          
        }

        
      })
    }
    postData()
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
          console.log(pair[0], ', ', pair[1]);
        }
        await axios.post('https://rubixdocuments.cjstudents.co.za:86/feed/post?image', data, requestOptions)
          .then(response => {
            console.log("Upload details:", response)
            this.setState({ mongoID: response.data.post._id })
          })
      }
      postDocument().then(()=>{
        this.setState({
          index: this.state.index + 1
        })
        this.getStudents()
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
  



    render() {
        return(
            <div>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Lease Information</title>
            </Helmet>

            <PageHeader
                HeaderText="Lease Information"
                Breadcrumb={[ { name: "Lease Information" }]}
                key="1"
              />

            <div className="card m-3 p-2">
                <h3>Lease Information</h3>

                <form>
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

              <button onClick={(e)=>{ this.postLeaseData(e)}} className="btn btn-primary">Update</button>
              <button onClick={(e)=>{ this.getStudents(e)}} className="btn btn-primary">Edit Leases</button>
                </form>
                </div>

            </div>
        )
    }
}


const mapStateToProps = ({ mailInboxReducer, navigationReducer }) => ({
    isEventModal: mailInboxReducer.isEventModal,
    isPopUpModal: mailInboxReducer.isPopUpModal,
  
    MyloadingController: navigationReducer.loadingController,
    loadingMessage: navigationReducer.loadingMessage,
  });
  
  export default connect(mapStateToProps, { 
    updateLoadingMessage,
    updateLoadingController,
   })(LeaseInformation);