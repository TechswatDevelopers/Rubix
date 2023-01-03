import Image1 from "../assets/images/image-gallery/1.jpg";
import Image2 from "../assets/images/image-gallery/2.jpg";
import Image3 from "../assets/images/image-gallery/3.jpg";
import Image4 from "../assets/images/image-gallery/4.jpg";
import Image5 from "../assets/images/image-gallery/5.jpg";
import Image6 from "../assets/images/image-gallery/6.jpg";
import Image7 from "../assets/images/image-gallery/7.jpg";
import Image8 from "../assets/images/image-gallery/8.jpg";
import Image9 from "../assets/images/image-gallery/9.jpg";
import Image10 from "../assets/images/image-gallery/10.jpg";
import Image11 from "../assets/images/image-gallery/11.jpg";
import Image12 from "../assets/images/image-gallery/12.jpg";
import Image13 from "../assets/images/image-gallery/13.jpg";
import Image14 from "../assets/images/image-gallery/14.jpg";
import Image15 from "../assets/images/image-gallery/15.jpg";

export const fileFolderCardData = [
  {
    Header: "ID Document",
    file: "test.pdf"
  },
  {
    Header: "Proof of Residence",
    file: "test2.pdf"
  },
  {
    Header: "University Registration",
    file: "test.pdf"
  },
  {
    Header: "Next of Kin ID",
    file: "test2.pdf"
  },
];
const mapStateToProps = ({ navigationReducer, mailInboxReducer }) => ({
  rubixUserID: navigationReducer.userID,
  studentProgress: navigationReducer.progressBar,
  currentStudentiD: navigationReducer.studentID
})

export const fileStorageStatusCardData = [
  {
    UsedSize: localStorage.getItem('nationality') == 
"South Africa, Republic of" ?  "ID Document" : "Passport",
    Type: "Documents",
    status: localStorage.getItem('idProgressMsg'),
    FileType: "id-document",
    TotalSize: "1tb",
    UsedPer: localStorage.getItem('idProgress'),
    ProgressBarClass:
      "progress progress-xs progress-transparent custom-color-blue mb-0",
  },
  {
    UsedSize: localStorage.getItem('nationality') == 
    "South Africa, Republic of" ? "Proof of Residence" : "Study Permit",
    Type: "Documents",
    status: localStorage.getItem('proofOfResProgressMsg'),
    FileType: "proof-of-res",
    TotalSize: "1tb",
    UsedPer: localStorage.getItem('proofOfResProgress'),
    ProgressBarClass:
      "progress progress-xs progress-transparent custom-color-purple mb-0",
  },
   {
    UsedSize: "Proof of Registration",
    Type: "Documents",
    status: localStorage.getItem('proofOfRegProgressMsg'),
    FileType: "proof-of-reg",
    TotalSize: "1tb",
    UsedPer: localStorage.getItem('proofOfRegProgress'),
    ProgressBarClass:
      "progress progress-xs progress-transparent custom-color-green mb-0",
  },
  localStorage.getItem('paymentMethod') == "NSFAS"
  ?
  {
    UsedSize: localStorage.getItem('yearOfStudy') == 
    "First Year" && localStorage.getItem('paymentMethod') == "NSFAS" ? "NSFAS Approval Document" : "Previous Year Results",
    Type: "Documents",
    status: localStorage.getItem('studentProgress'),
    FileType: "nsfas-doc",
    TotalSize: "1tb",
    UsedPer: localStorage.getItem('studentProgress'),
    ProgressBarClass:
      "progress progress-xs progress-transparent custom-color-grey mb-0",
  }
  :  {
    UsedSize: "Proof of Income",
    Type: "Documents",
    status: localStorage.getItem('popProgress'),
    FileType: "proof-of-income",
    TotalSize: "1tb",
    UsedPer: localStorage.getItem('popProgress'),
    ProgressBarClass:
      "progress progress-xs progress-transparent custom-color-grey mb-0",
  },
   {
    UsedSize: "Surety ID",
    Type: "Documents",
    status: localStorage.getItem('nextOfKinProgressMsg'),
    FileType: "next-of-kin",
    TotalSize: "1tb",
    UsedPer: localStorage.getItem('nextOfKinProgress'),
    ProgressBarClass:
      "progress progress-xs progress-transparent custom-color-yellow mb-0",
  },
 
  {
    UsedSize: "Bank Statement",
    Type: "Documents",
    status: localStorage.getItem('bookFormProgress'),
    FileType: "bank-statement",
    TotalSize: "1tb",
    UsedPer: localStorage.getItem('bookFormProgress'),
    ProgressBarClass:
      "progress progress-xs progress-transparent custom-color-blue mb-0",
  },
  {
    UsedSize: "Surety Deed Document",
    Type: "Documents",
    status: localStorage.getItem('rulesProgress'),
    FileType: "surety-doc",
    TotalSize: "1tb",
    UsedPer: localStorage.getItem('rulesProgress'),
    ProgressBarClass:
      "progress progress-xs progress-transparent custom-color-grey mb-0",
  },
  {
    UsedSize: "My Key Form",
    Type: "Documents",
    status: localStorage.getItem('keyProgress'),
    FileType: "key-form",
    TotalSize: "1tb",
    UsedPer: localStorage.getItem('keyProgress'),
    ProgressBarClass:
      "progress progress-xs progress-transparent custom-color-grey mb-0",
  },
   {
    UsedSize: "My Lease Agreement",
    Type: "Documents",
    status: localStorage.getItem('leaseProgressMsg'),
    FileType: "lease-agreement",
    TotalSize: "1tb",
    UsedPer: localStorage.getItem('leaseProgress'),
    ProgressBarClass:
      "progress progress-xs progress-transparent custom-color-red mb-0",
  },
];

