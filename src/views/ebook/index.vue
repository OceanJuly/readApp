<template>
<div class="ebook" ref="ebook">
  <ebook-title></ebook-title>
  <ebook-reader></ebook-reader>
  <ebook-menu></ebook-menu>
  <ebook-bookmark class="ebook-bookmark"></ebook-bookmark>
</div>
</template>

<script>
import EbookReader from '../../components/ebook/EbookReader'
import EbookTitle from '../../components/ebook/EbookTitle'
import EbookMenu from '../../components/ebook/EbookMenu'
import { getReadTime, saveReadTime } from '../../utils/localStorage'
import { ebookMixin } from '../../utils/mixin'
import EbookBookmark from '../../components/ebook/EbookBookmark'

export default {
  name: 'index',
  mixins: [ebookMixin],
  components: {
    EbookReader,
    EbookTitle,
    EbookMenu,
    EbookBookmark
  },
  watch: {
    offsetY (newValue) {
      if (!this.menuVisible && this.bookAvailable) {
        if (newValue > 0) {
          this.move(newValue)
        } else if (newValue === 0) {
          this.restore()
        }
      }
    }
  },
  methods: {
    restore () {
      this.$refs.ebook.style.top = 0
      this.$refs.ebook.style.transition = 'all .2s linear'
      setTimeout(() => {
        this.$refs.ebook.style.transition = ''
      }, 200)
    },
    move (v) {
      this.$refs.ebook.style.top = v + 'px'
    },
    startLoopReadTime () {
      let readTime = getReadTime(this.fileName)
      if (!readTime) {
        readTime = 0
      }
      this.task = setInterval(() => {
        readTime++
        if (readTime % 30 === 0) saveReadTime(this.fileName, readTime)
      }, 1000)
    }
  },
  mounted () {
    this.startLoopReadTime()
  },
  beforeDestroy () {
    if (this.task) clearInterval(this.task)
  }
}
</script>

<style scoped lang='scss'>
  @import "../../assets/styles/global.scss";

  .ebook {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    .ebook-bookmark {
      position: absolute;
      top: px2rem(-35);
      left: 0;
      z-index: 200;
      width: 100%;
      height: px2rem(35);
    }
  }
</style>
