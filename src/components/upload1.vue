<template>
    <div>
        <img id="video-poster" alt="视频封面" />
        <input type="file" id="upload-video" accept="image/*|video/*|audio/*|MIME_type" @change="uploadVideo" />
        <video id="video" controls />

        <video  id="example_video_1" class="video-js" webkit-playsinline=""
        playsinline="" x5-playsinline="" x-webkit-airplay="allow"
        width="100%" height="100%" src="" preload="true">
        </video>
    </div>
</template>

<script>
export default {
    data(){
        return{

        }
    },
    methods:{
        uploadVideo() {
            var video_file = document.getElementById('upload-video').files[0];
            // 这里可以打印出视频文件的size大小
            console.log(video_file.size);
            if (!video_file) return;
            var reader = new FileReader();
            reader.onload = function () {
            var videoDom = document.getElementById('video');
            videoDom.onloadeddata = function () {
                // 这里可以打印视频时长
                console.log(this.duration);
                // 这里取得视频封面
                var canvas = document.createElement('canvas');
                canvas.width = 300;
                canvas.height = 300 * this.videoHeight / this.videoWidth;
                canvas.getContext('2d').drawImage(this, 0, 0, canvas.width, canvas.height);
                document.getElementById('video-poster').src = canvas.toDataURL();
            }
            videoDom.src = reader.result;
            }
            reader.readAsDataURL(video_file);
        }
    }
}
</script>
