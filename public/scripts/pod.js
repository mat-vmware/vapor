
var PodRow = React.createClass({
  render: function() {
    return (
      <tr>
        <td>{this.props.pod.name}</td>
        <td>{this.props.pod.description}</td>
        <td></td>
      </tr>
    );
  } 
})

var PodsTable = React.createClass({
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
        rows.push(<PodRow pod={pod} key={rows.length + 1} index={rows.length + 1}/>); 
    }

    return (
      <div>
        <table className="table table-striped table-condensed">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
        <ModalForm />
      </div>
    );
  }
})

React.render(
  <PodsTable />,
  document.getElementById('podsTable')
)
