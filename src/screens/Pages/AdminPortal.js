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
      legend: [],
      studentDocSeriess: [],
      colors: ['#1ebbd7', '#212121', '#ffa500', '#5743bb', '#0000ff', '#e69138', '#f603a3'],
    }
  }

  //Create Donut
  createDonutInfoCard(data, centerValue, chartDOM, radius, legend, colors){
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
      color: colors,
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

  //Add Series
  createSeriesGraph(key, series, attributeID, legend){
    const donut  = {
      title: {
        text: key,
        x: "center",
        y: "center",
        textStyle: {
          color: "rgb(255, 255, 255)",
          fontFamily: "Arial",
          fontSize: 15,
          fontWeight: "bolder",
        },
      },
      //color: colors,
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
      series: series,
    }
    this.createChart(attributeID, donut)
  }
  //Add Series
  createMultipleSeriesGraph(key, series, attributeID, legend, colors){
    const donut  = {
      title: {
        text: key,
        x: "center",
        y: "center",
        textStyle: {
          color: "rgb(255, 255, 255)",
          fontFamily: "Arial",
          fontSize: 15,
          fontWeight: "bolder",
        },
      },
      color: colors,
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
      series: series,
    }
    
    this.createChart(attributeID, donut)
  }

  //Create Chart
  createChart(chartDOM, gauge) {
    var chartDom = document.getElementById(chartDOM);
    var myChart = echarts.init(chartDom);
    var option;
    option = gauge;

    option && myChart.setOption(option);
  }

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

          //Create Student Documents Series Chart
          //Add Total Students


          //Create Documents Data Donuts
          //Create Student Data Donuts
          let tempDocLegendList = []
          const tempData = [
            {
              value: response.data.PostRubixUserData[0].TotalRegistrationsPerYear,
              name: 'Total Students',
              itemStyle: {
                color: "#FF3366",
                emphasis: {
                  color: "#FF3366",
                },
              },
            },
           
          ]
          this.state.studentDocSeriess.push(
              {
                type: "pie",
                startAngle: 270,
                clockWise: 1,
                radius: [0, 30],
                itemStyle: {
                  normal: {
                    label: { show: false },
                    labelLine: { show: false },
                  },
                },
                data: tempData,
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)",
                  },
                },
              }
          )

          //Add StudentID Info
          const tempStudentIDLegend = ['Student ID Document', 'No Student ID Document']
          const tempStudentID = [
            {
              value: response.data.PostRubixUserData[0].IDDocumentCountPerRESPercentage,
              name: 'Student ID Document',
              itemStyle: {
                color: "#FFCC00",
                emphasis: {
                  color: "#FFCC00",
                },
              },
            },
            {
              value: 100 - response.data.PostRubixUserData[0].IDDocumentCountPerRESPercentage,
              name: 'No Student ID Document',
              itemStyle: {
                color: "#EEEEEE",
                emphasis: {
                  color: "#EEEEEE",
                },
              },
            }
           
          ]
          this.state.studentDocSeriess.push(
            {
              type: "pie",
              startAngle: 270,
              clockWise: 1,
              radius: [40, 60],
              itemStyle: {
                normal: {
                  label: { show: false },
                  labelLine: { show: false },
                },
              },
              data: tempStudentID,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                },
              },
            }
        )
        tempDocLegendList.push(tempStudentIDLegend)

        //Student Proof of Residence
        const tempStudentPORes = [
          {
            value: response.data.PostRubixUserData[0].ProofOfResCountPerRESPercentage,
            name: 'Proof of Residence',
            itemStyle: {
              color: "#00FF33",
              emphasis: {
                color: "#00FF33",
              },
            },
          },
          {
            
            value: 100 - response.data.PostRubixUserData[0].ProofOfResCountPerRESPercentage,
            name: 'No Proof of Residence',
            itemStyle: {
              color: "#EEEEEE",
              emphasis: {
                color: "#EEEEEE",
              },
            },
          }
         
        ]
        
        this.state.studentDocSeriess.push(
          {
            type: "pie",
            startAngle: 270,
            clockWise: 1,
            radius: [70, 90],
            itemStyle: {
              normal: {
                label: { show: false },
                labelLine: { show: false },
              },
            },
            data: tempStudentPORes,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          }
      )

      //Student Proof of Registration
      const tempStudentPOReg = [
        {
          value: response.data.PostRubixUserData[0].ProofOfRegCountPerRESPercentage,
          name: 'Proof of Regitration',
          itemStyle: {
            color: "#3399FF",
            emphasis: {
              color: "#3399FF",
            },
          },
        },
        {
          
          value: 100 - response.data.PostRubixUserData[0].ProofOfRegCountPerRESPercentage,
          name: 'No Proof of Regitration',
          itemStyle: {
            color: "#EEEEEE",
            emphasis: {
              color: "#EEEEEE",
            },
          },
        }
       
      ]

      this.state.studentDocSeriess.push(
        {
          type: "pie",
          startAngle: 270,
          clockWise: 1,
          radius: [100, 120],
          itemStyle: {
            normal: {
              label: { show: false },
              labelLine: { show: false },
            },
          },
          data: tempStudentPOReg,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        }
    )
