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
    console.log('mounted')
    var _this = this;
    searchStore.addChangeListener(this.onResults);
    this.props.details.query && this.callApi(this.props.details.query, this.props.details.page);
    this.selectAndFoucs();
    $(document).ready(function(){
      $("img").load(function(){
        _this.setState({
          visible: true
        });
      });
    })
    .on('keypress',function(event) {
      var flag = $('input').is(':focus');
      !flag && _this.selectAndFoucs();
    })
  },
  componentWillReceiveProps: function(nextProps) {
    console.log('crp',nextProps.details.page)
    location.pathname === '/' ? this.setState({searchTerm: false}) : this.setState({searchTerm: true});
    nextProps.details.query && this.callApi(nextProps.details.query, nextProps.details.page);
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
    var flag = event.target.value.length === 0;
    this.setState({
      input: event.target.value,
    });
  },
  callApi: function(q, p){
    searchApi.getResults(q,parseInt(p));
  },
  submit: function(event) {
    if(this.state.input.length > 0){
      Page('/search/'+this.state.input+'/1');
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
    return (
      <div className="search-home" onKeyPress={this.keyPress}>
      <div className={cn("search-loader",{hide: this.state.result})}>
        <svg className="circular">
            <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="2" stroke-miterlimit="10"/>
          </svg>
      </div>
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
