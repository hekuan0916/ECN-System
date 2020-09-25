<template>
    <div id="upload">
        <checkPic></checkPic>
        <!-- <a-card title="查看图片或视频" class='card' v-if="checkImgList.length>0">

            查看上传的图片
            <div class="imgUpload">
                <div class="imgList" v-for="(item,index) in checkImgList" :key='index'>
                    <img class="img" v-if="item.base64" :src="'data:image/png;base64,' + item.base64" @click="showBigImg(item.base64)"/> 
                    <a-icon type="close" v-if="item.base64" class="icon" @click="delImg(item.id)" />
                </div>
            </div>
             查看上传的视频
            <div class="ant-card-body">
                <li class="videoList" v-for="(item,index) in checkImgList" :key='index' v-if="item.video">
                    <div style="text-align:center;" @click="showBigVideo(item.video)">
                        <video class="video" :src="'data:video/mp4;base64,' + item.video" width="300" />       
                    </div>
                    <div class="cancelVideo"> 
                        <a-icon type="close-circle"  class="videoIcon" @click="delImg(item.id)"/>
                    </div>
                </li>
            </div>
        </a-card> -->

        <a-card title="上传图片" class='card'>
            <div>
                <li class="list-link">
                    <!-- 替换上传的按钮 -->
                    <label for="file">
                        <div class="ant-upload ant-upload-select ant-upload-select-picture-card">
                            <span role="button" tabindex="0" class="ant-upload ant-upload-btn">
                                <div>
                                    <i class="anticon anticon-plus">
                                        <svg viewBox="64 64 896 896" data-icon="plus" width="1em" height="1em" fill="currentColor" aria-hidden="true" class="">
                                            <path d="M848 474H550V152h-76v322H176c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h298v322h76V550h298c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"></path>
                                        </svg>
                                    </i> 
                                    <div class="ant-upload-text">Upload</div>
                                </div>
                            </span>
                        </div>
                    </label>
                    <!-- <input type="file" id="file" accept="video/*" @change="changeImg" style="display:none;"> -->
                    <input type="file" id="file" accept="image/*" @change="changeImg" style="display:none;">
                </li>
            </div>
            <a-card title="图片" class='photoCard' v-if="imgsrc.length>0">
                <!-- 上传的图片 -->
                <div class="imgUpload">
                    <div class="imgList" v-for="(item,index) in imgsrc" :key='index'>
                        <img class="img" :src='item' />
                        <a-icon class="icon" type="close-circle" @click="cancelImg(index)" />
                    </div>
                </div>
            </a-card>
            <!-- 上传的视频回显 -->
            <a-card title="视频" v-if="videoList.length>0">
                <div>
                    <li v-for="(item,index) in videoList" :key='index'>
                        <p>{{item}}
                            <span style="float:right"> 
                                <a-icon type="close-circle"  class="videoIcon" @click="cancelVideo(index)"/>
                            </span>
                        </p>
                    </li>
                </div>

                <!-- <div class="ant-card-body">
                    <li class="videoList" v-for="(item,index) in videosrc" :key='index'>
                        <div style="text-align: center;">
                            <video  controls="controls" width="300" height="300">
                                <source :src="item" type="video/mp4">
                                <source :src="item" type="video/webm">
                                <source :src="item" type="video/ogg"> 
                                你的浏览器不支持H5播放器
                            </video>
                        </div>
                        <div class="cancelVideo"> 
                        <a-icon type="close-circle"  class="videoIcon" @click="cancelVideo(index)"/>
                        </div>
                    </li>
                </div> -->
            </a-card>
            <div class="btn">
                <a-button type="primary" @click="uploadImg()">上传</a-button>
            </div>
        </a-card>
    </div>
</template>