//Student Next of Kin ID
          const tempStudentNOKID = [
            {
              value: response.data.PostRubixUserData[0].IDDocumentCountPerRESPercentage,
              name: 'Next of Kin ID',
              itemStyle: {
                color: "#FF3333",
                emphasis: {
                  color: "#FF3333",
                },
              },
            },
            {
              value: 100 - response.data.PostRubixUserData[0].IDDocumentCountPerRESPercentage,
              name: 'No Next of Kin ID',
              itemStyle: {
                color: "#EEEEEE",
                emphasis: {
                  color: "#EEEEEE",
                },
              },
            }
           
          ]

          this.state.studentDocSeriess.push(
            {
              type: "pie",
              startAngle: 270,
              clockWise: 1,
              radius: [130, 150],
              itemStyle: {
                normal: {
                  label: { show: false },
                  labelLine: { show: false },
                },
              },
              data: tempStudentNOKID,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                },
              },
            }
        )

          this.createSeriesGraph(response.data.PostRubixUserData[0].TotalRegistrationsPerYear, this.state.studentDocSeriess, 'NewDocDonut', tempDocLegendList)

          //Res Information Chart
          let tempSeriesList = []
          let tempColorsList = []
          let tempLegendList = []

          //Total Student
          tempSeriesList.push(
              {
                type: "pie",
                startAngle: 270,
                clockWise: 1,
                radius: [0, 30],
                itemStyle: {
                  normal: {
                    label: { show: false },
                    labelLine: { show: false },
                  },
                },
                data: tempData,
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)",
                  },
                },
              }
          )

          //Payment Method Chart
          let tempPayment = response.data.PostRubixUserData.filter(doc => doc.PaymentMethod !== undefined)
          let tempPyamentChartData = []
          let tempPaymentLegendData = []
          const PaymentPallete = 
          ["#99FF66", "#66CC66", "#00FF33", "#00CC66", "#009900", "#33EE33"]
          tempPayment.forEach((payment, index) =>{
            //Add to Legend
            tempPaymentLegendData.push(
              payment.PaymentMethod
            )
            tempLegendList.push(tempPaymentLegendData)
            //Add entry to data  List
            tempPyamentChartData.push(
              {
                value: payment.PMCountPerResCountPerRESPercentage,
                name: payment.PaymentMethod,
                itemStyle: {
                  color: PaymentPallete[index],
                  emphasis: {
                    color: PaymentPallete[index],
                  },
                },
              },

            )
          })
          tempColorsList.push({PaymentPallete})
          
          //Total Student
          tempSeriesList.push(
            {
              type: "pie",
              startAngle: 270,
              clockWise: 1,
              radius: [40, 60],
              itemStyle: {
                normal: {
                  label: { show: false },
                  labelLine: { show: false },
                },
              },
              data: tempPyamentChartData,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                },
              },
            }
        )

        //Provinces
        let tempProvince = response.data.PostRubixUserData.filter(doc => doc.RegisterUserProvince !== undefined)
          let tempProvinceChartData = []
          let tempProvinceLegendData = []
          const ProvincePallete = 
          ["#3399FF", "#66CCFF", "#33CCFF", "#00CCCC", "#3399CC", "#0033CC", "#0066CC", "#0033FF", "#3333CC"]

          tempProvince.forEach((province, index) =>{
            //Add to Legend
            tempProvinceLegendData.push(
              province.RegisterUserProvince
            )
           // tempLegendList.push({tempProvinceLegendData})
            tempProvinceChartData.push(
              {
                value: province.ProvinceCountPerResCountPerRESPercentage,
                name: province.RegisterUserProvince,
                itemStyle: {
                  color: ProvincePallete[index],
                  emphasis: {
                    color: ProvincePallete[index],
                  },
                },
              },)
          })
          tempColorsList.push({ProvincePallete})
          tempSeriesList.push(
            {
              type: "pie",
              startAngle: 270,
              clockWise: 1,
              radius: [70, 90],
              itemStyle: {
                normal: {
                  label: { show: false },
                  labelLine: { show: false },
                },
              },
              data: tempProvinceChartData,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                },
              },
            }
        )

        //Year of Study
          let tempYearofStudy = response.data.PostRubixUserData.filter(doc => doc.YearofStudy !== undefined)
          let tempYOSChartData = []
          let tempYOSLegend = []
          const YOSColorPallete = ["#FFCC00", "#FF9933", "#FF6633", "#CC6600", "#CC6633"]

          tempYearofStudy.forEach((year, index) =>{
            //Add to Legend
            tempYOSLegend.push(
              year.YearofStudy
            )
            tempYOSChartData.push(
              {
                value: year.YoSCountPerResCountPerRESPercentage,
                name: year.YearofStudy,
                itemStyle: {
                  color: YOSColorPallete[index],
                  emphasis: {
                    color: YOSColorPallete[index],
                  },
                },
              },)
          })
          tempColorsList.push({YOSColorPallete})

          tempSeriesList.push(
            {
              type: "pie",
              startAngle: 270,
              clockWise: 1,
              radius: [100, 120],
              itemStyle: {
                normal: {
                  label: { show: false },
                  labelLine: { show: false },
                },
              },
              data: tempYOSChartData,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                },
              },
            }
        )


        //Universities
        let tempUniversity = response.data.PostRubixUserData.filter(doc => doc.UniversityName !== undefined)
          let universiyChart = []
          let universiyLegend = []
          const UniPallete = ["#FFCCFF", "#FF66FF", "#FF00FF", "#FF3399", "#FF00CC", "#9933CC", "#990099", "#9966CC", "#9933FF", "#663399"]

          tempUniversity.forEach((university, index) =>{
            //Add to Legend
            universiyLegend.push(
              university.UniversityName
            )
            universiyChart.push(
              {
                value: university.UniCountPerResCountPerRESPercentage,
                name: university.UniversityName,
                itemStyle: {
                  color: UniPallete[index],
                  emphasis: {
                    color: UniPallete[index],
                  },
                },
              },)
          })
          tempColorsList.push({UniPallete})

          tempSeriesList.push(
            {
              type: "pie",
              startAngle: 270,
              clockWise: 1,
              radius: [130, 150],
              itemStyle: {
                normal: {
                  label: { show: false },
                  labelLine: { show: false },
                },
              },
              data: universiyChart,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                },
              },
            }
        )

        //Gender Chart
        let tempGender = response.data.PostRubixUserData.filter(doc => doc.Gender !== undefined)
          let genderChart = []
          let genderLegend = []
          const genderPallete = ["#FF3333", "#CC0033", "#990033"]

          
          tempGender.forEach((gender, index) =>{
            //Add to Legend
            genderLegend.push(
              gender.Gender 
            )
            genderChart.push(
              {
                value: gender.GenderCountPerResCountPerRESPercentage,
                name: gender.Gender,
                itemStyle: {
                  color: genderPallete[index],
                  emphasis: {
                    color: genderPallete[index],
                  },
                },
              },)
          })
          tempColorsList.push({genderPallete})

          tempSeriesList.push(
            {
              type: "pie",
              startAngle: 270,
              clockWise: 1,
              radius: [160, 180],
              itemStyle: {
                normal: {
                  label: { show: false },
                  labelLine: { show: false },
                },
              },
              data: genderChart,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                },
              },
            }
        )

          this.createMultipleSeriesGraph(response.data.PostRubixUserData[0].TotalRegistrationsPerYear, 
            tempSeriesList, 'TestDocDonut',
             tempLegendList, 
             tempColorsList)


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
                  <h4 className="margin-0">Student Data</h4>
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                  <div className="card p-4" style={{ height: 520, width: "100%", position: "relative" }}>
                  <div
                          id="TestDocDonut"
                          className="inner"
                          style={{ height: 485, width: "100%", position: "absolute" }}
                        ></div>
                  </div>
                </div>

                <div className="col-lg-12 col-md-12">
        <div className="card" style={{ height: 520, width: "100%", position: "relative" }}>
        <div className="header">
                  <h4>Documents Data</h4>
                </div>
          <div className="body content-center">
          <div
                          id="NewDocDonut"
                          className="inner"
                          style={{ height: 485, width: "100%", position: "absolute" }}
                        ></div>
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
