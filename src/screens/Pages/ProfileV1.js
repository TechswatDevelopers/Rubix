import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import { Tabs, Tab, Row, Col } from "react-bootstrap";
import ProfileV1Setting from "../../components/Pages/ProfileV1Setting";
import ResidenceInformation from "../../components/Pages/ResInformation";
import DocumentManager from "../../components/Pages/documentsSetting";
import axios from "axios";
import FileFolderCard from "../../components/FileManager/FileFolderCard";
import FileStorageCard from "../../components/FileManager/FileStorageCard";
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
  onUpdateLeaseProgress,
  onUpdateLeaseMessage,
  updateLoadingController,
  onUpdateVarsity,} from '../../actions';
import PopUpModal from '../../components/PopUpModal';
import PopUpConfirm from '../../components/PopUpConfirm';
import PopUpVarsity from '../../components/PopUpEditVarsity';
import PDFMerger from 'pdf-merger-js/browser';
//import tempfile from 'tempfile';
//import DocViewer from "react-doc-viewer";

import {
  fileFolderCardData,
  fileStorageStatusCardData,
  areaChartFileReport,
} from "../../Data/FileManagerData";
import { Document, Page, pdfjs } from "react-pdf";
import { set } from "echarts-gl";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

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
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    const userID = localStorage.getItem('userID');
    const userProgress = localStorage.getItem('progress');
    this.setState({ myUserID: userID });
    console.log("Student Progress: ", this.props.studentProgress)

    //Load Documents
    if (localStorage.getItem('role') == 'admin'){
      this.loadDocuments(this.props.currentStudentiD)
    } else {
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
  mergeFiles(){
    const merger = new PDFMerger();
    //console.log('these are the documents: ', this.state.docs)
    const mergeTime = async () =>{
        //Run through docs list
    this.state.docs.forEach((doc) =>{
      if(doc.FileType != "signature" && doc.FileType != "profile-pic"){
        const dataUrl = 'data:' + doc.fileextension + ';base64,' + doc.image
        const temp = this.dataURLtoFile(dataUrl, 'Merged Document-' + doc.FileType)

        const bytes = atob(doc.image);
        let length = bytes.length;
        let out = new Uint8Array(length);

        merger.add(temp)
        console.log("This is this document: ", temp)
      }
      
    })
    const mergedPdf = await merger.saveAsBlob();
    const url = URL.createObjectURL(mergedPdf);

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
    this.props.updateLoadingController(true);
    this.props.updateLoadingMessage("Loading Student Documents...");
    console.log("Loading Student Documents...");
    const fetchData = async () => {
      //Get documents from DB
      await fetch('https://rubixdocuments.cjstudents.co.za:86/feed/post/' + userID)
        .then(response => response.json())
        .then(data => {
          console.log("documents data:", data)
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

          //Convert base64 to file
          //const image = this.dataURLtoFile(string, "document.pdf")
          //this.setState({ testDoc: image })
          }
          else {
            this.setState({doc: null})
          }
          //console.log("Documents: ", data.post)

          //Check the lease
          const temp = data.post.filter(doc => doc.FileType == 'lease-agreement')[0]
          const temp2 = data.post.filter(doc => doc.FileType == 'unsigned-agreement')[0]
          
        });

    };
    fetchData()
    .then(()=>{
      setTimeout(() => {
      this.props.updateLoadingController(false);
    }, 1000)
      this.checkLease(userID)
      this.setDocumentProgress()
      //Set timer for loading screen
  ;
      
    })
    
  }

  //Check Lease Agreement Doc
  checkLease(userId) {
    //Set Loading Screen ON
    this.props.updateLoadingController(true);
    this.props.updateLoadingMessage("Checking Lease...");
    const temp = this.state.docs.filter(doc => doc.FileType == 'lease-agreement')
    const temp2 = this.state.docs.filter(doc => doc.FileType == 'unsigned-agreement')
    //console.log(temp[0].image)
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
    //console.log('Doc: ', temp)
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
          this.setState({ docType: "Next of Kin ID",
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
    //console.log('My document before base64', e.target.files[0])
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      this.setState({
        base64Pdf: reader.result
      })
      //console.log("This is the img:", this.state.imgUpload)
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
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
        //console.log(pair[0], ', ', pair[1]);
      }
      await axios.post('https://rubixdocuments.cjstudents.co.za:86/feed/post?image', data, requestOptions)
        .then(response => {
          //console.log("Upload details:", response)
          this.setState({ mongoID: response.data.post._id })
          this.onPressSignatureUpload(this.state.trimmedDataURL)
        })
    }
    postDocument().then(() => {
      localStorage.setItem('tab', currentActiveKey)
      //alert("Document uploaded successfully")
      this.setState({
        isLoad: false
      })

      //Populate Pop Up Event
      this.props.onPresPopUpEvent()
      
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
    this.props.onUpdateIDProgress(0)
    this.props.onUpdateRESProgress(0)
    this.props.onUpdateREGProgress(0)
    this.props.onUpdateNOKProgress(0)
    this.props.onUpdateLeaseProgress(0)

    //Reset Messages
    this.props.onUpdateIDMessage(this.setMessage(0))
    this.props.onUpdateRESMessage(this.setMessage(0))
    this.props.onUpdateREGMessage(this.setMessage(0))
    this.props.onUpdateNOKMessage(this.setMessage(0))
    this.props.onUpdateLeaseMessage(this.setMessage(0))
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
      title: 'Fetch User Profile Form',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    };

    const postData = async () => {
      await axios.post('https://rubixapi.cjstudents.co.za:88/api/RubixDocumentsProgress', data, requestOptions)
        .then(response => {
          //console.log("document progress", response)
          const temp = response.data.PostRubixUserData
          this.resetProgressBars()
         
          for (let i = 1; i <= temp.length - 1; i++) {
            switch (temp[i].FileType) {
              case 'id-document': {
                //console.log('its an ID')
                this.props.onUpdateIDProgress(temp[i].Percentage)
                this.props.onUpdateIDMessage(this.setMessage(temp[i].Percentage))
              }
                break;
              case "proof-of-res": {
                //console.log('its a Proof of res')
                this.props.onUpdateRESProgress(temp[i].Percentage)
                this.props.onUpdateRESMessage(this.setMessage(temp[i].Percentage))
              }
                break;
              case "proof-of-reg": {
                //console.log('its a proof of res')
                this.props.onUpdateREGProgress(temp[i].Percentage)
                this.props.onUpdateREGMessage(this.setMessage(temp[i].Percentage))
              }
                break;
              case "next-of-kin": {
                //console.log('its a next of kin')
                this.props.onUpdateNOKProgress(temp[i].Percentage)
                this.props.onUpdateNOKMessage(this.setMessage(temp[i].Percentage))
              }
                break;
              case "lease-agreement": {
                //console.log('its a lease')
                this.props.onUpdateLeaseProgress(this.setLeaseProg(temp[i].Percentage, temp[i].RubixVettedResult))
                this.props.onUpdateLeaseMessage(this.setLeaseMessage(temp[i].Percentage, temp[i].RubixVettedResult))
              }
              
            }
          }
        })

    }
    postData().then(()=>{
      //Set timer for loading screen
      setTimeout(() => {
        this.props.updateLoadingController(false);
        //this.mergeFiles()
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
    //console.log("selcted file1", event.target.files[0].type)
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
    //console.log('The file: ', my2ndFile)
    this.onPressSignatureUpload(my2ndFile)
    this.setLoadingPage(3000)
     if (this.sigPad.getTrimmedCanvas().toDataURL('image/png') != null) {
      this.setState({ trimmedDataURL: this.sigPad.getTrimmedCanvas().toDataURL('image/png') })
      //console.log("IP Address:", this.state.userIPAddress)
      this.postSignature(this.sigPad.getTrimmedCanvas().toDataURL('image/png'), this.state.myUserID, 1)
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
        //console.log(pair[0], ', ', pair[1]);
      }
      await axios.post('https://rubixdocuments.cjstudents.co.za:86/feed/post?image', data, requestOptions)
        .then(response => {
          //console.log("Upload details:", response)
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
      //console.log("my IP", res.data);
      this.setState({userIPAddress: res.data.IPv4 })
    }
    getData()
    
  }

  //Function to post signature to API
  postSignature(signature, userid, tryval) {
    const postDocument = async () => {
      const data = {
        'RubixRegisterUserID': userid,
        'ClientIdFronEnd': localStorage.getItem('clientID'),
        'IP_Address': this.state.userIPAddress,
        'Time_and_Date': this.state.dateAndTime,
        'image': signature
      }
      const requestOptions = {
        title: 'Student Signature Upload',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: data
      };
      //console.log("Posted Data:", data)
      await axios.post('https://rubixpdf.cjstudents.co.za:94/PDFSignature', data, requestOptions)
        .then(response => {
          //console.log("Signature upload details:", response)
          this.setState({ docUrl: response.data.Base })
          if (tryval === 1) {
            const dataUrl = 'data:application/pdf;base64,' + response.data.Base
            const temp = this.dataURLtoFile(dataUrl, 'Lease Agreement') //this.convertBase64ToBlob(response.data.Base)
            //console.log("temp file:", temp)
            this.onPressUpload(temp, 'lease-agreement', 'signing')
          } else if (tryval === 0) {
            const dataUrl = 'data:application/pdf;base64,' + response.data.Base
            const temp = this.dataURLtoFile(dataUrl, 'unsigned Agreement') //this.convertBase64ToBlob(response.data.Base)
            //console.log("temp file:", temp)
            this.onPressUpload(temp, 'unsigned-agreement', 'signing')
          }
        })
    }
    postDocument()
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
          
          <iframe src={'https://rubiximages.cjstudents.co.za:449/' + this.state.doc.filename}width="100%" height="500px">
    </iframe>
        </>

        : <>
          {this.state.keyString != 'lease-agreement'
          ? <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
            <p style={{ textAlign: 'center' }} className="lead">Oops, it seems that you have not uploaded a document yet, to enable viewer, please upload a document.</p>
            <div>
              <input style={{ display: 'none' }} id='upload-button' type="file" onChange={(e) => { this.changeHandler(e) }} />
              <button className="btn btn-primary" variant="contained" color="primary" component="span" onClick={(e) => this.handleUpdate(e)}>Upload A File</button>
            </div>
          </div>
          :<p style={{ textAlign: 'center' }} className="lead">Oops, it seems that you have not Any active lease, please make sure all documents are uploaded and you are assigned to a room.</p>
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
            :<iframe src={'https://rubiximages.cjstudents.co.za:449/' + this.state.myLease} width="100%" height="500px">
           </iframe>}
            
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
      <div ref={this.testRef}
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
                width="20%"
                height="20%"
                alt="Rubix System"
              />
            </div>
            <p>{this.props.loadingMessage}</p>
          </div>
        </div>
        <PopUpVarsity
        StudentID = {this.state.myUserID}
        />
        <PopUpModal 
        Title= "Upload Complete!"
        Body = "Your document has been uploaded successfully."
        Function ={()=>{
          window.location.reload()
      this.setDocumentProgress()
        }}
        />
        <PopUpConfirm 
        Title= "Confirm Vetting!"
        Body = "You are confirming that the document and information are in line."
        FileType = {this.state.keyString} 
        DocID = {this.state.currentDocID}
        Filename = {'https://rubiximages.cjstudents.co.za:449/' + this.state.myLease}
        />
        <div className="page-loader-wrapper" style={{ display: this.state.isLoad ? 'block' : 'none' }}>
          <div className="loader">
            <div className="m-t-30"><img src={localStorage.getItem('clientLogo')} width="170" height="70" alt=" " /></div>
            <p>Uploading document...</p>
          </div>
        </div>
        <div>
          <div className="container-fluid" >
            {localStorage.getItem('role') == 'admin'
            ? null
            : <PageHeader
              HeaderText="Rubix User Profile"
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
                        <ProfileV1Setting  />
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
                                  {/* <FileStorageCard TotalSize="Storage Used" UsedSize={90} /> */}
                                  {fileStorageStatusCardData.map((data, index) => {
                                    
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

                    <Tab  eventKey="Test" title="Test">
                    <>
                    <p>This is the merged doc: {this.state.mergedFile}</p>
                    <iframe src={this.state.mergedFile} width="100%" height="500px">
           </iframe>
                </>
                    </Tab>
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
  
  showLease: mailInboxReducer.isShowLease,

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
  updateLoadingMessage,
  updateLoadingController,
  onUpdateLeaseProgress,
  onUpdateLeaseMessage,
  onUpdateVarsity,
})(ProfileV1Page);