<script>
import {uploadImg,showMedioInfo,delMedioInfo} from '@/assets/js/url'
import checkPic from '@/components/checkPic'
import qs from 'qs'
export default {
    data () {
        return {
            question_id : '',
            imgsrc: [],
            videoList: [],
            fileList: [],
            checkImgList:[],
            visible: false,
            bigImgSrc: '',
            videoVisible:  false,
            bigVideoSrc: ''
        };
    },
    components:{checkPic},
    mounted(){
        this.question_id = this.$route.query.id
        const root = window.sessionStorage.getItem('ROOT')
        const group = window.sessionStorage.getItem('GROUP') || ''

    },
    methods:{
        //改变事件
        changeImg(e){
            let files = e.target.files || e.dataTransfer.files;
            let len = files.length
            this.fileList = files
            this.displayAsImage(files); 
        },
        //取消图片
        cancelImg(index){
            this.imgsrc.splice(index, 1);
        },
        //取消视频
        cancelVideo(index){
            this.videoList.splice(index,1)
        },
        //生成图片url
        displayAsImage(files) {
            let len = files.length
            for(var i=0;i<len;i++){
                let type = files[i].type
                if(/video\/\w+/.test(files[i].type)){ //代表是视频
                    let videoList = files[i].name
                    this.videoList.push(videoList)
                    // let videoUrL = URL.createObjectURL(files[i])
                    // console.log(videoUrL,'videouRL')
                    // this.videosrc.push(videoUrL)
                    // 判断下视频大小及格式，太大的可能会有问题
                    // console.log(files[i])
                    // console.log(files[i].size/(1024*1024),'888')
                    // const reader = new FileReader();
                    // reader.readAsDataURL(files[i]);
                    // reader.onload = (evt) => {
                    //     console.log(evt)
                    //     console.log(evt.target.result,'a')
                    //     this.videosrc.push(evt.target.result)
                    // };
                }else if(/image\/\w+/.test(files[i].type)){  //代表图片
                    let imgURL = URL.createObjectURL(files[i])
                    this.imgsrc.push(imgURL)
                }
                
            }
        },
        //提交图片给后端
        uploadImg(){
            let _this = this
            let formData = new FormData()
            let len = _this.fileList.length
            if(len > 0){
                dd.device.notification.showPreloader({
                    text: "上传中...",
                    showIcon: true,
                })
                formData.append('question_id',_this.question_id)

                let index = 0;

                let fn2 = () => {
                    index++;
                    fn();
                }

                let fn = () => {
                    if(index === len){
                        _this.axios.post(uploadImg,formData).then(res=>{
                            if(res.data.success == true){
                                _this.$message.success(res.data.message)
                                _this.$router.push('ecnList')
                                dd.device.notification.hidePreloader()
                            }else{
                                dd.device.notification.hidePreloader()
                                _this.$message.error(res.data.message)
                            }
                        })

                        return;
                    }

                    var file = _this.fileList[index]
                    if(/image\/\w+/.test(file.type)){ //判断是否为图片,图片就压缩
                        _this.photoCompress(file, {
                            quality: 0.2
                        }, function(base64Codes,filename){
                            let newfile = _this.processData(base64Codes,filename);
                            formData.append('files',newfile)
                            fn2();
                        })
                    }else{
                        formData.append('files',file)
                        
                        fn2();
                    }
                }

                fn();
            }else{
                _this.$message.error('请选择图片或视频上传')
            }
        },

        photoCompress(file,w,objDiv){
            let _this = this
            var ready=new FileReader();
            /*  开始读取指定的Blob对象或File对象中的内容. 当读取操作完成时,
                readyState属性的值会成为DONE,如果设置了onloadend事件处理程序,
                则调用之.同时,result属性中将包含一个data: URL格式的字符串以表示所读取文件的内容.
            */
            ready.readAsDataURL(file);
            ready.onload=function(){
                var re=this.result;
                _this.dealImage(re,w,objDiv,file.name)
            }
        },

        dealImage(path, obj, callback,fileName) {
            let _this = this
            var img = new Image();
            img.src = path;
            img.onload = function(){
                var that = this;
                // 默认按比例压缩
                var scale = that.width / that.height;
                var w = that.width;
                var h = (w / scale);

                // //水印
                // var tpl = document.createElement('canvas');
                // tpl.height = '120' 
                // tpl.width = '180'
                // var ctxl = tpl.getContext("2d");   //返回一个用于在画布上绘图的环境
                // // 绘制水印                
                // ctxl.font="18px microsoft yahei";
                // ctxl.rotate(20*Math.PI/180);
                // ctxl.fillStyle = "rgba(0,0,0,0.5)";
                // // ctxl.fillStyle = 'rgba(112, 113, 114, 0.6)' // 水印字体颜色
                // ctxl.fillText('张三-79070',30, 20);
                
                //生成canvas
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                // 创建属性节点
                canvas.width = w
                canvas.height = h
                ctx.drawImage(that, 0, 0, w, h);

                // //将水印放到canvas的图片中区
                // var pat = ctx.createPattern(tpl, "repeat");    //平铺
                // ctx.rect(0,0,w,h);
                // ctx.fillStyle = pat;
                // ctx.fillRect(0, 0, w, h);

                // quality值越小，所绘制出的图像越模糊
                var base64 = canvas.toDataURL('image/jpeg', obj.quality);
                // 回调函数返回base64的值
                callback(base64,fileName);
            }
        },

        processData(urlData,fileName){
            var arr = urlData.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), 
                n = bstr.length, 
                u8arr = new Uint8Array(n);
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr],fileName, {type:mime});
        },

    }
}

</script>

<style lang="less">
    .ant-card-head,.ant-card-body{
        padding:10px;
    }
    .ant-card-head-title{
        padding: 0;
    }
    .ant-modal-body{
        padding: 7px;
    }

    .lable-tc{
        border-top: 1px solid #f2f2f2;
        padding-left: 35rpx;
        padding-top:18rpx;
        font-size: 28rpx;
    }
    .photoCard{
        margin-bottom: 10px;
    }
    .imgUpload{
        padding:5px 0;
        display: inline-block;
    }
    .imgList{
        // float: left;
        display: inline-block;
    }
    .img{
        width: 166px;
        height: 155px;
        margin: 8px 6px;
        border: 1px solid #b4b4b4;
        padding: 1px;
    }
    .icon{
        margin-left: -12px;
        float: right;
        font-size: 16px;
    }

    .videoList{
        margin: 8px 0;
        border: 1px solid #b4b4b4;
    }
    .video{
        padding: 5px 5px 0 5px;
    }
    .cancelVideo{
        text-align: center;
    }
    .videoIcon{
        font-size: 18px;
    }
    .btn{
        text-align: center;
        margin-top: 20px;
    }
    #video{
        z-index: 1000;
    }
    
</style>