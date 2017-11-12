<template>
  <div>
    </br>
    <span>la la la</span>
    <!--displays list -->
    <ul>
      <li v-for="item in listItems">{{ item }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'list',
  data () {
    return {
      listItems: ['buy food', 'play games', 'sleep']
    }
  }
}
</script>

<style scoped="" lang="less">
  div {
    color: yellow;
    li {
      color: blue;
    }
  }
</style>
