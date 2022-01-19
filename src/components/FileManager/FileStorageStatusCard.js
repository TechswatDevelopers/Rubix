import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { ProgressBar } from "react-bootstrap";

class FileStorageStatusCard extends React.Component {
  render() {
    const { TotalSize, UsedSize, Type, UsedPer, ProgressBarClass, MyFunction } = this.props;
    return (
      <div className="card modal-open m-b-5">
        <div className="body">
          <h6>{UsedSize}</h6>
          <p className="mb-0">
            {Type}{" "}
            &nbsp;&nbsp;
          {
            localStorage.getItem('role') == 'admin' && UsedPer != 100
            ?<button onClick={()=>{MyFunction()}} className="btn btn-primary btn-sm">Vet</button>
          : null
          }
          </p>
        </div>
        <ProgressBar
          className={ProgressBarClass}
          now={parseInt(UsedPer)}
          min={0}
          max={100}
        />
        {}
      </div>
    );
  }
}

FileStorageStatusCard.propTypes = {
  TotalSize: PropTypes.string.isRequired,
  UsedSize: PropTypes.string.isRequired,
  Type: PropTypes.string.isRequired,
  UsedPer: PropTypes.number.isRequired,
  ProgressBarClass: PropTypes.string.isRequired,
};

const mapStateToProps = ({ mailInboxReducer, analyticalReducer }) => ({
  isTagDropDown: mailInboxReducer.isTagDropDown,
  facebookShowProgressBar: analyticalReducer.facebookShowProgressBar,
});

export default connect(mapStateToProps, {})(FileStorageStatusCard);
