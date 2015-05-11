
var HOSTS = [
    {name: 'esxi-001', mac: '00-50-56-99-d9-da', ip: '', netmask: '', gateway: '', status: 1}, 
    {name: 'esxi-002', mac: '00-50-56-99-4d-84', ip: '', netmask: '', gateway: '', status: 2} 
]

var FieldBox = React.createClass({
    render: function() {
        return <input type="text" className="form-control input-sm" id={this.props.id} defaultValue={this.props.value} />;
    }
})

var HostRow = React.createClass({
    render: function() {
        var color = this.props.host.status == 2 ? ' text-success' : '' 
        return (
            <tr>
                <td>{this.props.index}</td>
                <td><FieldBox id={'name' + this.props.index} value={this.props.host.name} /></td>
                <td><FieldBox id={'mac' + this.props.index} value={this.props.host.mac} /></td>
                <td><FieldBox id={'ip' + this.props.index} value={this.props.host.ip} /></td>
                <td><FieldBox id={'netmask' + this.props.index} value={this.props.host.netmask} /></td>
                <td><FieldBox id={'gateway' + this.props.index} value={this.props.host.gateway} /></td>
                <td><span className={'glyphicon glyphicon-flag' + color} aria-hidden="true" /></td>
            </tr>
        );
    }   
})

var HostsTableBody = React.createClass({
    getInitialState: function() {
        return {
            name: ''
        };
    },
    
    componentDidMount: function() {
        $.get("/host", function(result) {
            HOSTS = result
            console.log(result)
        }.bind(this));
    },

    render: function() {
        var rows = [];
        HOSTS.forEach(function(host) {
            rows.push(<HostRow host={host} key={rows.length + 1} index={rows.length + 1} />);
        })
        var host = {name: '', mac: '', ip: '', netmask: '', gateway: '', status: ''}
        for (i = rows.length; i < 8; i++) {
            rows.push(<HostRow host={host} key={rows.length + 1} index={rows.length + 1}/>); 
        }
        return (
            <tbody>{rows}</tbody>
        );
    }
})

React.render(
    <HostsTableBody />,
    document.getElementById('hosts')
)
