import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import FileFolderCard from "../../components/FileManager/FileFolderCard";
import FileStorageCard from "../../components/FileManager/FileStorageCard";
import FileStorageStatusCard from "../../components/FileManager/FileStorageStatusCard";
import LineChartCard from "../../components/LineChartCard";
import { Document, Page, pdfjs  } from "react-pdf";
import {
  fileFolderCardData,
  fileStorageStatusCardData,
  areaChartFileReport,
} from "../../Data/FileManagerData";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

class DocumentManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNumber: 1,
      numPages: null,
    }
  }
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  //When document is loaded successfuly
  onDocumentLoadSuccess = ({ numPages }) => {
    console.log("File loaded")
    this.setState({ numPages });
  };

  //Page navigation functions
  goToPrevPage = () =>
    this.setState(state => ({ pageNumber: state.pageNumber - 1 }));
  goToNextPage = () =>
    this.setState(state => ({ pageNumber: state.pageNumber + 1 }));
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
            <div className="row clearfix">
              {fileFolderCardData.map((data, index) => {
                return <FileFolderCard key={index} HeaderText={data.Header} />;
              })}
            </div>
            <div className="row clearfix">
              <div className="col-lg-3 col-md-5 col-sm-12">
                <FileStorageCard TotalSize="Storage Used" UsedSize={17} />
                {fileStorageStatusCardData.map((data, index) => {
                  return (
                    <FileStorageStatusCard
                      key={index + "sidjpidj"}
                      TotalSize={data.TotalSize}
                      UsedSize={data.UsedSize}
                      Type={data.Type}
                      UsedPer={data.UsedPer}
                      ProgressBarClass={`${data.ProgressBarClass}`}
                    />
                  );
                })}
              </div>
              <div className="col-lg-9 col-md-7 col-sm-12">
                <LineChartCard
                  HeaderText="View File"
                  ChartOption={areaChartFileReport}
                />
                <div className="pdf-div">
          <Document
            file= "test.pdf"
            onLoadSuccess={this.onDocumentLoadSuccess}
          >
            <Page pageNumber={this.state.pageNumber} />
          </Document>
        </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ ioTReducer }) => ({
  isSecuritySystem: ioTReducer.isSecuritySystem,
});

export default connect(mapStateToProps, {})(DocumentManager);
