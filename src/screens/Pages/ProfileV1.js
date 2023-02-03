import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import { Tabs, Tab, Row, Col } from "react-bootstrap";
import ProfileV1Setting from "../../components/Pages/ProfileV1Setting";
import axios from "axios";
import FileStorageStatusCard from "../../components/FileManager/FileStorageStatusCard";
import SignatureCanvas from 'react-signature-canvas';
import {Helmet} from "react-helmet";
import {
  onPresPopUpEvent, 
  onPresPopUpConfirm, 
  onUpdateNOKProgress,
  onUpdateIDProgress,
  onUpdateRESProgress,
  onUpdateREGProgress,

  onUpdateNOKMessage,
  onUpdateREGMessage,
  onUpdateRESMessage,
  onUpdateIDMessage,
  updateLoadingMessage,
  onUpdateBookingMessage,
  onUpdateProofOfPayMessage,
  onUpdateRulesMessage,
  onUpdateStudenCMessage,

  onUpdateLeaseProgress,
  onUpdateBookingForm,
  onUpdateProofOfPay,
  onUpdateRules,
  onUpdateStudentCard,
  onUpdateLeaseMessage,
  updateLoadingController,
  onPresPopConfirmInfo,
  onUpdateVarsity,

  onUpdateKeyMessage,
  onUpdateKeyProgress,
} from '../../actions';
import PopUpModal from '../../components/PopUpModal';
import PopUpConfirm from '../../components/PopUpConfirm';
import PopUpVarsity from '../../components/PopUpEditVarsity';
import PopUpConfirmInfo from '../../components/PopUpConfirmInfo';
import PDFMerger from 'pdf-merger-js/browser';
import { createPDF,pdfArrayToBlob, mergePDF } from "pdf-actions";
import {
  fileFolderCardData,
  fileStorageStatusCardData,
  areaChartFileReport,
} from "../../Data/FileManagerData";
import { Document, Page, pdfjs } from "react-pdf";
import { set } from "echarts-gl";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

var Base64Binary = {
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	
	/* will return a  Uint8Array type */
	decodeArrayBuffer: function(input) {
		var bytes = (input.length/4) * 3;
		var ab = new ArrayBuffer(bytes);
		this.decode(input, ab);
		
		return ab;
	},

	removePaddingChars: function(input){
		var lkey = this._keyStr.indexOf(input.charAt(input.length - 1));
		if(lkey == 64){
			return input.substring(0,input.length - 1);
		}
		return input;
	},

	decode: function (input, arrayBuffer) {
		//get last chars to see if are valid
		input = this.removePaddingChars(input);
		input = this.removePaddingChars(input);

		var bytes = parseInt((input.length / 4) * 3, 10);
		
		var uarray;
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		var j = 0;
		
		if (arrayBuffer)
			uarray = new Uint8Array(arrayBuffer);
		else
			uarray = new Uint8Array(bytes);
		
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		
		for (i=0; i<bytes; i+=3) {	
			//get the 3 octects in 4 ascii chars
			enc1 = this._keyStr.indexOf(input.charAt(j++));
			enc2 = this._keyStr.indexOf(input.charAt(j++));
			enc3 = this._keyStr.indexOf(input.charAt(j++));
			enc4 = this._keyStr.indexOf(input.charAt(j++));
	
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
	
			uarray[i] = chr1;			
			if (enc3 != 64) uarray[i+1] = chr2;
			if (enc4 != 64) uarray[i+2] = chr3;
		}
	
		return uarray;	
	}
}

class ProfileV1Page extends React.Component {

  constructor(props) {
    super(props);
    this.testRef = React.createRef();
    this.state = {
      residence: {},
      numPages: null,
      pageNumber: 1,
      imgUpload: null,
      selectedFile: null,
      keyString: 'id-document',
      docType: 'ID Document',
      myUserID: null,
      doc: {},
      docs: [],
      tempDoc: {},
      isSelected: false,
      base64Pdf: null,
      docUrl: '',
      showPad: false,
      trimmedDataURL: null,
      userIPAddress: null,
      userBrowser: null,
      dateAndTime: null,
      testDoc: {},
      numPages: null,
      progress: this.props.studentProgress,
      myLease: '',
      isSigned: false,
      tabKey: '',
      fade: false,
      title: '',
      popMessage: '',
      myFunction: null,
      studentDocs: [],
      topBarData: '',
      currentDocID: '',
      currentProgress: '',
      filename: '',
      pageTitle: 'User Profile',
      mergedFile: null,
      myDocs: [],
    }
  }

  componentDidMount() { 
    window.scrollTo(0, 0);
    const userID = localStorage.getItem('userID');
    const userProgress = localStorage.getItem('progress');
    this.setState({ myUserID: userID });
    //////////console.log("Student Progress: ", this.props.studentProgress)

    //Load Documents
    if (localStorage.getItem('role') == 'admin'){
      //////////console.log('I am called')
      this.loadDocuments(this.props.currentStudentiD)
    } else {
      //////////console.log('I am called here')
      this.loadDocuments(userID)
    }
    //this.setState({ progress: userProgress });
    //this.getUserBrowser()
    this.getUserWitnessData()
    const DATE_OPTIONS = { year: 'numeric', month: 'long', day: 'numeric', time: 'long' };
    const myDate = new Date().toLocaleDateString('en-ZA', DATE_OPTIONS)
    const myTime = new Date().toLocaleTimeString('en-ZA')
    this.setState({ dateAndTime: myDate + myTime })
  
    //Set tab 
    if(localStorage.getItem('tab') == '' || localStorage.getItem('tab') == null){
      this.setState({
        tabKey: 'settings'
      })
      this.setKey('settings')
    } else {
      this.setState({
        tabKey: localStorage.getItem('tab')
      })
      this.setKey(localStorage.getItem('tab'))
    }

    //Set document type
    if(localStorage.getItem('docType') != null){
      this.changeDocument(localStorage.getItem('docType'))
    }
    const scrollToElement = () => this.testRef.current.scrollIntoView();
    scrollToElement()
  }

