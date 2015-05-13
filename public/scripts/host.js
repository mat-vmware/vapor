
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
var modalTitle = 'Host'

$.fn.serializeObject = function()
{
   var o = {};
   var a = this.serializeArray();
   $.each(a, function() {
       if (o[this.name]) {
           if (!o[this.name].push) {
               o[this.name] = [o[this.name]];
           }
           o[this.name].push(this.value || '');
       } else {
           o[this.name] = this.value || '';
       }
   });
   return o;
};

var ModalForm = React.createClass({
  componentDidMount: function() {
    // Attach a submit handler to the form
    $("#crudForm").submit(function(event) {
      // Stop form from submitting normally
      event.preventDefault();
      var data = JSON.stringify($('#crudForm').serializeObject());
      data = $('#crudForm').serializeObject();
      console.log(data)
      $.ajax({
        type: "POST",
        url: "/host",
        data: data,
        dataType: "text"
      }). 
      done(function(data) {
        console.log("ok")
        $('#modalForm').modal('hide')
        React.unmountComponentAtNode(document.getElementById('hosts'))
        React.render(
          <HostsTable />,
          document.getElementById('hosts')
        )   
      });
    });
  },

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
      <div className="modal fade" id="modalForm" tabindex="-1" role="dialog" aria-labelledby="hostModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-sm">
          <form id="crudForm">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title" id="modalTitle">Add Host</h4>
            </div>
            <div className="modal-body">
                {formGroups}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
              <button type="submit" className="btn btn-success" id="actionBtn">Apply</button>
            </div>
          </div>
          </form>
        </div>
      </div>    
    ); 
  } 
})

var AddButton = React.createClass({
  handleClick: function() {
    $('#modalTitle').text('Add ' + modalTitle) 
    $('#actionButton').attr('value', 'add')
  },

  render: function() {
    return (
      <a href="#" data-toggle="modal" data-target="#modalForm" onClick={this.handleClick}>
        <span className="glyphicon glyphicon-plus text-muted" aria-hidden="true"></span>
      </a>
    );
  }
})

var UpdateButton = React.createClass({
  handleClick: function() {
    var host = this.props.host
    fields.forEach(function(field) {
      $('#' + field.name).val(host[field.name]); 
    })
    $('#modalTitle').text('Update ' + modalTitle) 
    $('#actionButton').attr('value', 'update')
  },

  render: function() {
    return (
      <a href="#" data-toggle="modal" data-target="#modalForm" onClick={this.handleClick}>
        <span className="glyphicon glyphicon-edit text-muted" aria-hidden="true"></span>
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
    $('#modalTitle').text('Delete ' + modalTitle) 
    $('#actionButton').attr('value', 'delete')
  },

  render: function() {
    return (
      <a href="#" data-toggle="modal" data-target="#modalForm" onClick={this.handleClick}>
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
    cells.push(<td key='plus'><UpdateButton host={this.props.host} /></td>)  
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

    $('#modalForm').on('hidden.bs.modal', function (e) {
      fields.forEach(function(field) {
        $('#' + field.name).val(''); 
      })
    })
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
    heads.push(<th key='plus'><AddButton /></th>)
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
