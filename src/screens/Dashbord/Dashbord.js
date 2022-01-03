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
      notices: {},
      comments: [],
      likes: [],
      liked: false,
    };
  }
  componentDidMount() {
    window.scrollTo(0, 0);
    //this.loadDataCard();
    this.setState({
      cardData: [...sparkleCardData],
    });

    this.getNoticies()
    //this.chartPlace();
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
    const getData = async () => {
      const res = await axios.post('https://rubixapi.cjstudents.co.za:88/api/RubixRegisterUserCommentsAndLikes')
      console.log("Messages data", res.data.PostRubixUserData);
      this.setState({ notices: res.data.PostRubixUserData[0] })
      this.loadComments(res.data.PostRubixUserData[0].RubixRegisterUserMessageID)
    }
    getData()
  }

  //Submit Comment
  submitComment() {
    const comment = document.getElementById('comment').value;
    const data = {
      'UserComments': comment,
      'RubixRegisterUserMessageID': this.state.notices.RubixRegisterUserMessageID,
      'RubixRegisterUserID': localStorage.getItem('userID')
    }
    const requestOptions = {
      title: 'Post Comment Form',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    };
    const getData = async () => {
      const res = await axios.post('https://rubixapi.cjstudents.co.za:88/api/RubixRegisterUserComments', data, requestOptions)
      //console.log("Comment Respinse",res.data);
    }
    getData()
    window.location.reload()
  }

  //Load Comments from DB
  loadComments(postID) {
    const data = {
      'RubixRegisterUserMessageID': postID,
    }
    const requestOptions = {
      title: 'Get Comments Form',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    };
    const getData = async () => {
      const res = await axios.post('https://rubixapi.cjstudents.co.za:88/api/RubixRegisterUserCommentsGet', data, requestOptions)
      console.log("List of Comments data", res.data.PostRubixUserData)
      this.setState({
        comments: res.data.PostRubixUserData
      })
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
      const res = await axios.post('https://rubixapi.cjstudents.co.za:88/api/RubixRegisterUserLikesGet', data, requestOptions)
      //console.log("List of likes data",res.data);
      const tempLikes = res.data.PostRubixUserData
      if (tempLikes.length == 0 || tempLikes == undefined) {

      } else {
        this.setState({
          likes: res.data.PostRubixUserData
        })
        //Check if post is liked
        const liked = tempLikes.filter(doc => doc.RubixRegisterUserID == localStorage.getItem('userID'))
        if (liked[0].LikedStatus) {
          this.setState({
            liked: true
          })
        }
        //console.log("Liked: ", liked)
      }

    }
    getData()
  }

  //Post Like
  postLike(postID) {
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
    const getData = async () => {
      const res = await axios.post('https://rubixapi.cjstudents.co.za:88/api/RubixRegisterUserLikes', data, requestOptions)
      console.log("My likes Response", res.data);
    }
    getData()
    window.location.reload()

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
    if (loadingPage) {
      return (
        <div className="page-loader-wrapper">
          <div className="loader">
            <div className="m-t-30">
              <img src={LogoiCON} width="170" height="70" alt="Lucid" />
            </div>
            <p>Please wait...</p>
          </div>
        </div>
      );
    }
    return (
      <div
        onClick={() => {
          document.body.classList.remove("offcanvas-active");
        }}
      >
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
                    <h2>Announcements</h2>
                  </div>
                  <div className="body">
                    <div
                      className="timeline-item green"
                      date-is="21-12-2021"
                    >
                      <h5>
                        {this.state.notices.Title}
                      </h5>
                      <span>
                        <a>{this.state.notices.Name}</a> {this.state.notices.Surname}
                      </span>
                      <br></br>
                      <span>
                        {this.state.notices.Residence}
                      </span>
                      <div className="msg">
                        <p>
                          {this.state.notices.UserMessage}
                        </p>
                        <a onClick={() => { this.postLike(this.state.notices.RubixRegisterUserMessageID) }} className="m-r-20">
                          <i className="icon-heart"></i> {this.state.liked ? 'Unlike' : 'Like'}
                        </a>
                        <a
                          role="button"
                          data-toggle="collapse"
                          aria-expanded="false"
                          aria-controls="collapseComment"
                          href="#collapseComment"
                        >
                          <i className="icon-bubbles"></i> Comment
                        </a>
                        <div>
                          <ReactList
                            itemRenderer={this.renderItem}
                          length={this.state.comments.length}
                          type='uniform'
          />

                          {/* {this.state.comments.map((comment, index) => (
                            <div>

                              <span><strong>{comment.NameAndSurname}:</strong></span>
                              <span>   {comment.UserComments}</span>

                            </div>
                          ))} */}
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
                              <button className="btn btn-primary" onClick={() => { this.submitComment() }}>
                                Submit
                              </button>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
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
});

export default connect(mapStateToProps, {
  /*  toggleMenuArrow,
   loadSparcleCard,
   onPressTopProductDropDown,
   onPressReferralsDropDown,
   onPressRecentChatDropDown,
   onPressDataManagedDropDown,
   facebookProgressBar,
   twitterProgressBar,
   affiliatesProgressBar,
   searchProgressBar, */
})(Dashbord);
