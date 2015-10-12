var React = require('react');
var getUrl = require('get-urls');
var _ = require('underscore');

var Result = React.createClass({

  render: function() {
    var data = this.props.data;
    var results = data.result.reverse().map(function(r, i){
      var tweet = r.tweet;
      var user = tweet.split(' - ')[0];
      tweet = tweet.split(' - ')[1];
      var urls = _.toArray(getUrl(tweet));
      console.log(urls);
      return (
        <div className="result" key={i}>
          <div className="lr-12 sm-12 md-12 user"><a href={'https://twitter.com/@'+user} target="_blank">@{user}</a></div>
          <div className="lr-12 sm-12 md-12 tweet">{tweet}</div>
          <div className="links">
            {
              urls.map(function(link, j){
                return <a href={link} key={j}>{link}</a>
              })
            }
          </div>
        </div>
        );
    });
    return (
      <div className="results">
        <p>{results}</p>
      </div>
    );
  }

});

module.exports = Result;
