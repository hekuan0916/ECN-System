<template>
    <div id="upload" >
        <a-card title="查看图片" class='card' >
            <!-- 查看上传的图片 -->
            <div class="imgUpload">
                <div class="imgList" v-for="(item,index) in checkImgList" :key='index'>
                    <!-- <img id="img" class="img" v-if="item" :src="item" @click="showBigImg(item)"/>  -->
                    <img :id="'img'+index" class="img" v-if="item.base64" :src="'data:image/png;base64,' + item.base64" @click="showBigImg(item.base64,index)"/> 
                    <a-icon type="close" v-if="item.base64" class="icon" @click="delImg(item.uuid)" />
                </div>
            </div>
             <!-- 查看上传的视频 -->
            <div class="ant-card-body">
                <li class="videoList" v-for="(item,index) in checkImgList" :key='index'>
                    <div style="text-align:center;margin:10px 0;" v-if="item.video" @click="showBigVideo(item.video,item.uuid)">
                        <video class="video" width="300" :poster="'data:image/png;base64,' + item.video">
                            您的浏览器不支持 video 标签。 
                        </video>
                    </div>
                    <div class="cancelVideo"> 
                        <a-icon type="close-circle"  class="videoIcon" @click="delImg(item.uuid)"/>
                    </div>
                </li>
            </div>
        </a-card>
        
        <a-modal title="查看大图" :visible="visible" @cancel="visible = false" :footer='null'>
            <img :src="bigImgSrc" style="width: 100%" alt="example">
        </a-modal>
        
        <a-modal title="查看视频" :visible="videoVisible" @cancel="videoVisible = false" width="95%" :footer='null'>
            <video class="video" :src="'data:video/mp4;base64,' + bigVideoSrc" autoPlay width="100%">    
             您的浏览器不支持 video 标签。
            </video>   
        </a-modal>

    </div>
</template>

<script>
import {showMedioInfo,delMedioInfo,showVideo} from '@/assets/js/url'
import qs from 'qs'
export default {
    data () {
        return {
            question_id : '',
            checkImgList:[],
            visible: false,
            bigImgSrc: '',
            videoVisible:  false,
            bigVideoSrc: '',
            isCanCheck: false
        };
    },
    mounted(){
        const root = window.sessionStorage.getItem('ROOT')
        const group = window.sessionStorage.getItem('GROUP') || ''
        if(root == 'usermedia' || group.indexOf('usermedia') != -1 || group.indexOf('usershowpic') != -1){
            this.isCanCheck = true
        }
        this.question_id = this.$route.query.id
        this.showMedioInfo()
    },
    methods:{

        dataURLtoBlob(dataurl) { 
            var arr = dataurl.split(','), 
            mime = arr[0].match(/:(.*?);/)[1], 
            bstr = atob(arr[1]), 
            n = bstr.length, 
            u8arr = new Uint8Array(n); 
            while (n--) { 
            u8arr[n] = bstr.charCodeAt(n); 
            } 
            return new Blob([u8arr], { type: mime }); 
        },
        //查看
        showMedioInfo(){
            dd.device.notification.showPreloader({
                text: "加载中...",
                showIcon: true,
            })
            this.axios.post(showMedioInfo,qs.stringify({
                question_id: this.question_id
            })).then(res=>{
                if(res.data.success == true){
                    dd.device.notification.hidePreloader()
                    this.checkImgList = res.data.obj
                }
            })
        },
        //查看大图
        showBigImg(item,index){
            const jobnumber = window.sessionStorage.getItem('LYRIC_JOBNUMBER')
            const name = window.sessionStorage.getItem('LYRIC_NAME')
            var img=document.getElementById("img"+index);
            var w = img.width * 10;
            var h = img.height * 7 ;
            //水印
            var tpl = document.createElement('canvas');
            tpl.height = '180' 
            tpl.width = '250'
            var ctxl = tpl.getContext("2d");   //返回一个用于在画布上绘图的环境
            // 绘制水印                
            ctxl.font="20px microsoft yahei";
            ctxl.rotate(20*Math.PI/180);
            ctxl.fillStyle = "rgba(225,225,225,0.2)";
            ctxl.fillText(name + '--' + jobnumber,30, 20);

             //生成canvas
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            // 创建属性节点
            canvas.width = w 
            canvas.height = h 
            ctx.drawImage(img, 0,0,w,h);

            //将水印放到canvas的图片中区
            var pat = ctx.createPattern(tpl, "repeat");    //平铺
            ctx.rect(0,0,w,h);
            ctx.fillStyle = pat;
            ctx.fillRect(0, 0, w, h);
            var base64 = canvas.toDataURL();
            // var bolbUrl = URL.createObjectURL(this.dataURLtoBlob(base64))
            
            this.bigImgSrc = base64
            this.visible = true

            // dd.biz.util.previewImage({
            //     urls: [base64],//图片地址列表
            //     current: base64,//当前显示的图片链接
            //     onSuccess: function(result) {},
            //     onFail: function(err) {}
            // })
            
        },
        //查看大视频
        showBigVideo(item,uuid){
            this.bigVideoSrc = ''
            dd.device.notification.showPreloader({
                text: "加载中...",
                showIcon: true,
            })
            this.axios.post(showVideo,qs.stringify({
                uuid: uuid
            })).then(res=>{
                dd.device.notification.hidePreloader()
                if(res.data.success == true){
                    console.log(res.data.obj.length)
                    this.bigVideoSrc = res.data.obj
                    this.videoVisible = true
                }else{
                    this.$message.error('失败')
                }   
                

            })
        },

        //删除图片
        delImg(uuid){
            this.axios.post(delMedioInfo,qs.stringify({
                uuid:uuid
            })).then(res=>{
                if(res.data.success == true){
                    this.$message.success(res.data.message)
                    this.showMedioInfo()
                }else{
                    this.$message.error(res.data.message)
                }
            })
        },

        
    }
}

</script>

<style lang="less">