<template>
  <div id="splash-screen">
    <div class="center">
      <div class="logo">
        <img src="/images/logo-text.svg" />
      </div>
      <div class="spinner-wrapper">
        <div class="spinner">
          <div class="inner">
            <div class="gap"></div>
            <div class="left">
              <div class="half-circle"></div>
            </div>
            <div class="right">
              <div class="half-circle"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SplashScreen',
};
</script>

<style lang="less">
#splash-screen {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #2d323d;
  z-index: 99999;
  pointer-events: none;
  .center {
    display: block;
    width: 100%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    .logo {
      width: 300px;
      margin: 0 auto;
      img {
        filter: drop-shadow(0px 10px 6px rgba(0, 0, 0, 0.2));
      }
    }
    .spinner-wrapper {
      display: block;
      position: relative;
      width: 100%;
      min-height: 100px;
      height: 100px;
      .spinner {
        position: absolute;
        overflow: hidden;
        left: 50%;
        margin-left: -50px;
        animation: outer-rotate 2.91667s linear infinite;
        .inner {
          width: 100px;
          height: 100px;
          position: relative;
          animation: sporadic-rotate 5.25s cubic-bezier(0.35, 0, 0.25, 1)
            infinite;
          .gap {
            position: absolute;
            left: 49px;
            right: 49px;
            top: 0;
            bottom: 0;
            border-top: 10px solid;
            box-sizing: border-box;
          }
          .left,
          .right {
            position: absolute;
            top: 0;
            height: 100px;
            width: 50px;
            overflow: hidden;
            .half-circle {
              position: absolute;
              top: 0;
              width: 100px;
              height: 100px;
              box-sizing: border-box;
              border: 10px solid #4285f4;
              border-bottom-color: transparent;
              border-radius: 50%;
            }
          }
          .left {
            left: 0;
            .half-circle {
              left: 0;
              border-right-color: transparent;
              animation: left-wobble 1.3125s cubic-bezier(0.35, 0, 0.25, 1)
                infinite;
              -webkit-animation: left-wobble 1.3125s
                cubic-bezier(0.35, 0, 0.25, 1) infinite;
            }
          }
          .right {
            right: 0;
            .half-circle {
              right: 0;
              border-left-color: transparent;
              animation: right-wobble 1.3125s cubic-bezier(0.35, 0, 0.25, 1)
                infinite;
              -webkit-animation: right-wobble 1.3125s
                cubic-bezier(0.35, 0, 0.25, 1) infinite;
            }
          }
        }
      }
    }
  }
}

@keyframes outer-rotate {
  0% {
    transform: rotate(0deg) scale(0.5);
  }
  100% {
    transform: rotate(360deg) scale(0.5);
  }
}
@keyframes left-wobble {
  0%,
  100% {
    transform: rotate(130deg);
  }
  50% {
    transform: rotate(-5deg);
  }
}
@keyframes right-wobble {
  0%,
  100% {
    transform: rotate(-130deg);
  }
  50% {
    transform: rotate(5deg);
  }
}
@keyframes sporadic-rotate {
  12.5% {
    transform: rotate(135deg);
  }
  25% {
    transform: rotate(270deg);
  }
  37.5% {
    transform: rotate(405deg);
  }
  50% {
    transform: rotate(540deg);
  }
  62.5% {
    transform: rotate(675deg);
  }
  75% {
    transform: rotate(810deg);
  }
  87.5% {
    transform: rotate(945deg);
  }
  100% {
    transform: rotate(1080deg);
  }
}
</style>