export const areaChartFileReport = {
  tooltip: {
    trigger: "axis",
  },
  grid: {
    top: "4%",
    left: "1%",
    right: "1%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: [
    {
      type: "category",
      boundaryGap: false,
      data: [2011, 2012, 2013, 2014, 2015, 2016, 2017],
      axisLine: {
        show: false,
      },
      axisLabel: {
        textStyle: {
          color: "#a9a9a9",
        },
      },
    },
  ],
  yAxis: [
    {
      type: "value",
      splitLine: { show: false },
      splitLine: {
        lineStyle: {
          type: "dotted",
        },
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        formatter: function (value, index) {
          if (value > 0) {
            return value;
          } else {
            return 0;
          }
        },
        textStyle: {
          color: "#a9a9a9",
        },
      },
    },
  ],
  series: [
    {
      type: "line",
      name: "Documents",
      data: [0, 22, 10, 27, 17, 39, 20],
      itemStyle: {
        color: "#38ade8",
      },
      symbolSize: 8,
      smooth: true,
      areaStyle: {
        opacity: 0.2,
      },
    },
    {
      type: "line",
      name: "Media",
      data: [0, 12, 1, 12, 9, 51, 9],
      itemStyle: {
        color: "#d9c5f8",
      },
      symbolSize: 8,
      smooth: true,
      areaStyle: {
        opacity: 0.2,
      },
    },
    {
      type: "line",
      name: "Images",
      data: [7, 5, 23, 2, 26, 9, 21],
      itemStyle: {
        color: "#92c635",
      },
      symbolSize: 8,
      smooth: true,
      areaStyle: {
        opacity: 0.2,
      },
    },
  ],
};

export const fileDocumentCardData = [
  {
    DocumentIconClass: "fa fa-file text-info",
    DocumentName: "Document_2017.doc",
    DocumentSize: "42KB",
    DocumentDate: "Nov 02, 2017",
  },
  {
    DocumentIconClass: "fa fa-file text-info",
    DocumentName: "Document_2017.doc",
    DocumentSize: "89KB",
    DocumentDate: "Dec 15, 2017",
  },
  {
    DocumentIconClass: "fa fa-file text-info",
    DocumentName: "Document_2017.doc",
    DocumentSize: "101KB",
    DocumentDate: "Dec 17, 2017",
  },
  {
    DocumentIconClass: "fa fa-bar-chart text-warning",
    DocumentName: "Report2016.xls",
    DocumentSize: "68KB",
    DocumentDate: "Dec 12, 2017",
  },
  {
    DocumentIconClass: "fa fa-bar-chart text-warning",
    DocumentName: "Report2016.xls",
    DocumentSize: "68KB",
    DocumentDate: "Dec 12, 2017",
  },
  {
    DocumentIconClass: "fa fa-file text-success",
    DocumentName: "asdf  hhkj.pdf",
    DocumentSize: "3MB",
    DocumentDate: "Aug 18, 2017",
  },
  {
    DocumentIconClass: "fa fa-file text-success",
    DocumentName: "asdf  hhkj.pdf",
    DocumentSize: "3MB",
    DocumentDate: "Aug 18, 2017",
  },
  {
    DocumentIconClass: "fa fa-file text-success",
    DocumentName: "asdf  hhkj.pdf",
    DocumentSize: "3MB",
    DocumentDate: "Aug 18, 2017",
  },
  {
    DocumentIconClass: "fa fa-file text-success",
    DocumentName: "asdf  hhkj.pdf",
    DocumentSize: "3MB",
    DocumentDate: "Aug 18, 2017",
  },
  {
    DocumentIconClass: "fa fa-bar-chart text-warning",
    DocumentName: "Report2016.xls",
    DocumentSize: "68KB",
    DocumentDate: "Dec 12, 2017",
  },
  {
    DocumentIconClass: "fa fa-bar-chart text-warning",
    DocumentName: "Report2016.xls",
    DocumentSize: "68KB",
    DocumentDate: "Dec 12, 2017",
  },
  {
    DocumentIconClass: "fa fa-bar-chart text-warning",
    DocumentName: "Report2016.xls",
    DocumentSize: "68KB",
    DocumentDate: "Dec 12, 2017",
  },
  {
    DocumentIconClass: "fa fa-file text-info",
    DocumentName: "Document_2017.doc",
    DocumentSize: "42KB",
    DocumentDate: "Nov 02, 2017",
  },
  {
    DocumentIconClass: "fa fa-file text-info",
    DocumentName: "Document_2017.doc",
    DocumentSize: "42KB",
    DocumentDate: "Nov 02, 2017",
  },
  {
    DocumentIconClass: "fa fa-bar-chart text-warning",
    DocumentName: "Report2016.xls",
    DocumentSize: "68KB",
    DocumentDate: "Dec 12, 2017",
  },
  {
    DocumentIconClass: "fa fa-file text-info",
    DocumentName: "Document_2017.doc",
    DocumentSize: "42KB",
    DocumentDate: "Nov 02, 2017",
  },
];

