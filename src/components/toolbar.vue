<template>
  <div class="toolbar">
    <p class="title">按钮列表</p>
    <fieldset>
      <legend>图片操作</legend>
      <el-button type="primary" round>主要按钮</el-button>
    </fieldset>
  </div>
</template>
<script>
export default {

}

</script>
<style lang="scss" scoped>
.toolbar {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  border-left: 1px solid #aaa;
  .title {
    width: 100%;
    text-align: center;
    height: 40px;
    line-height: 40px;
  }
}

</style>
