import React from "react";
import { connect } from "react-redux";
import { onPresAddEvent, onPresPopNewNotice,
  onUpdateVarsity,updateLoadingMessage,updateLoadingController } from "../actions";
import { Form } from 'react-bootstrap';
import axios from "axios";

class PopUpVarsity extends React.Component {
    //Initial State
constructor(props) {
  super(props)
  this.state = {
    resList:[],
            uniList: [],
            provList: [],
            courseList: [],
            yearList: [],
            myUserID: null,
            res: null,
            prov: null,
            uni: null,
            course: null,
            year: null,
            payment: null,
            hearAbout: null,
            selectedFile: null,
            bankType: null,
            payMethods: ['Please Select your Payment Method', 'NSFAS', 'External Bursary', 'Student Loan', 'Self Funded'],
            hearAboutUs: ['Where did you hear about us?', 'Social Media', 'Word of Mouth', 'School Campaign', 'Other'],
            bankTypes: ['Please select account type', 'Savings', 'Cheque'],
            value: 0
  }
}
async componentDidMount(){
  const userID = localStorage.getItem('userID');
  this.setState({myUserID: userID});

  console.log("Testing: ", this.props.isPopUpModal)

  const fetchData = async() =>{
      //Populate university list
      await fetch('https://rubixapi.cjstudents.co.za:88/api/RubixUniversities/' + localStorage.getItem('clientID'))
      .then(response => response.json())
      .then(data => {
          console.log("data is ", data.data)
          this.setState({uniList: data.data})
          });

          //Populate Residence list
          await fetch('https://rubixapi.cjstudents.co.za:88/api/RubixResidences/' + localStorage.getItem('clientID'))
      .then(response => response.json())
      .then(data => {
          console.log("data is ", data)
          this.setState({resList: data.data})
          });

          //Populate Provinces list
      await fetch('https://rubixapi.cjstudents.co.za:88/api/RubixProvinces')
      .then(response => response.json())
      .then(data => {
          //console.log("data is ", data.data)
          //this.state.provList = data.data
          this.setState({provList: data.data})
          //console.log("this is the provList:", this.state.provList)
          //setProvList(data.data)
          });

          //Populate Courses list
          await fetch('https://rubixapi.cjstudents.co.za:88/api/RubixCourses')
      .then(response => response.json())
      .then(data => {
          //console.log("data is ", data.data)
          this.setState({courseList: data.data})
          });

          //Populate Year of Study list
          await fetch('https://rubixapi.cjstudents.co.za:88/api/RubixStudentYearofStudies')
      .then(response => response.json())
      .then(data => {
          //console.log("data is ", data.data)
          this.setState({yearList: data.data})
          });
  
  }
  fetchData();
}

     //final submit check
     Submit(e, studentid){
      e.preventDefault();
      //Set Loading Screen ON
   this.props.updateLoadingController(true);
   this.props.updateLoadingMessage("Submitting Information...");
      const form = document.getElementById('uniDetails');
      console.log('Uni ID: ', this.state.uni)
      const data = {
          'RubixRegisterUserID': studentid,
          //'ProvinceID': this.state.prov,
          'UniversityID': this.state.uni,
          'CourseID': this.state.course,
          'ResidenceID': this.state.res,
          'StudentYearofStudyID': this.state.year,
          'PaymentMethod': this.state.payment,
          'HearAbout': this.state.hearAbout
      };
      for (let i=0; i < form.elements.length; i++) {
          const elem = form.elements[i];
          data[elem.name] = elem.value
      }
  
      const requestOptions = {
          title: 'Student University Deytails',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: data
      };
      console.log(data)
      const postData = async()=>{
          if (this.state.uni !=null && this.state.res !=null && this.state.year !=null && this.state.payment != this.state.payMethods[0] && document.getElementById('uniDetails').checkValidity() == true){
              await axios.post('https://rubixapi.cjstudents.co.za:88/api/RubixRegisterUserUniversityDetails', data, requestOptions)
              .then(response => {
                  console.log("Response: ", response)
                  //Set timer for loading screen
  setTimeout(() => {
    this.props.updateLoadingController(false);
  }, 1000);
  this.props.onUpdateVarsity()
  //window.location.reload()
                 // this.props.history.push("/nextofkin")
              })
                  
          } else{
            //Set timer for loading screen
  setTimeout(() => {
    this.props.updateLoadingController(false);
  }, 1000);
            alert("Please ensure that you entered all required information")
              console.log("checkValidity ", document.getElementById('uniDetails').checkValidity())
          }
      }
      postData()
  }

