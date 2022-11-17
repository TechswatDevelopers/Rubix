import React from "react";
import { Dropdown, Row } from "react-bootstrap";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import navigationReducer from "../../reducers/navigationReducer";
import DocumentsChart from "../../components/Charts/DocumentsChart";
import axios from "axios";
import ReactEcharts from "echarts-for-react";
import "echarts-gl";
import LargeScaleAreaChart from "../../components/Charts/LargeScaleAreaChart";
import echarts from "echarts";
import { format } from 'date-fns';
import {updateResidenceID,
  updateLoadingMessage,
  updateLoadingController,
} from "../../actions";
import {Helmet} from "react-helmet";

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

    //this.getAllResInfo()


    const fetchData = async() =>{
      //Populate Residence list
      await fetch('https://jjprest.rubix.mobi:88/api/RubixResidences/' /* + localStorage.getItem('clientID') */)
      .then(response => response.json())
      .then(data => {
          //console.log("data is ", data)
          this.setState({resList: data.data})
          });
      } 
      fetchData()
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
      resInfoList: [],
      resIndex: 0,
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
    //console.log("Posted Data: ", data)

    const postData = async () => {
      await axios.post('https://jjprest.rubix.mobi:88/api/RubixAdminReport', data, requestOptions)
      .then(response =>{
        console.log("Response: ", response)

        //Load data
        let registrationPerYear = response.data.PostRubixUserData.filter(doc => doc.TotalRegistrationsPerDay !== undefined)
        
        //Load Students Registered
        //console.log("Registration per year: ", registrationPerYear)
        let registrationLegend = [], regMonth = [], registrationChartData = [], dataset = []

        let statsID = response.data.PostRubixUserData.filter(doc => doc.FileType === "id-document")
        //console.log("Id stats", statsID)
        let statsLease = response.data.PostRubixUserData.filter(doc => doc.FileType === "lease-agreement")
        let statsNOK = response.data.PostRubixUserData.filter(doc => doc.FileType === "next-of-kin")
        let statsREG = response.data.PostRubixUserData.filter(doc => doc.FileType === "proof-of-reg")
        let statsRES = response.data.PostRubixUserData.filter(doc => doc.FileType === "proof-of-res")

        //Datasets
       let IdDataSets = [], leaseDataSet = [], nokDataSet = [], regDataSet = [], resDataSet = [], documentsLegend =[],
       IdDataSetsChartData = [],  leaseDataSetChartData = [],  nokDataSetChartData = [],  regDataSetChartData = [],  resDataSetChartData = []

       let seriesData = []
        var base =  new Date(2022, 5, 1).getTime();
        var base2 =  new Date(2021, 12, 1);
        var oneDay = 24 * 3600 * 1000;
        var date = [];
        var tempdate = [];

        var diff =Math.ceil(Math.abs( new Date() - base2)/oneDay)
        //console.log('Difference: ', diff)
        

        for (var i = 1; i <= diff; i++) {
          var now =  new Date(base += oneDay);
          var newDate = format(now, 'yyyy/MM/dd')
          tempdate.push(newDate)
          
        }

        //For each date add all relevant Data
        tempdate.forEach((currentDate, index) => {
          //Load Registration Stats
          let tempStudents = registrationPerYear.filter(doc => doc.daydate == currentDate)
          if(tempStudents != null && tempStudents != undefined && tempStudents.length != 0){
            //console.log("It's a match!", tempStudents)
            dataset.push(tempStudents[0].TotalRegistrationsPerDay)
          } else {
            //console.log("It's NOT a match!", tempStudents)
            dataset.push(0)
          }


          //Load ID Documents
          let tempID = statsID.filter(doc => doc.Documnetdaydate == currentDate)
          if(tempID != null && tempID != undefined && tempID.length != 0){
            //console.log("It's a match!", tempID)
            IdDataSets.push(tempID[0].DocumentCountPerDayPerTypePerDay)
          } else {
            //console.log("It's NOT a match!", tempID)
            IdDataSets.push(0)
          }

          //Load Lease Documents
          let tempLease = statsLease.filter(doc => doc.Documnetdaydate == currentDate)
          if(tempLease != null && tempLease != undefined && tempLease.length != 0){
            //console.log("It's a match!", tempID)
            leaseDataSet.push(tempLease[0].DocumentCountPerDayPerTypePerDay)
          } else {
            //console.log("It's NOT a match!", tempID)
            leaseDataSet.push(0)
          }

          //Load Next of Kin ID Documents
          let tempNOK = statsNOK.filter(doc => doc.Documnetdaydate == currentDate)
          if(tempNOK != null && tempNOK != undefined && tempNOK.length != 0){
            //console.log("It's a match!", tempID)
            nokDataSet.push(tempNOK[0].DocumentCountPerDayPerTypePerDay)
          } else {
            //console.log("It's NOT a match!", tempID)
            nokDataSet.push(0)
          }

          //Load Proof of Registration Documents
          let tempREG = statsREG.filter(doc => doc.Documnetdaydate == currentDate)
          if(tempREG != null && tempREG != undefined && tempREG.length != 0){
            //console.log("It's a match!", tempID)
            regDataSet.push(tempREG[0].DocumentCountPerDayPerTypePerDay)
          } else {
            //console.log("It's NOT a match!", tempID)
            regDataSet.push(0)
          }

          //Load Proof of Residence Documents
          let tempRES = statsRES.filter(doc => doc.Documnetdaydate == currentDate)
          if(tempRES != null && tempRES != undefined && tempRES.length != 0){
            //console.log("It's a match!", tempID)
            resDataSet.push(tempRES[0].DocumentCountPerDayPerTypePerDay)
          } else {
            //console.log("It's NOT a match!", tempID)
            resDataSet.push(0)
          }
        })

      
        //Populate Registration Graph Info
        registrationChartData = {
          name: "Students Registered",
          type: "line",
          smooth: true,
          symbol: "none",
          sampling: "average",
          itemStyle: {
            color: "rgb(255, 70, 131)",
          },
          areaStyle: {
          },
          data: dataset,
        }
        seriesData.push(registrationChartData)
        documentsLegend.push('Students Registered')
        
        //Add Documents to lists
        IdDataSetsChartData = {
          name: "Student ID Documents",
          type: "line",
          smooth: true,
          symbol: "none",
          sampling: "average",
          itemStyle: {
            color: "rgb(255, 171, 0)",
          },
          areaStyle: {
          },
          data: IdDataSets,
        }
        seriesData.push(IdDataSetsChartData)
        documentsLegend.push('Student ID Documents')

        leaseDataSetChartData = {
          name: "Lease Documents",
          type: "line",
          smooth: true,
          symbol: "none",
          sampling: "average",
          itemStyle: {
            color: "rgb(76, 0, 153)",
          },
          areaStyle: {
          },
          data: leaseDataSet,
        }
        seriesData.push(leaseDataSetChartData)
        documentsLegend.push('Lease Documents')

        nokDataSetChartData = {
          name: "Next of Kin ID",
          type: "line",
          smooth: true,
          symbol: "none",
          sampling: "average",
          itemStyle: {
            color: "rgb(47, 80, 243)",
          },
          areaStyle: {
          },
          data: nokDataSet,
        }
        seriesData.push(nokDataSetChartData)
        documentsLegend.push('Next of Kin ID')
        

        regDataSetChartData = {
          name: "Proof of Registration",
          type: "line",
          smooth: true,
          symbol: "none",
          sampling: "average",
          itemStyle: {
            color: "rgb(224, 243, 47)",
          },
          areaStyle: {
          },
          data: regDataSet,
        }
        seriesData.push(regDataSetChartData)
        documentsLegend.push('Proof of Registration')

        
        resDataSetChartData = {
          name: "Proof of Residence",
          type: "line",
          smooth: true,
          symbol: "none",
          sampling: "average",
          itemStyle: {
            color: "rgb(6, 229, 66)",
          },
          areaStyle: {
          },
          data: resDataSet,
        }
        seriesData.push(resDataSetChartData)
        documentsLegend.push('Proof of Residence')
        
        this.createLineGraph(documentsLegend, seriesData, tempdate)
      })
    } 
    if(resID == 0 || resID == 'Please Select Residence'){
      this.props.updateLoadingController(false);
      window.location.reload();
      
    } else {
      postData()
    }
  }

  //Create Line Graph
  createLineGraph(legend, series, date){
    const optionAreaEchart = {
      tooltip: {
        trigger: "axis",
        position: function (pt) {
          return [pt[0], "10%"];
        },
      },
      title: {
        left: "center",
        text: "",
      },
      grid: {
        top: 30,
        left: 45,
        right: 35,
      },
      legend: {data:legend},
      toolbox: {
        show: false,
        feature: {
          dataZoom: {
            yAxisIndex: "none",
          },
          restore: {},
          saveAsImage: {},
        },
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: date,
      },
      yAxis: {
        type: "value",
        boundaryGap: [0, "100%"],
      },
      dataZoom: [
        {
          type: "inside",
          start: 0,
          end: 100,
        },
        {
          start: 0,
          end: 10,
          handleIcon:
            "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
          handleSize: "80%",
          handleStyle: {
            color: "#fff",
            shadowBlur: 3,
            shadowColor: "rgba(0, 0, 0, 0.6)",
            shadowOffsetX: 2,
            shadowOffsetY: 2,
          },
        },
      ],
      series: series,
    }
    this.createChart("LineChart", optionAreaEchart)

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
  createStatsSeriesGraph(key, series, attributeID, legend){
    const donut  = {
      title: {
        text: key,
        x: "center",
        y: "center",
        textStyle: {
          color: "rgb(0, 0, 0)",
          fontFamily: "Arial",
          fontSize: 35,
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

  //Get All Reports
  getAllReports(){
    let newList = this.state.resList.filter(doc => doc.RubixResidenceID !== null && doc.RubixResidenceID !== 99)
    //console.log('cliked', newList)
    if (this.state.resIndex <= newList.length - 1){
        this.getResInfo(
          newList[this.state.resIndex].RubixResidenceID, 
          newList[this.state.resIndex].ResidenceName
          )
      

    } else {
    this.props.updateLoadingController(false);
    }
  }

  getAllResInfo(){
    this.setState({
      isShow: false
    })
    //Set Loading Screen ON
    this.props.updateLoadingController(true);
    this.props.updateLoadingMessage("Loading Data, Please wait...");
    const data = {
      'UserCode': localStorage.getItem('userCode'),
    }

    const requestOptions = {
      title: 'Fetch All Res Reports Form',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    };

    //Post Data
    
    const postData = async () => {
      await axios.post('https://jjprest.rubix.mobi:88/api/RubixAdminReportAll', data, requestOptions)
      .then( response =>{
        console.log('Stats Data: ', response.data.PostRubixUserData)
        var list = response.data.PostRubixUserData

        list.forEach(res =>{
          //console.log('Current res: ', res)
          this.state.resInfoList.push(
            {
              'name': res.ResidenceName,
              'total': res.TotalCapacityPerRes,
              'beds': res.TotalbedsTaken,
              'leases': res.lease_agreement_Count != null && res.lease_agreement_Count!= undefined ? res.lease_agreement_Count : 0
            }
          )
        })
      })
    }
    postData().then(()=>{
      setTimeout(() => {
        this.props.updateLoadingController(false);
        }, 2000);
    })
  }
  
  getResInfo(resID, resName) {
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
//console.log('Posted Data: ', data)
    const postData = async () => {
      await axios.post('https://jjprest.rubix.mobi:88/api/RubixAdminResidneceReports', data, requestOptions)
      .then(response => {
        //console.log('current response: ', response)
        if(response != null && response != undefined){
        let totalCapList = response.data.PostRubixUserData.filter(doc => doc.TotalCapacityPerRes !== undefined)
        let bedsTakenList = response.data.PostRubixUserData.filter(doc => doc.TotalbedsTaken !== undefined)
        let signedLease = response.data.PostRubixUserData.filter(doc => doc.lease_agreement_Count !== undefined)
        this.state.resInfoList.push(
          {
            'name': resName,
            'total': totalCapList[0].TotalCapacityPerRes,
            'beds': bedsTakenList[0].TotalbedsTaken,
            'leases': signedLease != null && signedLease!= undefined && signedLease.length !=0 ?signedLease[0].lease_agreement_Count : 0
          }
        )
        }
      })
    }
    postData().then(()=>{
      
    this.setState({
      resIndex: this.state.resIndex + 1
    });
      setTimeout(() => {
        
      this.getAllReports()
      }, 2000);
    })
    //console.log("Final List: ", this.state.resInfoList)
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

    //console.log("Posted:", data)
    const postData = async () => {
      await axios.post('https://jjprest.rubix.mobi:88/api/RubixAdminResidneceReports', data, requestOptions)
        .then(response => {
          console.log("look at this DB response: ", response)

          if(response != null || response != undefined){

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
              //Create Total Capacity Pie Chart
              let tempStatsLegendList = []
            const tempData = [
              {
                value: totalCapList[0].TotalCapacityPerRes,
                name: 'Total Residence Capacity',
                itemStyle: {
                  color: "rgba(255, 255, 255)",
                  emphasis: {
                    color: "rgba(255, 255, 255)",
                  },
                },
              },
             
            ]
           var totalCapSeries = 
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
                      shadowColor: "rgba(0, 0, 0, 0.2)",
                    },
                  },
                }
              this.setState({
                resCapacity: totalCapList[0].TotalCapacityPerRes,
              })
  
            } else {
  
              this.setState({
                resCapacity: 0,
              })
            }
            this.createStatsSeriesGraph(this.state.resCapacity, totalCapSeries, 'totalCap', ['Total Capacity'])

            if(bedsTakenList != null && bedsTakenList.length != 0){
              //Create Beds Allocated Pie Chart
              const bedsAllocStats = [
                {
                  value: bedsTakenList[0].TotalbedsTaken,
                  name: 'Total Beds Allocated',
                  itemStyle: {
                    color: "rgba(255, 255, 255)",
                    emphasis: {
                      color: "rgba(255, 255, 255)",
                    },
                  },
                },
               
              ]
             var bedsAllocSeries = 
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
                    data: bedsAllocStats,
                    emphasis: {
                      itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: "rgba(0, 0, 0, 0.2)",
                      },
                    },
                  }
              this.setState({
                resBedsAllocated: bedsTakenList[0].TotalbedsTaken,
              })
            } else {
              this.setState({
                resBedsAllocated: 0,
              })
            }
            this.createStatsSeriesGraph(this.state.resBedsAllocated, bedsAllocSeries, 'bedsAlloc', ['Beds Allocated'])


            if (signedLease != null && signedLease.length != 0){
              //Create leases Signed Pie Chart
              const LeaseSignedStats = [
                {
                  value: signedLease[0].lease_agreement_Count,
                  name: 'Total Signed Leases',
                  itemStyle: {
                    color: "rgba(255, 255, 255)",
                    emphasis: {
                      color: "rgba(255, 255, 255)",
                    },
                  },
                },
               
              ]
             var leaseSeries =
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
                    data: LeaseSignedStats,
                    emphasis: {
                      itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: "rgba(0, 0, 0, 0.2)",
                      },
                    },
                  }
              this.setState({
                signedLease: signedLease[0].lease_agreement_Count,
              })
            } else {
              this.setState({
                signedLease: 0,
              })
            }
            this.createStatsSeriesGraph(this.state.signedLease, leaseSeries, 'signedLease', ['Signed Lease'])

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


    //Student Card stats
    const tempStudentCard = [
      {
        value: response.data.PostRubixUserData[0].StudentCardCountPerRES,
        name: 'Student Card',
        itemStyle: {
          color: "#310B44",
          emphasis: {
            color: "#310B44",
          },
        },
      },
      {
        value: response.data.PostRubixUserData[0].TotalRegistrationsPerYear - response.data.PostRubixUserData[0].StudentCardCountPerRES,
        name: 'No Student Card',
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
        radius: [190, 210],
        itemStyle: {
          normal: {
            label: { show: false },
            labelLine: { show: false },
          },
        },
        data: tempStudentCard,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      }
    )

    
    //Proof of Pay Stats
    const tempProofOfPay = [
      {
        value: response.data.PostRubixUserData[0].ProofOfpaymentCountPerRES,
        name: 'Proof of Pay',
        itemStyle: {
          color: "#65044A",
          emphasis: {
            color: "#65044A",
          },
        },
      },
      {
        value: response.data.PostRubixUserData[0].TotalRegistrationsPerYear - response.data.PostRubixUserData[0].ProofOfpaymentCountPerRES,
        name: 'No Proof of Pay',
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
        radius: [220, 240],
        itemStyle: {
          normal: {
            label: { show: false },
            labelLine: { show: false },
          },
        },
        data: tempProofOfPay,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      }
    )

    

    //Rules and Regulations Stats
    const tempRules = [
      {
        value: response.data.PostRubixUserData[0].RulesDocumentCountPerRES,
        name: 'Rules and Regulations',
        itemStyle: {
          color: "#900437",
          emphasis: {
            color: "#900437",
          },
        },
      },
      {
        value: response.data.PostRubixUserData[0].TotalRegistrationsPerYear - response.data.PostRubixUserData[0].RulesDocumentCountPerRES,
        name: 'No Rules and Regulations',
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
        radius: [250, 270],
        itemStyle: {
          normal: {
            label: { show: false },
            labelLine: { show: false },
          },
        },
        data: tempRules,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      }
    )

    //Booking Doc Stats
    const tempBookingDoc = [
      {
        value: response.data.PostRubixUserData[0].BookingDocumentCountPerRES,
        name: 'Booking Form',
        itemStyle: {
          color: "#9E0507",
          emphasis: {
            color: "#9E0507",
          },
        },
      },
      {
        value: response.data.PostRubixUserData[0].TotalRegistrationsPerYear - response.data.PostRubixUserData[0].BookingDocumentCountPerRES,
        name: 'No Booking Form',
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
        radius: [250, 270],
        itemStyle: {
          normal: {
            label: { show: false },
            labelLine: { show: false },
          },
        },
        data: tempBookingDoc,
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
const ProvincePallete = ["#66FFFF","#3399FF", "#66CCFF", "#33CCFF", "#00CCCC", "#3399CC", "#0033CC", "#0066CC", "#0033FF", "#3333CC"]

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
const UniPallete = ["#FFCCFF", "#FF66FF", "#FF00FF", "#FF3399", "#FF00CC", "#9933CC", "#990099", "#9966CC", "#9933FF", "#663399", "#4d2e69"]


        
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

          }
        })
    }
    if (resID == 0 || resID == 'Please Select Residence'){
      this.props.updateLoadingController(false);
      window.location.reload();

    } else {
      postData().then(()=>{
        //Set timer for loading screen
        setTimeout(() => {
          this.getGraph(resID)
          this.props.updateLoadingController(false);
        }, 3000);
      })
    }
    
  }


  render() {
    return (
        <div className="container-fluid">
        <Helmet>
              <meta charSet="utf-8" />
              <title>Admin Stats</title>
          </Helmet>
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
         // console.log('ResID1: ', e.target.value)
          }} value={this.state.res}>
        {
            
            this.state.resList.map((res, index)=> (
            <option key={index} name='ResidenceID' value = {res.RubixResidenceID }>{res.ResidenceName}</option>
        ))   
        }
    </select> }

    <button className="btn btn-outline-primary mt-2" onClick={(e) => {this.getAllResInfo()}}>View All Residence Stats</button>
    {
      this.state.resInfoList.map((res, index) => (
        <>
        <h2 className="mt-4">{res.name} Stats</h2>
        <div className="row">
                    <div className="card m-1  col-lg-2 col-md-2" style={{ height: 80, width: "100%", position: "relative" }}>
                      <strong >Total Capacity:</strong>
                      <div id="" style={{ width: "100%", position: "absolute", fontSize: '35px'}}>{res.total}</div>
                     {/*  <p style={{fontSize: "60px"}}>{this.state.resCapacity}</p> */}
                    </div>
                    <div className="card m-1 col-lg-2 col-md-2" style={{ height: 80, width: "100%", position: "relative" }}>
                      <strong>Beds Allocated:</strong>
                      <div className="" id="" style={{ width: "100%", position: "absolute", fontSize: '35px'}}>{res.beds}</div>
                     {/*  <p style={{fontSize: "60px"}}>{this.state.resBedsAllocated}</p> */}
                    </div>
                    <div className="card m-1  col-lg-2 col-md-2" style={{ height: 80, width: "100%", position: "relative" }}>
                      <strong>Signed Leases:</strong>
                      <div id="" style={{width: "100%", position: "absolute", fontSize: '35px' }}>{res.leases}</div>
                     {/*  <p style={{fontSize: "60px"}}>{this.state.signedLease}</p> */}
                    </div>
                    {/* <hr style={{
                        border: '1px dotted grey',
                        width: '100%'
                      }} /> */}
                  </div>
        </>
        
      ))
    }
                </>
                : null
                }
              </div>



