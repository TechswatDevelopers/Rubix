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
            res: '',
            prov: 0,
            uni: '',
            course: '',
            year: '',
            payment: '',
            payMethods: ['NSFAS', 'External Bursary', 'Student Loan', 'Self Funded'],
            value: 0

        };
      }
     //final submit check
     Submit(e){
        e.preventDefault();
        const form = document.getElementById('uniDetails');
        const data = {
            'RubixRegisterUserID': '71',
            'ProvinceID': this.state.prov,
            'UniversityID': this.state.uni,
            'CourseID': this.state.course,
            'ResidenceID': this.state.res,
            'StudentYearofStudyID': this.state.year,
            'PaymentMethod': this.state.payment
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
            if (document.getElementById('uniDetails').checkValidity() == true){
                await axios.post('http://197.242.69.18:3300/api/RubixRegisterUserUniversityDetails', data, requestOptions)
                .then(response => {
                    console.log(response)
                    this.props.history.push("/nextofkin")
                })
                    
            } else{
                
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

    const fetchData = async() =>{

        //Populate university list
        await fetch('http://197.242.69.18:3300/api/RubixUniversities')
        .then(response => response.json())
        .then(data => {
            //console.log("data is ", data.data)
            this.setState({uniList: data.data})
            });

            //Populate Residence list
            await fetch('http://197.242.69.18:3300/api/RubixResidences')
        .then(response => response.json())
        .then(data => {
            //console.log("data is ", data.data)
            this.setState({resList: data.data})
            });

            //Populate Provinces list
        await fetch('http://197.242.69.18:3300/api/RubixProvinces')
        .then(response => response.json())
        .then(data => {
            //console.log("data is ", data.data)
            //this.state.provList = data.data
            this.setState({provList: data.data})
            //console.log("this is the provList:", this.state.provList)
            //setProvList(data.data)
            });

            //Populate Courses list
            await fetch('http://197.242.69.18:3300/api/RubixCourses')
        .then(response => response.json())
        .then(data => {
            //console.log("data is ", data.data)
            this.setState({courseList: data.data})
            });

            //Populate Year of Study list
            await fetch('http://197.242.69.18:3300/api/RubixStudentYearofStudies')
        .then(response => response.json())
        .then(data => {
            //console.log("data is ", data.data)
            this.setState({yearList: data.data})
            });
    
    }
    fetchData();
  }

  render() {
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
                    <form id='uniDetails'>

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
                      </div>

                      
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
                            {  
        <select className="form-control" onChange={(e)=>this.setState({course: e.target.value})} value={this.state.course}>
        {
            
            this.state.courseList.map((course, index)=> (
            <option key={index} name='CourseID' value = {course.RubixCourseID}>{course.CourseName}</option>
        ))   
        }
    </select> }
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

/* PersonalInformation.propTypes = {
};

const mapStateToProps = ({ loginReducer }) => ({
  email: loginReducer.email,
  password: loginReducer.password
});
 */
export default VarsityDetails;