  render() {
    const {StudentID, isPopUpModal} = this.props;
    let body;
    if(this.state.payment == 'NSFAS' || this.state.payment == 'External Bursary' || this.state.payment == 'Student Loan'){
      body = 
      null
    } else if(this.state.payment == 'Self Funded'){
      body = <>
      <div className="form-group">
                        <label className="control-label sr-only" >
                        Account Holder Name:
                            </label>
                            <input
                          className="form-control"
                          id="AccountHolderName"
                          name='AccountHolderName'
                          placeholder="Enter your bank account holder name"
                          type="text"
                          required
                        />
                      </div>

                            <div className="form-group">
                        <label className="control-label sr-only" >
                        Bank Name:
                            </label>
                            <input
                          className="form-control"
                          id="BankName"
                          name='BankName'
                          placeholder="Enter your bank name"
                          type="text"
                          required
                        />
                      </div>

                            <div className="form-group">
                        <label className="control-label sr-only" >
                        Branch Code:
                            </label>
                            <input
                          className="form-control"
                          id="BranchCode"
                          name='BranchCode'
                          placeholder="Enter your branch code"
                          type="text"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="control-label sr-only" >
                        Account Number:
                            </label>
                            <input
                          className="form-control"
                          id="AccountNumber"
                          name='AccountNumber'
                          placeholder="Enter your account number"
                          type="text"
                          required
                        />
                      </div>

                      
                      <div className="form-group">
                        <label className="control-label sr-only" >
                        Account Type:
                            </label>
                            {  
        <select className="form-control" onChange={(e)=>this.setState({bankType: e.target.value})} value={this.state.bankType}>
        {
         this.state.bankTypes.map((banktype, index)=> (
            <option key={index} name='AccountType' value = {banktype}>{banktype}</option>
        ))  
        }
        </select> }
                      </div>

      </>
    } else {
      body = null;
    }
    return (
      <div className={isPopUpModal ? "modal fade show" : "modal fade"}
      role="dialog">
          <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="">
                <div className="top p-3">
                  <img src={localStorage.getItem('clientLogo')} alt="" style={{  height: "40%",  width:"44%",  display: "block", display: "block", margin: "auto" }} />
                </div>
                  <div className="header">
                    <p className="lead px-3">Update Student University Details {}</p>
                    <p className="px-3">*Please not that changing the University informaion will affect the student lease, please regenerate lease after updating information.</p>
                  </div>
                  
                  <div className="body p-3">
                    <form id='uniDetails'>
                      <div className="form-group">
                        <label className="control-label sr-only" >
                        University:
                            </label>
                            {  
        <select className="form-control" onChange={(e)=>this.setState({uni: e.target.value})} value={this.state.uni}>
        {
            
         this.state.uniList.map((university, index)=> (
            <option key={index} name='UniversityID' value = {university.RubixUniversityID}>{university.UniversityName}</option>
        ))   
        }
    </select> }
                      </div>
                      
                      <div className="form-group">
                        <label className="control-label sr-only" >
                        Course:
                            </label>
                            <input
                          className="form-control"
                          id="CourseID"
                          name='CourseID'
                          placeholder="Enter your course name"
                          type="text"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="control-label sr-only" >
                        Residence:
                            </label>
                            {  
        <select className="form-control" onChange={(e)=>this.setState({res: e.target.value})} value={this.state.res}>
        {
            
            this.state.resList.map((res, index)=> (
            <option key={index} name='ResidenceID' value = {res.RubixResidenceID }>{res.ResidenceName}</option>
        ))   
        }
    </select> }
                      </div>
                      

                      <div className="form-group">
                        <label className="control-label sr-only" >
                        Year of Study:
                            </label>
                            {  
        <select className="form-control" onChange={(e)=>this.setState({year: e.target.value})} value={this.state.year}>
        {
            
            this.state.yearList.map((year, index)=> (
            <option key={index} name='StudentYearofStudyID' value = {year.RubixStudentYearofStudyID}>{year.YearofStudy}</option>
        ))   
        }
    </select> }
                      </div>

                      <div className="form-group">
                        <label className="control-label sr-only" >
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
                     {body}

                      <div className="form-group">
                        <label className="control-label sr-only" >
                        Hear About Us: 
                            </label>
                            {  
        <select className="form-control" onChange={(e)=>this.setState({hearAbout: e.target.value})} value={this.state.hearAbout}>
        {
            
            this.state.hearAboutUs.map((options, index)=> (
            <option key={index} name='HearAbout' value={options}>{options}</option>
        ))   
        }
    </select> }
                      </div>
                     
                      <button className="btn btn-primary" type="button" onClick={(e) => this.Submit(e, this.props.currentStudentiD)}>
                        UPDATE
                        </button>{" "}
                &nbsp;&nbsp;
                <button className="btn btn-default" type="button" onClick={(e) => {
                  e.preventDefault()
                  this.props.onUpdateVarsity()}}>
                  CANCEL
                </button>
                    </form>
                  </div>
                </div>

              </div>
          </div>
        </div>
    );
  }
}

const mapStateToProps = ({ mailInboxReducer, navigationReducer }) => ({
  currentStudentiD: navigationReducer.studentID,
  isEventModal: mailInboxReducer.isEventModal,
  isPopUpModal: mailInboxReducer.isShowVarsityPopUp,
});

export default connect(mapStateToProps, { onPresAddEvent, onPresPopNewNotice, 
  onUpdateVarsity,
  updateLoadingMessage,updateLoadingController  })(PopUpVarsity);
