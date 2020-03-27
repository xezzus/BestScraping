const CDP = require('chrome-remote-interface');
const http = require('http');

async function navigateInANewTab(url, callback) {
    const target = await CDP.New();
    const {Page, Runtime} = await CDP({target});
    await Page.enable();
    await Page.navigate({url});
    await Page.loadEventFired(()=>{
      console.log('runtime');
      setTimeout(function(){
        Runtime.evaluate({expression: 'let test = []; Array.from(document.getElementsByTagName(\'html\')).forEach((item,i)=>{test.push(item.outerHTML);}); test.join(\'\');'}).then((result) => {
          callback(result.result.value);
          CDP.Close({id: target.id});
        });
      },1500);
    });
}

const requestListener = function (req, res) {

  if(req.headers['content-type'] == 'application/json' && req.method == 'POST'){
    var data = '';
    req.on('data', function(chunk) {
        data += chunk.toString();
    });
    req.on('end', function() {
      data = JSON.parse(data);
      navigateInANewTab(data.url,function(e){
        res.writeHead(200);
        res.end(e);
      });
    });

  } else {

  res.writeHead(200);
  res.end('Hello, World!');
  }
}

const server = http.createServer(requestListener);
server.listen(9001);
