<template>
    <div class="scroll-wrapper"
         :class="{'no-scroll': ifNoScroll}"
         @scroll.passive="handleScroll"
         ref="scrollWrapper">
      <slot></slot>
    </div>
</template>

<script>
import { realPx } from '../../utils/utils'

export default {
  name: 'Scroll',
  props: {
    top: {
      type: Number,
      default: 0
    },
    bottom: {
      type: Number,
      default: 0
    },
    ifNoScroll: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleScroll (e) {
      const offSetY = e.target.scrollTop || window.pageYOffset || document.body.scrollTop
      this.$emit('onScroll', offSetY)
    },
    scrollTo (x, y) {
      this.$refs.scrollWrapper.scrollTo(x, y)
    },
    refresh () {
      if (this.$refs.scrollWrapper) {
        this.$refs.scrollWrapper.style.height = window.innerHeight - realPx(this.top) - realPx(this.bottom) + 'px'
        this.$refs.scrollWrapper.addEventListener('scroll', this.handleScroll)
      }
    }
  },
  mounted () {
    this.refresh()
  }
}
</script>

<style scoped lang='scss' rel='stylesheet/scss'>
@import "../../assets/styles/global";

.scroll-wrapper {
  position: relative;
  z-index: 100;
  width: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
    &.no-scroll {
      overflow: hidden;
    }
  }
}
</style>