  //Merge Documents
mergePDF(){
  // Async Function To Merge PDF Files Uploaded Using The Input Tag in HTML
const mergePDFHandler = async () => {
  
    this.state.docs.forEach((doc) =>{
    if(doc.FileType != "signature" && doc.FileType != "profile-pic" /* && doc.FileType  == "id-document" */){
      const dataUrl = 'data:' + doc.fileextension + ';base64,' + doc.image
      const temp = this.dataURLtoFile(dataUrl, doc.FileType)

      this.state.myDocs.push(temp)
      
    }
  })
  
  this.state.myDocs.forEach((file) =>{
    
    const test = async () => {
      await createPDF.PDFDocumentFromFile(file)
    }
    test()
    //////////console.log("New File: ", file)
  })
  
  //////////console.log("MergedPDF: ", this.state.myDocs)
  // Merging The PDF Files to A PDFDocument
  const mergedPDFDocument = await mergePDF(this.state.myDocs)
  ////////console.log("MergedPDF: ", mergedPDFDocument)
  this.getBase64(mergedPDFDocument)
  
  //const blob = new Blob([mergedPDFDocument], {type: 'application/pdf'});
 
}
mergePDFHandler()
}
  
  mergeFiles(){
    const merger = new PDFMerger();
    let myBlob;
    //////////console.log('these are the documents: ', this.state.docs)
    const mergeTime = async () =>{
        //Run through docs list
    this.state.docs.forEach((doc) =>{
      if(doc.FileType != "signature" && doc.FileType != "profile-pic" /* && doc.FileType  == "id-document" */){
        const dataUrl = 'data:' + doc.fileextension + ';base64,' + doc.image
        const temp = this.dataURLtoFile(dataUrl, 'Merged Document-' + doc.FileType)

        const myUrl = 'https://adowaimages.rubix.mobi:449/' + doc.filename
        
        const bytes = window.atob(doc.image);
        let length = bytes.length;
        let out = new Uint8Array(length);

        for(let i = 0; i< length; i++){
          out[i] = bytes.charCodeAt(i);
        }

        const blob = new Blob([out], {type: doc.fileextension});
        myBlob = blob
        var uintArray = Base64Binary.decode(dataUrl);  
        var byteArray = Base64Binary.decodeArrayBuffer(dataUrl); 

        merger.add(blob)
        //////////console.log("This is this document: ", merger)

      }
      
    })
    const mergedPdf = await merger.saveAsBlob();
    const url = URL.createObjectURL(myBlob);

    this.setState(
      {
        mergedFile: url
      }
    )
    }
    mergeTime()

  }


//Fetch All documents from DB
  loadDocuments(userID) {
    //Set Loading Screen ON
    localStorage.setItem('nationality', '')
    localStorage.setItem("check", 'no')
    this.props.updateLoadingController(true);
    this.props.updateLoadingMessage("Loading Student Documents...");
    ////////console.log("Loading Student Documents...");
    const fetchData = async () => {
      //Get documents from DB

      await fetch('https://adowadocuments.rubix.mobi:86/feed/post/' + userID)
        .then(response => response.json())
        .then(data => {
          //////////console.log("documents data:", data)
          //Set Documents list to 'docs'
          this.setState({ docs: data.post })

          //Load initial PDF
          let tempList, currentDoc
          if(localStorage.getItem('docType') == null){
            tempList = data.post.filter(doc => doc.FileType == 'id-document')[0]
            currentDoc = 'id-document'
          }else {
            tempList = data.post.filter(doc => doc.FileType == localStorage.getItem('docType'))[0]
            currentDoc = localStorage.getItem('docType')
          }
          

          if(tempList != null || tempList != undefined){
            //Set ID Document to initial Document
          const string = "data:application/pdf;base64," + data.post.filter(doc => doc.FileType == currentDoc)[0].image
          this.setState({ doc: data.post.filter(doc => doc.FileType == currentDoc)[0],
            currentDocID: data.post.filter(doc => doc.FileType == currentDoc)[0].ImageID
          })
          }
          else {
            this.setState({doc: null})
          }

          //Check the lease
          const temp = data.post.filter(doc => doc.FileType == 'lease-agreement')[0]
          if(temp != undefined && temp.length != 0 && temp != null){
            //////////console.log("this is it: ", temp)
            ///set show proof of pay tile
            localStorage.setItem("check", 'yes')
          } else {
            //////////console.log("this is it: ", temp)
          }
          const temp2 = data.post.filter(doc => doc.FileType == 'unsigned-agreement')[0]
          
        });
    };
    fetchData()
    .then(()=>{
      setTimeout(() => {
      this.props.updateLoadingController(false);
    }, 1000)
      this.checkLease(userID)
      this.setDocumentProgress();
    })
  }

  //Check Lease Agreement Doc
  checkLease(userId) {
    //Set Loading Screen ON
    this.props.updateLoadingController(true);
    this.props.updateLoadingMessage("Checking Lease...");
    const temp = this.state.docs.filter(doc => doc.FileType == 'lease-agreement')
    const temp2 = this.state.docs.filter(doc => doc.FileType == 'unsigned-agreement')
    if (temp.length != 0) {
      this.setState({ docUrl: temp[0].image, myLease: temp[0].filename })
      this.setState({ showPad: false })
      //Set timer for loading screen
      setTimeout(() => {
        this.props.updateLoadingController(false);
      }, 2000);
    }
    else if(temp2.length != 0){
      this.setState({ docUrl: temp2[0].image, myLease: temp2[0].filename })
      this.setState({ showPad: true })
      //Set timer for loading screen
      setTimeout(() => {
        this.props.updateLoadingController(false);
      }, 2000);
    }  
  }


