import React from "react";
import { connect } from "react-redux";
import ReactEcharts from "echarts-for-react";
import "echarts-gl";
import echarts from "echarts";
import LogoiCON from "../../assets/images/logo-icon.svg";
import AwsomeImage from "../../assets/images/blog/blog-page-4.jpg";
import AwsomeImageOt from "../../assets/images/blog/blog-page-2.jpg";
import { Dropdown } from "react-bootstrap";
import ReferralsCard from "../../components/Dashboard/ReferralsCard";
import ResentChat from "../../components/Dashboard/ResentChat";
import TwitterFeedCard from "../../components/Dashboard/TwitterFeedCard";
import FeedCards from "../../components/Dashboard/FeedsCard";
import PageHeader from "../../components/PageHeader";
import axios from "axios";
import "bootstrap/dist/js/bootstrap.min.js";
import ReactList from 'react-list';
import {linkResolver,RichText} from 'prismic-reactjs';
import {Grid, Row, Col, Button} from "react-bootstrap";
import PopUpAddNewNotice from "../../components/PopUpAddNewEvent"
import {onPresPopNewNotice, 
  updateLoadingMessage,
  updateLoadingController,
  onPressThemeColor} from "../../actions"
import {Helmet} from "react-helmet";
import {
  topProductOption,
  topRevenueOption,
  topRevenueMonthlyOption,
  saleGaugeOption,
  dataManagetOption,
  sparkleCardData,
} from "../../Data/DashbordData";
/* import {
  toggleMenuArrow,
  onPressTopProductDropDown,
  loadSparcleCard,
  onPressReferralsDropDown,
  onPressRecentChatDropDown,
  onPressDataManagedDropDown,
  facebookProgressBar,
  twitterProgressBar,
  affiliatesProgressBar,
  searchProgressBar,
} from "../../actions"; */
import SparkleCard from "../../components/SparkleCard";

