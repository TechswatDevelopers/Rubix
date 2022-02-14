import React from "react";
import { Dropdown, Row } from "react-bootstrap";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import navigationReducer from "../../reducers/navigationReducer";
import DocumentsChart from "../../components/Charts/DocumentsChart";
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
  createDonutInfoCard(data, centerValue, chartDOM, radius, legend, position){
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
      color: ["#FF7F50", "#FF69B4", "#20c997", "#e83e8c", "#6f42c1", "#ffc107", "#007bff", "#F0F8FF", "#B22222", "#FFFACD"],
      grid: {
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
      },
      tooltip: {
        trigger: "item",
        formatter: "{b} : {c} ({d}%)",
      },
      legend: legend,
      series: [
        {
          type: "pie",
          startAngle: 270,
          clockWise: 1,
          radius: radius,
          itemStyle: {
            normal: {
              label: { show: false },
              labelLine: { show: false },
            },
          },
          data: data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
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
              name: 'Total Students'
            },
           
          ],
          //Center
          response.data.PostRubixUserData[2].TotalRegistrationsPerYear,

          //Attribute ID
         'TotalDonut',

         //Radius
         [0, 30],

         //Legend
        null 
     /*  {
        orient: "vertical",
        left: "left",
        data: [
          'Total Students'
        ],
      }, */
         
          )

          //Payment Method Chart
          let tempPayment = response.data.PostRubixUserData.filter(doc => doc.PaymentMethod !== undefined)
          let tempPyamentChartData = []
          let tempPaymentLegendData = []
          tempPayment.forEach((payment, index) =>{
            //Add to Legend
            tempPaymentLegendData.push(
              payment.PaymentMethod
            )
            //Add entry to data  List
            tempPyamentChartData.push(
              {
                value: payment.PMCountPerResCountPerRESPercentage,
                name: payment.PaymentMethod
              },

            )
          })
          console.log('TempPaymentsLegend: ', tempPaymentLegendData)
          this.createDonutInfoCard(
            //Data
            tempPyamentChartData,

          //Center
          response.data.PostRubixUserData[2].PMCountPerResCountPerRESPercentage,

          //Attribute ID
         'PaymentDonut',

         //Radius
         [45, 55],
         
         //Legend
         {
          orient: "vertical",
          left: "right",
          data: tempPaymentLegendData,
        },
         
          )

          let tempProvince = response.data.PostRubixUserData.filter(doc => doc.RegisterUserProvince !== undefined)
          let tempProvinceChartData = []
          let tempProvinceLegendData = []
          tempProvince.forEach((province, index) =>{
            //Add to Legend
            tempProvinceLegendData.push(
              province.RegisterUserProvince
            )
            tempProvinceChartData.push(
              {
                value: province.ProvinceCountPerResCountPerRESPercentage,
                name: province.RegisterUserProvince
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
         [65, 75],
         
         //Legend
         {
          orient: "vertical",
          left: "left",
          data: tempProvinceLegendData,
        },
         

          )
          console.log('TempProvinceLegend: ', tempProvinceLegendData)

          let tempYearofStudy = response.data.PostRubixUserData.filter(doc => doc.YearofStudy !== undefined)
          let tempYOSChartData = []
          let tempYOSLegend = []
          tempYearofStudy.forEach((year, index) =>{
            //Add to Legend
            tempYOSLegend.push(
              year.YearofStudy
            )
            tempYOSChartData.push(
              {
                value: year.YoSCountPerResCountPerRESPercentage,
                name: year.YearofStudy,
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
         [85, 95],
         
         //Legend
         {
          orient: "horizontal",
          top: "top",
          data: tempYOSLegend,
        },
         
         
          )
          console.log('TempYOSLegend: ', tempYOSLegend)

          let tempUniversity = response.data.PostRubixUserData.filter(doc => doc.UniversityName !== undefined)
          let universiyChart = []
          let universiyLegend = []
          tempUniversity.forEach((university, index) =>{
            //Add to Legend
            universiyLegend.push(
              university.UniversityName
            )
            universiyChart.push(
              {
                value: university.UniCountPerResCountPerRESPercentage,
                name: university.UniversityName,
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
         [125, 135],
         
         //Legend
         {
          orient: "vertical",
          //left: "right",
          bottom: 'bottom',
          data: universiyLegend,
        },
         
          )
          console.log('TempUniLegend: ', universiyLegend)

          let tempGender = response.data.PostRubixUserData.filter(doc => doc.Gender !== undefined)
          let genderChart = []
          let genderLegend = []
          tempGender.forEach((gender, index) =>{
            //Add to Legend
            genderLegend.push(
              gender.Gender
            )
            genderChart.push(
              {
                value: gender.GenderCountPerResCountPerRESPercentage,
                name: gender.Gender,
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
         [105, 115],
         
         //Legend
         {
          orient: "horizontal",
          left: "right",
          data: genderLegend,
        },
         
          )
          console.log('TempGenderLegend: ', genderLegend)

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
        <div className="container-fluid">
          <div >
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
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                  <div className="card" style={{ height: 485, width: "100%", }}>
                    <div
                      id="PaymentDonut"
                      className=""
                      style={{ height: 485, width: "100%", position: "absolute" }}
                    ></div>
                    <div
                      id="ProvinceDonut"
                      className=""
                      style={{ height: 485, width: "100%", position: "absolute" }}
                    ></div>
                    <div
                      id="YearOfStudyDonut"
                      className=""
                      style={{ height: 485, width: "100%", position: "absolute" }}
                    ></div>
                    <div
                      id="UniversityDonut"
                      className=""
                      style={{ height: 485, width: "100%", position: "absolute" }}
                    ></div>
                    <div
                      id="GenderDonut"
                      className=""
                      style={{ height: 485, width: "100%", position: "absolute" }}
                    ></div>
                    <div
                      id="TotalDonut"
                      className=""
                      style={{ height: 485, width: "100%", position: "absolute" }}
                    ></div>
                  </div>
                </div>

                <DocumentsChart/>

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
