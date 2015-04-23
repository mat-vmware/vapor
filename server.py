# This file provided by Facebook is for non-commercial testing and evaluation purposes only.
# Facebook reserves all rights not expressly granted.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
# FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
# ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
# WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import json
import os
from flask import Flask, Response, request

import atexit

from pyVim.connect import SmartConnect, Disconnect                                                    
from pyVmomi import vim, vmodl

app = Flask(__name__, static_url_path='', static_folder='public')
app.add_url_rule('/', 'root', lambda: app.send_static_file('image.html'))

@app.route('/comments.json', methods=['GET', 'POST'])
def comments_handler():

    with open('comments.json', 'r') as file:
        comments = json.loads(file.read())

    if request.method == 'POST':
        comments.append(request.form.to_dict())

        with open('comments.json', 'w') as file:
            file.write(json.dumps(comments, indent=4, separators=(',', ': ')))

    return Response(json.dumps(comments), mimetype='application/json', headers={'Cache-Control': 'no-cache'})

@app.route('/image', methods=['GET'])
def image():
    app.logger.debug('Geting images list...')

    # Get ServiceInstanceContent
    si = SmartConnect(host='172.20.10.2',
                      user='root',
                      pwd='vmware')
    if not si:  
        return Response("Hi, guys. I'm sorry for that we can't connect to vcenter.")              
    atexit.register(Disconnect, si)                                                                   
    content = si.RetrieveContent()
    app.logger.debug('Sucessfully got a vCenter connecton...')

    # Look up templates under the specific '__vapor_templates'                                        
    images = []
    objView = content.viewManager.CreateContainerView(content.rootFolder,                             
                                                      [vim.Folder],
                                                      True)
    folderList = objView.view
    for folder in folderList:                                                                         
       if folder.name == '__vapor_templates':                                                         
          vmList = folder.childEntity                                                                 
          images.extend(vmList)                                                                    
          break                                                                                       
       else:                                                                                          
          continue                                                                                    

    return Response(json.dumps(map(lambda x: {'name': x.name} ,images)), mimetype='application/json', headers={'Cache-Control': 'no-cache'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT",3000)))
