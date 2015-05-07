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


app = Flask(__name__, static_url_path='', static_folder='public')

@app.route("/")
def welcome():
    return "Welcome to Vapor!"

@app.route("/esxi/installed")
def esxiInstalled():
    mac = request.args.get('mac')
    print(mac)
    p = Popen(["ssh", "-oStrictHostKeyChecking=no", "-oUserKnownHostsFile=/dev/null", "-o", "LogLevel=quiet", "root@172.20.10.101", "esxcli hardware platform get"], stdout=PIPE, stderr=PIPE)
    out, error = p.communicate()
    print(out)
    now = datetime.now()
    print(now.isoformat())
    return now.isoformat()
    # return "esxi installed" 

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT",8000)), debug=True)
