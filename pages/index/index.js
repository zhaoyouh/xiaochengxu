//index.js
//获取应用实例
const app = getApp()
const innerAudioContext = wx.createInnerAudioContext();
innerAudioContext.autoplay = false;
innerAudioContext.onError((res) => {
  console.log(res.errMsg)
  console.log(res.errCode)
})

Page({
  data: {
    musicUrl: '',
    albumpic:'',
    totalTime:0,
    cTime:'00:00',
    content:[],
    playButton:'/images/pause.png',
    plyaFalg:false,
    show:true,
    aa: app.data.globalData,
    width:0,
  },
  //事件处理函数
  // bindViewTap: function() {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },

  // 初始化播放器
  audio:function(){
    var that = this;

    // https://api.bzqll.com/music/tencent/url?id=曲目id &key=579621905&br=320  播放链接

    // this.data.musicUrl = 'http://zhangmenshiting.qianqian.com/data2/music/b10b0b3b1b713710ed10ba6e93adefc2/613440998/613440998.mp3?xcode=a79d11b662a6533ef1962d1d1690fc93'

    console.log(that.data.totalTime)
    that.setData({
      duration: that.changeTime(that.data.totalTime)
    })

    innerAudioContext.src = that.data.musicUrl;

    innerAudioContext.play();

    setTimeout(function () {
      console.log('进入播放：' + innerAudioContext.currentTime)
      that.onTimeUpdate()
    }, 1000)

    that.setWidth();
    // that.onEnded()
  },

  // 开始播放事件
  audioPlay:function(){
    this.audio();
    innerAudioContext.play();

    this.setData({
      playButton: '/images/pause.png',
    });

    this.onTimeUpdate();

    console.log('开始播放：'+innerAudioContext.currentTime)
  },

  // 暂停播放事件
  audioPause:function(){
    innerAudioContext.pause();

    this.setData({
      playButton: '/images/play.png',
    })

    console.log('暂停播放：'+innerAudioContext.currentTime)
  },

  // 播放按钮切换事件
  control:function(){
    innerAudioContext.currentTime
    
    if (this.data.plyaFalg) {
      this.audioPlay()
      this.setData({
        plyaFalg: false
      })

      this.setWidth();
    }else{
      this.audioPause()
      this.setData({
        plyaFalg: true
      })
    }

  },

  // 监听播放更新进度
  onTimeUpdate:function(){
    var time,ctime,that = this;
    innerAudioContext.onTimeUpdate(function () {
      // console.log('监听改变：'+innerAudioContext.currentTime)
      ctime = parseInt(innerAudioContext.currentTime);
      time = that.changeTime(ctime);
      that.setData({
        cTime: time,
      });
    })
  },

  //监听自然播放结束
  onEnded:function(){
    var that = this;
    innerAudioContext.onEnded(function(){
      innerAudioContext.stop();
      that.setData({
        cTime: '00:00'
      })
    })
  },

  //时间转化分，秒
  changeTime: function (parameter){
    //获取分钟，除以60取整数，得到整数分钟
    var m = parseInt(parameter / 60);
    //获取秒数，秒数取佘，得到整数秒数
    var s = parseInt(parameter % 60);
  
    var minute = m < 10 ? '0' + m : m,
      second = s < 10 ? '0' + s : s;

    return minute + ':' + second
  },

  getMusic: function () {
    var that = this;

    wx.request({
      // url:'https://u.y.qq.com/cgi-bin/musicu.fcg',
      url:'https://c.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg',
      data: {
        'albummid':'0010UePb4dyfoi',
      },
      method: 'get',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data);

        // var time = that.changeTime(res.data.bitrate.file_duration)
        that.setData({
          content: res.data.data,
          totalTime: res.data.data.list[0].interval, 
          albumpic: "https://y.gtimg.cn/music/photo_new/T002R300x300M000" + res.data.data.mid + ".jpg",
          musicUrl: "https://api.bzqll.com/music/tencent/url?id=" + res.data.data.list[0].songmid + "&key=579621905&br=320",
          // show:false
        });

        // that.audio();
      },
      fail(res) {
        console.log(res.data)
      }
    });
  },

  onPullDownRefresh() { 
    
    },

    //进度条
    setWidth:function(){
      var that = this, step,timer, leader, target;
      var query = wx.createSelectorQuery();
      query.select('.progress').boundingClientRect();
      query.exec(function (rect) {
        target = rect[0].width;

        step = +(target / that.data.totalTime).toFixed(1);
      });

      if (this.data.plyaFalg) {
        clearTimeout(timer);
        console.log('清除定时器')
        return false;
      }

      timer = setTimeout(function () {
        leader = +that.data.width;
        if (leader>=target) {
          that.setData({
            width: +target
          });

          clearTimeout(timer);
        }else{
          leader = (leader + step).toFixed(1)
          that.setData({
            width: +leader
          })

          that.setWidth();
        }
      }, 1000)
    },

  onReady: function () {
  // this.getMusic();
  // this.audio();

    //获得popup组件
    // this.popup = this.selectComponent("#popup");

  },

  onLoad: function () {
  },

})
