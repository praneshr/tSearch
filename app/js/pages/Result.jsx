var React = require('react');
var _ = require('underscore');

var Result = React.createClass({

  render: function() {
    console.log("Result Shown");
    var data = this.props.data;
    var results = data.results.map(function(r, i){
      return (<div className="result">
              <div className="bg" style={{backgroundImage: 'url('+r.imgUrl+')'}}></div>
            </div>);
    });
    return (
      <div className="results">
        <p>{results}</p>
      </div>
    );
  }

});

module.exports = Result;
