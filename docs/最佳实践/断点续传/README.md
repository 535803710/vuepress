# 断点续传

> 也叫可恢复文件上传

对于大文件上传，可能会出现一些文件中断的问题，而我们为了不浪费网络资源，用户时间，可以使用断点续传的功能。

由于 `feach` 不能监听到传输文件的进度。所以我们还是通过 `XMLHttpRequest` 。

### 为什么不能用 `upload.onprogress`？

要恢复上传，我们就需要知道之前上传到了那里。

我们虽然可以用 `xhr.upload.onprogress` 来知道上传的进度。但是很可惜，我们不能用它来定位上传的具体进度。

因为这个方法是在数据 **被发送** 的时候触发的，服务器是否接收到我们并不知道，也许它是由本地网络代理缓冲的（buffered），或者可能是远程服务器进程刚刚终止而无法处理它们，亦或是它在中间丢失了，并没有到达服务器。

这就是为什么此事件仅适用于显示一个好看的进度条。

要恢复上传，我们需要 **确切地** 知道服务器接收的字节数。而且只有服务器能告诉我们，因此，我们将发出一个额外的请求。

## 原理
1. 首先创建一个文件id，后面我们会用这个id去服务器查上传到哪里了。
``` js
let fileId = file.name + '-' + file.size + '-' + file.lastModified;
```
当我们改变文件名字或者大小或者修改时间，都会有一个新的id。

2. 向服务器发送一个请求，询问已经有多少个字节了。
``` js
let response = await fetch('status', {
  headers: {
    'X-File-Id': fileId
  }
});

// 服务器已有的字节数
let startByte = +await response.text();
```
这假设服务器通过header的 X-File-Id 属性 跟踪文件上传。应该在服务端实现。

如果服务器上尚不存在该文件，则服务器响应应为 0。

3. 然后，我们可以使用 Blob 和 slice 方法来发送从 startByte 开始的文件：
   
``` js
xhr.open("POST", "upload", true);

// 文件 id，以便服务器知道我们要恢复的是哪个文件
xhr.setRequestHeader('X-File-Id', fileId);

// 发送我们要从哪个字节开始恢复，因此服务器知道我们正在恢复
xhr.setRequestHeader('X-Start-Byte', startByte);

xhr.upload.onprogress = (e) => {
  console.log(`Uploaded ${startByte + e.loaded} of ${startByte + e.total}`);
};

// 文件可以是来自 input.files[0]，或者另一个源
xhr.send(file.slice(startByte));
```
这里我们将文件 id 作为 X-File-Id 发送给服务器，所以服务器知道我们正在上传哪个文件，并且，我们还将起始字节作为 X-Start-Byte 发送给服务器，所以服务器知道我们不是重新上传它，而是恢复其上传。

在服务器端，我们发现有一个id的文件没有上传完，并且上传的大小是 X-Start-Byte ， 继续接收新的数据附加到之前上传的文件。

## 实践
下面是源码实现，通过node 启动一个本地8080端口的服务。

1. `npm i node-static` 和 `npm i debug`
2. 运行 node server.js 启动服务
3. 访问 localhose:8080 来访问index.html文件。
4. 不要上传中文命名的文件，(没做转义处理)

``` js

// uploader.js
class Uploader {
  constructor({ file, onProgress }) {
    this.file = file;
    this.onProgress = onProgress;

    // 创建唯一标识文件的 fileId
    // 我们还可以添加用户会话标识符（如果有的话），以使其更具唯一性
    this.fileId = file.name + "-" + file.size + "-" + file.lastModified;
  }

  async getUploadedBytes() {
    console.log("headers");
    let response = await fetch("status", {
      headers: {
        "X-File-Id": this.fileId,
      },
    });

    if (response.status != 200) {
      throw new Error("Can't get uploaded bytes: " + response.statusText);
    }

    let text = await response.text();

    return +text;
  }

  async upload() {
    this.startByte = await this.getUploadedBytes();

    let xhr = (this.xhr = new XMLHttpRequest());
    xhr.open("POST", "upload", true);

    // 发送文件 id，以便服务器知道要恢复哪个文件
    xhr.setRequestHeader("X-File-Id", this.fileId);
    // 发送我们要从哪个字节开始恢复，因此服务器知道我们正在恢复
    xhr.setRequestHeader("X-Start-Byte", this.startByte);

    xhr.upload.onprogress = (e) => {
      this.onProgress(this.startByte + e.loaded, this.startByte + e.total);
    };

    console.log("send the file, starting from", this.startByte);
    xhr.send(this.file.slice(this.startByte));

    // return
    //   true —— 如果上传成功，
    //   false —— 如果被中止
    // 出现 error 时将其抛出
    return await new Promise((resolve, reject) => {
      xhr.onload = xhr.onerror = () => {
        console.log(
          "upload end status:" + xhr.status + " text:" + xhr.statusText
        );

        if (xhr.status == 200) {
          resolve(true);
        } else {
          reject(new Error("Upload failed: " + xhr.statusText));
        }
      };

      // onabort 仅在 xhr.abort() 被调用时触发
      xhr.onabort = () => resolve(false);
    });
  }

  stop() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }
}


```


