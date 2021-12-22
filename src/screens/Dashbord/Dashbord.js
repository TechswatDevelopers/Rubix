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

 /*  chartPlace = () => {
    var chartDom = document.getElementById("topsaleDonut");
    var myChart = echarts.init(chartDom);
    var option;
    option = saleGaugeOption;

    option && myChart.setOption(option);
  }; */
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
  getNoticies(){
    const getData = async () => {
      const res = await axios.post('https://rubixapi.cjstudents.co.za:88/api/RubixRegisterUserCommentsAndLikes')
      console.log("Messages data",res.data.PostRubixUserData);
      this.setState({notices: res.data.PostRubixUserData[0] })
    }
    getData()
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
                    <h2>Noticeboard</h2>
                  </div>
                  <div className="body">
                    <div
                      className="timeline-item green"
                      date-is="20-04-2018 - Today"
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
                        <a className="m-r-20">
                          <i className="icon-heart"></i> Like
                        </a>
                        <a
                          role="button"
                          data-toggle="collapse"
                          aria-expanded="false"
                          aria-controls="collapseExample"
                        >
                          <i className="icon-bubbles"></i> Comment
                        </a>
                        <div className="collapse m-t-10" id="collapseExample">
                          <div className="well">
                            <form>
                              <div className="form-group">
                                <textarea
                                  rows="2"
                                  className="form-control no-resize"
                                  placeholder="Enter here for tweet..."
                                ></textarea>
                              </div>
                              <button className="btn btn-primary">
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
