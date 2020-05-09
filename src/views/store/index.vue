<template>
    <div class="store">
      <router-view></router-view>
    </div>
</template>

<script>
export default {
  name: 'index'
}
</script>

<style scoped lang='scss' rel='stylesheet/scss'>
@import "../../assets/styles/global";

.store {
  position: relative;
  width: 100%;
  height: 100%;
  background: #fff;
}
</style>
