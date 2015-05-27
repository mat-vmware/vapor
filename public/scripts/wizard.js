var POD_DEF = {
  name: "customer_a",
  description: "Customizing a vpod for customer A."
}

var POD_NIL = {}

var CancelBtn = React.createClass({
  handleClick: function(e) {
    React.unmountComponentAtNode(document.getElementById('podPanel'))
    $('#podList').show()
    $('#podPanel').hide()
  },

  render: function() {
    return (
      <button type="button" className="btn btn-danger" onClick={this.handleClick}>Cancel</button>
    );
  }  
});

var ApplyBtn = React.createClass({
  render: function() {
    return (
      <button type="submit" className="btn btn-success"> Apply</button>
    );
  }  
});

var PodProfile = React.createClass({
  handleSubmit: function(event) {
    event.preventDefault();
    var data = $('#profileForm').serializeObject();
    console.log(data)
    $.ajax({
      type: "POST",
      url: "/vpod",
      data: data,
      dataType: "text"
    }). 
    done(function(data) {
      console.log("ok")
    });
  },

  render: function() {
    return (
      <div role="tabpanel" className="tab-pane active" id="profile">
        <h3>vPOD Profile</h3>
        <form onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="col-xs-4">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" className="form-control" id="name" placeholder="vpod-customer" defaultValue={this.props.podDef.name} />
              </div>
            </div>
            <div className="col-xs-8">
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input type="text" className="form-control" id="description" placeholder="Customizing a vPOD for a customer." defaultValue={this.props.podDef.description} />
              </div>
            </div>
          </div>
          
          <ApplyBtn />
        </form>
      </div>
    );
  }
});

var PodPackages = React.createClass({
  render: function() {
    return (
      <div role="tabpanel" className="tab-pane" id="packages">
        <h3>Select VMware SDDC Products</h3>
        <div className="row">
          <div className="col-xs-6 col-md-3">
            <button type="button" className="btn btn-primary btn-lg btn-block">
              <span className="glyphicon glyphicon-th-large"></span><br/>
              <span>vSphere</span>
            </button>
          </div>
  
          <div className="col-xs-6 col-md-3">
            <button type="button" className="btn btn-primary btn-lg btn-block" disabled>
              <span className="glyphicon glyphicon-scale"></span><br/>
              <span>vSOM</span>
            </button>
          </div>
  
          <div className="col-xs-6 col-md-3">
            <button type="button" className="btn btn-primary btn-lg btn-block" disabled>
              <span className="glyphicon glyphicon-cloud"></span><br/>
              <span>vCloud</span>
            </button>
          </div>
        </div>            
      </div>
    );
  }
});

