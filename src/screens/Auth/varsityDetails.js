import React from "react";
import { connect } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from "../../assets/images/logo-white.svg";
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css';
import axios from "axios";
import {Helmet} from "react-helmet";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { updateClientBackG,
  updateLoadingController, onPresRooms,
  updateLoadingMessage,} from "../../actions";
  import PopUpRooms from "../../components/PopUpRooms"
  import RoomsTableStudent from "../../components/Tables/RoomsTablesStudent"
//import { duration } from "moment/moment";

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
            showResInput: false,
            carRegistration: '',
            duration: 0,
            hasCar: false,
            payMethods: [],
            hearAboutUs: ['Where did you hear about us?', 'FLYERS', 'FACEBOOK', 'INTERNET', 'WEBSITE', 'WORD OF MOUTH', 'Other'],
            bankTypes: ['Please select account type', 'Savings', 'Cheque'],
            durations: [],
            value: 0,
            availableRooms: [],
            buildingNumberList: [],
            buildingNumber: '',
            floorNumberList: [],
            floorNumber: '',
            roomNumberList: [],
            roomNumber: '',
            genderRoomList: ['Female', 'Male'],
            roomGender: '',
            showFilters: false,

        };
      }

      //Change Duration According to Payment Method
      onChangeDurationViaPayment(e){
        if(e.target.value == "Private student"){
          this.state.durations.push(1)
          this.setState({
            //duration: this.state.duration.push(1)
          })
        } else {
          if(this.state.uni == 1 || this.state.uni == 2){
            this.setState({
              durations: [0, 5, 12]
            })
          } else {
            //console.log("Sila ")
            this.setState({
              durations: [0,5,10]
            })
          }
          //this.state.durations.pop(1)
        }
      }

     //final submit check
     Submit(e){
        e.preventDefault();
        //Set Loading Screen ON
     this.props.updateLoadingController(true);
     this.props.updateLoadingMessage("Submitting Information...");
        const form = document.getElementById('uniDetails');
        //console.log('Uni ID: ', this.state.uni)
        const data = {
            'RubixRegisterUserID': this.state.myUserID,
            'UniversityID': this.state.uni,
            'CourseID': this.state.course,
            'ResidenceID': this.state.res,
            'StudentYearofStudyID': this.state.year,
            'Duration': this.state.duration,
            'HearAbout': this.state.hearAbout,
            'PrefRoomID': localStorage.getItem('roomID')
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
        console.log("Sent Data: ",data)
        const postData = async()=>{
            if (this.state.uni !=null && this.state.res !=null && this.state.year !=null && document.getElementById('uniDetails').checkValidity() == true){
                await axios.post('https://adowarest.rubix.mobi:88/api/RubixRegisterUserUniversityDetails', data, requestOptions)
                .then(response => {
                    console.log("The Response: ",response)
                    //Set timer for loading screen
                    
    setTimeout(() => {
      this.props.updateLoadingController(false);
    }, 1000);
    localStorage.setItem('resID', this.state.res)
                    this.props.history.push("/payor")
                })
                    
            } else{
              //Set timer for loading screen
    setTimeout(() => {
      this.props.updateLoadingController(false);
    }, 1000);
              alert("Please ensure that you entered all required information")
            }
        }
        if(this.state.duration == 0){
          alert("Please select a contract duration")
          this.props.updateLoadingMessage("Reloading...");
          setTimeout(() => {
            this.props.updateLoadingController(false);
          }, 1000);
        } /* else if(this.state.payment == 'Please Select Payment Method' || this.state.payment == null){
          alert("Please select a payment method")
          this.props.updateLoadingMessage("Reloading...");
          setTimeout(() => {
            this.props.updateLoadingController(false);
          }, 1000);
        } */
        else if(this.state.res == 'Please Select Residence' || this.state.res == null){
          alert("Please select a Residence")
          this.props.updateLoadingMessage("Reloading...");
          setTimeout(() => {
            this.props.updateLoadingController(false);
          }, 1000);
        } else {
          postData()
        }
    }
  

async componentDidMount(){
    document.body.classList.remove("theme-cyan");
    document.body.classList.remove("theme-purple");
    document.body.classList.remove("theme-blue");
    document.body.classList.remove("theme-green");
    document.body.classList.remove("theme-orange");
    document.body.classList.remove("theme-blush");
    const userID = localStorage.getItem('userID');
    console.log("My UID: ",userID )
    this.props.updateClientBackG(localStorage.getItem('clientBG'))
    this.setState({myUserID: userID});
    this.getStudentRoomDetails(userID)

    this.props.updateLoadingController(true);
    this.props.updateLoadingMessage("Loading Details...");
    

    const fetchData = async() =>{
        //Populate university list
        await fetch('https://adowarest.rubix.mobi:88/api/RubixUniversities/')
        .then(response => response.json())
        .then(data => {
            console.log("data is ", data.data)
            this.setState({
              uniList: data.data,
              //uni: data.data[0]['RubixUniversityID']
            })
            });


            //Populate Provinces list
        await fetch('https://adowarest.rubix.mobi:88/api/RubixProvinces')
        .then(response => response.json())
        .then(data => {
            this.setState({provList: data.data})
            });

            //Populate Year of Study list
            await fetch('https://adowarest.rubix.mobi:88/api/RubixStudentYearofStudies')
        .then(response => response.json())
        .then(data => {
            //console.log("data is ", data.data)
            this.setState({yearList: data.data})
            });
    
    }
    fetchData().then(() => {
      setTimeout(() => {
        this.props.updateLoadingController(false);
      }, 2000);
      //this.postStatus()
    });
  }

  onPressCancel(){
    this.setState({selectedFile: null})
    this.setState({isSelected: false})
  }
  changeHandler = (event) => {
    this.setState({selectedFile: event.target.files[0]})
    //console.log("selcted file", event.target.files[0])
    this.setState({isSelected: true})
    this.getBase64(event)
  }
  handleUpdate(){
    const inputFile = document.getElementById('upload-button')
    inputFile.click()
  }

  //Fetch Residences
  getRes(uniID){
    console.log("Location ", this.state.durations)
    //console.log("Uni ID: ", uniID)
    const fetchResses = async() => {
      //Populate Residence list
      await fetch('https://adowarest.rubix.mobi:88/api/RubixResidences/' + uniID)
      .then(response => response.json())
      .then(data => {
          //console.log("data is ", data)
          this.setState({resList: data.data})
          });
    }
    fetchResses()
  }

  getResAndPayment(resID){
    //console.log("this: ", resID)
    this.setState({
      isLoad: true
    })
    const data = {
      'RubixUniversityID': this.state.uni,
      'RubixResidenceID': resID
    };
    const requestOptions = {
      title: 'Get Payment Details Form',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
  };
  //console.log("My Data: ", data)
    const getData = async() => {
      await axios.post('https://adowarest.rubix.mobi:88/api/RubixPaymentMethodDD', data, requestOptions)
      .then(response => {
        console.log("My response: ", response.data.PostRubixUserData)
        
        this.setState({
          isLoad: false,
          payMethods: response.data.PostRubixUserData
        })
    })
    }
    getData()
  }

  onVarsitySelect(e){
    //console.log("qala la: ", e.target.value)
    
    if(e.target.value == 1 || e.target.value == 2){
      this.setState({
        durations: [0, 5, 12]
      })
    } else {
      //console.log("Sila ")
      this.setState({
        durations: [0,5,10]
      })
    }

    this.getRes(e.target.value)
    this.setState({
      uni: e.target.value,
      showResInput: true,
    })
  }

  onValueChange(e){
    //console.log(e.target.value)
    if(e.target.value == 'no'){
      this.setState({
        hasCar: false
      })
    } else if (e.target.value == 'yes'){
      this.setState({
        hasCar: true
      })
    }
   
  }

    //Fetch User Res Data
    getStudentRoomDetails(studentID){
      const pingData = {
          'RubixClientID': localStorage.getItem('clientID'),
          'ResidenceName': "",
          'RubixResidenceID': 1,
          'BuildingNumber': "",
          'FloorNumber': "",
          'RoomNumber': "",
          'RubixRegisterUserID': ''
        };
        //Ping Request Headers
        const requestOptions = {
          title: 'Get Students Room Allocation Details',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: pingData
        };
        console.log('Posted:', pingData)
        const postData = async () => {
          await axios.post('https://adowarest.rubix.mobi:88/api/RubixStudentRoomAvailable', pingData, requestOptions)
          .then(response => {
            console.log("Students Rooms List:", response.data.PostRubixUserData)
            if (response.data.PostRubixUserData){
              //Show available rooms
              this.setState({
                availableRooms: response.data.PostRubixUserData,
                showFilters: true
              })

              this.setState({
                buildingNumberList:  this.populate('BuildingNumber', response.data.PostRubixUserData),
                floorNumberList: this.populate('FloorNumber', response.data.PostRubixUserData),
                roomNumberList: this.populate('RoomNumber', response.data.PostRubixUserData)
  
              })
  
            } else {
              //Show Room Details
              this.getStudentRoomDetails(' ')
            }
            
  
          })
        }
        postData()
    }

      //Get Romms Filters
  getRoomsFilters(buildingNumber, floorNumber, roomNumber, studentID, gender){
    const pingData = {
        'RubixClientID': localStorage.getItem('clientID'),
        'ResidenceName': "",
        'RubixResidenceID': 1,
        'BuildingNumber': buildingNumber,
        'FloorNumber': floorNumber,
        'RoomNumber': roomNumber,
        'Gender': gender,
        'RubixRegisterUserID': studentID
      };
      //Ping Request Headers
      const requestOptions = {
        title: 'Get Students Room Allocation Details',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: pingData
      };
      //console.log('Posted:', pingData)
      const postData = async () => {
        await axios.post('https://adowarest.rubix.mobi:88/api/RubixStudentRoomAvailableDropdown', pingData, requestOptions)
        .then(response => {
          console.log("Students Rooms Dropdown:", response)
          if (response.data.PostRubixUserData){
            //Show available rooms
            this.setState({
              availableRooms: response.data.PostRubixUserData,
              showFilters: true
            })

            this.setState({
              buildingNumberList:  this.populate('BuildingNumber', response.data.PostRubixUserData),
              floorNumberList: this.populate('FloorNumber', response.data.PostRubixUserData),
              roomNumberList: this.populate('RoomNumber', response.data.PostRubixUserData)

            })
          } else {
          
          }
          

        })
      }
      postData()
  }


  //Populate Lists
  populate(filterType, roomList){
    let newList = []

    //Select Filter
    switch(filterType){
      case 'BuildingNumber':
        {
          for(let i = 0; i<= roomList.length - 1; i++ ){
            
            if(newList.includes(roomList[i].BuildingNumber)){
              //console.log('found', roomList[i].BuildingNumber)
              
            } else {
              newList.push(roomList[i].BuildingNumber)
            }
          }
        }
        break;
      case 'FloorNumber':
        {
          for(let i = 0; i<= roomList.length - 1; i++ ){
            
            if(newList.includes(roomList[i].FloorNumber)){
              //console.log('found', roomList[i].FloorNumber)
            } else {
              newList.push(roomList[i].FloorNumber)
            }
          } 
        }
        break;
      case 'RoomNumber':
        {
          for(let i = 0; i<= roomList.length - 1; i++ ){
            
            if(newList.includes(roomList[i].RoomNumber)){
              //console.log('found')
            } else {
              newList.push(roomList[i].RoomNumber)
            }
          }
        }
    }
    return newList
  }
  render() {
   
    return (
      <div className="theme-grey">
        <Helmet>
              <meta charSet="utf-8" />
              <title>University Details</title>
          </Helmet>

          <PopUpRooms
          Title = "Room Preference"
          Body = {
          <RoomsTableStudent
              Student = {localStorage.getItem('userID')}
              RoomList= {this.state.availableRooms}
              Body = {
                <>
              <Row>
              {  <>
              <label>Buiding Number</label>
        <select className="form-control" onChange={(e)=>{
          this.getRoomsFilters(e.target.value, '', '', localStorage.getItem('userID'))
          this.setState({buildingNumber: e.target.value})}} value={this.state.buildingNumber}>
        {
            
         this.state.buildingNumberList.map((buidling, index)=> (
            <option key={index} name='BuildingNumber' value = {buidling}>{buidling}</option>
        ))   
        }
    </select> 
    </>}

    { <> 
              <label>Floor Number</label>
        <select className="form-control" onChange={(e)=>{
          this.getRoomsFilters('', e.target.value, '', localStorage.getItem('userID'))
          this.setState({floorNumber: e.target.value})}} value={this.state.floorNumberList}>
        {
            
         this.state.floorNumberList.map((floor, index)=> (
            <option key={index} name='FloorNumber' value = {floor}>{floor}</option>
        ))   
        }
    </select>
    
    </> }

    {   <> 
              <label>Room Number</label>
        <select className="form-control" onChange={(e)=>{
          this.getRoomsFilters('', '', e.target.value, localStorage.getItem('userID'))
          this.setState({roomNumber: e.target.value})}} value={this.state.roomNumberList}>
        {
            
         this.state.roomNumberList.map((room, index)=> (
            <option key={index} name='RoomNumber' value = {room}>{room}</option>
        ))   
        }
    </select> </>}

    {   <> 
              <label>Room Gender</label>
        <select className="form-control" onChange={(e)=>{
          this.getRoomsFilters('', '', '', localStorage.getItem('userID'), e.target.value == 'Female' ? 'F' : 'M')
          this.setState({ roomGender: e.target.value == 'Female' ? 'F' : 'M'})}} value={this.state.roomNumberList}>
        {
            
         this.state.genderRoomList.map((gender, index)=> (
            <option key={index} name='RoomGender' value = {gender}>{gender}</option>
        ))   
        }
    </select> </>}
    
              <button className="btn btn-primary" onClick={(e)=>this.getRoomsFilters('', '', '', localStorage.getItem('userID'))}>Reset</button>
              </Row>
              </>}
              />}></PopUpRooms>

          <div
          className="page-loader-wrapper"
          style={{ display: this.props.MyloadingController ? "block" : "none" }}
        >
          <div className="loader">
            <div className="m-t-30">
              <img
                src={localStorage.getItem('clientLogo')}
                width="10%"
                height="10%"
                alt=" "
              />
            </div>
            <p>{this.props.loadingMessage}</p>
          </div>
        </div>
        <div >
          <div className="vertical-align-wrap">
            <div className="vertical-align-middle auth-main"
            style={{
                backgroundImage: "url(" + this.props.clientBG + ")",
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                width: "100% !important",
                height: "100% !important",
              }}
            >
              <div className="auth-box">
                <div className="card">
                <div className="top">
                  <img src={localStorage.getItem('clientLogo')} alt="" style={{  height: "40%",  width:"44%",  display: "block", display: "block", margin: "auto" }} />
                </div>
                  <div className="header">
                    <p className="lead">Student University Details</p>
                  </div>
                  
                  <div className="body">
                    <form id='uniDetails'>
                      <div className="form-group">
                        <label className="control-label sr-only" >
                        University:
                            </label>
                            {  
        <select className="form-control" onChange={(e)=>this.onVarsitySelect(e)} value={this.state.uni}>
        {
            
         this.state.uniList.map((university, index)=> (
            <option key={index} name='UniversityID' value = {university.RubixUniversityID}>{university.UniversityName}</option>
        ))   
        }
    </select> 
    }
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

                      {
                        this.state.showResInput
                        ? <><div className="form-group">
                        <label className="control-label sr-only" >
                        Residence:
                            </label>
                            {  
        <select className="form-control" onChange={(e)=>{
          //console.log("see: ", e.target.value)
          if(e.target.value != "Please Select Residence"){
            this.getResAndPayment(e.target.value)
          } else {
            this.setState({
              payMethods: []
            })
          }
          this.setState({res: e.target.value})
          }} value={this.state.res}>
        {
            this.state.resList.map((res, index)=> (
            <option key={index} name='ResidenceID' value = {res.RubixResidenceID }>{res.ResidenceName}</option>
        ))   
        }
    </select> }
                      </div>

                      { this.state.res == "Please Select Residence"
                      ?<></>
                      :
                        
                        <div className="form-group">
                        <label className="control-label sr-only" >
                        Duration: 
                            </label>
                            {  
        <select className="form-control" onChange={(e)=>{/* console.log("Value: ", e.target.value); */ this.setState({duration: e.target.value})}} value={this.state.duration}>
        {
            
            this.state.durations.map((duration, index)=> (
            <option key={index} name='Duration' value={duration}>{duration == 0 ? "Please select contract duration in " : duration} {duration == 1 ? "Once off Payment" : "months"}</option>
        ))   
        }
    </select> }
                      </div>}

                      <label>Do you have car?</label>
                    <Row>
                    <Col >
                        <input 
                        onChange={(e) => {this.onValueChange(e)}}
                        //checked={this.state.yearOfRes === "2022"}
                        type="radio" name="CarReg" value='yes'/>
                         Yes
                      </Col>
                      <Col>
                      <input 
                      onChange={(e) => {this.onValueChange(e)}}
                      //checked={this.state.yearOfRes === "2023"}
                      type="radio" name="CarReg" value='no'/>
                         No
                      </Col>
                    </Row>
                    {
                      this.state.hasCar
                      ? <div className="form-group">
                      <label className="control-label sr-only" >
                      Car Number Plate:
                          </label>
                          <input
                        className="form-control"
                        id="CarReg"
                        name='CarReg'
                        placeholder="Enter your car Registration Number"
                        type="text"
                        required
                      />
                    </div>
                      : null
                    }
                      </>
                      
                    : null  
                    }

                 
                      

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
                      <button className="btn btn-primary btn-lg btn-block" type="submit" onClick={(e) =>{e.preventDefault(); this.props.onPresRooms()} }>
                        Choose Preffered Room
                        </button>
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
  
  clientBG: navigationReducer.backImage,

  MyloadingController: navigationReducer.loadingController,
  loadingMessage: navigationReducer.loadingMessage,
});

export default connect(mapStateToProps, {
  updateClientBackG,
  updateLoadingMessage,
  updateLoadingController, onPresRooms})(VarsityDetails);