  //Switch to different Document type
  changeDocument = (file) => {
    this.setLoadingDocumentPage()
    //Set Loading Screen ON
    this.props.updateLoadingController(true);
    this.props.updateLoadingMessage("Changing Document...");
    const temp = this.state.docs.filter(doc => doc.FileType == file)
    this.setState({ isSelected: false })
    this.setState({ selectedFile: null })
    if(temp != undefined && temp.length != 0){
      this.setState({
        currentDocID: temp[0].ImageID
      })
    }
    this.setState({ keyString: file,
    })
    localStorage.setItem('docType', file)

    //Set timer for loading screen
  setTimeout(() => {
    this.changeHeading(file)
    this.props.updateLoadingController(false);
  }, 1000);

    if (temp.length != 0) {
      this.setState({ doc: temp[0] })
    } else {
      this.setState({ doc: null })
    }
  }

  //Change heading
  changeHeading(file) {
    switch (file) {
      case 'id-document':
        {
          this.setState({ 
            docType: "My ID Document",
            topBarData: <>
            <span><strong>Student Full Name(s): </strong>{this.props.currentStudentname}</span>
            <br></br>
            <span><strong>Student ID is: </strong>{this.props.currentStudentIDNo}</span>
            <br></br>
            </>
            })
        }
        break
        case 'lease-agreement':
          {
            this.setState({ 
              docType: "My Lease Agreement",
              topBarData: <>
          <span><strong> </strong> </span>
          <br></br>
          </>
              })
          }
        break
      case 'proof-of-res':
        {
          this.setState({ docType: "My Proof of Residence",
          topBarData: <>
          <span><strong>Student Address is: </strong>{this.props.currentStudentAddress}</span>
          <br></br>
          </> 
           })
        }
        break
        case 'surety-doc':
          {
            this.setState({ docType: "Deed of Surety",
            topBarData: <>
            
            <br></br>
            </> 
             })
          }
          break
          case 'bank-statement':
            {
              this.setState({ docType: "3 Months Bank Statement",
              topBarData: <>
              
              <br></br>
              </> 
               })
            }
            break
            case 'key-form':
              {
                this.setState({ docType: "Key Receipt Form",
                topBarData: <>
                
                <br></br>
                </> 
                 })
              }
          break
          case 'proof-of-income':
            {
              this.setState({ docType: "My Proof of Income",
              topBarData: <>
              
              <br></br>
              </> 
               })
            }
          break
          case 'proof-of-pay':
            {
              this.setState({ docType: "My Proof of Payment",
              topBarData: <>
              
              <br></br>
              </> 
               })
            }
            break
      case 'proof-of-reg':
        {
          this.setState({ docType: "My Proof of Registration",
          topBarData:<>
          <span><strong>Student Full Name(s): </strong>{this.props.currentStudentname}</span>
          <br></br>
          <span><strong>Student Number is: </strong>{this.props.currentStudentNo}</span>
          <br></br>
          <span><strong>Student is registered at: </strong>{this.props.currentStudentUniversity}</span>
          <br></br>
          <span><strong>Course Registerd for: </strong>{this.props.currentStudentCourse}</span>
          <br></br>
          <span><strong>Year of Study: </strong>{this.props.currentStudentYear}</span>
          <br></br>
          </> 
           })
        }
        break
      case 'next-of-kin':
        {
          this.setState({ docType: "Surety ID",
          topBarData: <>
          <span><strong>Next of Kin ID number is: </strong>{this.props.nextOfKinId
}</span>
          <br></br>
          </> 
           })
        }
    }
  }