var timer = null;
class Dashbord extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cardData: [],
      notices: [],
      comments: [],
      likes: [],
      liked: false,
      pageTitle: 'Dashboard',
    };
  }
  componentDidMount() {
    window.scrollTo(0, 0);
    //this.loadDataCard();
    this.setState({
      cardData: [...sparkleCardData],
    });
    this.props.onPressThemeColor("marigold");
    localStorage.setItem("clientTheme", "marigold");

    this.getNoticies()
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
  ////console.log("date", date)
  return newdate
}

  async loadDataCard() {
    const { cardData } = this.state;
    var allCardData = cardData;
    cardData.map((data, i) => {
      var uData = [];
      data.sparklineData.data.map((d, j) => {
        uData[j] = Math.floor(Math.random() * 10) + 1;
      });
      allCardData[i].sparklineData.data = [...uData];
    });
    this.setState({ cardData: [...allCardData] });
  }

  //Get noticies
  getNoticies() {
    //Set Loading Screen ON
    this.props.updateLoadingController(true);
    this.props.updateLoadingMessage("Loading Details, Please wait...");
    const data = {
      'RubixClientID': localStorage.getItem('clientID'),
      'RubixResidenceID': localStorage.getItem('resID')
    }
    const requestOptions = {
      title: 'Login Form',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
  };
  //console.log('Posted data: ', data)
    const getData = async () => {
      const res = await axios.post('https://adowarest.rubix.mobi:88/api/RubixRegisterUserCommentsAndLikes', data, requestOptions)
      ////console.log("Messages data", res.data.PostRubixUserData);
      this.setState({ notices: res.data.PostRubixUserData })
      this.loadComments(res.data.PostRubixUserData[0].RubixRegisterUserMessageID)
    }
    getData().then(()=>{
      //Set timer for loading screen
    setTimeout(() => {
      this.props.updateLoadingController(false);
    }, 5000);
    })
  }

  //Submit Comment
  submitComment(mesageID, e, message) {
    let id
    if(localStorage.getItem('role') === 'admin'){
      id = message.RubixRegisterAdminID
    } else {
      id = localStorage.getItem('userID')
    }
    e.preventDefault()
    const comment = document.getElementById('comment').value;
    const data = {
      'UserComments': comment,
      'RubixRegisterUserMessageID': mesageID,
      'RubixRegisterUserID': id
    }
    const requestOptions = {
      title: 'Post Comment Form',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    };
    ////console.log("Data: ", data)
    const getData = async () => {
      const res = await axios.post('https://adowarest.rubix.mobi:88/api/RubixRegisterUserComments', data, requestOptions)
      ////console.log("Comment Respinse",res.data);
    }
    getData()
   window.location.reload()
  }

  //Load Comments from DB
  loadComments(postID) {
    let data
    if(localStorage.getItem('role') == 'admin'){
      data = {
        'RubixRegisterUserMessageID': postID,
        //'RubixRegisterUserID': localStorage.getItem('userID')
      }
    }else {
      data = {
        'RubixRegisterUserMessageID': postID,
        'RubixRegisterUserID': localStorage.getItem('userID')
      }
    }
    const requestOptions = {
      title: 'Get Comments Form',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    };
    ////console.log('message: ', postID)
    const getData = async () => {
      const res = await axios.post('https://adowarest.rubix.mobi:88/api/RubixRegisterUserCommentsGet', data, requestOptions)
      ////console.log("List of Comments data", res.data.PostRubixUserData)
      const tempComments = res.data.PostRubixUserData

      if(tempComments == null || tempComments.length == 0){

      } else {
        this.setState({
          comments: res.data.PostRubixUserData
        })
      }
      
      this.getLikes(postID)
    }
    getData()
  }


  //Get post likes
  getLikes(postID) {
    const data = {
      'RubixRegisterUserMessageID': postID,
    }
    const requestOptions = {
      title: 'Get likes Form',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    };
    const getData = async () => {
      const res = await axios.post('https://adowarest.rubix.mobi:88/api/RubixRegisterUserLikesGet', data, requestOptions)
      ////console.log("List of likes data",res.data);
      const tempLikes = res.data.PostRubixUserData
      if (tempLikes.length == 0 || tempLikes == undefined || tempLikes == false) {

      } else {
        this.setState({
          likes: res.data.PostRubixUserData
        })
        //Check if post is liked
        const liked = tempLikes.filter(doc => doc.RubixRegisterUserID == localStorage.getItem('userID'))
        //Check if liked posts
        if(liked.length != 0){
          if ( liked[0].LikedStatus) {
            this.setState({
              liked: true
            })
          } else {
  
          }
        }
        
        ////console.log("Liked: ", liked)
      }

    }
    getData()
  }

    //Split String into list
    splitString(given) {
      var string = given.split(',').map(function (element, index) {
          return <p key={index}>{ element }</p>; 
      });
      return string
    }

  //Post Like
  postLike(postID, e) {
    e.preventDefault()
    let liked;
    if (this.state.liked) {
      liked = '0'
    } else {
      liked = '1'
    }
    const data = {
      'RubixRegisterUserMessageID': postID,
      'RubixRegisterUserID': localStorage.getItem('userID'),
      'LikedStatus': liked
    }
    const requestOptions = {
      title: 'Post like Form',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    };
    ////console.log('message: ', postID)
    const getData = async () => {
      const res = await axios.post('https://adowarest.rubix.mobi:88/api/RubixRegisterUserLikes', data, requestOptions)
      ////console.log("My likes Response", res.data);
    }

    getData().then(data => {
      this.getLikes(postID)
    })
    //window.location.reload()
  }

  //Comments Scrollable list
  renderItem = (index, key) => {
    let comment, commenter;
    if(this.state.comments != undefined){
      comment = this.state.comments[index].UserComments
      commenter = this.state.comments[index].NameAndSurname
    } else {
      comment = "No comments..."
    }
    return <div key={key}><strong>{commenter}: </strong>{comment}</div>;
  }

  render() {
    const { loadingPage } = this.props;
    const { cardData } = this.state;
    
    return (
      <div className= "theme-grey"
        onClick={() => {
          document.body.classList.remove("offcanvas-active");
        }}
      >
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
        <PopUpAddNewNotice></PopUpAddNewNotice>
        <div>
          <div className="container-fluid">
            <PageHeader
              HeaderText="My Dashboard"
              Breadcrumb={[{ name: "Dashboard" }]}
            />
            <div className="row clearfix">
              <div className="col-lg-12">
                <div className="card">
                  <div className="header">
                    <Row>
                      <h2>Announcements</h2>
                      {localStorage.getItem('role') == 'admin' && localStorage.getItem('adminLevel') == '1'
                        ?
                        <button onClick={()=>this.props.onPresPopNewNotice()} className="btn btn-outline-success ml-5"> 
                      <i className="icon-bell pr-2"></i>
                      Add New Announcement
                      </button>
                    : null  
                    }
                      </Row>
                  </div>
                  {
                    this.state.notices == undefined || this.state.notices.length == 0
                    ? <>
                    <p>No Notices available</p>
                    </>
                    : this.state.notices.map((message, index) => (
                      <>
                      <div className="body">
                    <div
                      className="timeline-item green"
                      date-is= {this.getDateFormated(message.RubixRegisterUserMessageDateAdded).date}
                    >
                      <h5>
                        {message.Title}
                      </h5>
                      <span>
                        <a>{message.Name}</a> {message.Surname}
                      </span>
                      <br></br>
                      <span>
                        {message.Residence}
                      </span>
                      <div className="msg">
                        <span>
                          {this.splitString(message.UserMessage)}
                        </span>
                        { localStorage.getItem('role') === 'admin'
                        ? null
                          
                         : <a onClick={(e) => { this.postLike(message.RubixRegisterUserMessageID, e) }} className="m-r-20">
                          <i className="icon-heart" style={{color: this.state.liked ? 'red' : 'black'}}></i> {this.state.liked ? 'Unlike' : 'Like'}
                        </a>}
                        <a
                          role="button"
                          data-toggle="collapse"
                          aria-expanded="false"
                          aria-controls="collapseComment"
                          href="#collapseComment"
                        >
                          <i className="icon-bubbles"></i> Comment
                        </a>
                        <div style={{overflow: 'auto', maxHeight: 400}}>
                          <ReactList
                            itemRenderer={this.renderItem}
                          length={this.state.comments.length}
                          type='uniform'
          />
                        </div>
                        <div className="collapse m-t-10" id="collapseComment">
                          <div className="well">
                            <form>
                              <div className="form-group">
                                <textarea
                                  rows="2"
                                  className="form-control no-resize"
                                  placeholder="Enter here for tweet..."
                                  id="comment"
                                ></textarea>
                              </div>
                              <button className="btn btn-primary" onClick={(e) => { this.submitComment(message.RubixRegisterUserMessageID, e, message) }}>
                                Submit
                              </button>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                      </>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  loginReducer,
  navigationReducer,
  analyticalReducer,
}) => ({
  email: loginReducer.email,
  menuArrowToggle: navigationReducer.menuArrowToggle,
  sparkleCardData: analyticalReducer.sparkleCardData,
  topProductDropDown: analyticalReducer.topProductDropDown,
  referralsDropDown: analyticalReducer.referralsDropDown,
  recentChatDropDown: analyticalReducer.recentChatDropDown,
  facebookShowProgressBar: analyticalReducer.facebookShowProgressBar,
  twitterShowProgressBar: analyticalReducer.twitterShowProgressBar,
  affiliatesShowProgressBar: analyticalReducer.affiliatesShowProgressBar,
  searchShowProgressBar: analyticalReducer.searchShowProgressBar,
  loadingPage: analyticalReducer.loadingPage,

  MyloadingController: navigationReducer.loadingController,
  loadingMessage: navigationReducer.loadingMessage,
});

export default connect(mapStateToProps, {
  onPresPopNewNotice,
  updateLoadingMessage,
  updateLoadingController,
  onPressThemeColor
})(Dashbord);
