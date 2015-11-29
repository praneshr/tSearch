var React = require('react');
var _ = require('underscore');
var $ = require('jquery');
var cn = require('classnames');
var timeago = require('timeago');

var Result = React.createClass({

  render: function() {
    var temp = 0;
    var data = this.props.data;
    var one = [];
    var two = [];
    var three =[];
    var four = [];
    var _this = this;
    var dummyTag = data.relatedTags.indexOf('ryueidhflmcnxb2345');
    var relatedTags = data.relatedTags;
    relatedTags.splice(dummyTag,1);
    var related = data.relatedTags.map(function(tag, i) {
      return <a href={"/search/"+tag+"/1"}><div className="r-tag">{tag}</div></a>
    })
    var results = data.results.map(function(r, i){
      var tweet = '<p>'+r.tweet.replace(/([#][a-zA-Z0-9_]+)/g,'<span class="hashtag">$1</span>')+'</p>';
      tweet = tweet.replace(/([@][a-zA-Z0-9_]+)/g,'<a target="_blank" href="https://twitter.com/$1"class="at-link">$1</a>');
      var  template = <div className="lr-12 md-12 sm-12">
      <div className="result">
      <div className="bg">
      {r.imgUrl !== 'none' ? <img src={r.imgUrl} alt=""/>:''}
      <div className="text" dangerouslySetInnerHTML={{__html: tweet}}></div>
      <div className="time">{$.timeago(r.time)}</div>
      </div>
      </div>
      </div>;
      i = i+1;
      if(temp === 0){
        one.push(template);
        temp = 1;
      } else if(temp === 1){
        two.push(template);
        temp = 2;
      } else if(temp === 2){
        three.push(template);
        temp = 3;
      } else if(temp === 3){
        four.push(template);
        temp = 0;
      }
    });
    return (
      <div className="results">
        <div className="count">Found {data.count} results found for <span id="query">"{data.query}"</span></div>
        <div className="related row">{related.length !== 0 && "Related topics:"}{related}</div>
        <div className="row">
          <div className="lr-3 md-3 sm-12 same-row first">{one}</div>
          <div className="lr-3 md-3 sm-12 same-row second">{two}</div>
          <div className="lr-3 md-3 sm-12 same-row third">{three}</div>
          <div className="lr-3 md-3 sm-12 same-row third">{four}</div>
        </div>
        <div className={cn("row",{hide: data.results.length <= 0})}>
          <div className="page">
          <a href={"/search/"+data.query+"/"+(parseInt(data.page) - 1)} className={cn({'hide': this.props.data.page == 1})}>
            <i className="material-icons">chevron_left</i>
          </a>
          <a href={"/search/"+data.query+"/"+(parseInt(data.page) + 1)} className={cn({'hide': !((this.props.data.page + 1) * 15) > data.count })}>
            <i className="material-icons">chevron_right</i>
          </a>
          </div>
        </div>
      </div>
      );
  }

});

module.exports = Result;
