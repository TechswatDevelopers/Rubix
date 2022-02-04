import React from "react";
import { Dropdown, Row } from "react-bootstrap";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import navigationReducer from "../../reducers/navigationReducer";
import PieChart from "../../components/Charts/PieChart";
import axios from "axios";
import ReactEcharts from "echarts-for-react";
import "echarts-gl";
import echarts from "echarts";
import {
  topProductOption,
  topRevenueOption,
  topRevenueMonthlyOption,
  studentIDGaugeOption,
  totalStudents,
  regGaugeOption,
  ResGaugeOption,
  nokGaugeOption,
  leaseGaugeOption,
  dataManagetOption,
  sparkleCardData,
} from "../../Data/DashbordData";

class AdminDashboard extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
    
    setTimeout(() => {
      this.getReport()
    }, 5000);

    
    this.chartPlaceID();
    this.chartTotalStudents();
    this.chartPlaceReg();
    this.chartPlaceRes();
    this.chartPlaceNOK();
    this.chartPlaceLease();
  }

      //Initial State
constructor(props) {
  super(props)
  this.state = {
    resStats: [],
    paymentStats: [],
    provinceStats: [],
    yearOfStudyStats: [],
    genderStats: [],
    documentStats: [],
  }
}

chartPlaceID = () => {
  var chartDom = document.getElementById("studentID");
  var myChart = echarts.init(chartDom);
  var option;
  option = studentIDGaugeOption;

  option && myChart.setOption(option);
};


chartTotalStudents = () => {
  var chartDom = document.getElementById("totalStudentsDonut");
  var myChart = echarts.init(chartDom);
  var option;
  option = totalStudents;

  option && myChart.setOption(option);
};

chartPlaceRes = () => {
  var chartDom = document.getElementById("resDonut");
  var myChart = echarts.init(chartDom);
  var option;
  option = ResGaugeOption;

  option && myChart.setOption(option);
};


chartPlaceReg = () => {
  var chartDom = document.getElementById("RegDonut");
  var myChart = echarts.init(chartDom);
  var option;
  option = regGaugeOption;

  option && myChart.setOption(option);
};


