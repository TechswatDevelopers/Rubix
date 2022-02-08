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
  paymentGaugeOption,
  dataManagetOption,
  sparkleCardData,
} from "../../Data/DashbordData";

class AdminDashboard extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);

    setTimeout(() => {
      this.getReport()
    }, 5000);

    //Load First Donut
    this.chartPlaceID();
    this.chartTotalStudents();
    this.chartPlaceReg();
    this.chartPlaceRes();
    this.chartPlaceNOK();
    this.chartPlaceLease();

    //Load Second Donut
    //this.chartPaymentDonut();
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
      colors: ['#1ebbd7', '#212121', '#ffa500', '#5743bb', '#0000ff', '#e69138', '#f603a3'],
    }
  }

  //Create Donut
  createDonutInfoCard(data, centerValue, chartDOM, radius){
    //console.log("Creating pie chart for: ", data, "Center: ", centerValue, "Chart DOM: ", chartDOM)
    const donut  = {
      title: {
        text: centerValue,
        x: "center",
        y: "center",
        textStyle: {
          color: "rgb(255, 255, 255)",
          fontFamily: "Arial",
          fontSize: 15,
          fontWeight: "bolder",
        },
      },
      grid: {
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
      },
      tooltip: {
        show: false,
        formatter: function (params, ticket, callback) {
          return '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#212121;"></span>63';
        },
      },
      series: [
        {
          type: "pie",
          startAngle: 215,
          clockWise: 1,
          radius: radius,
          itemStyle: {
            normal: {
              label: { show: true },
              labelLine: { show: false },
            },
          },
          data: data,
        },
      ],
    }
    
    this.createChart(chartDOM, donut)
    return donut
  }

  //Create Chart
  createChart(chartDOM, gauge) {
    var chartDom = document.getElementById(chartDOM);
    var myChart = echarts.init(chartDom);
    var option;
    option = gauge;

    option && myChart.setOption(option);
  }

  //Load Donuts
  chartPaymentDonut = () => {
    var chartDom = document.getElementById("PaymentDonut");
    var myChart = echarts.init(chartDom);
    var option;
    option = paymentGaugeOption;

    option && myChart.setOption(option);
  };

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

  chartPlaceNOK = () => {
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
      'UserCode': localStorage.getItem('userCode'),
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
        .then(response => {
          console.log("DB response: ", response)

          //Load Lists
          localStorage.setItem('resTotal', response.data.PostRubixUserData[0].TotalRegistrationsPerYear)
          localStorage.setItem('resIdDocs', response.data.PostRubixUserData[0].IDDocumentCountPerRESPercentage)
          localStorage.setItem('resProofOfResDocs', response.data.PostRubixUserData[0].ProofOfResCountPerRESPercentage)
          localStorage.setItem('resProofOfRegDocs', response.data.PostRubixUserData[0].ProofOfRegCountPerRESPercentage)
          localStorage.setItem('resNOKDocs', response.data.PostRubixUserData[0].NextOfKinCountPerRESPercentage)
          localStorage.setItem('resLeaseDocs', response.data.PostRubixUserData[0].LeaseAgreementCountPerRESPercentage)

          //Create Donuts
          this.createDonutInfoCard(
            //Data
            [
            {
              value: response.data.PostRubixUserData[2].TotalRegistrationsPerYear,
              itemStyle: {
                color: "#ffa500",
                emphasis: {
                  color: "#ffa500",
                },
              },
            },
           
          ],
          //Center
          response.data.PostRubixUserData[2].TotalRegistrationsPerYear,

          //Attribute ID
         'TotalDonut',

         //Radius
         [0, 30]

          )
          

          //Payment Method Chart

          let tempPayment = response.data.PostRubixUserData.filter(doc => doc.PaymentMethod !== undefined)
          let tempPyamentChartData = []
          tempPayment.forEach((payment, index) =>{
            //Add entry to data  List
            tempPyamentChartData.push(
              {
                value: payment.PMCountPerResCountPerRESPercentage,
                itemStyle: {
                  color: this.state.colors[index],
                  emphasis: {
                    color: this.state.colors[index],
                  },
                },
              },

            )
          })
          this.createDonutInfoCard(
            //Data
            tempPyamentChartData,
          //Center
          response.data.PostRubixUserData[2].PMCountPerResCountPerRESPercentage,

          //Attribute ID
         'PaymentDonut',

         //Radius
         [45, 55]

          )

          let tempProvince = response.data.PostRubixUserData.filter(doc => doc.RegisterUserProvince !== undefined)

          let tempProvinceChartData = []
          tempProvince.forEach((province, index) =>{
            tempProvinceChartData.push(
              {
                value: province.ProvinceCountPerResCountPerRESPercentage,
                itemStyle: {
                  color: this.state.colors[index],
                  emphasis: {
                    color: this.state.colors[index],
                  },
                },
              },)
          })
          this.createDonutInfoCard(
            //Data
            tempProvinceChartData,
          //Center
          '',

          //Attribute ID
         'ProvinceDonut',

         //Radius
         [65, 75]

          )

          let tempYearofStudy = response.data.PostRubixUserData.filter(doc => doc.YearofStudy !== undefined)
          let tempYOSChartData = []
          tempYearofStudy.forEach((year, index) =>{
            tempYOSChartData.push(
              {
                value: year.YoSCountPerResCountPerRESPercentage,
                itemStyle: {
                  color: this.state.colors[index],
                  emphasis: {
                    color: this.state.colors[index],
                  },
                },
              },)
          })
          this.createDonutInfoCard(
            //Data
            tempYOSChartData,
          //Center
          '',

          //Attribute ID
         'YearOfStudyDonut',

         //Radius
         [85, 95]
          )

          let tempUniversity = response.data.PostRubixUserData.filter(doc => doc.UniversityName !== undefined)
          let universiyChart = []
          tempUniversity.forEach((university, index) =>{
            universiyChart.push(
              {
                value: university.UniCountPerResCountPerRESPercentage,
                itemStyle: {
                  color: this.state.colors[index],
                  emphasis: {
                    color: this.state.colors[index],
                  },
                },
              },)
          })
          this.createDonutInfoCard(
            //Data
            universiyChart,
          //Center
          '',

          //Attribute ID
         'GenderDonut',

         //Radius
         [125, 135]
          )

          let tempGender = response.data.PostRubixUserData.filter(doc => doc.Gender !== undefined)
          let genderChart = []
          tempGender.forEach((gender, index) =>{
            genderChart.push(
              {
                value: gender.GenderCountPerResCountPerRESPercentage,
                itemStyle: {
                  color: this.state.colors[index],
                  emphasis: {
                    color: this.state.colors[index],
                  },
                },
              },)
          })
          this.createDonutInfoCard(
            //Data
            genderChart,
          //Center
          '',

          //Attribute ID
         'UniversityDonut',

         //Radius
         [105, 115]
          )

          if (tempPayment.length != 0) {
            this.setState({
              paymentStats: tempPayment,
              provinceStats: tempProvince,
              yearOfStudyStats: tempYearofStudy,
            })
          } else if (tempProvince.length != 0) {
            this.setState({
              provinceStats: tempProvince,
            })
          } else if (tempYearofStudy.length != 0) {
            this.setState({
              yearOfStudyStats: tempYearofStudy,
            })
          }

          for (let i = 0; i <= response.data.PostRubixUserData.length - 1; i++) {
            let item = response.data.PostRubixUserData[i]
            if (i == 0 || i == 1) {
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
              <div className=" col-lg-12 col-md-15">
                <div className="header">
                  <h2>Admin Dashboard</h2>
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
                          style={{ height: 285, width: "100%", position: "absolute" }}
                        ></div>
                        <div
                          id="studentID"
                          className="inner"
                          style={{ height: 285, width: "100%", position: "absolute" }}
                        ></div>
                        <div
                          id="totalStudentsDonut"
                          className="inner"
                          style={{ height: 285, width: "100%", position: "absolute" }}
                        ></div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            <div className="row clearfix">
              <div className="body content-center">
                <div className="">
                  <div className="outer m-7">
                    <div
                      id="PaymentDonut"
                      className="inner"
                      style={{ height: 485, width: "100%", position: "absolute" }}
                    ></div>
                    <div
                      id="ProvinceDonut"
                      className="inner"
                      style={{ height: 485, width: "100%", position: "absolute" }}
                    ></div>
                    <div
                      id="YearOfStudyDonut"
                      className="inner"
                      style={{ height: 485, width: "100%", position: "absolute" }}
                    ></div>
                    <div
                      id="UniversityDonut"
                      className="inner"
                      style={{ height: 485, width: "100%", position: "absolute" }}
                    ></div>
                    <div
                      id="GenderDonut"
                      className="inner"
                      style={{ height: 485, width: "100%", position: "absolute" }}
                    ></div>
                    <div
                      id="TotalDonut"
                      className="inner"
                      style={{ height: 485, width: "100%", position: "absolute" }}
                    ></div>
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