export const fileMediaData = [
  {
    DocumentIconClass: "fa fa-image",
    DocumentName: "hellonew.mkv",
    DocumentSize: "720MB",
    DocumentDate: "Dec 08, 2017",
  },
  {
    DocumentIconClass: "fa fa-youtube-square text-danger",
    DocumentName: "Jee Le Zara Song.mpg4",
    DocumentSize: "32MB",
    DocumentDate: "Oct 11, 2017",
  },
  {
    DocumentIconClass: "fa fa-image",
    DocumentName: "hellonew.mkv",
    DocumentSize: "720MB",
    DocumentDate: "Dec 08, 2017",
  },
  {
    DocumentIconClass: "fa fa-image",
    DocumentName: "hellonew.mkv",
    DocumentSize: "720MB",
    DocumentDate: "Dec 08, 2017",
  },
  {
    DocumentIconClass: "fa fa-youtube-square text-danger",
    DocumentName: "Jee Le Zara Song.mpg4",
    DocumentSize: "32MB",
    DocumentDate: "Oct 11, 2017",
  },
  {
    DocumentIconClass: "fa fa-youtube-square text-danger",
    DocumentName: "Jee Le Zara Song.mpg4",
    DocumentSize: "32MB",
    DocumentDate: "Oct 11, 2017",
  },
  {
    DocumentIconClass: "fa fa-image",
    DocumentName: "hellonew.mkv",
    DocumentSize: "720MB",
    DocumentDate: "Dec 08, 2017",
  },
  {
    DocumentIconClass: "fa fa-youtube-square text-danger",
    DocumentName: "Jee Le Zara Song.mpg4",
    DocumentSize: "32MB",
    DocumentDate: "Oct 11, 2017",
  },
];

export const fileImagesCardData = [
  {
    ImageUrl: Image1,
    DocumentName: "imgd21545ds.jpg",
    DocumentSize: "2MB",
    DocumentDate: "Dec 11, 2017",
  },
  {
    ImageUrl: Image2,
    DocumentName: "imgd21545ds.jpg",
    DocumentSize: "2MB",
    DocumentDate: "Dec 11, 2017",
  },
  {
    ImageUrl: Image3,
    DocumentName: "imgd21545ds.jpg",
    DocumentSize: "2MB",
    DocumentDate: "Dec 11, 2017",
  },
  {
    ImageUrl: Image4,
    DocumentName: "imgd21545ds.jpg",
    DocumentSize: "2MB",
    DocumentDate: "Dec 11, 2017",
  },
  {
    ImageUrl: Image5,
    DocumentName: "imgd21545ds.jpg",
    DocumentSize: "2MB",
    DocumentDate: "Dec 11, 2017",
  },
  {
    ImageUrl: Image6,
    DocumentName: "imgd21545ds.jpg",
    DocumentSize: "2MB",
    DocumentDate: "Dec 11, 2017",
  },
  {
    ImageUrl: Image7,
    DocumentName: "imgd21545ds.jpg",
    DocumentSize: "2MB",
    DocumentDate: "Dec 11, 2017",
  },
  {
    ImageUrl: Image8,
    DocumentName: "imgd21545ds.jpg",
    DocumentSize: "2MB",
    DocumentDate: "Dec 11, 2017",
  },
  {
    ImageUrl: Image9,
    DocumentName: "imgd21545ds.jpg",
    DocumentSize: "2MB",
    DocumentDate: "Dec 11, 2017",
  },
  {
    ImageUrl: Image10,
    DocumentName: "imgd21545ds.jpg",
    DocumentSize: "2MB",
    DocumentDate: "Dec 11, 2017",
  },
  {
    ImageUrl: Image11,
    DocumentName: "imgd21545ds.jpg",
    DocumentSize: "2MB",
    DocumentDate: "Dec 11, 2017",
  },
  {
    ImageUrl: Image12,
    DocumentName: "imgd21545ds.jpg",
    DocumentSize: "2MB",
    DocumentDate: "Dec 11, 2017",
  },
  {
    ImageUrl: Image13,
    DocumentName: "imgd21545ds.jpg",
    DocumentSize: "2MB",
    DocumentDate: "Dec 11, 2017",
  },
  {
    ImageUrl: Image14,
    DocumentName: "imgd21545ds.jpg",
    DocumentSize: "2MB",
    DocumentDate: "Dec 11, 2017",
  },
  {
    ImageUrl: Image15,
    DocumentName: "imgd21545ds.jpg",
    DocumentSize: "2MB",
    DocumentDate: "Dec 11, 2017",
  },
];
