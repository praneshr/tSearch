var React = require('react');
var Page = require('page');
var cn = require('classnames')
var $ = require('jquery');

var searchApi = require('../api/get-results-api');
var searchStore = require('../stores/get-result-store');

var Result = require('./Result.jsx');

var Index = React.createClass({
  getInitialState: function() {
    return {
      input: this.props.details.query ? this.props.details.query : '',
      visible: false,
      searchTerm: this.props.details.query ? true : false,
      result: false
    };
  },
  componentDidMount: function() {
    var _this = this;
    this.selectAndFoucs();
    searchStore.addChangeListener(this.onResults);
    this.props.details.query && this.callApi(this.props.details.query);
    $(document).ready(function(){
      $("img").load(function(){
        _this.setState({
          visible: true
        });
      });
    });
  },
  componentWillReceiveProps: function(nextProps) {
    this.selectAndFoucs();
    location.pathname === '/' ? this.setState({searchTerm: false}) : this.setState({searchTerm: true});
    nextProps.details.query && this.callApi(nextProps.details.query);
    this.setState({
      input: nextProps.details.query,
      searchTerm: location.pathname === '/' ? false : true,
      result: false
    });
  },
  selectAndFoucs: function() {
    React.findDOMNode(this.refs.input).focus();
    React.findDOMNode(this.refs.input).select();
  },
  onUpdate: function(event){
    React.findDOMNode(this.refs.input).focus();
    console.log(event.target.value.length === 0);
    var flag = event.target.value.length === 0;
    this.setState({
      input: event.target.value,
    });
  },
  callApi: function(q){
    searchApi.getResults(q);
  },
  submit: function(event) {
    if(this.state.input.length > 0){
      this.selectAndFoucs();
      Page('/search/'+this.state.input);
    }
  },
  keyPress: function(event){
    if(event.which ===13 && this.state.input.length > 0)
      React.findDOMNode(this.refs.button).click();
  },
  onResults: function(){
    this.setState({
      result: true
    });
  },
  render: function() {
    var response = searchStore.getResults();
    console.log(response);
    return (
      <div className="search-home" onKeyPress={this.keyPress}>
        <div className={cn("bg-image",{top: this.state.searchTerm})} style={{height: window.innerHeight}}>
        <div className="black-drop"></div>
          <img id="spalsh" className={cn('image',{'visible': this.state.visible, top: this.state.searchTerm})} src={'https://source.unsplash.com/daily/'}/>
        </div>
        <div className={cn("field",{top: this.state.searchTerm})}>
          <div className="small-logo">
            <p className="brand-small">Petch<span id="dot-small">.</span></p>
          </div>
          <p className="brand">Petch<span id="dot">.</span></p>
          <input className="lr-8" type="text" onChange={this.onUpdate} value={this.state.input} ref="input"/>
          <button onClick={this.submit} ref="button"><i className="material-icons">search</i></button>
        </div>
        <div className={cn("loader", {none: this.state.visible})}>
          <svg className="circular">
            <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="2" stroke-miterlimit="10"/>
          </svg>
        </div>
        {this.state.result && <Result data={response} />}
      </div>
    );
  }

});

module.exports = Index;
