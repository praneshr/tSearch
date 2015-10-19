var React = require('react');
var _ = require('underscore');
var $ = require('jquery');

var Result = React.createClass({

  render: function() {
    var temp = 0;
    console.log("Result Shown");
    var data = this.props.data;
    var one = [];
    var two = [];
    var three =[];
    var _this = this;
    var results = data.results.map(function(r, i){
      var tweet = '<p>'+r.tweet.replace(/(#[a-zA-Z0-9_]+)/g,'<span class="hashtag">$1</span>')+'</p>';
      var  template = <div className="lr-12 md-12 sm-12">
        <div className="result">
          <div className="bg">
            {r.imgUrl !== 'none' ? <img src={r.imgUrl} alt=""/>:''}
            <div className="text" dangerouslySetInnerHTML={{__html: tweet}}></div>
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
        temp = 0;
      }
    });
    console.log(one)
    console.log(two)
    console.log(three)
    return (
      <div className="results">
        <div className="lr-4 md-4 sm-12 same-row first">{one}</div>
        <div className="lr-4 md-4 sm-12 same-row second">{two}</div>
        <div className="lr-4 md-4 sm-12 same-row third">{three}</div>
      </div>
    );
  }

});

module.exports = Result;
