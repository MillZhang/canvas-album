<template>
  <div class="main">
    <el-row :gutter="24">
      <el-col :span="4">
        <slider></slider>
      </el-col>
      <el-col :span="16">
        <main-box @loaded="handleInitEvent"></main-box>
      </el-col>
      <el-col :span="4">
        <toolbar v-if="showToolbar" :canvas="canvas"></toolbar>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import slider from 'components/slider';
import toolbar from 'components/toolbar'
import mainBox from 'components/main'
export default {
  data() {
    return {
      showToolbar: false,
      canvas: null
    }
  },
  components: {
    slider,
    toolbar,
    mainBox
  },
  methods: {
    handleInitEvent(canvas) {
      this.canvas = canvas;
      this.showToolbar = true;
    }
  }
}

</script>
<style>
.main {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 100;
  left: 0;
  right: 0;
  top: 0;
  .el-row {
    height: 100%;
    &:last-child {
      margin-bottom: 0;
    }
    .el-col {
      height: 100%;
      border-radius: 4px;
    }
  }
}

</style>
