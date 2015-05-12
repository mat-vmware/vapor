
var HOSTS = [
    {name: 'esxi-001', mac: '00-50-56-99-d9-da', ip: '', netmask: '', gateway: '', status: 1}, 
    {name: 'esxi-002', mac: '00-50-56-99-4d-84', ip: '', netmask: '', gateway: '', status: 2} 
]

var fields = [
  {name: 'name'},  
  {name: 'mac'},
  {name: 'ip'},
  {name: 'netmask'},
  {name: 'gateway'},
  {name: 'status', icon: 'flag', color: {1: 'text-muted', 2: 'text-success'}}
]

var ModalForm = React.createClass({
  render: function() {    
    var formGroups = []
    fields.forEach(function(field) {
      formGroups.push(
        <div className="form-group" key={field.name}>
          <label for={field.name} className="control-label">{field.name}</label>
          <input type="text" className="form-control input-sm" id={field.name} name={field.name}></input>
        </div>
      ) 
    })
     
    return (
      <div className="modal fade" id="hostModal" tabindex="-1" role="dialog" aria-labelledby="hostModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title" id="myModalLabel">Add Host</h4>
            </div>
            <div className="modal-body">
              {formGroups}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-success">Add Host</button>
            </div>
          </div>
        </div>
      </div>    
    ); 
  } 
})

var EditButton = React.createClass({
  handleClick: function() {
    var host = this.props.host
    fields.forEach(function(field) {
      $('#' + field.name).val(host[field.name]); 
    })
  },

  render: function() {
    return (
      <a href="#" data-toggle="modal" data-target="#hostModal" onClick={this.handleClick}>
        <span className={"glyphicon glyphicon-" + this.props.icon + " text-muted"} aria-hidden="true"></span>
      </a>
    );
  }
})

var DeleteButton = React.createClass({
  handleClick: function() {
    var host = this.props.host
    fields.forEach(function(field) {
      $('#' + field.name).val(host[field.name]); 
    })
  },

  render: function() {
    return (
      <a href="#" data-toggle="modal" data-target="#hostModal" onClick={this.handleClick}>
        <span className="glyphicon glyphicon-minus text-muted" aria-hidden="true"></span>
      </a>
    );
  }
})

var RichTextCell = React.createClass({
  render: function() {
    return (
      <td key={this.props.key}><span className={'glyphicon glyphicon-' + this.props.icon + ' ' + this.props.color} aria-hidden="true"></span></td>
    );
  }
})

var HostRow = React.createClass({
  render: function() {
    var host = this.props.host
    var cells = []
    cells.push(<td key='index'>{this.props.index}</td>)  
    fields.forEach(function(field) {
      var key = field.name
      if(field.icon === undefined || host[field.name] == '') {
        cells.push(<td key={key}>{host[field.name]}</td>)
      } else { 
        var color = field.color[host[field.name]]
        cells.push(<RichTextCell key={key} icon={field.icon} color={color} />) 
      }
    })
    cells.push(<td key='plus'><EditButton icon="edit" host={this.props.host} /></td>)  
    cells.push(<td key='minus'><DeleteButton host={this.props.host} /></td>)  

    return (
      <tr>{cells}</tr>
    );
  }   
})

var HostsTable = React.createClass({
  getInitialState: function() {
    return {
        data: [] 
    };
  },
  
  componentDidMount: function() {
    $.get("/host", function(result) {
      if (this.isMounted()) {
        this.setState({
          data: result.data
        });
      }
    }.bind(this));
  },

  render: function() {
    var rows = [];
    this.state.data.forEach(function(host) {
        rows.push(<HostRow host={host} key={rows.length + 1} index={rows.length + 1} />);
    })
    var host = {name: '', mac: '', ip: '', netmask: '', gateway: '', status: ''}
    for (i = rows.length; i < 8; i++) {
        rows.push(<HostRow host={host} key={rows.length + 1} index={rows.length + 1}/>); 
    }

    var heads = []    
    heads.push(<th key='index'>#</th>)
    fields.forEach(function(field) {
      heads.push(<th key={field.name}>{field.name}</th>)  
    })
    heads.push(<th key='plus'><EditButton icon="plus" /></th>)
    heads.push(<th key='minus'></th>)

    return (
      <div>
        <table className="table table-striped table-condensed">
          <thead><tr>{heads}</tr></thead>
          <tbody>{rows}</tbody>
        </table>
        <ModalForm />
      </div>
    );
  }
})

React.render(
    <HostsTable />,
    document.getElementById('hosts')
)
