<template>
  <div id="canvas" class="canvas" />
</template>

<script>
import { TimelineMax, TweenMax, Sine } from 'gsap'

export default {
  data() {
    return {
      tl: new TimelineMax({ repeat: -1 })
    }
  },
  mounted() {
    const tl = this.tl
    const container = document.getElementById('canvas')
    let html
    const isMobile = 'ontouchstart' in window
    const dotsCount = isMobile ? 80 : 175

    for (let i = 0; i < dotsCount; i++) {
      html = container.appendChild(document.createElement('div'))
      tl.add(
        TweenMax.fromTo(
          html,
          6,
          {
            left: random(0, 100) + '%',
            top: random(0, 100) + '%',
            z: random(-725, 600),
            opacity: Math.random()
          },
          {
            left: '+=' + random(-40, 40) + '%',
            top: '+=' + random(-36, 36) + '%',
            z: '+=' + random(-725, 600),
            opacity: Math.random() + 0.1,
            repeat: 1,
            yoyo: true,
            ease: Sine.easeInOut
          }
        ),
        0
      )
    }

    function random(min, max) {
      return Math.floor(Math.random() * (1 + max - min) + min)
    }

    tl.fromTo(
      container,
      0.8,
      { perspective: 50, opacity: 0.55 },
      { perspective: 215, opacity: 0.9, ease: Sine.easeInOut },
      3.25
    ).to(container, 0.8, { perspective: 50, opacity: 0.55, ease: Sine.easeInOut }, 6.5)
    document.body.style.backgroundColor = '#2B343A'
  },
  destroyed() {
    this.tl.pause(0, true)
    this.tl.remove()
    document.body.style.backgroundColor = '#F0F4F9'
  }
}
</script>

<style lang="less">
#canvas {
  position: fixed;
  left: 0;
  top: 0;
  z-index: -1;
  height: 100%;
  width: 100%;
  div {
    position: absolute;
    background: #505050;
    width: 30px;
    height: 30px;
    border-radius: 100%;
    box-shadow: 0 0 8px 0 #606060;
  }
}
</style>
