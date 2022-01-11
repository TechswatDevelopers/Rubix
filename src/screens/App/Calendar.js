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
import { events } from "../../Data/AppData";
import { onPresAddEvent } from "../../actions";
import axios from "axios";

class AppCalendar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      resDetails: {},
      resManagerPic: '',
    }
  }
  componentDidMount() {
    window.scrollTo(0, 0);
    this.getResData()
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
      await axios.post('https://rubixapi.cjstudents.co.za:88/api/RubixStudentResDetails', pingData, requestOptions)
      .then(response => {
        console.log("Res Data:", response.data.PostRubixUserData[0])
        this.setState({
          resDetails: response.data.PostRubixUserData[0]
        })

        this.fetchImages(response.data.PostRubixUserData[0].RubixResidenceID)
      })
    }
    postData()
  }
  
  //Fetch Res Gallery Images
  fetchImages(resID) {
    const fetchData = async () => {
    await fetch('https://rubixdocuments.cjstudents.co.za:86/feed/post/' + resID)
    .then(response => response.json())
    .then(data => {
      console.log("Images:", data.post)
      for(let i = 0; i <= data.post.length - 1; ++i){

       if(data.post[i].FileType == "ResManager"){ 
        
        this.setState({
          resManagerPic: 'https://rubiximages.cjstudents.co.za:449/' +  data.post[i].filename
        })
        }
      }
    })
  }
  fetchData()
  }

  //View Event Information
  viewEvent = (event) => {
    //console.log("I am called")
    alert("I am called")
    
    return(
      <>
      <div className= "modal fade show" role="dialog">
      <UIModalComponent
      title = {events[0].title}
      bodyText = "Event Description"
      size = '500px'
      />
      </div>
      </>
    )
  }

  render() {
    const { isEventModal } = this.props;
    return (
      <div style={{ flex: 1 }}>
        <div style={{ opacity: isEventModal ? 0.3 : 1 }}>
          <div className="ng-star-inserted">
            <div className="container-fluid">
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
                        events={events}
                        eventClick={(event)=> {
                          this.viewEvent(event)}}
                        dateClick={() => {
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
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AddEventModal resID= {this.state.resDetails.RubixResidenceID}/>
      </div>
    );
  }
}

const mapStateToProps = ({ mailInboxReducer }) => ({
  isEventModal: mailInboxReducer.isEventModal,
});

export default connect(mapStateToProps, { onPresAddEvent })(AppCalendar);