var PodHardware = React.createClass({
  render: function() {
    return (
      <div role="tabpanel" className="tab-pane" id="hardware">
        <h3>Improting MAC Addresses</h3>           
        <div className="row">
          <div className="col-xs-5">
            <form>
              <div className="form-group">
                <label htmlFor="exampleInputFile">File</label>
                <input type="file" id="exampleInputFile" />
              </div>
              <button type="submit" className="btn btn-default">Import</button>
            </form>
          </div>
          <div className="col-xs-2">
            <br />
            <br />
            <h3>OR</h3>
          </div>
          <div className="col-xs-5">
            <form>
              <div className="form-group">
                <label>MAC Addresses...</label>
                <textarea className="form-control" rows="10" placeholder="00-50-56-99-d9-da"></textarea>
              </div>
              <button type="submit" className="btn btn-default">Import</button>
            </form>
          </div>
        </div>    
    
        <hr />
        
        <div className="row">
          <table className="table table-striped table-condensed table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>SN</th>
                <th>MAC</th>
                <th>Hostname</th>
                <th>Mgmt IP</th>
                <th>vMotion IP</th>
                <th>Mgmt VLAN</th>
                <th>vMotion VLAN</th>
                <th>Gateway</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
});

var PodNetwork = React.createClass({
  render: function() {
    return (
      <div role="tabpanel" className="tab-pane" id="networking">
        <h3>ESXi Network Settings</h3>           
        <form>
          <div className="row">
            <div className="col-xs-6">
              <div className="form-group">
                <label htmlFor="esxiHostnamePrefix">ESXi Hostname Prefix</label>
                <input type="text" className="form-control" id="esxiHostnamePrefix" placeholder="esxi-" />
              </div>
            </div>
            <div className="col-xs-6">
              <div className="form-group">
                <label htmlFor="esxiHostnameIterator">ESXi Hostname Iterator</label>
                <input type="text" className="form-control" id="esxiHostnameIterator" placeholder="0001" />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xs-6">
              <div className="form-group">
                <label htmlFor="esxiIpStart">ESXi IP Start From</label>
                <input type="text" className="form-control" id="esxiIpStart" placeholder="172.20.10.101" />
              </div>
            </div>
            <div className="col-xs-6">
              <div className="form-group">
                <label htmlFor="esxiIpEnd">ESXi IP End To</label>
                <input type="text" className="form-control" id="esxiIpEnd" placeholder="172.20.10.110" />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-6">
              <div className="form-group">
                <label htmlFor="esxiNetmask">ESXi Netmask</label>
                <input type="text" className="form-control" id="esxiNetmask" placeholder="255.255.0.0" />
              </div>
            </div>
            <div className="col-xs-6">
              <div className="form-group">
                <label htmlFor="esxiGateway">ESXi Gateway</label>
                <input type="text" className="form-control" id="esxiGateway" placeholder="172.20.10.1" />
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-default">Apply</button>
        </form>
          
        <hr />

        <h3>vCenter Server Network Settings </h3>
        <form>
          <div className="row">
            <div className="col-xs-6">
              <div className="form-group">
                <label htmlFor="vCenterHostname">vCenter Server Hostname</label>
                <input type="text" className="form-control" id="vCenterHostname" placeholder="vcenter" />
              </div>
            </div>
            <div className="col-xs-6">
              <div className="form-group">
                <label htmlFor="vCenterIp">vCenter Server IP Address</label>
                <input type="text" className="form-control" id="vCenterIp" placeholder="172.20.10.2" />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-6">
              <div className="form-group">
                <label htmlFor="vCenterNetmask">vCenter Server Netmask</label>
                <input type="text" className="form-control" id="vCenterNetmask" placeholder="255.255.0.0" />
              </div>
            </div>
            <div className="col-xs-6">
              <div className="form-group">
                <label htmlFor="vCenterGateway">vCenter Server Gateway</label>
                <input type="text" className="form-control" id="vCenterGateway" placeholder="172.20.10.1" />
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-default">Apply</button>
        </form>
      </div>
    );
  }
});

var PodSecurity = React.createClass({
  render: function() {
    return (
      <div role="tabpanel" className="tab-pane" id="security">
        <h3>Security Settings </h3>
        <form>
          <div className="row">
            <div className="col-xs-6">
              <div className="form-group">
                <label htmlFor="esxiPassword">ESXi Password</label>
                <input type="password" className="form-control" id="esxiPassword" />
              </div>
            </div>
            <div className="col-xs-6">
              <div className="form-group">
                <label htmlFor="esxiPassword2">Confirm ESXi Password</label>
                <input type="password" className="form-control" id="esxiPassword2" />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-6">
              <div className="form-group">
                <label htmlFor="vCenterPassword">vCenter Password</label>
                <input type="password" className="form-control" id="vCenterPassword" />
              </div>
            </div>
            <div className="col-xs-6">
              <div className="form-group">
                <label htmlFor="vCenterPassword2">Confirm vCenter Password</label>
                <input type="password" className="form-control" id="vCenterPassword2" />
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-default">Apply</button>
        </form>
      </div>
    );
  }
});

var PodCompletion = React.createClass({
  render: function() {
    return (
      <div role="tabpanel" className="tab-pane" id="completion">
        <h3>Hosts</h3>
        <div id="hosts"></div>

        <form>
          <div className="row">
            <div className="col-xs-4"></div>
            <div className="col-xs-2"><button type="submit" className="btn btn-primary btn-block">Validate</button></div>
            <div className="col-xs-2"><button type="submit" className="btn btn-success btn-block">Build</button></div>
            <div className="col-xs-4"></div>
          </div>
        </form>
      </div>
    );
  }
});

var PodSidebar = React.createClass({
  render: function() {
    return (
      <div className="col-xs-2 sidebar">
        <ul className="nav nav-sidebar">
          <li role="presentation" className="active"><a href="#profile" aria-controls="profile" role="tab" data-toggle="tab">Profile</a></li> 
          <li role="presentation"><a href="#packages" aria-controls="packages" role="tab" data-toggle="tab">Packages</a></li> 
          <li role="presentation"><a href="#hardware" aria-controls="hardware" role="tab" data-toggle="tab">Hardware</a></li> 
          <li role="presentation"><a href="#networking" aria-controls="networking" role="tab" data-toggle="tab">Networking</a></li> 
          <li role="presentation"><a href="#security" aria-controls="security" role="tab" data-toggle="tab">Security</a></li> 
          <li role="presentation"><a href="#completion" aria-controls="completion" role="tab" data-toggle="tab">Completion</a></li> 
        </ul>
      </div>
    );
  }
});

var PodContent = React.createClass({
  render: function() {
    return (
      <div className="col-xs-10 col-xs-offset-2 tab-content main">
        <h1 className="page-header">Build a vPOD</h1>
        <PodProfile podDef={this.props.podDef} />
        <PodPackages />
        <PodHardware />
        <PodNetwork />
        <PodSecurity />
        <PodCompletion />
        
        <hr />  
        <CancelBtn />
      </div>
    );
  }
});

var PodPanel = React.createClass({
  componentDidMount: function() {
  },

  render: function() {
    return (
      <div className="container-fluid">
        <div className="row">
          <PodSidebar />
          <PodContent podDef={this.props.podDef} />            
        </div>
      </div>
    );
  }
});

