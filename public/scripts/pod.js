var POD_NIL = {}

var AddOrEditBtn = React.createClass({
   handleClick: function(e) {
    React.render(
      <PodPanel podDef={this.props.pod} />, 
      document.getElementById('podPanel')
    )
    $('#podList').hide()
    $('#podPanel').show();
    $("[href='#profile']").tab('show')
  },
  
  render: function() {
    var icon = 'glyphicon glyphicon-list-alt' 
    if(this.props.type == 'add')
      icon = 'glyphicon glyphicon-plus' 
    return (<a href="#" onClick={this.handleClick}><span className={icon} aria-hidden="true"></span></a>);
  }
})


var PodRow = React.createClass({
  handleClick: function(e) {
    $('#podList').hide()
    $('#podPanel').show();
    $("[href='#profile']").tab('show')
  },

  render: function() {
    return (
      <tr>
        <td>{this.props.index}</td>
        <td>{this.props.pod.name}</td>
        <td>{this.props.pod.description}</td>
        <td><AddOrEditBtn type='edit' pod={this.props.pod} /></td>
      </tr>
    );
  } 
})

var PhRow = React.createClass({
  render: function() {
    return (
      <tr>
        <td>{this.props.index}</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    );
  }
}) 

var PodTable = React.createClass({
  getInitialState: function() {
    return {
        data: [] 
    };
  },
  
  componentDidMount: function() {
    $.get("/vpod", function(result) {
      if (this.isMounted()) {
        this.setState({
          data: result.data
        });
      }
    }.bind(this));
  },

  render: function() {
    var rows = [];
    this.state.data.forEach(function(pod) {
        rows.push(<PodRow pod={pod} key={rows.length + 1} index={rows.length + 1} />);
    })
    var pod = {name: '', description: ''}
    for (i = rows.length; i < 8; i++) {
        rows.push(<PhRow key={rows.length + 1} index={rows.length + 1} />); 
    }

    return (
      <div>
        <table className="table table-striped table-condensed">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Description</th>
              <th><AddOrEditBtn type='add' pod={POD_NIL} /></th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  }
})

React.render(
  <PodTable />,
  document.getElementById('podTable')
)