chartPlaceNOK= () => {
  var chartDom = document.getElementById("NOKDonut");
  var myChart = echarts.init(chartDom);
  var option;
  option = nokGaugeOption;

  option && myChart.setOption(option);
};
chartPlaceLease = () => {
  var chartDom = document.getElementById("LeaseDonut");
  var myChart = echarts.init(chartDom);
  var option;
  option = leaseGaugeOption;

  option && myChart.setOption(option);
};


    //Get Admin Report
    getReport() {
    
      const data = {
        'UserCode':  localStorage.getItem('userCode'),
        'RubixClientID': localStorage.getItem('clientID'),
        'RubixResidenceID': localStorage.getItem('resID'),
      }
      
      const requestOptions = {
        title: 'Sending Vetted Status Form',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data
      };
  
      console.log("Posted:", data)
      const postData = async () => {
        await axios.post('https://rubixapi.cjstudents.co.za:88/api/RubixAdminResidneceReports', data, requestOptions)
        .then(response=>{
          console.log("DB response: ", response)

          //Load Lists
          localStorage.setItem('resTotal', response.data.PostRubixUserData[0].TotalRegistrationsPerYear)
          localStorage.setItem('resIdDocs', response.data.PostRubixUserData[0].IDDocumentCountPerRESPercentage)
          localStorage.setItem('resProofOfResDocs', response.data.PostRubixUserData[0].ProofOfResCountPerRESPercentage)
          localStorage.setItem('resProofOfRegDocs', response.data.PostRubixUserData[0].ProofOfRegCountPerRESPercentage)
          localStorage.setItem('resNOKDocs', response.data.PostRubixUserData[0].NextOfKinCountPerRESPercentage)
          localStorage.setItem('resLeaseDocs', response.data.PostRubixUserData[0].LeaseAgreementCountPerRESPercentage)


          let tempPayment = response.data.PostRubixUserData.filter(doc => doc.PaymentMethod !== undefined)
          let tempProvince = response.data.PostRubixUserData.filter(doc => doc.RegisterUserProvince !== undefined)
          let tempYearofStudy = response.data.PostRubixUserData.filter(doc => doc.YearofStudy !== undefined)
          
          if (tempPayment.length != 0){
            this.setState({
              paymentStats: tempPayment,
              provinceStats: tempProvince,
              yearOfStudyStats: tempYearofStudy,
            })
          } else if(tempProvince.length != 0){
            this.setState({
              provinceStats: tempProvince,
            })
          } else if(tempYearofStudy.length != 0){
            this.setState({
              yearOfStudyStats: tempYearofStudy,
            })
          }

          for(let i = 0; i<= response.data.PostRubixUserData.length - 1; i++){
            let item = response.data.PostRubixUserData[i]
            if (i == 0 || i == 1){
              this.state.resStats.push(item[i])
            }
          }
          
        })
      }
      postData()
    }


  render() {
    return (
      <div
        style={{ flex: 1 }}
        onClick={() => {
          document.body.classList.remove("offcanvas-active");
        }}
      >
        <div>
          <div className="container-fluid">
            <PageHeader
              HeaderText="Admin Dashboard"
              Breadcrumb={[
                { name: "Page", navigate: "" },
              ]}
            />
            <div className="row clearfix">
              <div className=" col-lg-12 col-md-12">
                <div className=" planned_task">
                  <div className="header">
                    <h2>Admin Dashboard</h2>
                    
                  </div>
                  {/* <div className="body">
                  <PieChart />
                  </div> */}
                </div>

                
              <div className=''>
                <div className="">
                  <div className="header">
                    {/* <h2>Total Revenue</h2> */}
                    {/* <Dropdown as="ul" className="header-dropdown">
                      <Dropdown.Toggle
                        variant="success"
                        as="li"
                        id="dropdown-basic"
                      >
                        <Dropdown.Menu
                          as="ul"
                          className="dropdown-menu dropdown-menu-right"
                        >
                          <li>
                            <a>Action</a>
                          </li>
                          <li>
                            <a>Another Action</a>
                          </li>
                          <li>
                            <a>Something else</a>
                          </li>
                        </Dropdown.Menu>
                      </Dropdown.Toggle>
                    </Dropdown> */}
                  </div>
                  <div className="body">
                    <h4 className="margin-0">Documents Data</h4>
                  <div className="row">
                    <div className="col-3">
                    <div className="outer m-3">
                       <div
                      id="LeaseDonut"
                      className="inner"
                      style={{ height: 285, width: "100%", position: "absolute" }}
                    ></div>
                       <div
                      id="NOKDonut"
                      className="inner"
                      style={{ height: 285, width: "100%", position: "absolute" }}
                    ></div>
                       <div
                      id="resDonut"
                      className="inner"
                      style={{ height: 285, width: "100%", position: "absolute" }}
                    ></div>
                    <div 
                      id="RegDonut"
                      className="inner"
                      style={{ height: 285, width: "100%", position: "absolute"}}
                    ></div>
                    <div 
                      id="studentID"
                      className="inner"
                      style={{ height: 285, width: "100%", position: "absolute"}}
                    ></div>
                    <div
                      id="totalStudentsDonut"
                      className="inner"
                      style={{ height: 285, width: "100%", position: "absolute" }}
                    ></div>
                    </div>
                    </div>
                    
                  </div>

                    
                    
                  <div className="col-7">
                    <div className="outer m-7">
                       <div
                      id="LeaseDonut"
                      className="inner"
                      style={{ height: 385, width: "100%", position: "absolute" }}
                    ></div>
                       <div
                      id="NOKDonut"
                      className="inner"
                      style={{ height: 385, width: "100%", position: "absolute" }}
                    ></div>
                       <div
                      id="resDonut"
                      className="inner"
                      style={{ height: 385, width: "100%", position: "absolute" }}
                    ></div>
                    <div 
                      id="RegDonut"
                      className="inner"
                      style={{ height: 385, width: "100%", position: "absolute"}}
                    ></div>
                    <div 
                      id="studentID"
                      className="inner"
                      style={{ height: 385, width: "100%", position: "absolute"}}
                    ></div>
                    <div
                      id="totalStudentsDonut"
                      className="inner"
                      style={{ height: 385, width: "100%", position: "absolute" }}
                    ></div>
                   
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

const mapStateToProps = ({ ioTReducer, navigationReducer }) => ({
  isSecuritySystem: ioTReducer.isSecuritySystem,
  resID: navigationReducer.studentResID
});

export default connect(mapStateToProps, {})(AdminDashboard);
