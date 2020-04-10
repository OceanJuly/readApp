<template>
  <div class="flap-card-wrapper" v-show="flapCardVisible">
    <div class="flap-card-bg" :class="{'animation': runFlapCardAnimation}" v-show="runFlapCardAnimation">
      <div class="flap-card" v-for="(item, index) in flapCardList" :key="index" :style='{zIndex: item.zIndex}'>
        <div class="flap-car-circle">
          <div class="flap-card-semi-circle flap-card-semi-circle-left" :style="semiCircleStyle(item, 'left')" ref="left"></div>
          <div class="flap-card-semi-circle flap-card-semi-circle-right" :style="semiCircleStyle(item, 'right')" ref="right"></div>
        </div>
      </div>
      <div class="point-wrapper">
        <div class="point" :class="{'animation': runPointAnimation}" v-for="item in pointList" :key="item"></div>
      </div>
    </div>
    <div class="book-card" v-show="runBookCardAnimation" :class="{'animation': runBookCardAnimation}">
      <div class="book-card-wrapper">
        <div class="img-wrapper">
          <img class="img" src="data.cover">
        </div>
        <div class="content-wrapper">
          <div class="title">{{data ? data.title : ''}}</div>
          <div class="author sub-title-medium">{{data ? data.author : ''}}</div>
          <div class="category">{{categoryText()}}</div>
        </div>
        <div class="read-btn" @click.stop="showBookDetail">{{$t('home.readNow')}}</div>
      </div>
    </div>
    <div class="close-btn-wrapper" @click="close">
      <div class="icon-close"></div>
    </div>
  </div>
</template>

<script>
import { storeHomeMixin } from '../../utils/mixin'
import { categoryText } from '../../utils/store'

