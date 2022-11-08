import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown, Nav, Toast } from "react-bootstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";
import {
  onPressDashbord,
  onPressDashbordChild,
  onPressThemeColor,
  onPressGeneralSetting,
  onPressNotification,
  onPressEqualizer,
  onPressSideMenuToggle,
  onPressMenuProfileDropdown,
  onPressSideMenuTab,
  tostMessageLoad,
  updateResidenceID,
  updateStudentName,
} from "../actions";
import Avatar4 from "../assets/images/xs/avatar4.jpg";
import Avatar5 from "../assets/images/xs/avatar5.jpg";
import Avatar2 from "../assets/images/xs/avatar2.jpg";
import Avatar1 from "../assets/images/xs/avatar1.jpg";
import Avatar3 from "../assets/images/xs/avatar3.jpg";

class NavbarMenu extends React.Component {
  state = {
    linkupdate: false,
    profile: {},
    imageUrl: 'user.png',
    myClientogo: localStorage.getItem('clientLogo'),
    clientID: localStorage.getItem('clientID'),
    userFullName: localStorage.getItem('studentName'),
  };


  componentDidMount() {
    this.props.tostMessageLoad(true);
    var res = window.location.pathname;
    const userID = localStorage.getItem('userID');
    const userCode = localStorage.getItem('userCode');
    this.props.onPressThemeColor(localStorage.getItem('clientTheme'))
    //console.log(userID)
    res = res.split("/");
    res = res.length > 4 ? res[4] : "/";
    const { activeKey } = this.props;

    if(this.props.studentName){
      this.setState({
        userFullName: this.props.studentName
        })
    }
    
    this.activeMenutabwhenNavigate("/" + activeKey);


 //Get User Profile Picture
 const fetchData = async () => {
  //Get documents from DB
  await fetch('http://129.232.144.154:86/feed/post/' + userID)
    .then(response => {
      //console.log("Profile data:", response)
      response.json()})
    .then(data => {
      const profilePic = data.post.filter(doc => doc.FileType == 'profile-pic')[0]
      //console.log("Profile Picture data:", profilePic)
      //If Profile Picture Exists...
      if(profilePic != null && profilePic != undefined){
        this.setState({ profilePicture: data.post.filter(doc => doc.FileType == 'profile-pic')[0]})
        this.setState({imageUrl: 'http://129.232.144.154:449/' + profilePic.filename})
      }
    });
};
    //Fetch data from DB
    const fetchUserData = async() =>{
    //Get Rubix User Details
    await fetch('http://129.232.144.154:88/api/RubixRegisterUsers/'+ userID)
    .then(response => response.json())
    .then(data => {
      //console.log("Check: ", data)
        this.setState({profile: data,
        userFullName: data.Name + " " + data.Surname
        })
        //console.log("image url", data)
        });
      };


      if (localStorage.getItem('role') == 'admin'){
         //Set timer for loading screen
  setTimeout(() => {
    this.setState({
      //profile: response.data.PostRubixUserData[0],
      userFullName: localStorage.getItem('adminName')
    })
    //this.getAdmin()
  }, 4000);
        
      } else {
        fetchUserData();
        //fetchData()
      }
  }

  
    //Fetch Res Gallery Images
    fetchImages() {
      const fetchData = async () => {
      await fetch('http://129.232.144.154:86/feed/post/' + localStorage.getItem('resID'))
      .then(response => response.json())
      .then(data => {
       /*  console.log("Res ID:", localStorage.getItem('resID'))
        console.log("Images:", data.post) */
        for(let i = 0; i <= data.post.length - 1; ++i){
  
         if(data.post[i].FileType == "ResManager"){ 
          
          this.setState({
            imageUrl: 'http://129.232.144.154:449/' +  data.post[i].filename
          })
          }
        }
      })
    }
    if(localStorage.getItem('resID') == 0){

    }else {
      fetchData()
    }
    }

    
  //Get Admin User Data
  getAdmin(){
    const pingData = {
        'UserCode': localStorage.getItem('userCode'),
      };
      //Ping Request Headers
      const requestOptions = {
        title: 'Get Admin User Details',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: pingData
      };
      const postData = async () => {
        await axios.post('http://129.232.144.154:88/api/RubixAdminGetUser', pingData, requestOptions)
        .then(response => {
          //console.log("Admin User Details:", response)
          this.setState({
            profile: response.data.PostRubixUserData[0],
            userFullName: response.data.PostRubixUserData[0].AdminUserName + " " + response.data.PostRubixUserData[0].AdminUserSurname
          })
          localStorage.setItem('adminName', response.data.PostRubixUserData[0].AdminUserName)
          localStorage.setItem('adminSurname', response.data.PostRubixUserData[0].AdminUserSurname)

          this.props.updateResidenceID(response.data.PostRubixUserData[0].RubixResidenceID)
  
        })
      }
      postData().then(() => {
        this.fetchImages()
      })
  }


