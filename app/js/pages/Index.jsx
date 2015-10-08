var React = require('react');
var Page = require('page');
var cn = require('classnames')

var searchApi = require('../api/get-results-api');
var searchStore = require('../stores/get-result-store');

var Index = React.createClass({
  getInitialState: function() {
    return {
      input: this.props.details.query ? this.props.details.query : '',
      blur: true
    };
  },
  componentDidMount: function() {
    this.selectAndFoucs();
    searchStore.addChangeListener(this.onResults);
    this.props.details.query && this.callApi();
    this.setState({
      blur: false
    });
  },
  componentWillReceiveProps: function(nextProps) {
    this.selectAndFoucs();
  },
  selectAndFoucs: function() {
    React.findDOMNode(this.refs.input).focus();
    React.findDOMNode(this.refs.input).select();
  },
  onUpdate: function(event){
    React.findDOMNode(this.refs.input).focus();
    this.setState({
      input: event.target.value
    });
  },
  callApi: function(){
    searchApi.getResults(this.state.input);
  },
  submit: function(event) {
    if(this.state.input.length > 0){
      Page('/search/'+this.state.input);
      this.callApi();
      this.selectAndFoucs();
    }
  },
  keyPress: function(event){
    if(event.which ===13 && this.state.input.length > 0)
      React.findDOMNode(this.refs.button).click();
  },
  onResults: function(){

  },
  render: function() {
    return (
      <div className="search-home" onKeyPress={this.keyPress}>
        <div className={cn("bg-image",{'no-blur': !this.state.blur})} style={{backgroundImage: 'url(https://unsplash.it/'+window.innerWidth+'/'+window.innerHeight+'?random)'}}></div>
        <div className="field">
          <p className="brand">Hello<span id="dot">.</span></p>
          <input className="lr-8" type="text" onChange={this.onUpdate} defaultValue={this.props.details.query ? this.props.details.query : this.state.input} ref="input"/>
          <button onClick={this.submit} ref="button"><i className="material-icons">search</i></button>
        </div>
      </div>
    );
  }

});

module.exports = Index;
