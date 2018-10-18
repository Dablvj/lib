/**
 * # qiniu API: https://developer.qiniu.com/kodo/api/1276/data-format
 * 
 * # pluupload API: http://www.phpin.net/tools/plupload/
 * 
 * ＃直接上传：
 * BeforeUpload=>this.directUpload=>FileUploaded
 * 
 * ＃分块上传：
 * BeforeUpload=>this.resumeUpload=>UploadProgress=>ChunkUploaded=>this.mkFileRequest=>FileUploaded
 * 
 * # directUpload和resumeUpload区别：
 *      1、首先需要重置 url、multipart、headers、multipart_params；
 *      2、然后是上面的流程不一样。
*/

//分快上传时候，第几块
let indexCount = 0;

//qiniu上传必传参数，后面还需要修改上传参数
let putExtra = {
    fname: "",
    params: {},
    mimeType: null
};

//是否是分块上传
let resume = false;

//这个参数很多位置会用到，并且就是uploader配置好的chunk_size，是固定的
let chunk_size;

//分块被中断了，如果没过期需要继续上传
let blockSize;

let QiniuUpload = {
    config:{
        //获取token和domain的Url，七牛做了跨域设置
        uptoken_url:'http://jssdk-v2.demo.qiniu.io/api/uptoken', 
        //
        url:"http://upload-z2.qiniup.com",  
        //
        select:"upload"  
    },
    /**
     * 初始化
     * 获取上传token以及上传资源七牛空间域名
     */
    init(option){
        let _this = this;

        //必传字断
        _this.config.uptoken_url = option.uptoken_url;
        _this.config.url = option.url;
        _this.config.select = option.select;
        //可不传，备选字断
        if(option.domain){
            _this.config.domain = option.domain;
            _this.config.uptoken = option.uptoken;
        }
        

        let req = new XMLHttpRequest();
        req.open("GET",option.uptoken_url,true);
        req.send(null);  
        req.onreadystatechange = function(){
            if(req.readyState == 4 && req.status == 200){
                console.log('success');
                _this.config.domain = req.responseText.domain;
                _this.config.uptoken = req.responseText.uptoken;
            }else{
                console.log('error:'+req.statusText);
            }
            _this.upload();
        } 
    },
    upload(){
        //方便在upload，调用外层方法和属性
        let _this = this,
        params = {
            runtimes: _this.config.runtimes || "html5,flash,silverlight,html4",// 上传模式,依次退化
            url: _this.config.url,
            browse_button: _this.config.select, // 触发文件选择对话框的按钮，为那个元素id，**必需**
            flash_swf_url: _this.config.flash_swf_url || "./js/Moxie.swf", // 引入flash,相对路径
            chunk_size: _this.config.chunk_size || 4 * 1024 * 1024,//分块上传时，每片的体积
            max_retries: _this.config.max_retries || 3,//上传失败最大重试次数
            multi_selection: _this.config.multi_selection || false, //不允许多选
            init: {
                'PostInit': function() {
                    console.log("PostInit");
                },
                'FilesAdded' : function(up, files) {
                    console.log('FilesAdded')
                    // 文件添加进队列后,处理相关的事情
                    resume = false;
                    chunk_size = uploader.getOption("chunk_size");
                    plupload.each(files, function(file) {
                        
                    });
                    uploader.start();
                },
                //BeforeUpload: 每个文件上传前,处理相关的事情
                //UploadProgress: 每个文件上传时处理相关的事情
                //FileUploaded: 每个文件上传成功后,处理相关的事情 
                //Error: 上传出错时,处理相关的事情
                //UploadComplete: 队列文件处理完毕后,处理相关的事情
            }

        };
        let uploader = new plupload.Uploader(params);
        uploader.init();

        //Error: 上传出错时,处理相关的事情
        uploader.bind('Error',function(uploader, errObject) {
            console.log('错误信息：'+errObject.message);        
        })

        //BeforeUpload: 每个文件上传前,处理相关的事情
        uploader.bind("BeforeUpload", function(uploader, file) {
            console.log("BeforeUpload")
            // 判断是否采取分片上传
            if ((uploader.runtime === "html5" || uploader.runtime === "flash") && chunk_size) {
                if (file.size < chunk_size) {
                    _this.directUpload(uploader,file);
                } else {
                    _this.resumeUpload(uploader,file);
                }
            } else {
                _this.directUpload(uploader,file);
            }
        })

        //UploadProgress: 每个文件上传时处理相关的事情（提示上传进度等操作）    
        uploader.bind("UploadProgress", function(uploader, file) {
            console.log("UploadProgress")
            // 更新进度条进度信息;
            let percent = file.percent + "%";
            let count = Math.ceil(file.size / chunk_size);
            //有时候需要对每一个块进行进度展示
            if (file.size > chunk_size) {
                _this.updateChunkProgress(file, chunk_size, count);
            }
        });
        
        uploader.bind("ChunkUploaded", function(uploader, file, info) {
            console.log("ChunkUploaded")
            let res = JSON.parse(info.response);
            let leftSize = info.total - info.offset;

            //url+'/mkblk/1568658'中1568658就是这个leftSize
            if (leftSize < chunk_size) {
                uploader.setOption({
                    url:  _this.config.url + "/mkblk/" + leftSize
                });
            }

            // 更新本地ctx存储状态和indexCount
            let localFileInfo = JSON.parse(localStorage.getItem(file.name)) || [];
            localFileInfo[indexCount] = {
                ctx: res.ctx,
                time: new Date().getTime(),
                offset: info.offset,
                percent: file.percent
            };
            indexCount++;
            localStorage.setItem(file.name, JSON.stringify(localFileInfo));
        });

        //每个文件上传成功后,处理相关的事情 
        uploader.bind("FileUploaded", function(uploader, file, responseObject) {
            console.log("FileUploaded")
            if (resume) {
                _this.mkFileRequest(uploader,file);               
            } else {
                // 其中 info 是文件上传成功后，服务端返回的json，形式如
                /*
                {
                    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                    "key": "gogopher.jpg"
                }
                */
                let res = JSON.parse(responseObject.response)

                // 获取上传成功后的文件的Url
                let sourceLink = _this.config.domain +'/'+ res.key; 
                console.log(sourceLink)
            }
        })
    },
    /**
     * 每一块的进度百分比
     * 
     */
    updateChunkProgress: function (file, chunk_size, count) {

        //第几块
        let index = Math.ceil(file.loaded / chunk_size);

        //当前模块已下载大小
        let chunck_loaded_size = file.loaded - chunk_size * (index - 1);

        //当前模块百分进度
        chunck_percent = chunck_loaded_size / chunk_size *100;
    },
    /**
     * 小于规定chunk_size，就直接上传
     * 
     */
    directUpload: function(uploader,file) {
        console.log("directUpload")

        // 对每个文件的key进行定制处理，因为访问是根据key来访问资源
        let key = "";  

        //获取年月日时分秒  
        let date = new Date();  
        let year = date.getFullYear();  
        let month = date.getMonth()+1;  
        let day = date.getDate();  
        let hour = date.getHours();  
        let minute = date.getMinutes();  
        let second = date.getSeconds();  
        key += year+'_'+month+'_'+day+'_'+hour+minute+second;  

        //key里面不能包含分隔符'/'，如'/test/'+key
        key += file.name;

        let multipart_params_obj = {};
        multipart_params_obj.token = this.config.uptoken;

        // filterParams 返回符合自定义变量格式的数组，每个值为也为一个数组，包含变量名及变量值
        let customVarList = qiniu.filterParams(putExtra.params);
        for (let i = 0; i < customVarList.length; i++) {
            let k = customVarList[i];
            multipart_params_obj[k[0]] = k[1];
        }
        multipart_params_obj.key = key; 
        uploader.setOption({
            url: this.config.url,
            //为true时将以multipart/form-data的形式来上传文件
            multipart: true,
            multipart_params:multipart_params_obj
        })
    },
    /**
     * 快上传前，准备操作，如必要配置ctx、url、multipart、headers
     * 
     */
    resumeUpload: function(uploader,file) {
        console.log("resumeUpload")
        
        //先初始化blockSize
        blockSize = chunk_size;

        //不同文件进行块上传，初始化ctx数组指针
        //之前有上传过的，被中断的，继续上传，更新blockSize
        this.initFileInfo(file);
        
        //官方实例有这段，我实验过，没用的，chunk_size就是blockSize，而且也不可能是0，七牛快上传，每块必须是4mb
        // if(blockSize === 0){
        //   this.mkFileRequest(uploader,file)
        //   uploader.stop()
        //   return
        // }
        
        //块上传标志
        resume = true;
        uploader.setOption({
            url: this.config.url + "/mkblk/" + blockSize,
            //为false 时则以二进制的格式来上传文件
            multipart: false,
            //当分片上传时，请求需要带这样的头信息，类似getHeadersForChunkUpload
            headers:{
                Authorization: "UpToken " + this.config.uptoken
            },
            multipart_params: {}
        });
    },
    initFileInfo(file) {
        let localFileInfo = JSON.parse(localStorage.getItem(file.name))|| [];
        let length = localFileInfo.length
        if (length) {
        let clearStatus = false
        for (let i = 0; i < localFileInfo.length; i++) {
            indexCount++
            //之前有上传过片段块，如果过期就重新分片上传，否则继续  
            if (this.isExpired(localFileInfo[i].time)) {
            clearStatus = true
            localStorage.removeItem(file.name);
            break;
            }
        }
        if(clearStatus){
            indexCount = 0;
            return
        }
        
        file.loaded = localFileInfo[length - 1].offset;
        let leftSize = file.size - file.loaded;
        //更新blockSize
        if(leftSize < chunk_size){
            blockSize = leftSize
        }
        file.percent = localFileInfo[length - 1].percent;
        return
        }else{
        indexCount = 0
        }
    },
    /**
     * 拼接每块数据库，创建文件
     * 
     */
    mkFileRequest(uploader,file){
        //这样上传成功，返回response中的name才不至于为null
        putExtra.params["x:name"] = file.name.split(".")[0];

        // 返回创建文件的 url
        let requestUrl = qiniu.createMkFileUrl(
            this.config.url,
            file.size,
            file.name,
            putExtra
        );
        /*
        * #Api：https://developer.qiniu.com/kodo/api/1287/mkfile
        * #将上传好的所有数据块按指定顺序合并成一个资源文件
        * #每个数据块上传完成，会返回的 ctx 信息，然后每块ctx信息拼接后作为data，上传给七牛以创建文件。
        * #并且创建完文件无比删除localStorage.removeItem(file.name)，否则无法正确创建后续快上传文件
        */
        let ctx = []
        let id = file.id
        let local = JSON.parse(localStorage.getItem(file.name))
        for(let i =0;i<local.length;i++){
            ctx.push(local[i].ctx)
        }

        // 设置上传的header信息
        let headers = qiniu.getHeadersForMkFile(this.config.uptoken)
        let _this = this;

        console.log(headers)

        let req = new XMLHttpRequest();
        
        req.open("POST",requestUrl,true);

        req.setRequestHeader('Authorization',headers.Authorization);

        req.send(ctx.join(","));  

        req.onreadystatechange = function(){
            if(req.readyState == 4 && req.status == 200){
                console.log('success');
                // 获取上传成功后的文件的Url
                let sourceLink = _this.config.domain +'/'+ JSON.parse(req.response).key; 
                console.log(sourceLink)
                localStorage.removeItem(file.name)  
            }else{
                console.log('error:'+req.statusText);
            }
        } 
        
        /*
        * # 采用jquery情况
        * # https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.0/jquery.min.js
        */

        /*
        $.ajax({url: requestUrl, type: "POST",  headers: headers, data: ctx.join(","), success: function(res){
            // uploadFinish(res, file.name,board[id]);
            if (res.key && res.key.match(/\.(jpg|jpeg|png|gif)$/)) {
                // imageDeal(board, res.key, domain);
            }
            // 获取上传成功后的文件的Url
            let sourceLink = _this.config.domain +'/'+ res.key; 
            console.log(sourceLink)
        },error(res){
            console.log(res)
        }})
        */
    },
    /**
     * 每个上传的块会有失效期，过了就没用了。我们前段固定一天就是失效
     */
    isExpired(time){
        let expireAt = time + 3600 * 24* 1000;
        return new Date().getTime() > expireAt;
    }
}

