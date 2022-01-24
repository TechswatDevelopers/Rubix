import React, { useContext } from "react";
import { connect } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import {onPresPopUpEvent} from "../../actions";
import PopUpModal from "../../components/PopUpModal"

class NextOfKin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        userGender: 'Male',
        errorMessage: '',
        location: null,
        myUserID: null,
        userIPAddress: null,
        dateAndTime: null,
        isLoad: false,
        showSearch: false,
        value: 0

    };
  }
 Validate() {
    
  var idNumber = document.getElementById("IDNumber").value;

  // store the error div, to save typing
  var error = document.getElementById('error');

  // assume everything is correct and if it later turns out not to be, just set this to false
  var correct = true;

  //Ref: http://www.sadev.co.za/content/what-south-african-id-number-made
  // SA ID Number have to be 13 digits, so check the length
  if (idNumber.length != 13 ) {
      //error.append('ID number does not appear to be authentic - input not a valid number.');
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
      //error.append('ID number does not appear to be authentic - date part not valid. ');
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
      //error.append('ID number does not appear to be authentic - check digit is not valid');
      correct = false;
  }
  if (correct) {
      // and put together a result message
      //document.getElementById('result').append('<p>South African ID Number:   ' + idNumber + '</p><p>Birth Date:   ' + fullDate + '</p><p>Gender:  ' + gender + '</p><p>SA Citizen:  ' + citzenship + '</p>');
   } else {
    alert("Invalid ID Number, please correct ID Number and try again")
    this.setState({errorMessage: "Invalid ID Number, please enter a valid ID Number"})
  }
  return correct
}