{ this.state.isShow
? <>
              <div className="col-lg-12 col-md-12">
                <div className="p-4">
                  <h4>Residence Stats</h4>
                  <div className="row">
                    <div className="card p-2 m-2 col-lg-2 col-md-2" style={{ height: 120, width: "100%", position: "relative" }}>
                      <strong>Total Capacity:</strong>
                      <div id="totalCap" style={{ height: 85, width: "100%", position: "absolute" }}></div>
                     {/*  <p style={{fontSize: "60px"}}>{this.state.resCapacity}</p> */}
                    </div>
                    <div className="card p-2 m-2 col-lg-2 col-md-2" style={{ height: 120, width: "100%", position: "relative" }}>
                      <strong>Beds Allocated:</strong>
                      <div id="bedsAlloc" style={{ height: 85, width: "100%", position: "absolute" }}></div>
                     {/*  <p style={{fontSize: "60px"}}>{this.state.resBedsAllocated}</p> */}
                    </div>
                    <div className="card p-2 m-2 col-lg-2 col-md-2" style={{ height: 120, width: "100%", position: "relative" }}>
                      <strong>Signed Leases:</strong>
                      <div id="signedLease" style={{ height: 85, width: "100%", position: "absolute" }}></div>
                     {/*  <p style={{fontSize: "60px"}}>{this.state.signedLease}</p> */}
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
        <div className="card" style={{ height: 780, width: "100%", position: "relative" }}>
        <div className="header">
                  <h4>Documents Data</h4>
                </div>
          <div className="body content-center">
          <div
                          id="NewDocDonut"
                          className="inner"
                          style={{ height: 585, width: "100%", position: "absolute" }}
                        ></div>
          </div>
        </div>
      </div>
                <div className="col-lg-12 col-md-12">
        <div className="card" style={{ height: 580, width: "100%", position: "relative" }}>
        <div className="header">
                  <h4>Daily Data</h4>
                </div>
                <div
                          id="LineChart"
                          className="inner"
                          style={{ height: 485, width: "100%", position: "absolute" }}
                        ></div>
                        {/* <LargeScaleAreaChart/> */}
          
        </div>
      </div>
</>
: null
}
    

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