  activeMenutabwhenNavigate(activeKey) {
    if (
      activeKey === "/dashboard" ||
      activeKey === "/demographic" ||
      activeKey === "/ioT"
    ) {
      this.activeMenutabContainer("dashboradContainer");
    } else if (
      activeKey === "/appinbox" ||
      activeKey === "/appchat" ||
      //activeKey === "/appcalendar" ||
      activeKey === "/appcontact" ||
      activeKey === "/apptaskbar"
    ) {
      this.activeMenutabContainer("AppContainer");
    } else if (
      activeKey === "/filemanagerdashboard" ||
      activeKey === "/filedocuments" ||
      activeKey === "/filemedia"
    ) {
      this.activeMenutabContainer("FileManagerContainer");
    } else if (
      activeKey === "/blognewpost" ||
      activeKey === "/bloglist" ||
      activeKey === "/blogdetails"
    ) {
      this.activeMenutabContainer("BlogContainer");
    } else if (
      activeKey === "/uitypography" ||
      activeKey === "/uitabs" ||
      activeKey === "/uibuttons" ||
      activeKey === "/bootstrapui" ||
      activeKey === "/uiicons" ||
      activeKey === "/uinotifications" ||
      activeKey === "/uicolors" ||
      activeKey === "/uilistgroup" ||
      activeKey === "/uimediaobject" ||
      activeKey === "/uimodal" ||
      activeKey === "/uiprogressbar"
    ) {
      this.activeMenutabContainer("UIElementsContainer");
    } else if (
      activeKey === "/widgetsdata" ||
      activeKey === "/widgetsweather" ||
      activeKey === "/widgetsblog" ||
      activeKey === "/widgetsecommers"
    ) {
      this.activeMenutabContainer("WidgetsContainer");
    } else if (activeKey === "/login") {
      this.activeMenutabContainer("WidgetsContainer");
    } else if (
      activeKey === "/teamsboard" ||
      activeKey === "/profilev2page" ||
      activeKey === "/helperclass" ||
      activeKey === "/searchresult" ||
      activeKey === "/invoicesv2" ||
      activeKey === "/invoices" ||
      activeKey === "/pricing" ||
      activeKey === "/timeline" ||
      activeKey === "/profilev1page" ||
      activeKey === "/blankpage" ||
      activeKey === "/imagegalleryprofile" ||
      activeKey === "/projectslist" ||
      activeKey === "/maintanance" ||
      activeKey === "/testimonials" ||
      activeKey === "/faqs"
    ) {
     this.activeMenutabContainer("PagesContainer");
    } else if (
      activeKey === "/formvalidation" ||
      activeKey === "/basicelements"
    ) {
      this.activeMenutabContainer("FormsContainer");
    } else if (activeKey === "/tablenormal") {
      this.activeMenutabContainer("TablesContainer");
    } else if (activeKey === "/echart") {
      this.activeMenutabContainer("chartsContainer");
    } else if (activeKey === "/leafletmap") {
      this.activeMenutabContainer("MapsContainer");
    } else if (activeKey === "/appcalendar"){
      this.activeMenutabContainer("Calendar")
    } else if (activeKey === "/residence"){
      this.activeMenutabContainer("Residence")
    }
  }

