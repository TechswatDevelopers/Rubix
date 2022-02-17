import React from "react";
import { Dropdown, Row } from "react-bootstrap";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import navigationReducer from "../../reducers/navigationReducer";
import DocumentsChart from "../../components/Charts/DocumentsChart";
import axios from "axios";
import ReactEcharts from "echarts-for-react";
import "echarts-gl";
import StackedAreaChart from "../../components/Charts/StackedAreaChart";
import echarts from "echarts";
import {updateResidenceID,
  updateLoadingMessage,
  updateLoadingController,
} from "../../actions"
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
    this.props.updateLoadingMessage("Loading Data, Please wait...");
    this.props.updateLoadingController(true);

    //Set timer for loading screen
    setTimeout(() => {
      this.props.updateLoadingController(false);
    }, 6000);

    if(localStorage.getItem('adminLevel') == 2 || localStorage.getItem('adminLevel') == '2'){

    } else {
      setTimeout(() => {
        this.getReport(localStorage.getItem('resID'))
      }, 2000);
    }


    const fetchData = async() =>{
      //Populate Residence list
      await fetch('https://rubixapi.cjstudents.co.za:88/api/RubixResidences/' + localStorage.getItem('clientID'))
      .then(response => response.json())
      .then(data => {
          console.log("data is ", data)
          this.setState({resList: data.data})
          });
      } 
      fetchData();
    //Load First Donut
    //Load Second Donut
    //this.chartPaymentDonut();
  }

  //Initial State
  constructor(props) {
    super(props)
    this.state = {
      resCapacity: 0,
      signedLease: 0,
      resBedsAllocated: 0,
      resStats: [],
      paymentStats: [],
      provinceStats: [],
      yearOfStudyStats: [],
      genderStats: [],
      documentStats: [],
      legend: [],
      studentDocSeriess: [],
      resList: [],
      isShow: localStorage.getItem('adminLevel') == 2 || localStorage.getItem('adminLevel') == 2 ? false : true,
      colors: ['#1ebbd7', '#212121', '#ffa500', '#5743bb', '#0000ff', '#e69138', '#f603a3'],
    }
  }


  //Get Line Graph Stats
  getGraph(resID){
    const data = {
      'UserCode': localStorage.getItem('userCode'),
      'RubixClientID': localStorage.getItem('clientID'),
      'RubixResidenceID': resID,
    }

    const requestOptions = {
      title: 'Sending Vetted Status Form',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    }
    console.log("Posted Data: ", data)

    const postData = async () => {
      await axios.post('https://rubixapi.cjstudents.co.za:88/api/RubixAdminReport', data, requestOptions)
      .then(response =>{
        console.log("Response: ", response)
        let registrationPerYear = response.data.PostRubixUserData.filter(doc => doc.TotalRegistrationsPerDay !== undefined)
        console.log("Registration per year: ", registrationPerYear)
        let registrationLegend = [], regMonth = [], registrationChartData = [], dataset = []
        //Populate Graph Info
        registrationPerYear.forEach((registration, index) =>{
          //Add to Legend
         /*  registrationLegend.push(
            registration.dayofweek
          ) */
          regMonth.push(
            registration.Month
          )
          //Add entry to data  List
          dataset.push(registration.TotalRegistrationsPerDay)
          
        })

        registrationChartData = {
          name: "Students Registered",
          type: "line",
          stack: "",
          areaStyle: {},
          data: dataset,
        }
        console.log('Legend: ', registrationChartData)
        this.createLineGraph(registrationLegend, registrationChartData)
      })
    } 
    postData()
  }

  //Create Line Graph
  createLineGraph(legend, series){
    const LineEchart = {
      title: {
        text: "",
      },
      color: ["#20c997", "#e83e8c", "#6f42c1", "#ffc107", "#007bff"],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985",
          },
        },
      },
      legend: legend,
      toolbox: {
        // feature: {
        //     saveAsImage: {}
        // }
      },
      grid: {
        left: "3%",
        right: "1%",
        bottom: "2%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          boundaryGap: false,
          axisLabel: {
            color: "rgba(0,0,0,0.4)",
          },
          axisLine: {
            lineStyle: {
              color: "rgba(0,0,0,0.5)",
            },
          },
          data: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thersday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
        },
      ],
      yAxis: [
        {
          type: "value",
          axisLabel: {
            color: "rgba(0,0,0,0.4)",
          },
          axisLine: {
            lineStyle: {
              color: "rgba(0,0,0,0.5)",
            },
          },
          splitLine: {
            show: false,
          },
        },
      ],
      series: series,
    }
    //this.createChart("LineChart", LineEchart)

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
        formatter: "{b} : {c} Students ({d}%)",
      },
      legend: {
        onClick: function(event, legendItem) {},
        orient: "vertical",
        left: "left",
            item: {
              onChange:  null,
              paddingY: 20
          },
            legend},
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
        formatter: "{b} : {c} Students ({d}%)",
      },
      legend: {
        onClick:  (e)=> {
          e.stopPropagation();
      },
      spacing: 30,
        orient: "vertical",
        left: "left",
            item: {
              paddingX: 10,
              
          },
            legend},
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
  getReport(resID) {
    //Set Loading Screen ON
    this.props.updateLoadingController(true);
    this.props.updateLoadingMessage("Loading Data, Please wait...");
    const data = {
      'UserCode': localStorage.getItem('userCode'),
      'RubixClientID': localStorage.getItem('clientID'),
      'RubixResidenceID': resID,
    }

    const requestOptions = {
      title: 'Fetch Reports Form',
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

          let totalCapList = response.data.PostRubixUserData.filter(doc => doc.TotalCapacityPerRes !== undefined)
          let bedsTakenList = response.data.PostRubixUserData.filter(doc => doc.TotalbedsTaken !== undefined)
          let signedLease = response.data.PostRubixUserData.filter(doc => doc.lease_agreement_Count !== undefined)

          if(totalCapList != null && totalCapList.length != 0){
            this.setState({
              resCapacity: totalCapList[0].TotalCapacityPerRes,
            })
          }
          if(bedsTakenList != null && bedsTakenList.length != 0){
            this.setState({
              resBedsAllocated: bedsTakenList[0].TotalbedsTaken,
            })
          }
          if (signedLease != null && signedLease.length != 0){

            this.setState({
              signedLease: signedLease[0].lease_agreement_Count,
            })
          }
          //Create Student Documents Series Chart
          //Add Total Students


          //Create Documents Data Donuts
          //Create Student Data Donuts
          let tempDocLegendList = []
          const tempData = [
            {
              value: response.data.PostRubixUserData[0].TotalRegistrationsPerYear,
              name: 'Total Students on Rubix',
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
              value: response.data.PostRubixUserData[0].IDDocumentCountPerRES,
              name: 'Student ID Document',
              itemStyle: {
                color: "#FFCC00",
                emphasis: {
                  color: "#FFCC00",
                },
              },
            },
            {
              value: response.data.PostRubixUserData[0].TotalRegistrationsPerYear - response.data.PostRubixUserData[0].IDDocumentCountPerRES,
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
            value: response.data.PostRubixUserData[0].ProofOfResCountPerRES,
            name: 'Proof of Residence',
            itemStyle: {
              color: "#00FF33",
              emphasis: {
                color: "#00FF33",
              },
            },
          },
          {
            
            value: response.data.PostRubixUserData[0].TotalRegistrationsPerYear - response.data.PostRubixUserData[0].ProofOfResCountPerRES,
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
          value: response.data.PostRubixUserData[0].ProofOfRegCountPerRES,
          name: 'Proof of Registration',
          itemStyle: {
            color: "#3399FF",
            emphasis: {
              color: "#3399FF",
            },
          },
        },
        {
          
          value: response.data.PostRubixUserData[0].TotalRegistrationsPerYear - response.data.PostRubixUserData[0].ProofOfRegCountPerRES,
          name: 'No Proof of Registration',
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
//Student Lease
          const tempStudentLease = [
            {
              value: response.data.PostRubixUserData[0].LeaseAgreementCountPerRES,
              name: 'Lease Agreement',
              itemStyle: {
                color: "#660099",
                emphasis: {
                  color: "#660099",
                },
              },
            },
            {
              value: response.data.PostRubixUserData[0].TotalRegistrationsPerYear - response.data.PostRubixUserData[0].LeaseAgreementCountPerRES,
              name: 'No Lease Agreement',
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
              radius: [160, 180],
              itemStyle: {
                normal: {
                  label: { show: false },
                  labelLine: { show: false },
                },
              },
              data: tempStudentLease,
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
              value: response.data.PostRubixUserData[0].NextOfKinCountPerRES,
              name: 'Next of Kin ID',
              itemStyle: {
                color: "#FF3333",
                emphasis: {
                  color: "#FF3333",
                },
              },
            },
            {
              value:  response.data.PostRubixUserData[0].TotalRegistrationsPerYear - response.data.PostRubixUserData[0].NextOfKinCountPerRES,
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
                value: payment.PMCountPerRes,
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
          ["#66FFFF","#3399FF", "#66CCFF", "#33CCFF", "#00CCCC", "#3399CC", "#0033CC", "#0066CC", "#0033FF", "#3333CC"]

          tempProvince.forEach((province, index) =>{
            //Add to Legend
            tempProvinceLegendData.push(
              province.RegisterUserProvince
            )
           // tempLegendList.push({tempProvinceLegendData})
            tempProvinceChartData.push(
              {
                value: province.ProvinceCountPerRes,
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
                value: year.YearofStudyCountPerRes,
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
                value: university.UniCountPerRes,
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
                value: gender.GenderCountPerRes,
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
    postData().then(()=>{
      //Set timer for loading screen
      setTimeout(() => {
        this.props.updateLoadingController(false);
        this.getGraph(resID)
      }, 2000);
    })
  }

  render() {
    return (
        <div className="container-fluid">
          <div >
            <PageHeader
              HeaderText="Admin Stats"
              Breadcrumb={[
                { name: "Page", navigate: "" },
              ]}
            />
            
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
                alt="Rubix System"
              />
            </div>
            <p>{this.props.loadingMessage}</p>
          </div>
        </div>

            <div className="row clearfix">
              <div className=" col-lg-12 col-md-15">
                {localStorage.getItem('adminLevel') == 2 || localStorage.getItem('adminLevel') == '2'
                ? <>
                <p> <strong>Please Select a Residence to view: </strong></p>
                {  
        <select className="form-control" onChange={(e)=>{
          this.setState({res: e.target.value,
          isShow: true
          })
          
        this.getReport(e.target.value)
          this.props.updateResidenceID(e.target.value)
          console.log('ResID1: ', e.target.value)
          }} value={this.state.res}>
        {
            
            this.state.resList.map((res, index)=> (
            <option key={index} name='ResidenceID' value = {res.RubixResidenceID }>{res.ResidenceName}</option>
        ))   
        }
    </select> }
                </>
                : null
                }
              </div>

              <div className="col-lg-12 col-md-12">
                <div className="p-4">
                  <h4>Residence Stats</h4>
                  <div className="row">
                    <div className="card p-2 m-2 col-lg-2 col-md-2">
                      <strong>Total Capacity:</strong>
                      <p style={{fontSize: "60px"}}>{this.state.resCapacity}</p>
                    </div>
                    <div className="card p-2 m-2 col-lg-2 col-md-2">
                      <strong>Beds Allocated:</strong>
                      <p style={{fontSize: "60px"}}>{this.state.resBedsAllocated}</p>
                    </div>
                    <div className="card p-2 m-2 col-lg-2 col-md-2">
                      <strong>Signed Leases:</strong>
                      <p style={{fontSize: "60px"}}>{this.state.signedLease}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-12 col-md-12">
                  <div className="card" style={{ height: 580, width: "100%", position: "relative" }}>
                  <div className="header">
              <h4 className="margin-0">Student Data</h4>
                </div>
                  <div
                          id="TestDocDonut"
                          className="inner"
                          style={{ height: 485, width: "100%", position: "absolute" }}
                        ></div>
                  </div>
                </div>

                <div className="col-lg-12 col-md-12">
        <div className="card" style={{ height: 580, width: "100%", position: "relative" }}>
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
                {/* <div className="col-lg-12 col-md-12">
        <div className="card" style={{ height: 580, width: "100%", position: "relative" }}>
        <div className="header">
                  <h4>Daily Data</h4>
                </div>
                <div
                          id="LineChart"
                          className="inner"
                          style={{ height: 485, width: "100%", position: "absolute" }}
                        ></div>
          
        </div>
      </div> */}


    

            </div>
          </div>
        </div>
    );
  }
}

const mapStateToProps = ({ ioTReducer, navigationReducer }) => ({
  isSecuritySystem: ioTReducer.isSecuritySystem,
  resID: navigationReducer.studentResID,

  MyloadingController: navigationReducer.loadingController,
  loadingMessage: navigationReducer.loadingMessage,
});

export default connect(mapStateToProps, {
  updateResidenceID,
  updateLoadingMessage,
  updateLoadingController,
})(AdminDashboard);