``` js

// server.js
let http = require('http');
let static = require('node-static');
let fileServer = new static.Server('.');
let path = require('path');
let fs = require('fs');
let debug = require('debug')('example:resume-upload');

let uploads = Object.create(null);

function onUpload(req, res) {

  let fileId = req.headers['x-file-id'];
  let startByte = +req.headers['x-start-byte'];

  if (!fileId) {
    res.writeHead(400, "No file id");
    res.end();
  }

  // 我们将“无处”保存文件
  let filePath = '/dev/null';
  // 可以改用真实路径，例如
  // let filePath = path.join('/tmp', fileId);

  debug("onUpload fileId: ", fileId);

  // 初始化一个新上传
  if (!uploads[fileId]) uploads[fileId] = {};
  let upload = uploads[fileId];

  debug("bytesReceived:" + upload.bytesReceived + " startByte:" + startByte)

  let fileStream;

  // 如果 startByte 为 0 或者没设置，创建一个新文件，否则检查大小并附加到现有的大小
  if (!startByte) {
    upload.bytesReceived = 0;
    fileStream = fs.createWriteStream(filePath, {
      flags: 'w'
    });
    debug("New file created: " + filePath);
  } else {
    // 我们也可以检查磁盘上的文件大小以确保
    if (upload.bytesReceived != startByte) {
      res.writeHead(400, "Wrong start byte");
      res.end(upload.bytesReceived);
      return;
    }
    // 附加到现有文件
    fileStream = fs.createWriteStream(filePath, {
      flags: 'a'
    });
    debug("File reopened: " + filePath);
  }


  req.on('data', function(data) {
    debug("bytes received", upload.bytesReceived);
    upload.bytesReceived += data.length;
  });

  // 将 request body 发送到文件
  req.pipe(fileStream);

  // 当请求完成，并且其所有数据都以写入完成
  fileStream.on('close', function() {
    if (upload.bytesReceived == req.headers['x-file-size']) {
      debug("Upload finished");
      delete uploads[fileId];

      // 可以在这里对上传的文件进行其他操作

      res.end("Success " + upload.bytesReceived);
    } else {
      // 连接断开，我们将未完成的文件保留在周围
      debug("File unfinished, stopped at " + upload.bytesReceived);
      res.end();
    }
  });

  // 如果发生 I/O error —— 完成请求
  fileStream.on('error', function(err) {
    debug("fileStream error");
    res.writeHead(500, "File error");
    res.end();
  });

}

function onStatus(req, res) {
  let fileId = req.headers['x-file-id'];
  let upload = uploads[fileId];
  debug("onStatus fileId:", fileId, " upload:", upload);
  if (!upload) {
    res.end("0")
  } else {
    res.end(String(upload.bytesReceived));
  }
}


function accept(req, res) {
  if (req.url == '/status') {
    onStatus(req, res);
  } else if (req.url == '/upload' && req.method == 'POST') {
    onUpload(req, res);
  } else {
    fileServer.serve(req, res);
  }

}




// -----------------------------------

if (!module.parent) {
  http.createServer(accept).listen(8080);
  console.log('Server listening at port 8080');
} else {
  exports.accept = accept;
}
```


``` html
<!-- index.html  -->

<!DOCTYPE HTML>

<script src="uploader.js"></script>

<form name="upload" method="POST" enctype="multipart/form-data" action="/upload">
  <input type="file" name="myfile">
  <input type="submit" name="submit" value="Upload (Resumes automatically)">
</form>

<button onclick="uploader.stop()">Stop upload</button>


<div id="log">Progress indication</div>

<script>
  function log(html) {
    document.getElementById('log').innerHTML = html;
    console.log(html);
  }

  function onProgress(loaded, total) {
    log("progress " + loaded + ' / ' + total);
  }

  let uploader;

  document.forms.upload.onsubmit = async function(e) {
    e.preventDefault();

    let file = this.elements.myfile.files[0];
    if (!file) return;

    uploader = new Uploader({file, onProgress});

    try {
      let uploaded = await uploader.upload();

      if (uploaded) {
        log('success');
      } else {
        log('stopped');
      }

    } catch(err) {
      console.error(err);
      log('error');
    }
  };

</script>
```

