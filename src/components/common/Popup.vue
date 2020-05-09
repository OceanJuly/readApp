<template>
  <div class="popup" v-if="popupVisible">
    <transition name="fade">
      <div class="popup-bg" @click.stop.prevent="hide" v-show="popupVisible"></div>
    </transition>
    <transition name="popup-slide-up">
      <div class="popup-wrapper" v-show="visible">
        <div class="popup-title" v-if="title && title.length">{{ title }}</div>
        <div class="popup-btn"
             v-for="(item, index) in btn"
             :key="index"
             @click="item.click"
             :class="{'danger': item.type === 'danger'}">{{ item.text }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Popup',
  props: {
    title: String,
    btn: Array
  },
  data () {
    return {
      popupVisible: false,
      visible: false
    }
  },
  methods: {
    show () {
      this.popupVisible = true
      setTimeout(() => {
        this.visible = true
      })
    },
    hide () {
      this.visible = false
      setTimeout(() => {
        this.popupVisible = false
      }, 200)
    }
  }
}
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
@import "../../assets/styles/global";

.popup {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
  background-color: rgba(0, 0, 0, .4);
  .popup-bg {
    width: 100%;
    height: 100%;
  }
  .popup-wrapper {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 2000;
    width: 100%;
    background: #fff;
    .popup-title {
      height: px2rem(44);
      width: 100%;
      border: px2rem(1) solid #eee;
      font-size: px2rem(12);
      line-height: px2rem(14);
      padding: px2rem(15);
      box-sizing: border-box;
      text-align: center;
      color: #999999;
      @include center;
    }
    .popup-btn {
      width: 100%;
      height: px2rem(60);
      font-size: px2rem(16);
      font-weight: bold;
      color: #666666;
      border-bottom: px2rem(1) solid #eee;
      @include center;
      &.danger {
        color: $color-pink;
      }
    }
  }
}
</style>