  //convert to base64
  getBase64(e) {
    var file = e.target.files[0]
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      this.setState({
        base64Pdf: reader.result
      })
      //////////console.log("This is the img:", this.state.imgUpload)
    };
    reader.onerror = function (error) {
      //////////console.log('Error: ', error);
    }
  }

  //convert to base64
  getBase64fromFile(e) {
    var file = e
    let myBase
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      myBase = reader.result
      //////////console.log("This is the img:", this.state.imgUpload)
    };
    reader.onerror = function (error) {
      //////////console.log('Error: ', error);
    }
  }
  

  //Converts base64 to file
  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  //Post File Using Mongo
  onPressUpload(image, filetype, currentActiveKey) {
    let userID
    if(localStorage.getItem('role') == 'admin'){
      userID = this.props.currentStudentiD
    } else {
      userID = this.state.myUserID
    }
    this.setState({ isLoad: true, })
    const postDocument = async () => {
      const data = new FormData()
      data.append('image', image)
      data.append('FileType', filetype)
      data.append('RubixRegisterUserID', userID)
      const requestOptions = {
        title: 'Student Document Upload',
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data', },
        body: data
      };
      for (var pair of data.entries()) {
        ////////console.log(pair[0], ', ', pair[1]);
      }
      await axios.post('https://adowadocuments.rubix.mobi:86/feed/post?image', data, requestOptions)
        .then(response => {
          ////////console.log("The reponse: ", response)
          this.setState({ mongoID: response.data.post._id })
        })
    }
    postDocument().then(() => {
      localStorage.setItem('tab', currentActiveKey)
      this.setState({
        isLoad: false
      })
      //Populate Pop Up Event
      this.props.onPresPopUpEvent()
      
    })
      
  }

  //Post File Using Mongo
  onPressUpload2(image, filetype, currentActiveKey) {
    let userID
    if(localStorage.getItem('role') == 'admin'){
      userID = this.props.currentStudentiD
    } else {
      userID = this.state.myUserID
    }
    this.setState({ isLoad: true, })
    const postDocument = async () => {
      const data = new FormData()
      data.append('image', image)
      data.append('FileType', filetype)
      data.append('RubixRegisterUserID', userID)
      const requestOptions = {
        title: 'Student Document Upload',
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data', },
        body: data
      };
      for (var pair of data.entries()) {
        ////////console.log(pair[0], ', ', pair[1]);
      }
      await axios.post('https://adowadocuments.rubix.mobi:86/feed/post?image', data, requestOptions)
        .then(response => {
          ////////console.log("The reponse: ", response)
          this.setState({ mongoID: response.data.post._id })
        })
    }
    postDocument().then(() => {
      //localStorage.setItem('tab', currentActiveKey)
      this.setState({
        isLoad: false
      })
      //Populate Pop Up Event
      //this.props.onPresPopUpEvent()
      
    })
      
  }

   //Set Message according to percentage
   setMessage(percent) {
    let message
    switch (percent) {
      case 0, '0':
        message = 'No document uploaded'
        break
      case 50, '50':
        message = 'Pending validation'
        break
      case 100, '100':
        message = 'Approved'
    }
    return message
  }

  setLeaseMessage(percent, result) {
    let message
   if(result == 'correct'){
     message = 'Approved'
   } else if (percent == 0 || percent == '0') {
    message = 'No document uploaded'
   } else if(percent == 50 || percent == '50' && result == null){
    message = 'Pending validation'
   }
    return message
  }

  setLeaseProg(percent, result) {
    let progress
   if(result == 'correct'){
    progress = 100
   } else if (percent == 0 || percent == '0') {
    progress = 0
   } else if(percent == 50 || percent == '50' && result != 'correct'){
    progress = 50
   }
    return progress
  }

  resetProgressBars(){
    //Reset Progress Bar
    this.props.onUpdateIDProgress(0)
    this.props.onUpdateRESProgress(0)
    this.props.onUpdateREGProgress(0)
    this.props.onUpdateNOKProgress(0)
    this.props.onUpdateLeaseProgress(0)
    this.props.onUpdateStudentCard(0)
    this.props.onUpdateRules(0)
    this.props.onUpdateProofOfPay(0)
    this.props.onUpdateBookingForm(0)
    this.props.onUpdateKeyProgress(0)

    //Reset Messages
    this.props.onUpdateIDMessage(this.setMessage(0))
    this.props.onUpdateRESMessage(this.setMessage(0))
    this.props.onUpdateREGMessage(this.setMessage(0))
    this.props.onUpdateNOKMessage(this.setMessage(0))
    this.props.onUpdateLeaseMessage(this.setMessage(0))
    this.props.onUpdateBookingMessage(this.setMessage(0))
    this.props.onUpdateProofOfPayMessage(this.setMessage(0))
    this.props.onUpdateRulesMessage(this.setMessage(0))
    this.props.onUpdateStudenCMessage(this.setMessage(0))
    this.props.onUpdateKeyMessage(this.setMessage(0))

    //Reset Nationality
    localStorage.getItem('nationality', '')
  }

  
  //Get user document progress
  setDocumentProgress() {
    this.props.updateLoadingController(true);
    this.props.updateLoadingMessage("Loading Documents...");
    let studentId
    if (localStorage.getItem('role') == 'admin'){
      studentId = this.props.currentStudentiD
    } else {
      studentId = localStorage.getItem('userID')
    }
    const data = {
      'RubixRegisterUserID':  studentId,
    };

    const requestOptions = {
      title: 'Fetch User Document Progresses',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    };

    const postData = async () => {
      await axios.post('https://adowarest.rubix.mobi:88/api/RubixDocumentsProgress', data, requestOptions)
        .then(response => {
          const temp = response.data.PostRubixUserData
          this.resetProgressBars()
          console.log("The returned data: ", response)
         
          for (let i = 1; i <= temp.length - 1; i++) {
            switch (temp[i].FileType) {
              case 'id-document': {
                this.props.onUpdateIDProgress(temp[i].Percentage)
                this.props.onUpdateIDMessage(this.setMessage(temp[i].Percentage))
              }
                break;
              case "proof-of-res": {
                this.props.onUpdateRESProgress(temp[i].Percentage)
                this.props.onUpdateRESMessage(this.setMessage(temp[i].Percentage))
              }
                break;
              case "proof-of-reg": {
                this.props.onUpdateREGProgress(temp[i].Percentage)
                this.props.onUpdateREGMessage(this.setMessage(temp[i].Percentage))
              }
                break;
              case "next-of-kin": {
                this.props.onUpdateNOKProgress(temp[i].Percentage)
                this.props.onUpdateNOKMessage(this.setMessage(temp[i].Percentage))
              }
                break;
              case "lease-agreement": {
                this.props.onUpdateLeaseProgress(this.setLeaseProg(temp[i].Percentage, temp[i].RubixVettedResult))
                this.props.onUpdateLeaseMessage(this.setLeaseMessage(temp[i].Percentage, temp[i].RubixVettedResult))
              }
              break;
            case "bank-statement": {
              this.props.onUpdateBookingForm(temp[i].Percentage)
              this.props.onUpdateBookingMessage(this.setMessage(temp[i].Percentage))
            }
              break;
            case "proof-of-income": {
              this.props.onUpdateProofOfPay(temp[i].Percentage)
              this.props.onUpdateProofOfPayMessage(this.setMessage(temp[i].Percentage))
            }
              break;
            case "surety-doc": {
              this.props.onUpdateRules(temp[i].Percentage)
              this.props.onUpdateRulesMessage(this.setMessage(temp[i].Percentage))
            }
              break;
            case "nsfas-doc": {
              this.props.onUpdateStudentCard(temp[i].Percentage)
              this.props.onUpdateStudenCMessage(this.setMessage(temp[i].Percentage))
            }
              break;
            case "key-form": {
              this.props.onUpdateKeyProgress(temp[i].Percentage)
              this.props.onUpdateKeyMessage(this.setMessage(temp[i].Percentage))
            }
            }
          }
        })
    }
    postData().then(()=>{
      //Set timer for loading screen
      setTimeout(() => {
        this.props.updateLoadingController(false);
        //this.mergePDF()
      }, 3000);
    })
  }

  //Get Progress
  getProgress(doc){
    let progress;
    switch(doc){
      case 'id-document':
        {
          progress = this.props.idProgress
        }
        break;
      case 'proof-of-res':
        {
          progress = this.props.resProgress
        }
        break;
      case 'proof-of-reg':
        {
          progress = this.props.regProgress
        }
        break;
      case 'next-of-kin':
        {
          progress = this.props.nokProgress
        }
        break;
      case "lease-agreement":
        {
          progress = this.props.myLeaseProgress
        }
        break;
      case "bank-statement":
        {
          progress = this.props.myBookingFProgress
        }
        break;
      case "proof-of-income":
        {
          progress = this.props.myProofOfPayProgress
        }
        break;
      case "surety-doc":
        {
          progress = this.props.myRules
        }
        break;
      case "nsfas-doc":
        {
          progress = this.props.myStudentCardProgress
        }
        break;
      case "key-form":
        {
          progress = this.props.myKeyFormProgress
        }
        break;
      case "proof-of-pay":
        {
          progress = 0
        }
    }
    return progress
  }

  //Get Progress
  getMessage(doc){
    let message;
    switch(doc){
      case 'id-document':
        {
          message = this.props.idMessage
        }
        break;
      case 'proof-of-res':
        {
          message = this.props.resMessage
        }
        break;
      case 'proof-of-reg':
        {
          message = this.props.regMessage
        }
        break;
      case 'next-of-kin':
        {
          message = this.props.nokMessage
        }
        break;
      case 'lease-agreement':
        {
          message = this.props.myLeaseMessage
        }
        break;
      case 'bank-statement':
        {
          message = this.props.myBookingFMessage
        }
        break;
      case "proof-of-income":
        {
          message = this.props.myProofOfPayMessage
        }
        break;
      case "surety-doc":
        {
          message = this.props.myRulesMessage
        }
        break;
      case "nsfas-doc":
        {
          message = this.props.myStudentCardMessage
        }
        break;
      case "key-form":
        {
          message = this.props.myKeyFormMessage
        }
        break;
      case "proof-of-pay":
        {
          message = "Please sign lease first"
        }
    }
    return message
  }

  //When User Presses Cancel on Document Uploading
  onPressCancel() {
    this.setState({ selectedFile: null })
    this.setState({ isSelected: false })
  }

  //Handle File Selection input
  changeHandler(event) {
    this.setState({ selectedFile: event.target.files[0] })
    //////////console.log("selcted file1", event.target.files[0].type)
    if(event.target.files[0].type == 'image/png' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'application/pdf'){
      this.onPressUpload(event.target.files[0], this.state.keyString, 'documents')
      this.setState({ isSelected: true })
      this.getBase64(event)
    } else {
      alert("Please select proper file")
    }
  }

  handleUpdate(e) {
    const inputFile = document.getElementById('upload-button')
    inputFile.click()
  }

  //Signature Pad array of lines
  sigPad = {}
  //Function for clearing signature pad
  clear = () => {
    this.sigPad.clear()
  }
  
  //Function for triming Signature Pad array and save as one png file
  trim = () => {
    //var myBlob = this.sigPad.getTrimmedCanvas().toBlob
    //var myFile = new File([myBlob], 'mySignature', { type: "image/png", })
    var my2ndFile = this.dataURLtoFile(this.sigPad.getTrimmedCanvas().toDataURL('image/png'), 'Student signature')
    //////////console.log('The file: ', my2ndFile)
    this.onPressSignatureUpload(my2ndFile)
    this.setLoadingPage(3000)
     if (this.sigPad.getTrimmedCanvas().toDataURL('image/png') != null) {
      this.setState({ trimmedDataURL: this.sigPad.getTrimmedCanvas().toDataURL('image/png') })
      //////////console.log("IP Address:", this.state.userIPAddress)
      this.postSignature(this.sigPad.getTrimmedCanvas().toDataURL('image/png'), this.state.myUserID, 1)
      setTimeout(() => {
        this.postKeyForm(this.sigPad.getTrimmedCanvas().toDataURL('image/png'), this.state.myUserID)
      }, 3000)
      

    } else {
      alert("Please provide a signature")
    } 
  }
  
  //Update Profile Picture
  onPressSignatureUpload(file) {
    //e.preventDefault();
    //var file = this.state.selectedFile
    const postDocument = async () => {
      const data = new FormData()
      data.append('image', file)
      data.append('FileType', 'signature')
      data.append('RubixRegisterUserID', this.state.myUserID)
      const requestOptions = {
        title: 'Save Student Signature',
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data', },
        body: data
      };
      for (var pair of data.entries()) {
        //////////console.log(pair[0], ', ', pair[1]);
      }
      await axios.post('https://adowadocuments.rubix.mobi:86/feed/post?image', data, requestOptions)
        .then(response => {
          //////////console.log("Upload details:", response)
          //this.setState({ mongoID: response.data.post._id })
          //window.location.reload()
        })
    }
    postDocument()
  }

  //Coleect User Signing Info
  getUserWitnessData() {
    //Fetch IP Address
    const getData = async () => {
      const res = await axios.get('https://geolocation-db.com/json/')
      //////////console.log("my IP", res.data);
      this.setState({userIPAddress: res.data.IPv4 })
    }
    getData()
  }

  //Function to post signature to API
  postSignature(signature, userid, tryval) {
    const postDocument = async () => {
      const data = {
        'RubixRegisterUserID': userid,
        'ClientId': localStorage.getItem('clientID'),
        'Time_and_Date': this.state.dateAndTime,
        'Signature': signature
      }
      const requestOptions = {
        title: 'Student Signature Upload',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: data
      };
      ////////console.log("Posted Data:", data)
      await axios.post('https://adowarest.rubix.mobi:88/api/RubixGeneratePDF', data, requestOptions)
        .then(response => {
          ////////console.log("Signature upload details:", response)
          this.setState({ docUrl: response.data.PostRubixUserData })
          if (tryval === 1) {
            const dataUrl = 'data:application/pdf;base64,' + response.data.PostRubixUserData
            const temp = this.dataURLtoFile(dataUrl, 'Lease Agreement') //this.convertBase64ToBlob(response.data.Base)
            //////////console.log("temp file:", temp)
            this.onPressUpload2(temp, 'lease-agreement', 'signing')
          } else if (tryval === 0) {
            const dataUrl = 'data:application/pdf;base64,' + response.data.PostRubixUserData
            const temp = this.dataURLtoFile(dataUrl, 'unsigned Agreement') //this.convertBase64ToBlob(response.data.Base)
            //////////console.log("temp file:", temp)
            this.onPressUpload2(temp, 'unsigned-agreement', 'signing')
          }
        })
    }
    postDocument()
  }

  //Function to post signature to API
  postKeyForm(signature, userid) {
    const postDocument = async () => {
      const data = {
        'RubixRegisterUserID': userid,
        'ClientId': localStorage.getItem('clientID'),
        'Time_and_Date': this.state.dateAndTime,
        'Signature': signature
      }
      const requestOptions = {
        title: 'Student Signature Upload',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: data
      };
      ////////console.log("Posted Data:", data)
      await axios.post('https://adowarest.rubix.mobi:88/api/RubixGenerateKeyReceiptFormPDF', data, requestOptions)
        .then(response => {
          ////////console.log("Signature upload details:", response)
          const dataUrl = 'data:application/pdf;base64,' + response.data.PostRubixUserData
          const temp = this.dataURLtoFile(dataUrl, 'Key Form') //this.convertBase64ToBlob(response.data.Base)
          //////////console.log("temp file:", temp)
          this.onPressUpload2(temp, 'key-form', 'signing')
        })
    }
    postDocument().then(() => {
      this.setState({
        isLoad: false
      })
      //Populate Pop Up Event
      this.props.onPresPopUpEvent()
  })

  }

  //On Press loading data
  setLoadingPage(time,) {
    this.setState({ isLoad: true, })
    setTimeout(() => {
      this.setState({
        isLoad: false,
      })
    }, time);
  }
  
  //On Press loading data
  setLoadingDocumentPage() {
    this.setState({ isDocLoad: true, })
    setTimeout(() => {
      this.setState({
        isDocLoad: false,
      })
    }, 700);
  }

  getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("application/pdf");
    return dataURL.replace(/^data:application\/?[A-z]*;base64,/);
  }

  
  nextOfKinEmail(){
    //Set Loading Screen ON
    this.props.updateLoadingController(true);
    this.props.updateLoadingMessage("Loading Student Details, Please wait...");
    const pingData = {
      'RubixRegisterUserID': localStorage.getItem('userID'),
      'SuretyEmail': this.state.suretyEmail,
    };
    const requestOptions = {
      title: 'Send Out Student Email',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: pingData
    };
    //////////console.log("The information sent: ", pingData)
    const postData = async () => {
      await axios.post('https://adowarest.rubix.mobi:88/api/RubixDeedofSuretyEmail', pingData, requestOptions)
      .then(response => {
        //////////console.log("The response = ", response)
        alert("Email sent out.")
      })
    }
    postData().then(()=>{
      this.props.updateLoadingController(false);
    })
  }

  //Set Key
  setKey(e){
    localStorage.setItem('tab', e)
    this.setState({
      tabKey: e
    })
  }

   //Set Message according to percentage
   setMessage(percent) {
    let message
    switch (percent) {
      case 0, '0':
        message = 'No Document Uploaded'
        break
      case 50, '50':
        message = 'Pending Vetting'
        break
      case 100, '100':
        message = 'Approved'
    }
    return message
  }

  render() {
    let myBody, myLease;
      myBody = <> {this.state.doc != null 
        ? <>
        {localStorage.getItem('role') == 'admin' ? this.state.topBarData : null}
        <input style={{ display: 'none' }} id='upload-button' type="file" onChange={(e) => this.changeHandler(e)} />
        {
          this.getProgress(this.state.doc.FileType) != 100 || localStorage.getItem('role') == 'admin'
          ?this.state.keyString != 'lease-agreement' 
          ?<button className="btn btn-primary" variant="contained" color="primary" component="span" onClick={(e) => this.handleUpdate(e)}>Upload A New File</button>
          : null
          : null
        }
          
          <iframe style=  {localStorage.getItem('role') == 'admin'?{} :{pointerEvents: 'none', overflowY: 'scroll'}} src={'https://adowaimages.rubix.mobi:449/' + this.state.doc.filename}width="100%" height="800px">
    </iframe>
        </>
        : <>
          {this.state.keyString != 'lease-agreement' && this.state.keyString != 'proof-of-pay'/* || this.state.keyString != 'proof-of-pay' */
          ? <>
          {
            this.state.keyString == 'key-form'
            ?<>
            <iframe style=  {localStorage.getItem('role') == 'admin'?{} :{pointerEvents: 'none', overflowY: 'scroll'}} src={"https://adowaimages.rubix.mobi:449/2a32ee9c-d6fb-4f2c-9665-0c78e119385e.pdf"}width="100%" height="800px"></iframe>
            </>
            : 
            <>
            {
              this.state.keyString == 'surety-doc'
              ?<>
              <iframe style=  {localStorage.getItem('role') == 'admin'?{} :{pointerEvents: 'none', overflowY: 'scroll'}} src={'https://adowaimages.rubix.mobi:449/17_surety-doc_Samkelo_Zondi_21458321.pdf'}width="100%" height="800px"></iframe>
              </>
              :<>
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
            <p style={{ textAlign: 'center' }} className="lead">Oops, it seems that you have not uploaded a document yet, to enable viewer, please upload a document.</p>
            <div>
              <input style={{ display: 'none' }} id='upload-button' type="file" onChange={(e) => { this.changeHandler(e) }} />
              <button className="btn btn-primary" variant="contained" color="primary" component="span" onClick={(e) => this.handleUpdate(e)}>Upload A New File</button>
            </div>
          </div>
              </>
            }
            </>
          }
          </>
          
        
          : <><p style={{ textAlign: 'center' }} className="lead">Oops, it seems that you have not Any active lease, please make sure all documents are uploaded and you are assigned to a room.</p>


          {
            this.state.keyString == 'proof-of-pay' && localStorage.getItem('check') == 'yes'
            ? 
            <>
            <input style={{ display: 'none' }} id='upload-button' type="file" onChange={(e) => { this.changeHandler(e) }} />
            <button className="btn btn-primary" variant="contained" color="primary" component="span" onClick={(e) => this.handleUpdate(e)}>Upload A File</button>
            </>
            : null
          }
          </>
          
          
           }
        </>
      }
      </>

        if (this.props.showLease){
          myLease =
        <Tab eventKey="signing" title="Lease Agreement">
          <div className="w-auto p-3">
            { !this.state.myLease
              ? <>
              
              <p>Loading document...</p>
            </>
            :<>
            <div className="bg-danger p-1">
                <p className="text-white">Please Note that there is a <strong>R700</strong> fee applicable after signing the below lease.</p>
              </div>
              <div style= {localStorage.getItem('role') == 'admin'?{} :{overflow: 'scroll'}}>
            <iframe /* sandbox="allow-pointer-lock" */ style= {localStorage.getItem('role') == 'admin'?{} :{pointerEvents: 'none', overflow: 'hidden'}} src={'https://adowaimages.rubix.mobi:449/' + this.state.myLease} 
            className="scrolling"
            width="100%" height="800px" >
           </iframe>
           </div>
           <input type="email" placeholder="Please enter surety email" onChange={(e) => {this.setState({suretyEmail: e.target.value})}}></input>
           <button className="btn btn-primary" onClick={(e) => {this.nextOfKinEmail()}}>Send Surety Sign Email</button>
            </>
           
           }
            {
              this.state.showPad
                ? <>
                  <p>If you agree to the above document, please enter your signature:</p>
                  <div className="border border-primary border-2 p-3" style={{
                    width: '100%'
                    }}>
                    <SignatureCanvas className="border border-primary border-2" penColor='black'
                    canvasProps={{  height: '100%', width: '400px', className: 'sigCanvas' }} ref={(ref) => { this.sigPad = ref }} />
                    </div>
                  <button className="btn btn-primary rounded-0" onClick={() => this.trim()}>
                    Submit Signature
                  </button>
                  <button className="btn btn-default" onClick={this.clear}>
                    Clear
                  </button>
                </>
                : null
            }
  
          </div>
  
        </Tab>
        } else {
          myLease = null
        }

    return (
      <div className="theme-grey" ref={this.testRef}
        style={{ flex: 1 }}
        onClick={() => {
          document.body.classList.remove("offcanvas-active");
        }}
      >
         <Helmet>
                <meta charSet="utf-8" />
                <title>{this.state.pageTitle}</title>
            </Helmet>
            <div
          className="page-loader-wrapper"
          style={{ display: this.props.MyloadingController ? "block" : "none" }}
        >
          <div className="loader">
            <div className="m-t-30">
              <img
                src={localStorage.getItem('clientLogo')}
                width="10%"
                height="10%"
                alt="Rubix System"
              />
            </div>
            <p>{this.props.loadingMessage}</p>
          </div>
        </div>


        {/* <PopUpVarsity
        StudentID = {this.state.myUserID}
        /> */}
        <PopUpModal 
        Title= "Upload Complete!"
        Body = "Your document has been uploaded successfully."
        Function ={()=>{
           //Load Documents
    if (localStorage.getItem('role') == 'admin'){
      //////////console.log('I am called')
      this.loadDocuments(this.props.currentStudentiD)
    } else {
      //////////console.log('I am called here')
      this.loadDocuments(this.state.myUserID)
    }
          //window.location.reload()
      this.setDocumentProgress()
        }}
        />
        <PopUpConfirm 
        Title= "Confirm Vetting!"
        Body = "You are confirming that the document and information are in line."
        FileType = {this.state.keyString} 
        DocID = {this.state.currentDocID}
        Filename = {this.state.docs.filter(doc => doc.FileType == this.state.keyString)[0]}
        Function = {()=>{
          //Load Documents
   if (localStorage.getItem('role') == 'admin'){
     //////////console.log('I am called')
     this.loadDocuments(this.props.currentStudentiD)
   } else {
     //////////console.log('I am called here')
     this.loadDocuments(this.state.myUserID)
   }
         //window.location.reload()
     this.setDocumentProgress()
       }}
        />
        <div className="page-loader-wrapper" style={{ display: this.state.isLoad ? 'block' : 'none' }}>
          <div className="loader">
            <div className="m-t-30"><img src={localStorage.getItem('clientLogo')} width="10%" height="10%" alt=" " /></div>
            <p>Uploading document...</p>
          </div>
        </div>
        <div>
          <div className="container-fluid" >

            {
            localStorage.getItem('role') == 'admin'
            ? null
            : <PageHeader
              HeaderText="Adowa Living User Profile"
              Breadcrumb={[
                { name: "Page", navigate: "" },
                { name: "My Profile", navigate: "" },
              ]}
            />}

            <div
              className="progress-bar bg-success progress-bar-striped"
              data-transitiongoal={this.props.studentProgress}
              aria-valuenow={this.props.studentProgress}
              style={{ width: this.props.studentProgress + `%` }}
            >
              Profile is {this.props.studentProgress}% complete
            </div>
            <div className="row clearfix">
              <div className="col-lg-12">
                <div className="card">
                  <div className="body" >
                    <Tabs
                      activeKey={this.state.tabKey}
                      onSelect={(e) => this.setKey(e)}
                      id="controlled-tab-example"
                    >
                      <Tab eventKey="settings" title="Personal Information">
                        <ProfileV1Setting />
                      </Tab>
          
                      <Tab  eventKey="documents" title="Documents">
                        <div
                          style={{ flex: 1 }}
                          onClick={() => {
                            document.body.classList.remove("offcanvas-active");
                          }}
                        >
                          <div>
                            <div className="container-fluid">
                              <div className="row clearfix">
                                <div className="col-lg-3 col-md-5 col-sm-12">
                                  {
                                  fileStorageStatusCardData.map((data, index) => {

                                    /* if(data.FileType == 'nsfas-doc' && localStorage.getItem('payMethod') == 'NSFAS'){

                                    } else {
                                      
                                    } */
                                    
                                    return (
                                      <div 
                                      key={index + "sidjpidj"} 
                                      onClick={() => this.changeDocument(data.FileType)}
                                      onAnimationEnd={() => this.setState({ fade: false,
                                        currentProgress: data.UsedPer,
                                      })}
                                      >
                                        <FileStorageStatusCard
                                          key={index + "sidjpidj"}
                                          TotalSize={data.RubixVettedResult}
                                          UsedSize={data.UsedSize}
                                          Type={this.getMessage(data.FileType)}
                                          UsedPer={this.getProgress(data.FileType)}
                                          ProgressBarClass={`${data.ProgressBarClass}`}
                                          MyFunction = {()=>{this.props.onPresPopUpConfirm()}}
                                        />
                                      </div>
                                    );
                                  })}
                                  <div>
                                  </div>
                                </div>
                                <div className="col-lg-9 col-md-7 col-sm-12">
                                  <div style={{ height: '100%' }} className="pdf-div">
                                    <p className="lead" style={{ textAlign: 'center' }}>{this.state.docType}</p>
                                    {myBody}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Tab>
{myLease}
                    </Tabs>
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

const mapStateToProps = ({ navigationReducer, ioTReducer, mailInboxReducer }) => ({
  rubixUserID: navigationReducer.userID,
  isSecuritySystem: ioTReducer.isSecuritySystem,
  studentProgress: navigationReducer.progressBar,
  isPopUpModal: mailInboxReducer.isPopUpModal,
  isUpdateVarsityModal: mailInboxReducer.isShowVarsityPopUp,

  currentStudentiD: navigationReducer.studentID,
  currentStudentIDNo: navigationReducer.studentIDNo,
  currentStudentname: navigationReducer.studentName,

  currentStudentAddress: navigationReducer.studentAddress,
  currentStudentUniversity: navigationReducer.studentUniversity,
  currentStudentCourse: navigationReducer.studentCourse,
  currentStudentYear: navigationReducer.studentYearOfStudy,
  currentStudentNo: navigationReducer.studentStudentNo,

  nextOfKinName: navigationReducer.nextofKinName,
  nextOfKinId: navigationReducer.nextofKinID,

  idProgress: navigationReducer.idProgress,
  idMessage: navigationReducer.idMessage,

  resProgress: navigationReducer.proofOfResProgress,
  resMessage: navigationReducer.proofOfResMessage,

  regProgress: navigationReducer.proofOfRegProgress,
  regMessage: navigationReducer.proofOfRegMessage,

  nokProgress: navigationReducer.nextOfKinProgress,
  nokMessage: navigationReducer.nextOfKinMessage,

  myLeaseProgress: navigationReducer.leaseProgress,
  myLeaseMessage: navigationReducer.leaseMessage,

  myStudentCardProgress: navigationReducer.studentCProgress,
  myStudentCardMessage: navigationReducer.studentCMessage,

  myProofOfPayProgress: navigationReducer.proofOfPayProgress,
  myProofOfPayMessage: navigationReducer.proofOfPayMessage,

  myBookingFProgress: navigationReducer.bookingProgress,
  myBookingFMessage: navigationReducer.bookingFMessage,

  myKeyFormProgress: navigationReducer.keyProgress,
  myKeyFormMessage: navigationReducer.keyMessage,

  myRules: navigationReducer.rulesProgress,
  myRulesMessage: navigationReducer.rulesMessage,
  
  showLease: mailInboxReducer.isShowLease,

  showConfrimInfo: mailInboxReducer.isShowConfirmInfo,

  MyloadingController: navigationReducer.loadingController,
  loadingMessage: navigationReducer.loadingMessage,


});

export default connect(mapStateToProps, {
  onPresPopUpEvent,
  onPresPopUpConfirm,

  onUpdateNOKProgress,
  onUpdateIDProgress,
  onUpdateRESProgress,
  onUpdateREGProgress,

  onUpdateNOKMessage,
  onUpdateREGMessage,
  onUpdateRESMessage,
  onUpdateIDMessage,
  onUpdateBookingMessage,
  onUpdateProofOfPayMessage,
  onUpdateRulesMessage,
  onUpdateStudenCMessage,

  updateLoadingMessage,
  updateLoadingController,

  onUpdateLeaseProgress,
  onUpdateBookingForm,
  onUpdateProofOfPay,
  onUpdateRules,
  onUpdateStudentCard,

  onUpdateLeaseMessage,

  onUpdateVarsity,

  onPresPopConfirmInfo,

  onUpdateKeyMessage,
  onUpdateKeyProgress,
})(ProfileV1Page);