import React from "react";
import { connect } from "react-redux";
import imageuser from "../../assets/images/user.png";
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css';
import axios from "axios";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

class ProfileV1Setting extends React.Component {
  //Reset password
  updateAddressInformation(e){
//const history = useHistory();
const locations = document.getElementById('location');
    console.log("location:",this.state.location)
    const street_address = this.state.location['value']['structured_formatting']['main_text']
e.preventDefault();
const form = document.getElementById('addresses');
const data = {
    'RubixRegisterUserID': '2745',
    'RegisterUserStreetNameAndNumer': street_address,
    'RegisterUserProvince': this.state.prov,
    'RegisterUserCountry': this.state.country,
};
for (let i=0; i < form.elements.length; i++) {
    const elem = form.elements[i];
    data[elem.name] = elem.value
}

const requestOptions = {
    title: 'Update Address Form',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data
};
console.log(data)
const postData = async() => {
        await axios.post('http://197.242.69.18:3300/api/RubixRegisterUserAddesss', data, requestOptions)
        .then(response => {
            console.log(response)
            //alert(response.data.PostRubixUserData[0].Response)
        })
}
postData()

  }
  //Reset password
  resetPassword(e){
//const history = useHistory();
e.preventDefault();
const form = document.getElementById('password');
const data = {
    'RubixRegisterUserID': '2745'
};
for (let i=0; i < form.elements.length; i++) {
    const elem = form.elements[i];
    data[elem.name] = elem.value
}

const requestOptions = {
    title: 'Reset Password Form',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data
};
console.log(data)
const postData = async() => {
        await axios.post('http://197.242.69.18:3300/api/RubixResetPassword', data, requestOptions)
        .then(response => {
            console.log(response)
            alert(response.data.PostRubixUserData[0].Response)
        })
}
postData()

  }

  //Validate ID
  Validate() {
    
    var idNumber = document.getElementById("IDNumber").value;

    // store the error div, to save typing
    var error = document.getElementById('error');
    //console.log("ID number is ",idNumber);

    // assume everything is correct and if it later turns out not to be, just set this to false
    var correct = true;

    //Ref: http://www.sadev.co.za/content/what-south-african-id-number-made
    // SA ID Number have to be 13 digits, so check the length
    if (idNumber.length != 13 ) {
        error.append('ID number does not appear to be authentic - input not a valid number.');
        correct = false;
    }

    //Extract first 6 digits
    var year = idNumber.substring(0, 2);
    var month = idNumber.substring(2, 4);
    var day = idNumber.substring(4, 6);
    console.log(year, month, day)

    // get first 6 digits as a valid date
    var tempDate = new Date(year, month - 1, day);

    var id_date = tempDate.getDate();
    var id_month = tempDate.getMonth();
    var id_year = tempDate.getFullYear();
    var right_month = id_month + 1;
    console.log(id_date, id_month, id_year)

    var fullDate = id_date + "-" + right_month + "-" + id_year;

    if (!((tempDate.getYear() == idNumber.substring(0, 2)) && (id_month == idNumber.substring(2, 4) - 1) && (id_date == idNumber.substring(4, 6)))) {
        error.append('ID number does not appear to be authentic - date part not valid. ');
        correct = false;
    }

    // get the gender
    var genderCode = idNumber.substring(6, 10);
    var gender = parseInt(genderCode) < 5000 ? "Female" : "Male";
    this.setState({userGender: gender})
    //setGender(gender)

    // get country ID for citzenship
    var citzenship = parseInt(idNumber.substring(10, 11)) == 0 ? "Yes" : "No";

    // apply Luhn formula for check-digits
    var tempTotal = 0;
    var checkSum = 0;
    var multiplier = 1;
    for (var i = 0; i < 13; ++i) {
        tempTotal = parseInt(idNumber.charAt(i)) * multiplier;
        if (tempTotal > 9) {
            tempTotal = parseInt(tempTotal.toString().charAt(0)) + parseInt(tempTotal.toString().charAt(1));
        }
        checkSum = checkSum + tempTotal;
        multiplier = (multiplier % 2 == 0) ? 1 : 2;
    }
    if ((checkSum % 10) != 0) {
        error.append('ID number does not appear to be authentic - check digit is not valid');
        correct = false;
    }
    if (correct) {
        // and put together a result message
        //document.getElementById('result').append('<p>South African ID Number:   ' + idNumber + '</p><p>Birth Date:   ' + fullDate + '</p><p>Gender:  ' + gender + '</p><p>SA Citizen:  ' + citzenship + '</p>');
    }
    return correct
}

