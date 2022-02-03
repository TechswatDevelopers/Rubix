import React from "react";
import { connect } from "react-redux";
import imageuser from "../../assets/images/user.png";
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css';
import axios from "axios";
import {onUpdateProgressBar,
  onUpdateIDProgress, onUpdateRESProgress, 
  onUpdateREGProgress, onUpdateNOKProgress, 
  updateStudentID, updateStudentName, 
  updateNOKName, updateNOKID,
  updateStudentAddress,
  updateStudentCourse,
  updateStudentUniversity,
  updateStudentStudentNo,
  updateStudentYear,
  } from '../../actions/NavigationAction';
  import {
    onPresLease} from '../../actions/MailInboxAction';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

class ProfileV1Setting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myProfile: {},
      profile: {},
      profiles: [],
      clients: [],
      addressProv: 'Gauteng',
      resProv: 'Gauteng',
      addressCountry: '',
      provList: [],
      resList: [],
      uniList: [],
      courseList: [],
      yearList: [],
      countryList: [],
      payment: '',
      address: {},
      university: {},
      nextOfKin: {},
      universityID: '',
      courseID: '',
      myYear: '',
      myPayment: '',
      myresID: '',
      location: {},
      selectedFile: null,
      isSelected: false,
      picPresent: false,
      newPic: false,
      base64Image: null,
      imgUpload: null,
      errorMessage: null,
      myUserID: null,
      imageUrl: 'user.png',
      payMethods: ['Change Payment Method', 'NSFAS', 'External Bursary', 'Student Loan', 'Self Funded'],
      value: 0,
      profilePicture: {},
      progress: '',
      idProgress: '',
      nextOfKinProgress: '',
      proofOfResProgress: '',
      proofOfRegProgress: '',
    };
  }


  //Reset password
  updateAddressInformation(e) {
    const locations = document.getElementById('location');
    let id;
    console.log("location:", this.state.location)
    let street_address
    if (Object.keys(this.state.location).length != 0) {
      street_address = this.state.location['value']['structured_formatting']['main_text']
    } else {
      street_address = this.state.myProfile.RegisterUserStreetNameAndNumer
    }

    e.preventDefault();
    const form = document.getElementById('addresses');
    const data = {
      'RubixRegisterUserID': localStorage.getItem('role') == 'admin' ? this.props.currentStudentiD : localStorage.getItem('userID'),
      'RegisterUserStreetNameAndNumer': street_address,
      'RegisterUserProvince': this.state.prov,
      'RegisterUserCountry': this.state.country,
    };
    for (let i = 0; i < form.elements.length; i++) {
      const elem = form.elements[i];
      data[elem.name] = elem.value
    }

    const requestOptions = {
      title: 'Update Address Form',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    };
    //console.log(data)
    const postData = async () => {
      await axios.post('https://rubixapi.cjstudents.co.za:88/api/RubixRegisterUserAddesss', data, requestOptions)
        .then(response => {
          console.log(response)
          alert(response.data[0].ResponceMessage)
          window.location.reload()
        })
    }
    postData()

  }


  //Reset password
  resetPassword(e) {
    //const history = useHistory();
    e.preventDefault();
    const form = document.getElementById('password');
    const data = {
      'RubixRegisterUserID': this.state.myUserID,
      'RubixClientID': localStorage.getItem('clientID'),
    };
    for (let i = 0; i < form.elements.length; i++) {
      const elem = form.elements[i];
      data[elem.name] = elem.value
    }

    const requestOptions = {
      title: 'Reset Password Form',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    };
    //console.log(data)
    const postData = async () => {
      await axios.post('https://rubixapi.cjstudents.co.za:88/api/RubixResetPassword', data, requestOptions)
        .then(response => {
          //console.log(response)
          alert(response.data.PostRubixUserData[0].Response)
          window.location.reload()
        })
    }
    postData()

  }

  //Update Next of Kin Information
  updateNextOfKin(e) {
    e.preventDefault();
    const form = document.getElementById('nextOfKin');

    //Request Data
    const data = {
      'RubixRegisterUserID': localStorage.getItem('role') == 'admin' ? this.props.currentStudentiD : localStorage.getItem('userID'),
    }
    for (let i = 0; i < form.elements.length; i++) {
      const elem = form.elements[i];
      data[elem.name] = elem.value
    }

    const requestOptions = {
      title: 'Next of Kin Form',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    }
    const postData = async () => {
      await axios.post('https://rubixapi.cjstudents.co.za:88/api/RubixUserNextOfKins', data, requestOptions)
        .then(response => {
          console.log("Next of Kin Post Response", response)
          alert("Information Updated")
          
        })
    }
    postData().then(()=>{
      window.location.reload()
    })
   // 
  }

  //Update Varsity details
  updateVarsityDetails(e) {
    e.preventDefault();
    const form = document.getElementById('uniDetails');

    //Request Data
    const data = {
      'RubixRegisterUserID': this.state.myUserID,
    }
    for (let i = 0; i < form.elements.length; i++) {
      const elem = form.elements[i];
      data[elem.name] = elem.value
    }

    const requestOptions = {
      title: 'Next of Kin Form',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    }
    const postData = async () => {
      await axios.post('https://rubixapi.cjstudents.co.za:88/api/RubixRegisterUserUniversityDetails', data, requestOptions)
        .then(response => {
          console.log("Update Varsity information Response: ", response)
          alert("Information Updated")
          window.location.reload()
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
    if (idNumber.length != 13) {
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
    this.setState({ userGender: gender })
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
      this.setState({ errorMessage: "Invalid ID Number, please enter a valid ID Number" })
    }
    return correct
  }

  //Update personal information
  updateUserInformation(e) {
    e.preventDefault();
    console.log(this.state.selectedFile)
    const form = document.getElementById('personalInfo');
    const data = {
      'RubixRegisterUserID': this.state.myUserID, //Buffer.from(this.state.selectedFile.value).toString('base64')
      'UserProfileImage': this.state.imgUpload,
      'ClientID': 1
    };
    for (let i = 0; i < form.elements.length; i++) {
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
    const postData = async () => {
      if (this.Validate) {
        await axios.post('https://rubixapi.cjstudents.co.za:88/api/RubixRegisterUsers', data, requestOptions)
          .then(response => {
            //console.log(response)
            alert(response.data.PostRubixUserData[0].ResponceMessage)
          })
      } else {
        alert("ID Number Invalid")
      }
    }
    postData()

  }

  //Update Profile Picture
  onPressUpload(e) {
    e.preventDefault();
    var file = this.state.selectedFile
    const postDocument = async () => {
      const data = new FormData()
      data.append('image', file)
      data.append('FileType', 'profile-pic')
      data.append('RubixRegisterUserID', this.state.myUserID)
      const requestOptions = {
        title: 'Student Profile Picture Upload',
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
          window.location.reload()
        })
    }
    postDocument()
  }


  onPressImageCancel() {
    this.setState({ selectedFile: null })
    this.setState({ isSelected: false })
    this.setState({ base64Image: null })
  }
  changeImageHandler = (event) => {
    this.setState({ selectedFile: event.target.files[0] })
    //console.log("selcted file", event.target.files[0])
    this.setState({ isSelected: true })
    this.getBase64(event)
  }
  handleImageUpdate() {
    const inputFile = document.getElementById('upload-image-button')
    inputFile.click()
  }

  getBase64(e) {
    //console.log("I am called")
    var file = e.target.files[0]
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      this.setState({
        base64Image: reader.result,
        imageUrl: reader.result,
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

    if (this.state.selectedFile) {
      const reader = new FileReader();

      reader.onload = this.handleReaderLoaded.bind(this);

      //reader.readAsBinaryString(this.state.selectedFile)
    }

  };

  //Get Specific User Data
  getStudentData(userID){
    console.log('Current Student Rubix ID: ', userID)
    const data = {
      'RubixRegisterUserID': userID,
      "RubixClientID" : localStorage.getItem('clientID'),
      'UserCode': localStorage.getItem('userCode')
    };
    const requestOptions = {
      title: 'Fetch User Profile Form',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    };
    console.log('Posted student data:', data)
    const postData = async () => {
      await axios.post('https://rubixapi.cjstudents.co.za:88/api/RubixAdminUserData', data, requestOptions)
        .then(response => {
          console.log("All Student data", response)
          this.setState({ myProfile: response.data.PostRubixUserData[0] })
          //Load Vetting information to Redux Store
this.props.updateStudentID(response.data.PostRubixUserData[0].IDNumber)
this.props.updateStudentName(
  response.data.PostRubixUserData[0].Name 
  + ' ' 
  + response.data.PostRubixUserData[0].MiddleName 
  +  ' ' 
   + this.state.myProfile.Surname)
   this.props.updateNOKName(response.data.PostRubixUserData[0].RubixUserNextOfKinFirstName + ' ' + response.data.PostRubixUserData[0].RubixUserNextOfKinLastName)
   this.props.updateNOKID(response.data.PostRubixUserData[0].RubixUserNextOfKinID)

   this.props.updateStudentAddress(response.data.PostRubixUserData[0].RegisterUserStreetNameAndNumer)
   this.props.updateStudentUniversity(response.data.PostRubixUserData[0].UniversityName)
   this.props.updateStudentCourse(response.data.PostRubixUserData[0].RubixCourse)
   this.props.updateStudentYear(response.data.PostRubixUserData[0].YearofStudy)
   this.props.updateStudentStudentNo(response.data.PostRubixUserData[0].StudentNumber)
         

        })
    }
    postData()
  }

  //Get All User Data
  getAllUserData(userId) {
    const data = {
      'RubixRegisterUserID': userId,
    };

    const requestOptions = {
      title: 'Fetch User Profile Form',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    };
    //console.log('All student data:', data)
    const postData = async () => {
      await axios.post('https://rubixapi.cjstudents.co.za:88/api/GetRegistrationStudentDetailAll', data, requestOptions)
        .then(response => {
          console.log("All profile data", response.data.PostRubixUserData)
          this.setState({ myProfile: response.data.PostRubixUserData[0] })

          localStorage.setItem('progress', response.data.PostRubixUserData[1].InfoCount)
          this.props.onUpdateProgressBar(response.data.PostRubixUserData[1].InfoCount)
          //console.log("Student Progress: ", this.props.studentProgress)
        //isShowLease: !state.isShowLease,
          
          if(response.data.PostRubixUserData[0].LeaseShow == 1){
            this.props.onPresLease()
          } 


 //console.log("testing",response.data.PostRubixUserData[0].Name)
        }).then(() => {
          localStorage.setItem('resName', this.state.myProfile.ResidenceName)
          localStorage.setItem('resPhoto', this.state.myProfile.ResidencePhoto)
          localStorage.setItem('resAddress', this.state.myProfile.ResidenceLocation)
          localStorage.setItem('resUni', this.state.myProfile.ResidenceUniversity)
          localStorage.setItem('resDescription', this.state.myProfile.ResidenceDescription)
          localStorage.setItem('resAmenities', this.state.myProfile.ResidenceAmenities)

         
        })
    }
    postData()

  }

  //Set Message according to percentage
  setMessage(percent) {
    let message
    switch (percent) {
      case 0, '0':
        message = 'No document uploaded'
        break
      case 50, '50':
        message = 'Pending validation'
        break
      case 100, '100':
        message = 'Approved'
    }
    return message
  }

  //Get user document progress
  setDocumentProgress() {
    const data = {
      'RubixRegisterUserID': localStorage.getItem('userID'),
    };

    const requestOptions = {
      title: 'Fetch User Profile Form',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    };

    const postData = async () => {
      await axios.post('https://rubixapi.cjstudents.co.za:88/api/RubixDocumentsProgress', data, requestOptions)
        .then(response => {
          console.log("document progress", response.data.PostRubixUserData)
          const temp = response.data.PostRubixUserData
          //Set local storage to default values
          localStorage.setItem('idProgress', 0)
          localStorage.setItem('proofOfResProgress', 0)
          localStorage.setItem('proofOfRegProgress', 0)
          localStorage.setItem('nextOfKinProgress', 0)

          localStorage.setItem('idProgressMsg', 'No document uploaded')
          localStorage.setItem('proofOfResProgressMsg', 'No document uploaded')
          localStorage.setItem('proofOfRegProgressMsg', 'No document uploaded')
          localStorage.setItem('nextOfKinProgressMsg', 'No document uploaded')


          for (let i = 1; i <= temp.length - 1; i++) {
            switch (temp[i].FileType) {
              case 'id-document': {
                //console.log('its an ID')
                localStorage.setItem('idProgress', temp[i].Percentage)
                this.props.onUpdateIDProgress(temp[i].Percentage)
                localStorage.setItem('idProgressMsg', this.setMessage(temp[i].Percentage))
              }
                break;
              case "proof-of-res": {
                //console.log('its a Proof of res')
                localStorage.setItem('proofOfResProgress', temp[i].Percentage)
                this.props.onUpdateRESProgress(temp[i].Percentage)
                localStorage.setItem('proofOfResProgressMsg', this.setMessage(temp[i].Percentage))
              }
                break;
              case "proof-of-reg": {
                //console.log('its a proof of reg')
                localStorage.setItem('proofOfRegProgress', temp[i].Percentage)
                this.props.onUpdateREGProgress(temp[i].Percentage)
                localStorage.setItem('proofOfRegProgressMsg', this.setMessage(temp[i].Percentage))
              }
                break;
              case "next-of-kin": {
                //console.log('its a next of kin')
                this.props.onUpdateNOKProgress(temp[i].Percentage)
                localStorage.setItem('nextOfKinProgress', temp[i].Percentage)
                localStorage.setItem('nextOfKinProgressMsg', this.setMessage(temp[i].Percentage))
              }
            }
          }
        })

    }
    postData()
  }

  componentDidMount() {
    const userID = localStorage.getItem('userID');
    this.setState({ myUserID: userID });
    console.log('My role is: ', localStorage.getItem('role'))

    //Get All User Data
    if (localStorage.getItem('role') == 'student'){
      this.getAllUserData(localStorage.getItem('userID'))
    } else if (localStorage.getItem('role') == 'admin') {
      this.getStudentData(this.props.currentStudentiD)
    } 
    

    //Get Year of study list
    this.fetchYearOfStudyData()



    //Get User Profile Picture
    const fetchData = async () => {
      //Get documents from DB
      await fetch('https://rubixdocuments.cjstudents.co.za:86/feed/post/' + userID)
        .then(response => response.json())
        .then(data => {
          console.log("Profile data:", data)
          const profilePic = data.post.filter(doc => doc.FileType == 'profile-pic')[0]
          console.log("Profile Picture data:", profilePic)
          //If Profile Picture Exists...
          if (profilePic != null && profilePic != undefined) {
            this.setState({ profilePicture: data.post.filter(doc => doc.FileType == 'profile-pic')[0] })
            this.setState({ imageUrl: 'https://rubiximages.cjstudents.co.za:449/' + profilePic.filename })
          }
        });

    };
    fetchData()
  }

  //Populate data from DB
  fetchUserData = async () => {
    //console.log("user id:", localStorage.getItem('userID'))
    //Get Rubix User Details
    await fetch('https://rubixapi.cjstudents.co.za:88/api/RubixRegisterUsers/' + localStorage.getItem('userID'))
      .then(response => response.json())
      .then(data => {
        if (data === null || data === undefined) {
          alert('Error loading user data')
        } else {
          this.setState({ profile: data })
        }
      });
  }

  fetchUserUniversityData = async () => {
    //Get Rubix User University Details
    await fetch('https://rubixapi.cjstudents.co.za:88/api/RubixRegisterUserUniversityDetails/' + localStorage.getItem('userID'))
      .then(response => response.json())
      .then(data => {
        if (data === null || data === undefined) {
          alert('Error loading university data: ' + data.message)
        } else {
          console.log("University detail:", data)
          this.setState({ universityID: data.RubixUniversityID })
          this.setState({ courseID: data.RubixCourseID })
          this.setState({ myresID: data.RubixRegisterUserUniversityDetailsID })
          this.setState({ myPayment: data.PaymentMethod })
          this.setState({ myYear: data.RubixStudentYearofStudyID })
          this.setState({ university: data })
        }
      });
  }

  //Get Rubix User Address Details
  fetchUserAddressData = async () => {
    //console.log("User ID being used:", localStorage.getItem('userID'))
    //Get Rubix User Address Details
    await fetch('https://rubixapi.cjstudents.co.za:88/api/RubixRegisterUserAddesss/' + localStorage.getItem('userID'))
      .then(response => response.json())
      .then(data => {
        if (data === null || data === undefined) {
          alert('Error loading Address data' + data.message)
        } else {
          this.setState({ address: data })
          this.setState({ addressProv: data.RegisterUserProvince })
          this.setState({ addressProv: data.RegisterUserProvince })
          this.setState({ addressProv: data.RegisterUserProvince })
          this.setState({ addressCountry: data.RegisterUserCountry })
        }
        this.setState({ address: data })
        this.setState({ addressProv: data.RegisterUserProvince })
        this.setState({ addressProv: data.RegisterUserProvince })
        this.setState({ addressProv: data.RegisterUserProvince })
        this.setState({ addressCountry: data.RegisterUserCountry })
      });
  }

  fetchProvinceListData = async () => {
    //Get Rubix Provices
    await fetch('https://rubixapi.cjstudents.co.za:88/api/RubixProvinces')
      .then(response => response.json())
      .then(data => {
        if (data.data != null || data.data != undefined) {
          this.setState({ provList: data.data })
        } else {
          alert("Error loading provices list: " + data.message)
        }
      });
  }

  fetchCountriesData = async () => {
    //Fetch Countries List
    await fetch('https://rubixapi.cjstudents.co.za:88/api/RubixCountries')
      .then(response => response.json())
      .then(data => {
        if (data.data != null || data.data != undefined) {
          console.log('countries', data)
          this.setState({ countryList: data.data })
        } else {
          alert("Error loading countries list: " + data.message)
        }
      });
  }
  fetchUniversitiesData = async () => {
    //Populate university list
    await fetch('https://rubixapi.cjstudents.co.za:88/api/RubixUniversities')
      .then(response => response.json())
      .then(data => {
        if (data.data === null || data.data === undefined) {
          alert('Error loading Universities data' + data.message)
        } else {
          //console.log("University data:", data)
          this.setState({ uniList: data.data })
        }

      });
  }

  fetchResidencesData = async () => {
    //Populate Residence list
    await fetch('https://rubixapi.cjstudents.co.za:88/api/RubixResidences')
      .then(response => response.json())
      .then(data => {
        if (data.data === null || data.data === undefined) {
          alert('Error loading Residence data' + data.message)
        } else {
          this.setState({ resList: data.data })
        }

      });
  }

  fetchYearOfStudyData = async () => {
    //Populate Year of Study list
    await fetch('https://rubixapi.cjstudents.co.za:88/api/RubixStudentYearofStudies')
      .then(response => response.json())
      .then(data => {
        if (data.data === null || data.data === undefined) {
          alert('Error loading Year of Study data' + data.message)
        } else {
          this.setState({ yearList: data.data })
        }

      });
  }
  fetchUserNextofKinData = async () => {
    //Populate Next of Kin
    await fetch('https://rubixapi.cjstudents.co.za:88/api/RubixUserNextOfKins/' + localStorage.getItem('userID'))
      .then(response => response.json())
      .then(data => {
        if (data === null || data === undefined) {
          alert('Error loading next of kin informaion')
        } else {
          console.log("Next of Kin Details:", data)
          this.setState({ nextOfKin: data })
        }

      });

  }

  render() {
    const { StudentID } = this.props;
    let myButton;
    //Select Image Url
    if (this.state.profilePicture != null && this.state.base64Image == null) {
      //this.setState({imageUrl:this.state.myProfile.UserProfileImage})
      myButton = <>
        <div>
          {/*  <input type="file" onChange={(e)=>{this.getBase64(e)}} /> */}
          <input style={{ display: 'none' }} id='upload-image-button' type="file" onChange={(e) => { this.changeImageHandler(e) }} />
          <button className="btn btn-primary rounded-0" variant="contained" color="primary" component="span" onClick={() => this.handleImageUpdate()}>Change Profile Image</button>
        </div>
      </>
    } else if (this.state.base64Image != null) {
      //this.setState({imageUrl:this.state.base64Image})
      myButton = <>
        <button className="btn btn-primary rounded-0" onClick={(e) => this.onPressUpload(e)}>Confirm Upload</button>{" "}
        &nbsp;&nbsp;
        <button className="btn btn-default" type="button" onClick={() => this.onPressImageCancel()}>
          Cancel
        </button>
      </>
    }

    //Toggle image select button

    return (
      <div>
        <div className="body">
          <h6>Profile Photo</h6>
          <div className="media">
            <div className="media-left m-r-15 border border-primary border-2"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center'
              }}
            >
              <img
                alt="cannot display image"
                accept='.jpg, .png, .jpeg'
                className="user-photo media-object"
                width="150px"
                src={this.state.imageUrl} />
              {localStorage.getItem('role') == 'admin' ?null : myButton}
            </div>
            <div className="media-body">
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
                  <label>
                    First Name:
                  </label>
                  <input
                    className="form-control"
                    placeholder="First Name"
                    name="Name"
                    defaultValue={this.state.myProfile.Name}
                    type="text"
                  />
                </div>
                <div className="form-group">
                  <label>
                    Middle Name:
                  </label>
                  <input
                    className="form-control"
                    placeholder="Middle Name"
                    name="MiddleName"
                    defaultValue={this.state.myProfile.MiddleName}
                    type="text"
                  />
                </div>
                <div className="form-group">
                  <label>
                    Last Name:
                  </label>
                  <input
                    className="form-control"
                    placeholder="Last Name"
                    name="Surname"
                    defaultValue={this.state.myProfile.Surname}
                    type="text"
                  />
                </div>
                <div className="form-group">
                </div>

                <div className="form-group">
                  <label>
                    ID Number:
                  </label>
                  <input
                    className="form-control"
                    id='IDNumber'
                    placeholder="ID Number"
                    name="IDNumber"
                    required=''
                    maxLength='13'
                    minLength='13'
                    placeholder='Enter your ID Number'
                    defaultValue={this.state.myProfile.IDNumber}
                    type='number'
                  />
                  <br></br>
                  <div id="error">{this.state.errorMessage}</div>
                </div>
              </div>
              <div className="col-lg-6 col-md-12">
                <label>
                  Email Address:
                </label>
                <div className="form-group">
                  <input
                    className="form-control"
                    placeholder="Email"
                    name="UserEmail"
                    defaultValue={this.state.myProfile.UserEmail}
                    type="text"
                  />
                </div>
                <div className="form-group">
                  <label>
                    Phone Number:
                  </label>
                  <PhoneInput id='register-page-phone-number' placeholder="+27 123 15348"
                    defaultValue={this.state.myProfile.PhoneNumber} name="PhoneNumber" required=''
                    value={this.state.myProfile.PhoneNumber}
                    onChange={() => this.setState({ value: this.state.value })} />
                </div>
                <div className="form-group">
                  <label>
                    Student Number:
                  </label>
                  <input
                    className="form-control"
                    defaultValue={this.state.myProfile.StudentNumber}
                    name="StudentNumber"
                    placeholder="Student Number"
                    type="text"
                  />
                </div>
                <div className="form-group">
                  <label>
                    Medical Conditions:
                  </label>
                  <input
                    className="form-control"
                    name="MedicalConditions"
                    defaultValue={this.state.myProfile.AdditionalUserInformationMedicalCondition}
                    placeholder="MedicalConditions"
                    type="text"
                  />
                </div>
                <button className="btn btn-primary" type="button" onClick={(e) => { this.updateUserInformation(e) }}>
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

        {//Change Password Section
        }
        { localStorage.getItem('role') == 'admin'
        ? null
          : <div className="body">
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
          <button className="btn btn-primary" type="button" onClick={(e) => { this.resetPassword(e) }}>
            Change Password
          </button>{" "}
          &nbsp;&nbsp;
          <button className="btn btn-default">Cancel</button>
        </div>
}
        {//Residential Address Section
        }
        <div className="body">
          <form id="addresses" onSubmit={(e) => this.updateAddressInformation(e)}>
            <div className="row clearfix">
              <div className="col-lg-6 col-md-12">
                <h6>Address Information</h6>
                <div className="form-group">
                  <label>
                    Street Address: {this.state.myProfile.RegisterUserStreetNameAndNumer}, {this.state.myProfile.RegisterUserProvince}
                  </label>
                  <input
                          className="form-control"
                          name= "RegisterUserStreetNameAndNumer"
                          id="streetAddress"
                          placeholder="Enter your Physical Address"
                          type="text"
                        />
                        <button className="btn btn-primary btn-sm" onClick={(e)=>this.showSearch(e)}><i className="icon-magnifier"/> Search</button>
                        { this.state.showSearch
                        ?  <GooglePlacesAutocomplete
                          apiKey="AIzaSyBoqU4KAy_r-4XWOvOiqj0o_EiuxLd9rdA" id='location' onChange={(e) => this.setState({ location: e.target.value })}
                          selectProps={{
                            location: this.state.location,
                            onChange: (e) => this.setState({ location: e }),
                            placeholder: "Enter your home Address"
                          }}
                        />
                      : null
                      }
                  
                </div>
                {/* <div className="form-group">
                  
                  <input
                    className="form-control"
                    placeholder="Street Address"
                    name="RegisterUserStreetNameAndNumer"
                    defaultValue={this.state.myProfile.RegisterUserStreetNameAndNumer}
                    type="text"
                  />
                </div> */}
                <div className="form-group">
                  <label>
                    Unit Number:
                  </label>
                  <input
                    className="form-control"
                    placeholder="Appartment/Unit Number"
                    name="RegisterUserComplexorBuildingNumber"
                    defaultValue={this.state.myProfile.RegisterUserComplexorBuildingNumber}
                    type="text"
                  />
                </div>
                <div className="form-group">
                  <label>
                    Complex Name:
                  </label>
                  <input
                    className="form-control"
                    placeholder="Complex Name"
                    name="RegisterUserComplexorBuildingName"
                    defaultValue={this.state.myProfile.RegisterUserComplexorBuildingName}
                    type="text"
                  />
                </div>
                {/* <div className="form-group">
                  <label>
                    Postal Code:
                  </label>
                  <input
                    className="form-control"
                    placeholder="Complex/Appartment Number"
                    defaultValue={this.state.myProfile.PostCode}
                    type="email"
                    onChange={() => { }}
                  />
                </div> */}
                {/* <div className="form-group">
                  <input
                    className="form-control"
                    placeholder="Complex/Appartment Name"
                    defaultValue={this.state.myProfile.RegisterUserComplexorBuildingName}
                    type="text"
                    onChange={() => { }}
                  />
                </div> */}
              </div>
              {/* <div className="col-lg-6 col-md-12">
                <div className="form-group">
                  <input
                    className="form-control"
                    placeholder="Postal Code"
                    defaultValue={this.state.myProfile.PostCode}
                    type="text"
                  />
                </div> 
                <div className="form-group">
                  {
                    <select className="form-control" onChange={(e) => this.setState({addressProv: e.target.value })} value={this.state.myProfile.Province}>
                      {
                        this.state.provList.map((province, index) => (
                          <option key={index} name='RegisterUserProvince' value={province.Province}>{province.Province}</option>
                        ))
                      }
                    </select>}
                </div>
                <div className="form-group">
                  <select className="form-control" onChange={(e) => this.setState({country: e.target.value })} value={this.state.myProfile.Country}>
                    {
                      this.state.countryList.map((country, index) => (
                        <option key={index} name='RegisterUserCountry' value={country.Country_Name}>{country.Country_Name}</option>
                      ))
                    }
                  </select>
                </div>
              </div> */}
            </div>
            <button className="btn btn-primary" type="button" onClick={(e) => { this.updateAddressInformation(e) }}>
              Update
            </button>{" "}
            &nbsp;&nbsp;
            <button className="btn btn-default">Cancel</button>
          </form>
        </div>


        <div className="body">
          <form id='uniDetails' onSubmit={(e) => this.updateVarsityDetails(e)}>
          <div className="row clearfix">
            <div className="col-lg-6 col-md-12">
              <h6>University Information</h6>
              <div className="form-group">
                <label>
                  University:
                </label>
                <input
                  className="form-control"
                  disabled
                  name="UniversityName"
                  defaultValue={this.state.myProfile.UniversityName}
                  placeholder="University Name"
                  type="text"
                />
              </div>
              <div className="form-group">
                <label>
                  Field of Study:
                </label>
                <input
                disabled
                  className="form-control"
                  name="CourseID"
                  defaultValue={this.state.myProfile.RubixCourse}
                  placeholder="Field of Study"
                  type="text"
                />
              </div>
              <div className="form-group">
                <label>
                  Year of Study:
                </label>
                <input
                disabled
                  className="form-control"
                  name="StudentYearofStudyID"
                  defaultValue={this.state.myProfile.YearofStudy}
                  placeholder="Year of Study"
                  type="text"
                />
              </div>
              {/* <div className="form-group">
                <label>
                  Payment Method: {this.state.myProfile.PaymentMethod}
                </label>
                {
                  <select className="form-control" onChange={(e) => this.setState({ payment: e.target.value })} value={this.state.payment}>
                    {

                      this.state.payMethods.map((payment, index) => (
                        <option key={index} name='PaymentMethod' value={payment}>{payment}</option>
                      ))
                    }
                  </select>}
              </div> */}
            </div>
          </div>
          {/* <button className="btn btn-primary" type="submit" onClick={(e) => this.updateVarsityDetails(e)}>
            Update
          </button>{" "}
          &nbsp;&nbsp;
          <button className="btn btn-default">Cancel</button> */}
          </form>
        </div>


        <div className="body">
          <form id='nextOfKin' onSubmit={(e) => this.updateNextOfKin(e)}>
            <div className="row clearfix">
              <div className="col-lg-6 col-md-12">
                <h6>Next of Kin Information</h6>
                <div className="form-group">
                  <label>
                    First Name:
                  </label>
                  <input
                    className="form-control"
                    disabled=""
                    placeholder="First Name"
                    id="NextOfKinFirstName"
                    name='NextOfKinFirstName'
                    type="text"
                    defaultValue={this.state.myProfile.RubixUserNextOfKinFirstName}
                    onChange={() => { }}
                  />
                </div>

                <div className="form-group">
                  <label>
                    Last Name:
                  </label>
                  <input
                    className="form-control"
                    placeholder="Last Name"
                    id="NextOfKinLastName"
                    name='NextOfKinLastName'
                    type="text"
                    defaultValue={this.state.myProfile.RubixUserNextOfKinLastName}
                    onChange={() => { }}
                  />
                </div>
                <div className="form-group">
                  <label>
                    Email Address:
                  </label>
                  <input
                    className="form-control"
                    disabled=""
                    placeholder="Email"
                    id="NextOfKinEmail"
                    name='NextOfKinEmail'
                    type="text"
                    defaultValue={this.state.myProfile.RubixUserNextOfKinEmail}
                    onChange={() => { }}
                  />
                </div>


              </div>
              <div className="col-lg-6 col-md-12">
                <div className="form-group">
                  <label>
                    Phone Number:
                  </label>
                  <PhoneInput id='register-page-phone-number' placeholder="+27 123 15348"
                    defaultValue={this.state.myProfile.RubixUserNextOfKinPhoneNumber} name="NextOfKinPhoneNumber" required=''
                    value={this.state.myProfile.RubixUserNextOfKinPhoneNumber}
                    onChange={() => this.setState({ value: this.state.value })} />
                </div>
                <div className="form-group">
                  <label>
                    ID Number:
                  </label>
                  <input
                    className="form-control"
                    placeholder="ID Number"
                    id='IDNumber'
                    name="RubixUserNextOfKinID"
                    defaultValue={this.state.myProfile.RubixUserNextOfKinID}
                    type="text"
                  />
                </div>
                <div className="form-group">
                  <label>
                    Relationship:
                  </label>
                  <input
                    className="form-control"
                    placeholder="Relationship"
                    name='NextOfKiniRelationship'
                    defaultValue={this.state.myProfile.RubixUserNextOfKiniRelationship}
                    type="text"
                  />
                </div>
                <div className="form-group">
                  <label>
                    Home Address:
                  </label>
                  <input
                    className="form-control"
                    placeholder="Address"
                    name='RubixUserNextOfKinAddress'
                    defaultValue={this.state.myProfile.RubixUserNextOfKinAddress}
                    type="text"
                  />
                </div>
              </div>
            </div>
            <button className="btn btn-primary" type="button" onClick={(e) => this.updateNextOfKin(e)}>
              Update
            </button>{" "}
            &nbsp;&nbsp;
            <button className="btn btn-default">Cancel</button>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ navigationReducer, mailInboxReducer }) => ({
  rubixUserID: navigationReducer.userID,
  studentProgress: navigationReducer.progressBar,
  currentStudentiD: navigationReducer.studentID,

  
  currentStudentIDNo: navigationReducer.studentIDNo,
  currentStudentname: navigationReducer.studentName,

  nextOfKinName: navigationReducer.nextofKinName,
  nextOfKinId: navigationReducer.nextofKinID,

});

export default connect(mapStateToProps, {
  onUpdateProgressBar,
  onUpdateIDProgress,
  onUpdateRESProgress,
  onUpdateREGProgress,
  onUpdateNOKProgress,
  updateStudentID,
  updateStudentName,
  updateNOKName,
  updateNOKID,

  updateStudentAddress,
  updateStudentCourse,
  updateStudentUniversity,
  updateStudentAddress,
  updateStudentStudentNo,
  updateStudentYear,
  onPresLease
})(ProfileV1Setting);
