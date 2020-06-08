<template>
  <div class="shelf-list" :style="{'top': shelfListTop}">
    <transition-group name="list"
                      tag="div"
                      id="shelf-list">
      <div v-for="item in data" :key="item.id" class="shelf-list-item-wrapper">
        <shelf-item :style="{ height: itemHeight }" :data="item"></shelf-item>
        <div class="shelf-list-title-wrapper">
          <div class="shelf-list-title title-small">{{ item.title }}</div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { storeShelf } from '../../utils/mixin'
import ShelfItem from './ShelfItem'
import { px2rem, realPx } from '../../utils/utils'

export default {
  name: 'ShelfList',
  mixins: [storeShelf],
  props: {
    top: {
      type: Number,
      default: 94
    },
    data: Array
  },
  components: {
    ShelfItem
  },
  computed: {
    // h = w / 250 * 350
    itemHeight () {
      return ((window.innerWidth - realPx(120)) / 3) / 250 * 350 + 'px'
    },
    shelfListTop () {
      return px2rem(this.top) + 'rem'
    }
  }
}
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
@import "../../assets/styles/global";

.shelf-list {
  position: absolute;
  width: 100%;
  left: 0;
  z-index: 100;
  #shelf-list {
    display: flex;
    flex-flow: row wrap;
    width: 100%;
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .shelf-list-item-wrapper {
      flex: 0 0 33.33%;
      width: 33.33%;
      padding: px2rem(15);
      box-sizing: border-box;
      &.list-leave-active {
        display: none;
      }
      &.list-move {
        transition: transform .5s;
      }
      .shelf-list-title-wrapper {
        margin-top: px2rem(10);
      }
    }
  }
}
</style>
