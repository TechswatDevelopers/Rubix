import React from "react";
import { connect } from "react-redux";
import * as echarts from "echarts";
import { optionPieEchart } from "../../Data/Charts";

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
} from "../../Data/DashbordData"
class DocumentsChart extends React.Component {
  componentDidMount() {
    this.chartTotalStudents();
    this.chartPlaceNOK();
    this.chartPlaceLease();
    this.chartPlaceRes();
    this.chartPlaceReg();
    this.chartPlaceID();
  }
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
  
  render() {
    return (
      <div className="col-lg-12 col-md-12">
        <div className="card" style={{ height: 375, width: "100%", position: "relative" }}>
        <div className="header">
                  <h4>Documents Data</h4>
                </div>
          <div className="body">
            <div
              id="LeaseDonut"
              className="inner"
              style={{ height: 285, width: "100%", position: "absolute",}}
            ></div>
            
            <div id="NOKDonut"
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
    );
  }
}

const mapStateToProps = ({ analyticalReducer }) => ({});

export default connect(mapStateToProps, {})(DocumentsChart);
