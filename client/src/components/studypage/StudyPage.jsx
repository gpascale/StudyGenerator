import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import CircularProgress from 'material-ui/CircularProgress';
import _ from 'underscore'

import AbcScore from '../abcscore/AbcScore'
import common from 'src/js/common'


var StudyPage = React.createClass({

  getInitialState() {
    return {
      abcText: null,
      selectedTune: "A Felicidade",
      selectedType: "Guide Tones",
      tunes: [ "A Felicidade", "All The Things You Are", "Giant Steps" ]
    };
  },

  render: function() {
    var self = this;

    var tuneList = _.map(this.state.tunes, function(tune, idx) {
      return ( <MenuItem key={idx} value={tune} primaryText={tune} /> );
    });

    var typeList = _.map(['Guide Tones'], function(type, idx) {
      return ( <MenuItem key={idx} value={type} primaryText={type} /> );
    });

    console.log("render - " + this.state.loading);

    return (
      <div className="studyPage">
	<div className="controls">
	  <span className="dropdownLabel tuneDropdownLabel">Tune:</span>
	  <DropDownMenu ref="tuneDropdown" value={this.state.selectedTune}
			iconStyle={{fill: 'rgb(140, 140, 140)'}} underlineStyle={{borderTop: '1px solid rgb(140, 140, 140)'}}
			onChange={(event, index, value) =>
			  self.setState({selectedTune: value}, self._fetchStudy)
			}>
	    {tuneList}
	  </DropDownMenu>
	  <span className="dropdownLabel typeDropdownLabel">Type:</span>
	  <DropDownMenu ref="typeDropdown" value={this.state.selectedType}
			iconStyle={{fill: 'rgb(140, 140, 140)'}} underlineStyle={{borderTop: '1px solid rgb(140, 140, 140)'}}
			onChange={(event, index, value) =>
			  self.setState({selectedType: value}, self._fetchStudy)
			}>
	    {typeList}
	  </DropDownMenu>
	</div>
	<div className={"scoreWrapper " + (this.state.loading ? "displayNone" : "")}>
	  <AbcScore abcText={this.state.abcText} />
	</div>
	<CircularProgress className={this.state.loading ? "" : "displayNone"}
			  size={100} thickness={10}
			  style={{margin: "200px auto"}} />
      </div>
    );
  },

  componentDidMount: function() {
    this._fetchStudy();
  },

  _fetchStudy: function() {
    var self = this;
    var url = 'http://localhost:5001/api/generateStudy?tune=' + this.state.selectedTune;
    this.setState({ loading: true }, () => {
      console.log("LOADING");
      common.GETJSON(url, function(result) {
	console.log("LOADED");
	self.setState({
	  abcText: result.abc,
	  loading: false
	});
      });
    });
  }

});

module.exports = StudyPage;