export default {
  name: 'FlapCard',
  mixins: [storeHomeMixin],
  props: {
    data: Object
  },
  data () {
    return {
      flapCardList: [
        {
          r: 255,
          g: 102,
          _g: 102,
          b: 159,
          imgLeft: 'url(' + require('../../assets/images/gift-left.png') + ')',
          imgRight: 'url(' + require('../../assets/images/gift-right.png') + ')',
          backgroundSize: '50% 50%',
          zIndex: 100,
          rotateDegree: 0
        },
        {
          r: 74,
          g: 171,
          _g: 171,
          b: 255,
          imgLeft: 'url(' + require('../../assets/images/compass-left.png') + ')',
          imgRight: 'url(' + require('../../assets/images/compass-right.png') + ')',
          backgroundSize: '50% 50%',
          zIndex: 99,
          rotateDegree: 0
        },
        {
          r: 255,
          g: 198,
          _g: 198,
          b: 102,
          imgLeft: 'url(' + require('../../assets/images/star-left.png') + ')',
          imgRight: 'url(' + require('../../assets/images/star-right.png') + ')',
          backgroundSize: '50% 50%',
          zIndex: 98,
          rotateDegree: 0
        },
        {
          r: 255,
          g: 102,
          _g: 102,
          b: 159,
          imgLeft: 'url(' + require('../../assets/images/heart-left.png') + ')',
          imgRight: 'url(' + require('../../assets/images/heart-right.png') + ')',
          backgroundSize: '50% 50%',
          zIndex: 97,
          rotateDegree: 0
        },
        {
          r: 59,
          g: 201,
          _g: 201,
          b: 22,
          imgLeft: 'url(' + require('../../assets/images/crown-left.png') + ')',
          imgRight: 'url(' + require('../../assets/images/crown-right.png') + ')',
          backgroundSize: '50% 50%',
          zIndex: 96,
          rotateDegree: 0
        }
      ],
      front: 0,
      back: 1,
      intervalTime: 25,
      runFlapCardAnimation: false,
      pointList: null,
      runPointAnimation: false,
      runBookCardAnimation: false
    }
  },
  watch: {
    flapCardVisible (v) {
      if (v) {
        this.runAnimation()
      }
    }
  },
  created () {
    this.pointList = []
    for (let i = 0; i < 18; i++) {
      this.pointList.push(`point${i}`)
    }
  },
  methods: {
    close () {
      this.stopAnimation()
      this.setFlapCardVisible(false)
    },
    semiCircleStyle (item, dir) {
      return {
        backgroundColor: `rgb(${item.r}, ${item.g}, ${item.b})`,
        backgroundSize: item.backgroundSize,
        backgroundImage: dir === 'left' ? item.imgLeft : item.imgRight
      }
    },
    rotate (index, type) {
      const item = this.flapCardList[index]
      let dom
      if (type === 'front') {
        dom = this.$refs.right[index]
      } else {
        dom = this.$refs.left[index]
      }
      dom.style.transform = `rotateY(${item.rotateDegree}deg)`
      dom.style.backgroundColor = `rgb(${item.r}, ${item._g}, ${item.b})`
    },
    flapCardRotate () {
      const frontFlapCard = this.flapCardList[this.front]
      const backFlapCard = this.flapCardList[this.back]
      frontFlapCard.rotateDegree += 10
      frontFlapCard._g -= 5
      backFlapCard.rotateDegree -= 10
      if (backFlapCard.rotateDegree < 90) {
        backFlapCard._g += 5
      }
      if (frontFlapCard.rotateDegree === 90 && backFlapCard.rotateDegree === 90) {
        backFlapCard.zIndex += 2
      }
      this.rotate(this.front, 'front')
      this.rotate(this.back, 'back')
      if (frontFlapCard.rotateDegree === 180 && backFlapCard.rotateDegree === 0) {
        this.next()
      }
    },
    next () {
      const frontFlapCard = this.flapCardList[this.front]
      const backFlapCard = this.flapCardList[this.back]
      frontFlapCard.rotateDegree = 0
      backFlapCard.rotateDegree = 0
      frontFlapCard._g = frontFlapCard.g
      backFlapCard._g = backFlapCard.g
      this.rotate(this.front, 'front')
      this.rotate(this.back, 'back')
      this.front++
      this.back++
      const len = this.flapCardList.length
      if (this.front >= len) {
        this.front = 0
      }
      if (this.back >= len) {
        this.back = 0
      }
      /*
      动态设置zIndex
       设计算法，实现五个元素当某一个zIndex达到100时减四
       100 -> 96
       99 -> 100
       98 -> 99
       97 -> 98
       96 -> 97
        */
      this.flapCardList.forEach((item, index) => {
        item.zIndex = 100 - ((index - this.front + len) % len)
      })
      this.prepare()
    },
    prepare () {
      const backFlapCard = this.flapCardList[this.back]
      backFlapCard.rotateDegree = 180
      backFlapCard._g = backFlapCard.g - 5 * 9
      this.rotate(this.back, 'back')
    },
    reset () {
      this.front = 0
      this.back = 1
      this.flapCardList.forEach((item, index) => {
        item.zIndex = 100 - index
        item._g = item.g
        item.rotateDegree = 0
        this.rotate(index, 'left')
        this.rotate(index, 'right')
      })
      this.runBookCardAnimation = false
      this.runFlapCardAnimation = false
      this.runPointAnimation = false
    },
    startFlapCardAnimation () {
      this.prepare()
      this.task = setInterval(() => {
        this.flapCardRotate()
      }, this.intervalTime)
    },
    startPointAnimation () {
      this.runPointAnimation = true
      setTimeout(() => {
        this.runPointAnimation = false
      }, 750)
    },
    stopAnimation () {
      if (this.task) {
        clearInterval(this.task)
      }
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      if (this.timeout2) {
        clearTimeout(this.timeout2)
      }
      this.reset()
    },
    runAnimation () {
      this.runFlapCardAnimation = true
      this.timeout = setTimeout(() => {
        this.startFlapCardAnimation()
        this.startPointAnimation()
      }, 300)
      this.timeout2 = setTimeout(() => {
        this.stopAnimation()
        this.runBookCardAnimation = true
      }, 2500)
    },
    categoryText () {
      if (this.data) {
        return categoryText(this.data.category, this)
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang='scss' rel='stylesheet/scss' scope>
@import "../../assets/styles/global";
@import "../../assets/styles/flapCard";

.flap-card-wrapper {
  z-index: 1000;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .6);
  @include center;
  @include absCenter;
  .close-btn-wrapper {
    position: absolute;
    left: 0;
    bottom: px2rem(30);
    z-index: 1100;
    width: 100%;
    @include center;
    .icon-close {
      width: px2rem(45);
      height: px2rem(45);
      font-size: px2rem(25);
      border-radius: 50%;
      background: #333;
      color: #fff;
      @include center;
    }
  }
  .flap-card-bg {
    position: relative;
    width: px2rem(64);
    height: px2rem(64);
    border-radius: px2rem(5);
    background: #fff;
    transform: scale(0);
    opacity: 0;
    &.animation {
      animation: flap-card-move .3s ease-in both;
    }
    @keyframes flap-card-move {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      50%  {
        transform: scale(1.2);
        opacity: 1;
      }
      75%  {
        transform: scale(0.9);
        opacity: 1;
      }
      100%  {
        transform: scale(1);
        opacity: 1;
      }
    }
    .flap-card {
      width: px2rem(48);
      height: px2rem(48);
      @include absCenter;
      .flap-car-circle {
        display: flex;
        width: 100%;
        height: 100%;
        .flap-card-semi-circle {
          flex: 0 0 50%;
          width: 50%;
          height: 100%;
          background-repeat: no-repeat;
          backface-visibility: hidden;
        }
        .flap-card-semi-circle-left {
          border-radius: px2rem(24) 0 0 px2rem(24);
          background-position: center right;
          transform-origin: right;
        }
        .flap-card-semi-circle-right {
          border-radius: 0  px2rem(24) px2rem(24) 0;
          background-position: center left;
          transform-origin: left;
        }
      }
    }
    .point-wrapper {
      z-index: 1500;
      @include absCenter;
      .point {
        border-radius: 50%;
        @include absCenter;
        &.animation {
          @for $i from 1 to length($moves) {
            &:nth-child(#{$i}) {
              @include move($i);
            }
          }
        }
      }
    }
  }
  .book-card {
    position: relative;
    width: 65%;
    // height: 70%;
    box-sizing: border-box;
    border-radius: px2rem(15);
    background: white;
    &.animation {
      animation: scale .3s ease-in both;
      @keyframes scale {
        0% {
          transform: scale(0);
          opacity: 0;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
    }
    .book-card-wrapper {
      width: 100%;
      height: 100%;
      margin-bottom: px2rem(30);
      @include columnTop;
      .img-wrapper {
        width: 100%;
        margin-top: px2rem(20);
        @include center;
        .img {
          width: px2rem(90);
          height: px2rem(130);
        }
      }
      .content-wrapper {
        padding: 0 px2rem(20);
        margin-top: px2rem(20);
        .title {
          color: #333;
          font-weight: bold;
          font-size: px2rem(18);
          line-height: px2rem(20);
          max-height: px2rem(40);
          text-align: center;
          @include ellipsis2(2)
        }
        .author {
          margin-top: px2rem(10);
          text-align: center;
        }
        .category {
          color: #999;
          font-size: px2rem(14);
          margin-top: px2rem(10);
          text-align: center;
        }
      }
      .read-btn {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 1100;
        width: 100%;
        border-radius: 0 0 px2rem(15) px2rem(15);
        padding: px2rem(15) 0;
        text-align: center;
        color: white;
        font-size: px2rem(14);
        background: $color-blue;
      }
    }
  }
}
</style>
