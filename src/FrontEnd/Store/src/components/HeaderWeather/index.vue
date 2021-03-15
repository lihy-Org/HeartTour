<template>
  <div v-if="showHeaderWeather" class="header-weather">
    <!-- 地理位置 -->
    <span class="localtion">{{ localtionInfo }}</span>

    <!-- 天气 -->
    <span class="weather-text">{{ weatherInfo.text }}</span>

    <!-- 天气图标 -->
    <img
      :src="weatherIcon && require(`@/assets/weather_images/${weatherIcon}.png`)"
      class="weather-icon"
    >

    <!-- 温度 -->
    <span class="weather-temp">{{ `${weatherInfo.tempMin}℃ ~ ${weatherInfo.tempMax}℃` }}</span>
  </div>
</template>
<script>
import AMap from 'AMap'
import { commonUrl } from '@/api/common'

export default {
  props: {
    panelHeight: {
      type: Number,
      default: 350
    }
  },
  data() {
    return {
      /**
       * 高德地图查询信息
       * @param showHeaderWeather 获取失败或者成功后，是否展示天气、地理位置等
       * @param localtionInfo 位置信息
       * @param weatherInfo 天气信息
       * @param weatherIcon 天气图标
       */
      showHeaderWeather: false,
      localtionInfo: '',
      weatherIcon: null,
      weatherInfo: {}
    }
  },
  mounted() {
    this.initWeather()
  },
  methods: {
    // 获取定位，因为天气是基于用户定位的
    getGeolocation() {
      const that = this
      return new Promise(function(resolve, reject) {
        const mapObj = new AMap.Map('iCenter')
        mapObj.plugin('AMap.Geolocation', function() {
          const geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, // 是否使用高精度定位，默认:true
            timeout: 10000, // 超过10秒后停止定位，默认：无穷大
            maximumAge: 0, // 定位结果缓存0毫秒，默认：0
            convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            showButton: true, // 显示定位按钮，默认：true
            buttonPosition: 'LB', // 定位按钮停靠位置，默认：'LB'，左下角
            buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            showMarker: true, // 定位成功后在定位到的位置显示点标记，默认：true
            showCircle: true, // 定位成功后用圆圈表示定位精度范围，默认：true
            panToLocation: true, // 定位成功后将定位到的位置作为地图中心点，默认：true
            zoomToAccuracy: true // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          })
          mapObj.addControl(geolocation)
          geolocation.getCurrentPosition()
          AMap.event.addListener(geolocation, 'complete', (data) => {
            console.log(data)
            resolve(data)
          }) // 返回定位信息
          AMap.event.addListener(geolocation, 'error', (err) => {
            that.$message.error(err)
            reject(err)
          }) // 返回定位出错信息
        })
      })
    },
    async initWeather() {
      // 获取天气
      const $self = this

      // 获取定位的城市
      const countyInfo = await $self.getGeolocation()
      console.log(countyInfo)

      // 位置信息
      if (!countyInfo.addressComponent || !countyInfo.addressComponent.city) {
        this.showHeaderWeather = false
        return
      } else {
        this.showHeaderWeather = true
      }
      this.localtionInfo = countyInfo.addressComponent.city + countyInfo.addressComponent.district

      // 和风天气，可以显示天气icon
      const key = '6624dc043aeb492aa0667afca72b5995'
      const url = `https://devapi.qweather.com/v7/weather/3d?location=${countyInfo.position.lng},${countyInfo.position.lat}&key=${key}`
      commonUrl.getWeather(url).then(res => {
        /**
         * @param tempMin 最低气温
         * @param tempMax 最高气温
         * @param text 天气
         * @param iconDay 天气图标
         */
        this.$set(this, 'weatherInfo', {
          tempMin: res.data.daily[0].tempMin,
          tempMax: res.data.daily[0].tempMax,
          text: res.data.daily[0].textDay
        })
        this.weatherIcon = res.data.daily[0].iconDay
      }).catch(err => {
        console.log(err)
      })

      // // 高德地图查询的天气，但是没有天气icon
      // AMap.plugin('AMap.Weather', function() {
      //   const weather = new AMap.Weather()
      //   // 查询实时天气信息, 查询的城市到行政级别的城市
      //   weather.getLive(countyInfo.addressComponent.city, function(err, data) {
      //     if (!err) {
      //       console.log(data)
      //       $self.weatherInfo.city = data.city
      //       $self.weatherInfo.humidity = data.humidity
      //       $self.weatherInfo.temperature = data.temperature
      //       $self.weatherInfo.weather = data.weather
      //       $self.weatherInfo.windDirection = data.windDirection
      //       $self.weatherInfo.windPower = data.windPower
      //     } else {
      //       this.$message.error('未查询到相关天气信息')
      //     }
      //   })
      //   // 查询实时天气预报
      //   weather.getForecast(countyInfo.addressComponent.city, function(err, data) {
      //     if (!err) {
      //       console.log(data)
      //     }
      //   })
      // })
    }
  }
}
</script>
<style lang="scss" scoped>
.header-weather > *:not(:last-child) {
  margin-right: 16px;
}
.header-weather {
  .weather-icon {
    vertical-align: middle;
    height: 100% !important;
  }
}
</style>
