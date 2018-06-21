//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    city: "",
    today: {},
    future: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    this.loadInfo();
  },
  loadInfo: function () {
    var page = this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude;
        console.log(latitude);
        page.loadCity(latitude, longitude);
      }
    })
  },
  loadCity: function (latitude, longitude) {
    var page = this;
    wx.request({
      url: 'http://api.map.baidu.com/geocoder/v2/?ak=k0FLTatEcEbsuu5A15hCfBea7KoxuSkf&location=' + latitude + ',' + longitude +'&output=json',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
       console.log(res);
        var city = res.data.result.addressComponent.city;
       //console.log(city);
        city = city.replace("市", "");
        page.setData({ city: city });
        page.loadWeather(city);
      }
    });
  },
  loadWeather: function (city) {
    var page = this;
    wx.request({
      url: 'http://wthrcdn.etouch.cn/weather_mini?city=' + city,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        var future = res.data.data.forecast;
        var todayInfo = future.shift();
        var today = res.data.data;
        today.todayInfo = todayInfo;
        page.setData({ today: today, future: future })
      }
    })
  }

})
