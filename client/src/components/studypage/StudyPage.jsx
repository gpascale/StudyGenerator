import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import CircularProgress from 'material-ui/CircularProgress';
import _ from 'underscore'
import MIDI from 'midi.js'

import PageLayout from '../pagelayout/PageLayout'
import AbcScore from '../abcscore/AbcScore'
import common from 'src/js/common'

require('assets/soundfont/acoustic_grand_piano-ogg.js');


var StudyPage = React.createClass({

  getInitialState() {
    return {
      abcText: null,
      selectedTune: null,
      selectedType: "Guide Tones",
      tunes: [ ]
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

    return (
      <PageLayout>
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
            <a href="javascript:void(0);" onClick={this._playMidi}>Play MIDI</a>
          </div>
          <div className={"scoreWrapper " + (this.state.loading ? "displayNone" : "")}>
            <AbcScore abcText={this.state.abcText} />
          </div>
          <CircularProgress className={this.state.loading ? "" : "displayNone"}
                size={100} thickness={10}
                style={{margin: "200px auto"}} />
        </div>
      </PageLayout>
    );
  },

  componentDidMount: function() {
    var self = this;
    common.GETJSON('http://' + window.location.hostname + ':5001/api/tunes', function(result) {
      self.setState({
        tunes: result.tunes,
        selectedTune: result.tunes[0]
      }, self._fetchStudy);
    });
  },

  _fetchStudy: function() {
    var self = this;
    var url = 'http://' + window.location.hostname + ':5001/api/generateStudy?tune=' + this.state.selectedTune;
    this.setState({ loading: true }, () => {
      common.GETJSON(url, function(result) {
        self.setState({
          abcText: result.abc,
          midi: result.midi,
          loading: false
        });
      });
    });
  },

  _playMidi: function() {
    MIDI.loadPlugin({ soundfontUrl: "./assets/soundfont/", onsuccess: () => {
      const player = MIDI.Player;
      player.loadFile(this.state.midi.lead, () => {
        player.start();
        player.addListener(function(evt) {
          if (evt.message == 144) {
            console.log("NOTE ON: " + evt.note);
            console.log("TIME: " + evt.now);
          }
        });
      });
    }});
    
  }

});

module.exports = StudyPage;