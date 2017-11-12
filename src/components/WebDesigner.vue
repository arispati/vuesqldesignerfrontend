<template>
  <div>
    </br>
    <span>
      {{webdesigner}}
    </span>
  </div>
</template>

<script>
export default {
  name: 'webdesigner',
  data () {
    return {
      webdesigner: 'this is web designer component'
    }
  }
}
</script>

<style scoped="" lang="less">
  div {
    color: red;
  }
</style>