//final submit check
 Submit(e){
   console.log("called")
   //Set timer for loading screen
  this.setState({
    isLoad: true
  })
  e.preventDefault();
  const form = document.getElementById('nof');
  var idNumber = document.getElementById("IDNumber").value;
  var nextofKinEmail = document.getElementById("NextOfKinEmail").value;
  const studentID =  localStorage.getItem('studentIDNo')
  const studentEmail =  localStorage.getItem('email')

  if(this.state.location !=null){
    const locations = document.getElementById('location');
    const postCode = document.getElementById('post-code').value;
    const street_address = this.state.location['value']['structured_formatting']['main_text'] + ', ' + postCode
  
  const data = {
      'RubixRegisterUserID': this.state.myUserID,
      'RubixUserNextOfKinAddress': street_address,
  };
  for (let i=0; i < form.elements.length; i++) {
      const elem = form.elements[i];
      data[elem.name] = elem.value
  }

  const requestOptions = {
      title: 'Next of Kin Form',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
  };
  console.log(data)
  const postData = async() => {
      if (this.Validate() && idNumber != studentID && studentEmail != nextofKinEmail){
          await axios.post('https://rubixapi.cjstudents.co.za:88/api/RubixUserNextOfKins', data, requestOptions)
          .then(response => {
              console.log(response)
              //alert("Registration complete")
              //this.postSignature('https://github.com/TechSwat/CGES-Rubix-ClientPDF/raw/main/Frame%201%20(1).png', this.state.myUserID, 0)
              
              
          })
              
      } else{
        alert("Next of kin ID Number/Email cannot be the same as student Id Number/Email")
        this.setState({
          isLoad: false
        })
      }
  }
  postData().then(() => {
    this.setState({
      isLoad: false
    })
    this.props.onPresPopUpEvent()
    //this.props.history.push("/login/" + localStorage.getItem('clientID'))
  })
} else if(document.getElementById('streetAddress') != null)  {
  const data = {
    'RubixRegisterUserID': this.state.myUserID,
};
for (let i=0; i < form.elements.length; i++) {
    const elem = form.elements[i];
    data[elem.name] = elem.value
}

const requestOptions = {
    title: 'Next of Kin Form',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data
};

const postData = async() => {
  if (this.Validate() && idNumber != studentID && studentEmail != nextofKinEmail){
      await axios.post('https://rubixapi.cjstudents.co.za:88/api/RubixUserNextOfKins', data, requestOptions)
      .then(response => {
          console.log(response)
          //alert("Registration complete")
          //this.postSignature('https://github.com/TechSwat/CGES-Rubix-ClientPDF/raw/main/Frame%201%20(1).png', this.state.myUserID, 0)
          
          
      })
          
  } else{
    alert("Next of kin ID Number/Email cannot be the same as student Id Number/Email")
    this.setState({
      isLoad: false
    })
  }
}
postData().then(() => {
this.setState({
  isLoad: false
})
this.props.onPresPopUpEvent()
//this.props.history.push("/login/" + localStorage.getItem('clientID'))
})
}

else{
  alert("Please a valid home address")
  this.setState({
    isLoad: false
  })
}
}

  //Post File Using Mongo
  onPressUpload(image, filetype, currentActiveKey) {
    
    const postDocument = async () => {
      const data = new FormData()
      data.append('image', image)
      data.append('FileType', filetype)
      data.append('RubixRegisterUserID', this.state.myUserID)
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
    postDocument().then(() => {
      //alert("Document uploaded successfully")
      this.setState({
        isLoad: false
      })
      this.props.onPresPopUpEvent()
      
      
      
      /* setTimeout(() => {
        
        this.props.history.push("/login/" + localStorage.getItem('clientID'))
      }, 5000); */
      
      //window.location.reload()
      //document.getElementById('uncontrolled-tab-example').activeKey = currentActiveKey
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

  //Function to post signature to API
  postSignature(signature, userid, tryval) {
    console.log("I am called incorrectly")
    const postDocument = async () => {
      const data = {
        'RubixRegisterUserID': userid,
        'ClientIdFronEnd': localStorage.getItem('clientID'),
        'IP_Address': this.state.userIPAddress,
        'Time_and_Date': this.state.dateAndTime,
        'image': signature
      }
      const requestOptions = {
        title: 'Student Signature Upload',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: data
      };
      console.log("Posted Data:", data)
      await axios.post('https://rubixpdf.cjstudents.co.za:94/PDFSignature', data, requestOptions)
        .then(response => {
          console.log("Signature upload details:", response)
          this.setState({ docUrl: response.data.Base })
          if (tryval === 1) {
            const dataUrl = 'data:application/pdf;base64,' + response.data.Base
            const temp = this.dataURLtoFile(dataUrl, 'Lease Agreement') //this.convertBase64ToBlob(response.data.Base)
            //console.log("temp file:", temp)
            this.onPressUpload(temp, 'lease-agreement', 'signing')
          } else if (tryval === 0) {
            const dataUrl = 'data:application/pdf;base64,' + response.data.Base
            const temp = this.dataURLtoFile(dataUrl, 'unsigned Agreement') //this.convertBase64ToBlob(response.data.Base)
            //console.log("temp file:", temp)
            this.onPressUpload(temp, 'unsigned-agreement', 'signing')
          }
        })
    }
    postDocument()
  }
    //Coleect User Signing Info
    getUserWitnessData() {
      //Fetch IP Address
      const getData = async () => {
        const res = await axios.get('https://geolocation-db.com/json/')
        console.log("my IP", res.data);
        this.setState({userIPAddress: res.data.IPv4 })
      }
      getData()
    }
  

//Posting Update status
postStatus(){
  const data = {
    'RegisterStatus': 'Email Verify',
    'RubixRegisterUserID': this.state.myUserID,
};
const requestOptions = {
  title: 'Verify Status Form',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: data
};
const postData = async() => {
  await axios.post('https://rubixapi.cjstudents.co.za:88/api/RubixUserNextOfKins', data, requestOptions)
          .then(response => {
              console.log(response)
              this.props.history.push("/" )
          })
}
postData()
}


  componentDidMount(){
    document.body.classList.remove("theme-cyan");
    document.body.classList.remove("theme-purple");
    document.body.classList.remove("theme-blue");
    document.body.classList.remove("theme-green");
    document.body.classList.remove("theme-orange");
    document.body.classList.remove("theme-blush");
    const userID = localStorage.getItem('userID');
    this.setState({myUserID: userID});
    this.getUserWitnessData()
    const DATE_OPTIONS = { year: 'numeric', month: 'long', day: 'numeric', time: 'long' };
    const myDate = new Date().toLocaleDateString('en-ZA', DATE_OPTIONS)
    const myTime = new Date().toLocaleTimeString('en-ZA')
    this.setState({ dateAndTime: myDate + myTime })

  }
  setLoadingPage(time,) {
    this.setState({ isLoad: true, })
    setTimeout(() => {
      this.setState({
        isLoad: false,
      })
    }, time);
  }
  //Show Search
  showSearch(e){
    e.preventDefault() 
    this.setState({showSearch: !this.state.showSearch})
  }


  render() {
    //const user = useContext(MyProvider);
    return (
      <div className="theme-purple">
        
        <PopUpModal 
        Title= "Registration Complete!"
        Body = "Thank you for registering with Us. We have sent you an email to verify your account, please check your emails."
        Function ={()=>this.props.history.push("/login/" + localStorage.getItem('clientID'))}
        />
        <div className="page-loader-wrapper" style={{ display: this.state.isLoad ? 'block' : 'none' }}>
          <div className="loader">
            <div className="m-t-30"><img src={localStorage.getItem('clientLogo')} width="170" height="70" alt="Lucid" /></div>
            <p>Registering please wait...</p>
          </div>
        </div>
        <div >
          <div className="vertical-align-wrap">
            <div className="vertical-align-middle auth-main">
              <div className="auth-box">
                <div className="card">
                <div className="top">
                  <img src={localStorage.getItem('clientLogo')} alt="Lucid" style={{ height: "50px", margin: "10px", display: "block", margin: "auto" }} />
                </div>
                  <div className="header">
                    <p className="lead">Next of Kin Details</p>
                  </div>
                  <div className="body">
                    <form id='nof' onSubmit={(e) => this.Submit(e)}>
                      <div className="form-group">
                        <label className="control-label sr-only" >
                        First Name(s):
                            </label>
                        <input
                          className="form-control"
                          id="NextOfKinFirstName"
                          name='NextOfKinFirstName'
                          placeholder="Enter next of kin name"
                          type="text"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="control-label sr-only" >
                        Surname:
                            </label>
                        <input
                          className="form-control"
                          id="NextOfKinLastName"
                          name='NextOfKinLastName'
                          placeholder="Enter Next of kin surnme"
                          type="text"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="control-label sr-only" >
                        ID Number:
                            </label>
                            <input type='number' name="RubixUserNextOfKinID" className='form-control' id='IDNumber' 
                    required='' maxLength = '13' minLength='13' placeholder='Enter your ID Number'></input>
                    <p id="error" style={{color: 'red'}}>{this.state.errorMessage}</p>
                      </div>
                      <div className="form-group">
                        <label className="control-label sr-only" >
                        Email:
                            </label>
                        <input
                          className="form-control"
                          id="NextOfKinEmail"
                          name='NextOfKinEmail'
                          placeholder="Enter Next of kin email"
                          type="email"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="control-label sr-only" >
                        Phone Number:
                            </label>
                            <PhoneInput placeholder="+27 123 15348" name="NextOfKinPhoneNumber" className='NextOfKinPhoneNumber' required='' 
                    value={this.state.value}
                    onChange={()=> this.setState({value: this.state.value})}/>
                      </div>

                      <div className="form-group">
                        <label className="control-label sr-only" >
                          Home Address
                            </label>
                            <input
                          className="form-control"
                          name= "RubixUserNextOfKinAddress"
                          id= "streetAddress"
                          placeholder="Enter your Physical Address"
                          type="text"
                        />
                         <button className="btn btn-primary btn-sm" onClick={(e)=>this.showSearch(e)}><i className="icon-magnifier"/> Search</button>
                            {
                              !this.state.showSearch
                              ? null
                              :<GooglePlacesAutocomplete
apiKey="AIzaSyBoqU4KAy_r-4XWOvOiqj0o_EiuxLd9rdA" id='location' onChange = {(e)=>this.setState({location: e.target.value})}
selectProps={{
location: this.state.location,
onChange: (e)=>this.setState({location: e}),
placeholder: "Enter next of kin address"
}}
/>}
<br/>
<div className="form-group">
                        <label className="control-label sr-only" >
                        Postal Code:
                            </label>
                        <input
                          className="form-control"
                          //name="PostCode"
                          id="post-code"
                          placeholder="Enter your post code"
                          type="text"
                          required/>
                      </div>

                      </div>
                      <div className="form-group">
                        <label className="control-label sr-only" >
                        Relationship:
                            </label>
                        <input
                          className="form-control"
                          id="NextOfKinEmail"
                          name='NextOfKiniRelationship'
                          placeholder="Enter Next of kin relation to you"
                          type="text"
                          required
                        />
                      </div>
                      <button className="btn btn-primary btn-lg btn-block" onClick={(e) => this.Submit(e)}>
                        REGISTER
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

NextOfKin.propTypes = {
};

const mapStateToProps = ({ navigationReducer,  loginReducer, mailInboxReducer }) => ({
  rubixStudentIDNo: navigationReducer.studentIDNo,
  rubixUserID: navigationReducer.userID,
  email: loginReducer.email,
  password: loginReducer.password,
  isPopUpModal: mailInboxReducer.isPopUpModal,
});

export default connect(mapStateToProps, {
  onPresPopUpEvent,
})(NextOfKin);
