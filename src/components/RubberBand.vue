<template>
<div class="rubberband" :style="{ left: data.x + 'px', top: data.y + 'px', width: data.width + 'px', height: data.height + 'px', visibility: data.visibility}"></div>
</template>
<script>
export default {
  name: 'rubberband',
  props: ['data']
}
</script>
<style lang="less">
  .rubberband {
    position: absolute;
  	border: 1px solid #000;
  	background: #888;
  	opacity: 0.5;
  	// visibility: hidden;
  }
</style>
