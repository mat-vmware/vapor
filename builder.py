# This file provided by Facebook is for non-commercial testing and evaluation purposes only.
# Facebook reserves all rights not expressly granted.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
# FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
# ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
# WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

from datetime import datetime
import json
import os
from subprocess import Popen, PIPE
from flask import Flask, Response, request

import atexit
from host import write

app = Flask(__name__, static_url_path='', static_folder='public')
app.add_url_rule('/', 'root', lambda: app.send_static_file('host.html'))

@app.route('/host', methods=['GET', 'POST'])
def addHosts():
    if request.method == 'GET':
        with open('hosts.json', 'r+') as file:
            hosts = json.load(file).values()
        data = {"data": hosts}

        print data
        return Response(json.dumps(data), mimetype='application/json', headers={'Cache-Control': 'no-cache'}) 
    if request.method == 'POST':
        host = request.form.to_dict()
        write(host)        
        return 'Ok'

@app.route("/esxi/installed")
def esxiInstalled():
    mac = request.args.get('mac')
    print(request.remote_addr)
    print(mac)
    p = Popen(["ssh", "-oStrictHostKeyChecking=no", "-oUserKnownHostsFile=/dev/null", "-o", "LogLevel=quiet", "root@" + request.remote_addr, "esxcli hardware platform get"], stdout=PIPE, stderr=PIPE)
    out, error = p.communicate()
    print(out)
    now = datetime.now()
    print(now.isoformat())
    return now.isoformat()
    # return "esxi installed" 

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT",8000)), debug=True)