   componentWillReceiveProps(){
     this.setState({
       linkupdate:!this.state.linkupdate
     })
  }

   activeMenutabContainer(id) {
    var parents = document.getElementById("main-menu");
    var activeMenu = document.getElementById(id);

    for (let index = 0; index < parents.children.length; index++) {
      if (parents.children[index].id !== id) {
        parents.children[index].classList.remove("active");
       // parents.children[index].children[1].classList.remove("in");
      }
    }
    /* setTimeout(() => {
      activeMenu.classList.toggle("active");
      activeMenu.children[1].classList.toggle("in");
    }, 10); */
  } 
  render() {
    const {
      addClassactive,
      addClassactiveChildAuth,
      addClassactiveChildMaps,
      themeColor,
      toggleNotification,
      toggleEqualizer,
      sideMenuTab,
      isToastMessage,
      clientLogo,
      activeKey,
    } = this.props;
    var path = window.location.pathname;
    document.body.classList.add(themeColor);

    return (
      <div>
        {isToastMessage ? (
          <Toast
            id="toast-container"
            show={isToastMessage}
            onClose={() => {
              this.props.tostMessageLoad(false);
            }}
            className="toast-info toast-top-right"
            autohide={true}
            delay={5000}
          >
            <Toast.Header className="toast-info mb-0">
              Hello, welcome to Lucid, a unique admin Template.
            </Toast.Header>
          </Toast>
        ) : null}

        {//Top Nav Bar
        }
        <nav className="navbar navbar-fixed-top h-30">
          <div className="container-fluid">
            <div className="navbar-btn">
              <button
                className="btn-toggle-offcanvas"
                onClick={() => {
                  this.props.onPressSideMenuToggle();
                }}
              >
                <i className="lnr lnr-menu fa fa-bars"></i>
              </button>
            </div>

            <div className="navbar-brand">
              <a href="dashboard">
                <img
                  src={this.state.myClientogo == null ?'user.png' : this.state.myClientogo}/* {
                    document.body.classList.contains("full-dark")
                      ? LogoWhite
                      : Logo
                  } */
                  alt="Company Logo"
                  className="img-responsive logo pl-3"
                  style={{
                    height: '50px',
                    width: '80px'
                  }}
                />
              </a>
            </div>

            <div className="navbar-right">
            
              <div id="navbar-menu">
                <ul className="nav navbar-nav">
                  <li>
                    <a
                      href="profilev1page"
                      className="icon-menu d-none d-sm-block d-md-none d-lg-block"
                      onClick={(e)=>{
                        //e.preventDefault()
                        localStorage.setItem('tab', 'documents')
                      }}
                    >
                      <i className="fa fa-folder-open-o"></i>
                    </a>
                  </li>
                  <li>
                    <a
                      href="appcalendar"
                      className="icon-menu d-none d-sm-block d-md-none d-lg-block"
                    >
                      <i className="icon-calendar"></i>
                    </a>
                  </li>
                  <li
                    className=''
                  >
                    <a
                      href="dashboard"
                      className=" icon-menu"
                      //data-toggle="dropdown"
                     /*  onClick={(e) => {
                        e.preventDefault();
                        this.props.onPressNotification();
                      }} */
                    >
                      <i className="icon-bell"></i>
                    </a>
                    <ul
                      className={"dropdown-menu notifications"
                      }
                    >
                      <li className="header">
                        <strong>You have 4 new Notifications</strong>
                      </li>
                      <li>
                        <a>
                          <div className="media">
                            <div className="media-left">
                              <i className="icon-info text-warning"></i>
                            </div>
                            <div className="media-body">
                              <p className="text">
                                Campaign <strong>Holiday Sale</strong> is nearly
                                reach budget limit.
                              </p>
                              <span className="timestamp">10:00 AM Today</span>
                            </div>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a>
                          <div className="media">
                            <div className="media-left">
                              <i className="icon-like text-success"></i>
                            </div>
                            <div className="media-body">
                              <p className="text">
                                Your New Campaign <strong>Holiday Sale</strong>{" "}
                                is approved.
                              </p>
                              <span className="timestamp">11:30 AM Today</span>
                            </div>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a>
                          <div className="media">
                            <div className="media-left">
                              <i className="icon-pie-chart text-info"></i>
                            </div>
                            <div className="media-body">
                              <p className="text">
                                Website visits from Twitter is 27% higher than
                                last week.
                              </p>
                              <span className="timestamp">04:00 PM Today</span>
                            </div>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a>
                          <div className="media">
                            <div className="media-left">
                              <i className="icon-info text-danger"></i>
                            </div>
                            <div className="media-body">
                              <p className="text">
                                Error on website analytics configurations
                              </p>
                              <span className="timestamp">Yesterday</span>
                            </div>
                          </div>
                        </a>
                      </li>
                      <li className="footer">
                        <a className="more">See all notifications</a>
                      </li>
                    </ul>
                  </li>
                  <li
                    className={toggleEqualizer ? "show dropdown" : "dropdown"}
                  >
                    
                    <ul
                      className={
                        toggleEqualizer
                          ? "dropdown-menu user-menu menu-icon show"
                          : "dropdown-menu user-menu menu-icon"
                      }
                    >
                      <li className="menu-heading">ACCOUNT SETTINGS</li>
                      <li>
                        <a>
                          <i className="icon-note"></i> <span>Basic</span>
                        </a>
                      </li>
                      <li>
                        <a>
                          <i className="icon-equalizer"></i>{" "}
                          <span>Preferences</span>
                        </a>
                      </li>
                      <li>
                        <a>
                          <i className="icon-lock"></i> <span>Privacy</span>
                        </a>
                      </li>
                      <li>
                        <a>
                          <i className="icon-bell"></i>{" "}
                          <span>Notifications</span>
                        </a>
                      </li>
                      <li className="menu-heading">BILLING</li>
                      <li>
                        <a>
                          <i className="icon-credit-card"></i>{" "}
                          <span>Payments</span>
                        </a>
                      </li>
                      <li>
                        <a>
                          <i className="icon-printer"></i> <span>Invoices</span>
                        </a>
                      </li>
                      <li>
                        <a>
                          <i className="icon-refresh"></i> <span>Renewals</span>
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a href={"login/" + this.state.clientID} className="icon-menu">
                      <i className="icon-login"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>



{//Left Side Bar
}
        <div id="left-sidebar" className="sidebar pt-4" style={{ zIndex: 9 }}>
          <div className="sidebar-scroll">
            <div className="user-account">
              <img
                src={localStorage.getItem('adminLevel') == 2 || localStorage.getItem('adminLevel') == '2' ? 'user.png' :  this.state.imageUrl}
                className="rounded-circle user-photo"
                alt="User Profile Picture"
              />
              <Dropdown>
                <span>Welcome,</span>
                <Dropdown.Toggle
                  variant="none"
                  as="a"
                  id="dropdown-basic"
                  className="user-name"
                >
                  <strong>{this.state.userFullName}</strong>
                </Dropdown.Toggle>

                <Dropdown.Menu className="dropdown-menu-right account">
                  { localStorage.getItem('role') == 'admin'
                  ? null
                    :
                    <><Dropdown.Item href="profilev1page">
                    <i className="icon-user"></i>My Profile
                  </Dropdown.Item>
                  <li className="divider"></li>
                  </>}
                  
                  <Dropdown.Item href={"login/" + this.state.clientID}>
                    {" "}
                    <i className="icon-power"></i>Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <hr />
              
            </div>
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <a
                  className={sideMenuTab[0] ? "nav-link active" : "nav-link"}
                  data-toggle="tab"
                  onClick={() => {
                    this.props.onPressSideMenuTab(0);
                  }}
                >
                  Menu
                </a>
              </li>
              {/* <li className="nav-item">
                <a
                  className={sideMenuTab[1] ? "nav-link active" : "nav-link"}
                  data-toggle="tab"
                  onClick={() => {
                    this.props.onPressSideMenuTab(1);
                  }}
                >
                  <i className="icon-book-open"></i>
                </a>
              </li> */}
             {/*  <li className="nav-item">
                <a
                  className={sideMenuTab[2] ? "nav-link active" : "nav-link"}
                  data-toggle="tab"
                  onClick={() => {
                    this.props.onPressSideMenuTab(2);
                  }}
                >
                  <i className="icon-settings"></i>
                </a>
              </li> */}
             {/*  <li className="nav-item">
                <a
                  className={sideMenuTab[3] ? "nav-link active" : "nav-link"}
                  data-toggle="tab"
                  onClick={() => {
                    this.props.onPressSideMenuTab(3);
                  }}
                >
                  <i className="icon-question"></i>
                </a>
              </li> */}
            </ul> 


            <div className="tab-content p-l-0 p-r-0">
              <div
                className={sideMenuTab[0] ? "tab-pane active show" : "tab-pane"}
                id="menu"
              >
                <Nav id="left-sidebar-nav" className="sidebar-nav">
                  <ul id="main-menu" className="metismenu">
                  <li className="" id="dashboard">
                    <a
                        href="dashboard"
                        className=""
                        /* onClick={(e) => {
                          e.preventDefault();
                          this.activeMenutabContainer("AppContainer");
                        }} */
                      >
                        <i className="icon-pin"></i> <span>Announcements</span>
                      </a>
                    </li>
                    
                  <li className="" id={localStorage.getItem('role') == 'admin' ? "students" : "myProfile"}>
                    <a
                        href= {localStorage.getItem('role') == 'admin' ? "students" :"profilev1page"}
                        className=""
                        onClick={(e)=>{
                          //e.preventDefault()
                          localStorage.setItem('tab', 'settings')
                        }}
                      
                      >
                        <i className="icon-user"></i> <span>{localStorage.getItem('role') == 'admin' ? "Students" : "My Profile"}</span>
                      </a>
                    </li>
                    { localStorage.getItem('role') == 'admin'
                    ?
                    <li className="" id="adminDash">
                      <a
                          href="adminDash"
                          className=""
                          /* onClick={(e) => {
                            e.preventDefault();
                            this.activeMenutabContainer("AppContainer");
                          }} */
                        >
                          <i className="icon-speedometer"></i> <span>Admin Stats</span>
                        </a>
                      </li>
                      : null}


                  <li className="" id={localStorage.getItem('role') == 'admin' ? 'communication' :"Residence"}>
                    <a
                        href={localStorage.getItem('role') == 'admin' ? 'communication' :"residence"}
                        className={
                          activeKey === "residence" ? "active" : ""
                        }
                        /* onClick={(e) => {
                          e.preventDefault();
                          this.activeMenutabContainer("AppContainer");
                        }} */
                      >
                        <i className= {localStorage.getItem('role') == 'admin' ? 'icon-bubbles' : "icon-home"}></i> <span> {localStorage.getItem('role') == 'admin' ? 'Communication' :"Residence Information"}</span>
                      </a>
                    </li>

             { 
                    
                     localStorage.getItem('adminLevel') == 2 || localStorage.getItem('adminLevel') == '2'
                      ? null    
                  : localStorage.getItem('adminLevel') == 1 || localStorage.getItem('adminLevel') == '1' || localStorage.getItem('role') == 'student'
                  
                  ? <li className="" id="Calendar" >
                    <a 
                    style=
                    {{
                      dispay: localStorage.getItem('adminLevel') == 2 || localStorage.getItem('adminLevel') == '2' ? 'none' : 'block'
                    }}
                        href="appcalendar"
                        className={
                          activeKey === "appcalendar" ? "active" : ""
                        }
                      >
                        <i className="icon-calendar"></i> <span>Calendar</span>
                      </a>
                    </li>
                    : null
                  }

{ localStorage.getItem('role') == 'admin'
                    ?
                    <li className="" id="support">
                      <a
                          href="support"
                          className=""
                        
                        >
                          <i className="icon-earphones-alt"></i> <span>Rubix Support</span>
                        </a>
                      </li>
                      : null}

                  </ul>
                </Nav>
              </div>
              <div
                className={
                  sideMenuTab[1]
                    ? "tab-pane p-l-15 p-r-15 show active"
                    : "tab-pane p-l-15 p-r-15"
                }
                id="Chat"
              >
                <form>
                  <div className="input-group m-b-20">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="icon-magnifier"></i>
                      </span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search..."
                    />
                  </div>
                </form>
                <ul className="right_chat list-unstyled">
                  <li className="online">
                    <a>
                      <div className="media">
                        <img className="media-object " src={Avatar4} alt="" />
                        <div className="media-body">
                          <span className="name">Chris Fox</span>
                          <span className="message">Designer, Blogger</span>
                          <span className="badge badge-outline status"></span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="online">
                    <a>
                      <div className="media">
                        <img className="media-object " src={Avatar5} alt="" />
                        <div className="media-body">
                          <span className="name">Joge Lucky</span>
                          <span className="message">Java Developer</span>
                          <span className="badge badge-outline status"></span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="offline">
                    <a>
                      <div className="media">
                        <img className="media-object " src={Avatar2} alt="" />
                        <div className="media-body">
                          <span className="name">Isabella</span>
                          <span className="message">CEO, Thememakker</span>
                          <span className="badge badge-outline status"></span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="offline">
                    <a>
                      <div className="media">
                        <img className="media-object " src={Avatar1} alt="" />
                        <div className="media-body">
                          <span className="name">Folisise Chosielie</span>
                          <span className="message">
                            Art director, Movie Cut
                          </span>
                          <span className="badge badge-outline status"></span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="online">
                    <a>
                      <div className="media">
                        <img className="media-object " src={Avatar3} alt="" />
                        <div className="media-body">
                          <span className="name">Alexander</span>
                          <span className="message">Writter, Mag Editor</span>
                          <span className="badge badge-outline status"></span>
                        </div>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
              <div
                className={
                  sideMenuTab[2]
                    ? "tab-pane p-l-15 p-r-15 show active"
                    : "tab-pane p-l-15 p-r-15"
                }
                id="setting"
              >
                <h6>Choose Mode</h6>
                <ul className="choose-skin list-unstyled">
                  <li
                    data-theme="white"
                    className={
                      document.body.classList.contains("full-dark")
                        ? ""
                        : "active"
                    }
                    onClick={() => {
                      this.setState({ somethi: false });
                      document.body.classList.remove("full-dark");
                    }}
                  >
                    <div className="white"></div>
                    <span>Light</span>
                  </li>
                  <li
                    data-theme="black"
                    className={
                      document.body.classList.contains("full-dark")
                        ? "active"
                        : ""
                    }
                    onClick={() => {
                      this.setState({ somethi: true });
                      document.body.classList.add("full-dark");
                    }}
                  >
                    <div className="black"></div>
                    <span>Dark</span>
                  </li>
                </ul>
                <hr />
                <h6>Choose Skin</h6>
                <ul className="choose-skin list-unstyled">
                  <li
                    data-theme="purple"
                    className={themeColor === "theme-purple" ? "active" : ""}
                  >
                    <div
                      className="purple"
                      onClick={() => {
                        if (themeColor !== "theme-purple") {
                          document.body.classList.remove(themeColor);
                        }
                        this.props.onPressThemeColor("purple");
                      }}
                    ></div>
                    <span>Purple</span>
                  </li>
                  <li
                    data-theme="blue"
                    className={themeColor === "theme-blue" ? "active" : ""}
                  >
                    <div
                      className="blue"
                      onClick={() => {
                        if (themeColor !== "theme-blue") {
                          document.body.classList.remove(themeColor);
                        }
                        this.props.onPressThemeColor("blue");
                      }}
                    ></div>
                    <span>Blue</span>
                  </li>
                  <li
                    data-theme="cyan"
                    //className="active"
                    className={themeColor === "theme-cyan" ? "active" : ""}
                  >
                    <div
                      className="cyan"
                      onClick={() => {
                        if (themeColor !== "theme-cyan") {
                          document.body.classList.remove(themeColor);
                        }
                        this.props.onPressThemeColor("cyan");
                      }}
                    ></div>
                    <span>Cyan</span>
                  </li>
                  <li
                    data-theme="green"
                    className={themeColor === "theme-green" ? "active" : ""}
                  >
                    <div
                      className="green"
                      onClick={() => {
                        if (themeColor !== "theme-green") {
                          document.body.classList.remove(themeColor);
                        }
                        this.props.onPressThemeColor("green");
                      }}
                    ></div>
                    <span>Green</span>
                  </li>
                  <li
                    data-theme="orange"
                    className={themeColor === "theme-orange" ? "active" : ""}
                  >
                    <div
                      className="orange"
                      onClick={() => {
                        if (themeColor !== "theme-orange") {
                          document.body.classList.remove(themeColor);
                        }
                        this.props.onPressThemeColor("orange");
                      }}
                    ></div>
                    <span>Orange</span>
                  </li>
                  <li
                    data-theme="blush"
                    className={themeColor === "theme-blush" ? "active" : ""}
                  >
                    <div
                      className="blush"
                      onClick={() => {
                        if (themeColor !== "theme-blush") {
                          document.body.classList.remove(themeColor);
                        }
                        this.props.onPressThemeColor("blush");
                      }}
                    ></div>
                    <span>Blush</span>
                  </li>
                </ul>
                <hr />
                <h6>General Settings</h6>
                <ul className="setting-list list-unstyled">
                  <li>
                    <label className="fancy-checkbox">
                      <input type="checkbox" name="checkbox" />
                      <span>Report Panel Usag</span>
                    </label>
                  </li>
                  <li>
                    <label className="fancy-checkbox">
                      <input type="checkbox" name="checkbox" />
                      <span>Email Redirect</span>
                    </label>
                  </li>
                  <li>
                    <label className="fancy-checkbox">
                      <input type="checkbox" name="checkbox" />
                      <span>Notifications</span>
                    </label>
                  </li>
                  <li>
                    <label className="fancy-checkbox">
                      <input type="checkbox" name="checkbox" />
                      <span>Auto Updates</span>
                    </label>
                  </li>
                  <li>
                    <label className="fancy-checkbox">
                      <input type="checkbox" name="checkbox" />
                      <span>Offline</span>
                    </label>
                  </li>
                  <li>
                    <label className="fancy-checkbox">
                      <input type="checkbox" name="checkbox" />
                      <span>Location Permission</span>
                    </label>
                  </li>
                </ul>
              </div>
              <div
                className={
                  sideMenuTab[3]
                    ? "tab-pane p-l-15 p-r-15 show active"
                    : "tab-pane p-l-15 p-r-15"
                }
                id="question"
              >
                <form>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="icon-magnifier"></i>
                      </span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search..."
                    />
                  </div>
                </form>
                <ul className="list-unstyled question">
                  <li className="menu-heading">HOW-TO</li>
                  <li>
                    <a
                      href="#!"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      How to Create Campaign
                    </a>
                  </li>
                  <li>
                    <a
                      href="#!"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      Boost Your Sales
                    </a>
                  </li>
                  <li>
                    <a
                      href="#!"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      Website Analytics
                    </a>
                  </li>
                  <li className="menu-heading">ACCOUNT</li>
                  <li>
                    <a
                      href="registration"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      Cearet New Account
                    </a>
                  </li>
                  <li>
                    <a
                      href="forgotpassword"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      Change Password?
                    </a>
                  </li>
                  <li>
                    <a
                      href="#!"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      Privacy &amp; Policy
                    </a>
                  </li>
                  <li className="menu-heading">BILLING</li>
                  <li>
                    <a
                      href="#!"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      Payment info
                    </a>
                  </li>
                  <li>
                    <a
                      href="#!"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      Auto-Renewal
                    </a>
                  </li>
                  <li className="menu-button m-t-30">
                    <a
                      href="#!"
                      className="btn btn-primary"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <i className="icon-question"></i> Need Help?
                    </a>
                  </li>
                </ul>
              </div>
            </div> 
          </div>
        </div>
      </div>
    );
  }
}

