import PDFMerger from 'pdf-merger-js/browser';
import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";

// files: Array of PDF File or Blob objects
class Test extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            PDFurl: ''
        }
      }
    merge() {
        const merger = new PDFMerger();
        const load = async () => {
            await merger.add('https://rubiximages.cjstudents.co.za:449/37a1fcad-a06d-4dfb-9632-3348dbaf0f19.pdf')
            await merger.add(`https://rubiximages.cjstudents.co.za:449/37a1fcad-a06d-4dfb-9632-3348dbaf0f19.pdf`)
            const mergedPdf = await merger.saveAsBlob();
            const url = URL.createObjectURL(mergedPdf);
            console.log("The url", url)
            this.setState({
                PDFurl: url
            })
        }
        load()
    }
    componentDidMount() {
    window.scrollTo(0, 0);
    
    //console.log("file", ${'test.pdf'})
    this.merge()
    }

render() {
    return (
        <div>
            <p>Test</p>
        <iframe
          height="500px"
          src={`${this.state.PDFurl}`}
          title='pdf-viewer'
          width='100%'
        ></iframe>
        </div>
      );
};
}

const mapStateToProps = ({ ioTReducer }) => ({
  isSecuritySystem: ioTReducer.isSecuritySystem,
});

export default connect(mapStateToProps, {})(Test);