  //Update personal information
  updateUserInformation(e){
e.preventDefault();
console.log(this.state.selectedFile)
const form = document.getElementById('personalInfo');
const data = {
    'RubixRegisterUserID': '2745', //Buffer.from(this.state.selectedFile.value).toString('base64')
    'UserProfileImage': this.state.imgUpload,
    'ClientID': 1
};
for (let i=0; i < form.elements.length; i++) {
    const elem = form.elements[i];
    data[elem.name] = elem.value
}

const requestOptions = {
    title: 'Update Personal Information Form',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data
};
console.log(data)
const postData = async() => {
        if(this.Validate)
        {
          await axios.post('http://197.242.69.18:3300/api/RubixRegisterUsers', data, requestOptions)
        .then(response => {
            console.log(response)
            alert(response.data.PostRubixUserData[0].ResponceMessage)
        })}else {
          alert("ID Number Invalid")
        }
}
postData()

  }


  constructor(props) {
    super(props);
    this.state = {
        profile: {},
        profiles: [],
        clients: [],
        addressProv: 'Gauteng',
        resProv: 'Gauteng',
        addressCountry: '',
        provList:[],
        resList:[],
        uniList: [],
        courseList: [],
        yearList: [],
        countryList: [],
        payment: '',
        address: {},
        university: {},
        location: {},
        selectedFile: null,
        newPic: false,
        base64Image: null,
        imgUpload: null,
        payMethods: ['NSFAS', 'External Bursary', 'Student Loan', 'Self Funded'],
        value: 0

    };
  }
  getBase64(e) {
    //console.log("I am called")
    var file = e.target.files[0]
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      this.setState({
        imgUpload: reader.result
      })
      //console.log("This is the img:", this.state.imgUpload)
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    }
  }
  
  // On file select (from the pop up)
  onFileChange = event => {
  
    // Update the state
    this.setState({ selectedFile: event.target.files[0] });
    this.setState({ newPic: true });

    if(this.state.selectedFile) {
      const reader = new FileReader();

      reader.onload = this.handleReaderLoaded.bind(this);

      //reader.readAsBinaryString(this.state.selectedFile)
    }
  
  };

  componentDidMount(){
    const fetchData = async() =>{

      //Get Rubix User Details
      await fetch('http://197.242.69.18:3300/api/RubixRegisterUsers/2745')
      .then(response => response.json())
      .then(data => {
          this.setState({profile: data})
          console.log("image url", data.UserProfileImage)
          });

          //Get Rubix User University Details
      await fetch('http://197.242.69.18:3300/api/RubixRegisterUserUniversityDetails/71')
      .then(response => response.json())
      .then(data => {
          console.log("my uni data is ", data)
          this.setState({university: data})
          });


          //Get Rubix User Address Details
      await fetch('http://197.242.69.18:3300/api/RubixRegisterUserAddesss/2745')
      .then(response => response.json())
      .then(data => {
          console.log("data is ", data)
          this.setState({address: data})
          this.setState({addressProv: data.RegisterUserProvince})
          this.setState({addressCountry: data.RegisterUserCountry})
          });

          //Get Rubix Provices
          await fetch('http://197.242.69.18:3300/api/RubixProvinces')
        .then(response => response.json())
        .then(data => {
            //console.log("data is ", data.data)
            //this.state.provList = data.data
            this.setState({provList: data.data})
            //console.log("this is the provList:", this.state.provList)
            //setProvList(data.data)
            });
            //Fetch Countries List
                    await fetch('http://197.242.69.18:3300/api/RubixCountries')
                .then(response => response.json())
                .then(data => {
                    //console.log("data is ", data.data)
                    this.setState({countryList: data.data})
                    //console.log("this is the countryList:", this.state.countryList)
                    //setCountryList(data.data)
                    });

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
      <div>
        <div className="body">
          <h6>Profile Photo</h6>
          <div className="media">
            <div className="media-left m-r-15">
              <img
                 alt="cannot display"
                 accept='.jpg, .png, .jpeg'
                className="user-photo media-object"
                src= {this.state.profile.UserProfileImage} />
            </div>
            <div className="media-body">
              <p>
                Upload your photo. <br />
                <em>Image should be at least 140px x 140px</em>
              </p>
              <div>
                <input type="file" onChange={(e)=>{this.getBase64(e)}} />
                
            </div>
              <input className="sr-only" id="filePhoto" type="file" />
            </div>
          </div>
        </div>


        <div className="body">
          <form id="personalInfo">
          <h6>Personal Information</h6>
          <div className="row clearfix">
            <div className="col-lg-6 col-md-12">
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="First Name"
                  name="Name"
                  defaultValue={this.state.profile.Name}
                  type="text"
                />
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="Middle Name"
                  name="MiddleName"
                  defaultValue={this.state.profile.MiddleName}
                  type="text"
                />
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="Last Name"
                  name="Surname"
                  defaultValue={this.state.profile.Surname}
                  type="text"
                />
              </div>
              <div className="form-group">
                <div>
                  <label className="fancy-radio">
                    <input
                      name="Gender"
                      type="radio"
                      value="male"
                      onChange={() => {}}
                    />
                    <span>
                      <i></i>Male
                    </span>
                  </label>
                  <label className="fancy-radio">
                    <input
                      name="Gender"
                      type="radio"
                      value="female"
                      onChange={() => {}}
                    />
                    <span>
                      <i></i>Female
                    </span>
                  </label>
                </div>
              </div>
              
              <div className="form-group">
                <input
                  className="form-control"
                  id='IDNumber'
                  placeholder="ID Number"
                  name="IDNumber"
                  required='' 
                  maxLength = '13' 
                  minLength='13' 
                  placeholder='Enter your ID Number'
                  defaultValue={this.state.profile.IDNumber}
                  type='number'
                />
                <br></br>
                    <div id="error"></div>
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="Email"
                  name="UserEmail"
                  defaultValue={this.state.profile.UserEmail}
                  type="text"
                />
              </div>
              <div className="form-group">
              <PhoneInput id = 'register-page-phone-number' placeholder="+27 123 15348"
                          defaultValue={this.state.profile.PhoneNumber} name="PhoneNumber"  required='' 
                    value={this.state.profile.PhoneNumber}
                    onChange={()=> this.setState({value: this.state.value})} />
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  defaultValue={this.state.profile.StudentNumber}
                  name="StudentNumber"
                  placeholder="Student Number"
                  type="text"
                />
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  name="MedicalConditions"
                  defaultValue={this.state.profile.MedicalConditions}
                  placeholder="MedicalConditions"
                  type="text"
                />
              </div>
              <button className="btn btn-primary" type="button" onClick={(e)=>{this.updateUserInformation(e)}}>
            Update
          </button>{" "}
          &nbsp;&nbsp;
          <button className="btn btn-default" type="button">
            Cancel
          </button>
            </div>
          </div>
          </form>
        </div>

        
        <div className="body">
          <div className="row clearfix">
            <div className="col-lg-6 col-md-12">
              <form id="password">
              <h6>Change Password</h6>
              <div className="form-group">
                <input
                  className="form-control"
                  autoComplete="off"
                  name="UserPass"
                  placeholder="Current Password"
                  type="password"
                />
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="New Password"
                  name="UserNewPass"
                  type="password"
                />
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="Confirm New Password"
                  type="password"
                />
              </div>
              </form>
            </div>
          </div>
          <button className="btn btn-primary" type="button" onClick={(e)=>{this.resetPassword(e)}}>
            Change Password
          </button>{" "}
          &nbsp;&nbsp;
          <button className="btn btn-default">Cancel</button>
        </div>


        <div className="body">
          <form id="addresses">
          <div className="row clearfix">
             <div className="col-lg-6 col-md-12">
              <h6>Address Information</h6>
              <p>Current Address: {this.state.address.RegisterUserStreetNameAndNumer}</p>
              <div className="form-group">
              <GooglePlacesAutocomplete
apiKey="AIzaSyBoqU4KAy_r-4XWOvOiqj0o_EiuxLd9rdA" id='location' onChange = {(e)=>this.setState({location: e.target.value})}
selectProps={{
location: this.state.location,
onChange: (e)=>this.setState({location: e}),
placeholder: "Update home address"
}}
/>
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="Complex/Appartment Number"
                  defaultValue={this.state.address.RegisterUserComplexorBuildingNumber}
                  type="email"
                  onChange={() => {}}
                />
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="Complex/Appartment Name"
                  defaultValue={this.state.address.RegisterUserComplexorBuildingName}
                  type="text"
                  onChange={() => {}}
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <h6>.</h6>
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="Postal Code"
                  defaultValue={this.state.address.PostCode}
                  type="text"
                />
              </div>
              <div className="form-group">
              {  
        <select className="form-control" onChange={(e)=>this.setState({addressProv: e.target.value})} value={this.state.addressProv}>
        {
         this.state.provList.map((province, index)=> (
            <option key={index} name='RegisterUserProvince' value = {province.Province}>{province.Province}</option>
        ))  
        }
        </select> }
              </div>
              <div className="form-group">
              <select className="form-control" onChange={(e)=>this.setState({country: e.target.value})} value={this.state.addressCountry}>
        {
         this.state.countryList.map((country, index)=> (
            <option key={index} name='RegisterUserCountry' value = {country.Country_Name}>{country.Country_Name}</option>
        ))   
        }
        </select> 
              </div>
            </div>
          </div>
          <button className="btn btn-primary" type="button" onClick={(e)=>{this.updateAddressInformation(e)}}>
            Update
          </button>{" "}
          &nbsp;&nbsp;
          <button className="btn btn-default">Cancel</button>
          </form>
        </div>


        <div className="body">
          <div className="row clearfix">
             <div className="col-lg-6 col-md-12">
              <h6>University Information</h6>
              <div className="form-group">
              {  
        <select className="form-control" onChange={(e)=>this.setState({resProv: e.target.value})} value={this.state.resProv}>
        {
         this.state.provList.map((province, index)=> (
            <option key={index} name='RegisterUserProvince' value = {this.state.university.RegisterUserUniversityProvinceID}>{province.Province}</option>
        ))  
        }
        </select> }
              </div>
              <div className="form-group">
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
              {  
        <select className="form-control" onChange={(e)=>this.setState({course: e.target.value})} value={this.state.course}>
        {
            
            this.state.courseList.map((course, index)=> (
            <option key={index} name='CourseID' value = {course.RubixCourseID}>{course.CourseName}</option>
        ))   
        }
    </select> }
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <h6>.</h6>
              <div className="form-group">
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
              {  
        <select className="form-control" onChange={(e)=>this.setState({year: e.target.value})} value={this.state.year}>
        {
            
            this.state.yearList.map((year, index)=> (
            <option key={index} name='StudentYearofStudyID' value = {year.RubixStudentYearofStudyID}>{year.YearofStudy}</option>
        ))   
        }
    </select> }
              </div>
              <div className="form-group">{  
        <select className="form-control" onChange={(e)=>this.setState({payment: e.target.value})} value={this.state.payment}>
        {
            
            this.state.payMethods.map((payment, index)=> (
            <option key={index} name='PaymentMethod' value={payment}>{payment}</option>
        ))   
        }
    </select> }
              </div>
            </div>
          </div>
          <button className="btn btn-primary" type="button">
            Update
          </button>{" "}
          &nbsp;&nbsp;
          <button className="btn btn-default">Cancel</button>
        </div>


<div className="body">
  <div className="row clearfix">
     <div className="col-lg-6 col-md-12">
      <h6>Next of Kin Information</h6>
      <div className="form-group">
        <input
          className="form-control"
          disabled=""
          placeholder="First Name"
          type="text"
          onChange={() => {}}
        />
      </div>
      <div className="form-group">
        <input
          className="form-control"
          placeholder="Last Name"
          type="email"
          onChange={() => {}}
        />
      </div>
      <div className="form-group">
      <input
                  className="form-control"
                  placeholder="ID Number"
                  defaultValue={this.state.profile.IDNumber}
                  type="text"
                />
      </div>
    </div>
    <div className="col-lg-6 col-md-12">
      <h6>.</h6>
      <div className="form-group">
        <input
          className="form-control"
          placeholder="Postal Code"
          type="text"
        />
      </div>
      <div className="form-group">
      {  
<select className="form-control" onChange={(e)=>this.setState({prov: e.target.value})} value={this.state.prov}>
{
 this.state.provList.map((province, index)=> (
    <option key={index} name='RegisterUserProvince' value = {province.Province}>{province.Province}</option>
))  
}
</select> }
      </div>
      <div className="form-group">
      <select className="form-control" onChange={(e)=>this.setState({country: e.target.value})} value={this.state.country}>
{
 this.state.countryList.map((country, index)=> (
    <option key={index} name='RegisterUserCountry' value = {country.Country_Name}>{country.Country_Name}</option>
))   
}
</select> 
      </div>
    </div>
  </div>
  <button className="btn btn-primary" type="button">
    Update
  </button>{" "}
  &nbsp;&nbsp;
  <button className="btn btn-default">Cancel</button>
</div>

{/* 
        <div className="body">
          <h6>General Information</h6>
          <div className="row">
            <div className="col-lg-6 col-md-12">
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="Phone Number"
                  type="text"
                />
              </div>
              <div className="form-group">
                <select className="form-control">
                  <option>--Select Language</option>
                  <option lang="en" value="en_US">
                    English (United States)
                  </option>
                  <option lang="ar" value="ar">
                    العربية
                  </option>
                  <option lang="ar" value="ary">
                    العربية المغربية
                  </option>
                  <option lang="az" value="az">
                    Azərbaycan dili
                  </option>
                  <option lang="az" value="azb">
                    گؤنئی آذربایجان
                  </option>
                  <option lang="be" value="bel">
                    Беларуская мова
                  </option>
                  <option lang="bg" value="bg_BG">
                    Български
                  </option>
                  <option lang="bn" value="bn_BD">
                    বাংলা
                  </option>
                  <option lang="bs" value="bs_BA">
                    Bosanski
                  </option>
                  <option lang="ca" value="ca">
                    Català
                  </option>
                  <option lang="ceb" value="ceb">
                    Cebuano
                  </option>
                  <option lang="cs" value="cs_CZ">
                    Čeština‎
                  </option>
                  <option lang="cy" value="cy">
                    Cymraeg
                  </option>
                  <option lang="da" value="da_DK">
                    Dansk
                  </option>
                  <option lang="de" value="de_CH_informal">
                    Deutsch (Schweiz, Du)
                  </option>
                  <option lang="de" value="de_CH">
                    Deutsch (Schweiz)
                  </option>
                  <option lang="de" value="de_DE">
                    Deutsch
                  </option>
                  <option lang="de" value="de_DE_formal">
                    Deutsch (Sie)
                  </option>
                  <option lang="el" value="el">
                    Ελληνικά
                  </option>
                  <option lang="en" value="en_GB">
                    English (UK)
                  </option>
                  <option lang="en" value="en_AU">
                    English (Australia)
                  </option>
                  <option lang="en" value="en_ZA">
                    English (South Africa)
                  </option>
                  <option lang="en" value="en_NZ">
                    English (New Zealand)
                  </option>
                  <option lang="en" value="en_CA">
                    English (Canada)
                  </option>
                  <option lang="eo" value="eo">
                    Esperanto
                  </option>
                  <option lang="es" value="es_CL">
                    Español de Chile
                  </option>
                  <option lang="es" value="es_MX">
                    Español de México
                  </option>
                  <option lang="es" value="es_GT">
                    Español de Guatemala
                  </option>
                  <option lang="es" value="es_AR">
                    Español de Argentina
                  </option>
                  <option lang="es" value="es_ES">
                    Español
                  </option>
                  <option lang="es" value="es_PE">
                    Español de Perú
                  </option>
                  <option lang="es" value="es_CO">
                    Español de Colombia
                  </option>
                  <option lang="es" value="es_VE">
                    Español de Venezuela
                  </option>
                  <option lang="et" value="et">
                    Eesti
                  </option>
                  <option lang="eu" value="eu">
                    Euskara
                  </option>
                  <option lang="fa" value="fa_IR">
                    فارسی
                  </option>
                  <option lang="fi" value="fi">
                    Suomi
                  </option>
                  <option lang="fr" value="fr_FR">
                    Français
                  </option>
                  <option lang="fr" value="fr_CA">
                    Français du Canada
                  </option>
                  <option lang="fr" value="fr_BE">
                    Français de Belgique
                  </option>
                  <option lang="gd" value="gd">
                    Gàidhlig
                  </option>
                  <option lang="gl" value="gl_ES">
                    Galego
                  </option>
                  <option lang="haz" value="haz">
                    هزاره گی
                  </option>
                  <option lang="he" value="he_IL">
                    עִבְרִית
                  </option>
                  <option lang="hi" value="hi_IN">
                    हिन्दी
                  </option>
                  <option lang="hr" value="hr">
                    Hrvatski
                  </option>
                  <option lang="hu" value="hu_HU">
                    Magyar
                  </option>
                  <option lang="hy" value="hy">
                    Հայերեն
                  </option>
                  <option lang="id" value="id_ID">
                    Bahasa Indonesia
                  </option>
                  <option lang="is" value="is_IS">
                    Íslenska
                  </option>
                  <option lang="it" value="it_IT">
                    Italiano
                  </option>
                  <option lang="ja" value="ja">
                    日本語
                  </option>
                  <option lang="ka" value="ka_GE">
                    ქართული
                  </option>
                  <option lang="ko" value="ko_KR">
                    한국어
                  </option>
                  <option lang="lt" value="lt_LT">
                    Lietuvių kalba
                  </option>
                  <option lang="mk" value="mk_MK">
                    Македонски јазик
                  </option>
                  <option lang="mr" value="mr">
                    मराठी
                  </option>
                  <option lang="ms" value="ms_MY">
                    Bahasa Melayu
                  </option>
                  <option lang="my" value="my_MM">
                    ဗမာစာ
                  </option>
                  <option lang="nb" value="nb_NO">
                    Norsk bokmål
                  </option>
                  <option lang="nl" value="nl_NL">
                    Nederlands
                  </option>
                  <option lang="nl" value="nl_NL_formal">
                    Nederlands (Formeel)
                  </option>
                  <option lang="nn" value="nn_NO">
                    Norsk nynorsk
                  </option>
                  <option lang="oc" value="oci">
                    Occitan
                  </option>
                  <option lang="pl" value="pl_PL">
                    Polski
                  </option>
                  <option lang="ps" value="ps">
                    پښتو
                  </option>
                  <option lang="pt" value="pt_BR">
                    Português do Brasil
                  </option>
                  <option lang="pt" value="pt_PT">
                    Português
                  </option>
                  <option lang="ro" value="ro_RO">
                    Română
                  </option>
                  <option lang="ru" value="ru_RU">
                    Русский
                  </option>
                  <option lang="sk" value="sk_SK">
                    Slovenčina
                  </option>
                  <option lang="sl" value="sl_SI">
                    Slovenščina
                  </option>
                  <option lang="sq" value="sq">
                    Shqip
                  </option>
                  <option lang="sr" value="sr_RS">
                    Српски језик
                  </option>
                  <option lang="sv" value="sv_SE">
                    Svenska
                  </option>
                  <option lang="th" value="th">
                    ไทย
                  </option>
                  <option lang="tl" value="tl">
                    Tagalog
                  </option>
                  <option lang="tr" value="tr_TR">
                    Türkçe
                  </option>
                  <option lang="ug" value="ug_CN">
                    Uyƣurqə
                  </option>
                  <option lang="uk" value="uk">
                    Українська
                  </option>
                  <option lang="vi" value="vi">
                    Tiếng Việt
                  </option>
                  <option lang="zh" value="zh_CN">
                    简体中文
                  </option>
                  <option lang="zh" value="zh_TW">
                    繁體中文
                  </option>
                </select>
              </div>
              <div className="form-group"></div>
              <div className="form-group">
                <label>Date Format</label>
                <div className="fancy-radio">
                  <label>
                    <input
                      name="dateFormat"
                      type="radio"
                      value=""
                      onChange={() => {}}
                    />
                    <span>
                      <i></i>May 18, 2018
                    </span>
                  </label>
                  &nbsp;&nbsp;
                  <label>
                    <input
                      name="dateFormat"
                      type="radio"
                      value=""
                      onChange={() => {}}
                    />
                    <span>
                      <i></i>2018, May, 18
                    </span>
                  </label>
                  &nbsp;&nbsp;
                  <label>
                    <input
                      name="dateFormat"
                      type="radio"
                      value=""
                      onChange={() => {}}
                    />
                    <span>
                      <i></i>2018-03-10
                    </span>
                  </label>
                  &nbsp;&nbsp;
                  <label>
                    <input
                      name="dateFormat"
                      type="radio"
                      value=""
                      onChange={() => {}}
                    />
                    <span>
                      <i></i>02/09/2018
                    </span>
                  </label>
                  &nbsp;&nbsp;
                  <label>
                    <input
                      name="dateFormat"
                      type="radio"
                      value=""
                      onChange={() => {}}
                    />
                    <span>
                      <i></i>10/05/2018
                    </span>
                  </label>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <h6>Email from Lucid</h6>
              <p>I'd like to receive the following emails:</p>
              <ul className="list-unstyled list-email-received">
                <li>
                  <label className="fancy-checkbox">
                    <input type="checkbox" />
                    <span>Weekly account summary</span>
                  </label>
                </li>
                <li>
                  <label className="fancy-checkbox">
                    <input type="checkbox" />
                    <span>Campaign reports</span>
                  </label>
                </li>
                <li>
                  <label className="fancy-checkbox">
                    <input type="checkbox" />
                    <span>Promotional news such as offers or discounts</span>
                  </label>
                </li>
                <li>
                  <label className="fancy-checkbox">
                    <input type="checkbox" />
                    <span>
                      Tips for campaign setup, growth and client success stories
                    </span>
                  </label>
                </li>
              </ul>
            </div>
          </div>
        </div> */}
      </div>
    );
  }
}

const mapStateToProps = ({ navigationReducer, mailInboxReducer }) => ({
  rubixUserID: navigationReducer.userID,
});

export default connect(mapStateToProps, {})(ProfileV1Setting);
