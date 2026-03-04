/* 空白配置组件 */
<template>
  <div class="blank-config">
    <el-empty description="这里什么也没有">
      <template #image>
        <div class="animated-icon">
          <div class="box">
            <div class="face front"></div>
            <div class="face back"></div>
            <div class="face right"></div>
            <div class="face left"></div>
            <div class="face top"></div>
            <div class="face bottom"></div>
          </div>
        </div>
      </template>
    </el-empty>
  </div>
</template>

<script>
export default {
  name: 'BlankConfig'
}
</script>

<style scoped>
/* 空白配置容器样式 */
.blank-config {
  /* 高度占满父容器 */
  height: 100%;
  /* 使用flex布局 */
  display: flex;
  /* 垂直方向居中对齐 */
  align-items: center;
  /* 水平方向居中对齐 */
  justify-content: center;
}

/* 深度选择器：覆盖Element Plus的el-empty图片容器样式 */
:deep(.el-empty__image) {
  /* 宽度设置为100% */
  width: 100%;
  /* 使用flex布局 */
  display: flex;
  /* 水平方向居中对齐 */
  justify-content: center;
}

/* 动画图标容器样式 */
.animated-icon {
  /* 容器宽度 */
  width: 60px;
  /* 容器高度 */
  height: 60px;
  /* 3D透视效果，值越小透视越强 */
  perspective: 200px;
  /* 使用flex布局 */
  display: flex;
  /* 垂直方向居中对齐 */
  align-items: center;
  /* 水平方向居中对齐 */
  justify-content: center;
}

/* 3D立方体容器样式 */
.box {
  /* 立方体宽度 */
  width: 40px;
  /* 立方体高度 */
  height: 40px;
  /* 相对定位，用于子元素绝对定位参考 */
  position: relative;
  /* 保留3D变换效果 */
  transform-style: preserve-3d;
  /* 旋转动画：3秒完成一次，无限循环，线性速度 */
  animation: rotate 3s infinite linear;
}

/* 立方体每个面的通用样式 */
.face {
  /* 绝对定位，相对于.box定位 */
  position: absolute;
  /* 面的宽度 */
  width: 40px;
  /* 面的高度 */
  height: 40px;
  /* 渐变背景色，从#409eff到#79bbff */
  background: linear-gradient(135deg, #409eff 0%, #79bbff 100%);
  /* 白色边框 */
  border: 2px solid #fff;
  /* 透明度0.8，稍微透明 */
  opacity: 0.8;
}

/* 前面：绕Y轴旋转0度，沿Z轴向前移动20px */
.front  { transform: rotateY(0deg) translateZ(20px); }
/* 后面：绕Y轴旋转180度，沿Z轴向前移动20px */
.back   { transform: rotateY(180deg) translateZ(20px); }
/* 右面：绕Y轴旋转90度，沿Z轴向前移动20px */
.right  { transform: rotateY(90deg) translateZ(20px); }
/* 左面：绕Y轴旋转-90度，沿Z轴向前移动20px */
.left   { transform: rotateY(-90deg) translateZ(20px); }
/* 顶面：绕X轴旋转90度，沿Z轴向前移动20px */
.top    { transform: rotateX(90deg) translateZ(20px); }
/* 底面：绕X轴旋转-90度，沿Z轴向前移动20px */
.bottom { transform: rotateX(-90deg) translateZ(20px); }

/* 旋转动画关键帧定义 */
@keyframes rotate {
  /* 动画起始状态 */
  0% {
    /* X轴和Y轴都不旋转 */
    transform: rotateX(0deg) rotateY(0deg);
  }
  /* 动画结束状态 */
  100% {
    /* X轴和Y轴都旋转360度，完成一周旋转 */
    transform: rotateX(360deg) rotateY(360deg);
  }
}
</style>