NavbarMenu.propTypes = {
  addClassactive: PropTypes.array.isRequired,
  addClassactiveChild: PropTypes.array.isRequired,
  addClassactiveChildApp: PropTypes.array.isRequired,
  addClassactiveChildFM: PropTypes.array.isRequired,
  addClassactiveChildBlog: PropTypes.array.isRequired,
  addClassactiveChildUI: PropTypes.array.isRequired,
  addClassactiveChildWidgets: PropTypes.array.isRequired,
  addClassactiveChildAuth: PropTypes.array.isRequired,
  addClassactiveChildPages: PropTypes.array.isRequired,
  addClassactiveChildForms: PropTypes.array.isRequired,
  addClassactiveChildTables: PropTypes.array.isRequired,
  addClassactiveChildChart: PropTypes.array.isRequired,
  addClassactiveChildMaps: PropTypes.array.isRequired,
  themeColor: PropTypes.string.isRequired,
  generalSetting: PropTypes.array.isRequired,
  toggleNotification: PropTypes.bool.isRequired,
  toggleEqualizer: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ navigationReducer }) => {
  const {
    addClassactive,
    addClassactiveChild,
    addClassactiveChildApp,
    addClassactiveChildFM,
    addClassactiveChildBlog,
    addClassactiveChildUI,
    addClassactiveChildWidgets,
    addClassactiveChildAuth,
    addClassactiveChildPages,
    addClassactiveChildForms,
    addClassactiveChildTables,
    addClassactiveChildChart,
    addClassactiveChildMaps,
    themeColor,
    generalSetting,
    toggleNotification,
    toggleEqualizer,
    menuProfileDropdown,
    sideMenuTab,
    isToastMessage,
    userID,
    clientLogo,
    studentName
  } = navigationReducer;
  return {
    addClassactive,
    addClassactiveChild,
    addClassactiveChildApp,
    addClassactiveChildFM,
    addClassactiveChildBlog,
    addClassactiveChildUI,
    addClassactiveChildWidgets,
    addClassactiveChildAuth,
    addClassactiveChildPages,
    addClassactiveChildForms,
    addClassactiveChildTables,
    addClassactiveChildChart,
    addClassactiveChildMaps,
    themeColor,
    userID,
    generalSetting,
    toggleNotification,
    toggleEqualizer,
    menuProfileDropdown,
    sideMenuTab,
    isToastMessage,
    clientLogo,
    studentName
  };
};

export default connect(mapStateToProps, {
  onPressDashbord,
  onPressDashbordChild,
  onPressThemeColor,
  onPressGeneralSetting,
  onPressNotification,
  onPressEqualizer,
  onPressSideMenuToggle,
  onPressMenuProfileDropdown,
  onPressSideMenuTab,
  tostMessageLoad,
  updateResidenceID,
  
  updateStudentName,
})(NavbarMenu);
