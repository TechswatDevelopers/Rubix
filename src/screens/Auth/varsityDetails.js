import React from "react";
import { connect } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from "../../assets/images/logo-white.svg";
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css';
import axios from "axios";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

class VarsityDetails extends React.Component {
    constructor(props) {
        super(props);
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
            hearAboutUs: ['Where did you hear about us?', 'Social Media', 'Word of Mouth', 'School Campiegn', 'Other'],
            bankTypes: ['Please select account type', 'Savings', 'Cheque'],
            value: 0

        };
      }

     //final submit check
     Submit(e){
        e.preventDefault();
        const form = document.getElementById('uniDetails');
        const data = {
            'RubixRegisterUserID': this.state.myUserID,
            'ProvinceID': this.state.prov,
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
                    console.log(response)
                    //this.props.history.push("/nextofkin")
                })
                    
            } else{
              alert("Please ensure that you entered all required information")
                console.log("checkValidity ", document.getElementById('uniDetails').checkValidity())
            }
        }
        postData()
    }


async componentDidMount(){
    document.body.classList.remove("theme-cyan");
    document.body.classList.remove("theme-purple");
    document.body.classList.remove("theme-blue");
    document.body.classList.remove("theme-green");
    document.body.classList.remove("theme-orange");
    document.body.classList.remove("theme-blush");
    const userID = localStorage.getItem('userID');
    this.setState({myUserID: userID});

    const fetchData = async() =>{

        //Populate university list
        await fetch('https://rubixapi.cjstudents.co.za:88/api/RubixUniversities')
        .then(response => response.json())
        .then(data => {
            //console.log("data is ", data.data)
            this.setState({uniList: data.data})
            });

            //Populate Residence list
            await fetch('https://rubixapi.cjstudents.co.za:88/api/RubixResidences')
        .then(response => response.json())
        .then(data => {
            //console.log("data is ", data.data)
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

  onPressCancel(){
    this.setState({selectedFile: null})
    this.setState({isSelected: false})
  }
  changeHandler = (event) => {
    this.setState({selectedFile: event.target.files[0]})
    console.log("selcted file", event.target.files[0])
    this.setState({isSelected: true})
    this.getBase64(event)
  }
  handleUpdate(){
    const inputFile = document.getElementById('upload-button')
    inputFile.click()
  }

  render() {
    let body;
    if(this.state.payment == 'NSFAS' || this.state.payment == 'External Bursary' || this.state.payment == 'Student Loan'){
      body = 
      null
      {/* <>
      <div style={{margin: 'auto', width: '25%'}}>
        <input style={{ display: 'none' }} id='upload-button' type="file" onChange={(e)=>{this.changeHandler(e)}} />
        <button className="btn btn-primary" variant="contained" color="primary" component="span" onClick={()=>this.handleUpdate()}>Upload Proof of Funding</button>
        </div>
      </> */}
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
      <div className="theme-green">
        <div >
          <div className="vertical-align-wrap">
            <div className="vertical-align-middle auth-main">
              <div className="auth-box">
                <div className="card">
                <div className="top">
                  <img src="CJ-Logo.png" alt="Logo" style={{ height: "50px", margin: "10px", display: "block", margin: "auto" }} />
                </div>
                  <div className="header">
                    <p className="lead">Student University Details</p>
                  </div>
                  
                  <div className="body">
                    <form id='uniDetails'>{/* 

                      <div className="form-group">
                        <label className="control-label sr-only" >
                        Province:
                            </label>
                            {  
        <select className="form-control" onChange={(e)=>this.setState({prov: e.target.value})} value={this.state.prov}>
        {
         this.state.provList.map((province, index)=> (
            <option key={index} name='RegisterUserProvince' value = {province.RubixProvinceID}>{province.Province}</option>
        ))  
        }
        </select> }
                      </div> */}

                      
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
                        Courses:
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
                     
                      <button className="btn btn-primary btn-lg btn-block" type="submit" onClick={(e) => this.Submit(e) }>
                        NEXT
                        </button>
                    </form>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

VarsityDetails.propTypes = {
};

const mapStateToProps = ({ navigationReducer, loginReducer }) => ({
  email: loginReducer.email,
  password: loginReducer.password,
  rubixUserID: navigationReducer.userID,
});

export default connect(mapStateToProps, {})(VarsityDetails);
