import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import ProfileHeaderCard from "../../components/ProfileHeaderCard";
import UIModalComponent from "../../components/UIElements/UIModal";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import AddEventModal from "../../components/AddEventModal";
import PopUpModal from "../../components/PopUpModal";
import { events } from "../../Data/AppData";
import { onPresAddEvent, onPresPopUpEvent,
  updateLoadingMessage,
  updateLoadingController, } from "../../actions";
import axios from "axios";
import {Helmet} from "react-helmet";

class AppCalendar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      resDetails: {},
      resManagerPic: '',
      resEvents: [],
      studentEvents: [],
      eventBody: '',
      eventTitle: '',
      totalResEvents: '',
      upcomingResEvents: '',
      pastEvents: '',
      chosenDate: null,
      pageTitle: 'My Calendar',
    }
  }
  componentDidMount() {
    window.scrollTo(0, 0);
    //Set Loading Screen ON
    this.props.updateLoadingController(true);
    this.props.updateLoadingMessage("Loading Residence Information...");

    //Set timer for loading screen
    setTimeout(() => {
      this.props.updateLoadingController(false);
    }, 3000);


    //Get Residence Data
    //If Admin: Only fetch Res events
    if(localStorage.getItem('role') == 'admin'){
      //Get Events Data
      this.getAdminResData()
      
    } else {
      this.getResData()
    }
  }

  //Get Events
  getResEvents() {
    //Set Loading Screen ON
    this.props.updateLoadingController(true);
    this.props.updateLoadingMessage("Loading Residence Events...");
    //Post Request Data
    const data = {
      'RubixResidenceID': localStorage.getItem('resID')
    }
    const requestOptions = {
      title: 'Get Residence Events Details',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    }

    //Http Post Request
    const postData = async () => {
      await axios.post('https://jjprest.rubix.mobi:88/api/RubixResidenceEventsGetData', data, requestOptions)
      .then(response => {
console.log("Events :", response)
        if(response.data.PostRubixUserData == null || response.data.PostRubixUserData.length == 0 || response.data.PostRubixUserData == false){

        } else {
          //console.log("Res Events: ", response.data.PostRubixUserData)
          //Popolate Events List
          this.populateEvents(response.data.PostRubixUserData)
          this.setState({
            totalResEvents: response.data.PostRubixUserData[0].TotalEvents,
            upcomingResEvents: response.data.PostRubixUserData[0].UpcomingEvents,
            pastEvents:response.data.PostRubixUserData[0].PastEvents
          })
        }

        
    this.props.updateLoadingController(false);
    //Get Student Events
    this.getStudentEvents()
        
      })
    }
    postData()
  }


  //Get Events
  getStudentEvents() {
    //Set Loading Screen ON
    this.props.updateLoadingController(true);
    this.props.updateLoadingMessage("Loading Student Events...");
    
    //Post Request Data
    const data = {
      'RubixRegisterUserID': localStorage.getItem('userID')
    }

    const requestOptions = {
      title: 'Get Student Events Details',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    }

    //Http Post Request
    const postData = async () => {
      await axios.post('https://jjprest.rubix.mobi:88/api/RubixStudentEventsGetData', data, requestOptions)
      .then(response => {

        if(response.data.PostRubixUserData == null || response.data.PostRubixUserData.length == 0){
           //Set timer for loading screen
           setTimeout(() => {
            this.props.updateLoadingController(false);
          }, 4000);
        } else {
          console.log("Student Events: ", response.data.PostRubixUserData)
          //Popolate Events List
          this.populateStudentEvents(response.data.PostRubixUserData)
          
     //Set timer for loading screen
     setTimeout(() => {
      this.props.updateLoadingController(false);
    }, 4000);
          
          
        }
        
      })
    }
    postData()
  }


  //Fetch Res Details
  getResData(){
    const pingData = {
      'RubixRegisterUserID': localStorage.getItem('userID'),
    };
    //Ping Request Headers
    const requestOptions = {
      title: 'Get residence Details',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: pingData
    };
    const postData = async () => {
      await axios.post('https://jjprest.rubix.mobi:88/api/RubixStudentResDetails', pingData, requestOptions)
      .then(response => {
        console.log("Res Data:", response.data.PostRubixUserData[0])
        this.setState({
          resDetails: response.data.PostRubixUserData[0]
        })

        this.fetchImages(response.data.PostRubixUserData[0].RubixResidenceID)
        //Get Events Data
    this.getResEvents()
      })
    }
    postData()
  }

  getAdminResData(){
    //Set Loading Screen ON
    this.props.updateLoadingController(true);
    this.props.updateLoadingMessage("Loading Res Admin Information...");

    const pingData = {
      'RubixResidenceID': localStorage.getItem('resID'),
    };
    //Ping Request Headers
    const requestOptions = {
      title: 'Get Residence Admin Details',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: pingData
    };
    console.log('Posted Data: ', pingData)
    const postData = async () => {
      await axios.post('https://jjprest.rubix.mobi:88/api/RubixAdminResDetails', pingData, requestOptions)
      .then(response => {
        console.log("Res Admin Data:", response)
        this.setState({
          resDetails: response.data.PostRubixUserData[0]
        })

        //this.fetchImages(localStorage.getItem('resID'))
        this.fetchImages(response.data.PostRubixUserData[0].RubixResidenceID)
    this.getResEvents()
      })
    }
    postData()
  }
  
  //Fetch Res Gallery Images
  fetchImages(resID) {
    const fetchData = async () => {
    await fetch('https://jjpdocument.rubix.mobi:86/feed/post/' + resID)
    .then(response => response.json())
    .then(data => {
      console.log("Images:", data.post)
      for(let i = 0; i <= data.post.length - 1; ++i){

       if(data.post[i].FileType == "ResManager"){ 
        
        this.setState({
          resManagerPic: 'hhttp://129.232.144.154:449/' +  data.post[i].filename
        })
        }
      }
    })
  }
  fetchData()
  }

    //Convert Date and time
    getDateFormated(date){
      let newdate
      const DATE_OPTIONS = { year: 'numeric', month: 'numeric', day: 'numeric', time: 'long' };
    const myDate = new Date(date).toISOString().replace(/T.*/,'').split('-').join('-')
    const myTime = new Date(date).toLocaleTimeString('en-ZA')
      newdate = {
        date: myDate,
        time: myTime
      }
      //console.log("date", date)
      return newdate
    }
  //View Event Information
  viewEvent = (event) => {
    console.log("I am called", event.event._instance.range.start)
    //Get date and time
    let start = this.getDateFormated(event.event._instance.range.start)
    let end = this.getDateFormated(event.event._instance.range.end)
    this.props.onPresPopUpEvent()
     this.setState({
       eventTitle: event.event._def.title,
       eventBody: <>
       <p><strong>About Event: </strong>{event.event._def.extendedProps.desc}</p>
       <span><strong>Start Date: </strong>{start.date} at {start.time}</span><br></br>
       <span><strong>End Date: </strong>{end.date} at {end.time}</span>
      </>
    })
  }

  //Populate Events List
  populateEvents(eventsList){
    let tempEvents = []
    for( let i = 0; i <= eventsList.length - 1; i++){
      tempEvents.push(
       {
          id: i,
          title: eventsList[i].ResidenceEventName,
          start: new Date(eventsList[i].ResidenceEventStartDate),
          end: new Date(eventsList[i].ResidenceEventEndDate),
          desc: eventsList[i].ResidenceEventDescription,
        }
      )
    }
    this.setState({
      resEvents: tempEvents
    })
  }


  //Populate Events List
  populateStudentEvents(eventsList){
    let tempEvents = []
    for( let i = 0; i <= eventsList.length - 1; i++){
      tempEvents.push(
       {
          id: i,
          title: eventsList[i].StudentEventName,
          start: new Date(eventsList[i].StudentEventStartDate),
          end: new Date(eventsList[i].StudentEventEndDate),
          desc: eventsList[i].StudentEventDescription,
        }
      )

    }
    const temp2 = this.state.resEvents.concat(tempEvents)
    console.log('Joint string', temp2)
    this.setState({
      resEvents: temp2
    })
    //Set timer for loading screen
    setTimeout(() => {
      this.props.updateLoadingController(false);
    }, 3000);
  }

  render() {
    const { isEventModal } = this.props;
    return (
      <div style={{ flex: 1 }}>
        <div style={{ opacity: isEventModal ? 0.3 : 1 }}>
          <div className="ng-star-inserted">
            <div className="container-fluid">
              
            <Helmet>
                <meta charSet="utf-8" />
                <title>{this.state.pageTitle}</title>
            </Helmet>

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

              <PageHeader
                HeaderText="Calendar"
                Breadcrumb={[{ name: "App" }, { name: "Calendar" }]}
                key="1"
              />
              <div className="row clearfix">
                <div className="col-lg-8">
                  <div className="card">
                    <div className="body">
                      <FullCalendar
                        defaultView="dayGridMonth"
                        header={{
                          left: "prev,next today",
                          center: "title",
                          right:
                            "dayGridMonth",
                        }}
                        plugins={[
                          dayGridPlugin,
                          timeGridPlugin,
                          interactionPlugin,
                          listPlugin,
                        ]}
                        events={this.state.resEvents}
                        eventClick={(event)=> {
                          this.viewEvent(event)}}
                        dateClick={(e) => {
                          this.setState({
                            chosenDate: e
                          })
                          this.props.onPresAddEvent();
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="card">
                    <div className="body">
                      <button
                        type="button"
                        onClick={() => {
                          this.props.onPresAddEvent();
                          //document.body.classList.add('modal-open');
                        }}
                        className="btn btn-primary btn-block"
                        data-toggle="modal"
                        data-target="#addevent"
                      >
                        Add New Event
                      </button>
                    </div>
                  </div>
                  <div className="card profile-header">
                    <ProfileHeaderCard 
                    FirstName = {this.state.resDetails.ResidenceManagerName}
                    SecondName = {this.state.resDetails.ResidenceManagerSurname}
                    ProfilePicture = {this.state.resManagerPic}
                    TotalEvents = {this.state.totalResEvents}
                    UpcomingEvents = {this.state.upcomingResEvents}
                    PastEvents = {this.state.pastEvents}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AddEventModal 
        resID= {this.state.resDetails.RubixResidenceID}
        StartDate= {this.state.chosenDate}
        />
        <PopUpModal 
        Title= {this.state.eventTitle}
        Body = {this.state.eventBody}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ mailInboxReducer, navigationReducer }) => ({
  isEventModal: mailInboxReducer.isEventModal,
  isPopUpModal: mailInboxReducer.isPopUpModal,

  MyloadingController: navigationReducer.loadingController,
  loadingMessage: navigationReducer.loadingMessage,
});

export default connect(mapStateToProps, { 
  onPresAddEvent, 
  onPresPopUpEvent,
  updateLoadingMessage,
  updateLoadingController,
 })(AppCalendar);
