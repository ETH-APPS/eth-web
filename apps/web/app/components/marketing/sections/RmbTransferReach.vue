<script setup lang="ts">
import logo1688 from '~/assets/images/brand/1688.png'
import logoAlibaba from '~/assets/images/brand/alibaba.png'
import logoAlipay from '~/assets/images/brand/alipay.png'
import logoBankOfChina from '~/assets/images/brand/bank-of-china.png'
import logoTaobao from '~/assets/images/brand/taobao.png'
import logoWechatPay from '~/assets/images/brand/wechat-pay.png'

const paymentChannels = [
  {
    name: 'Alipay',
    logo: logoAlipay,
    sizeClass: 'w-[132px] sm:w-[164px]',
  },
  {
    name: 'Bank of China',
    logo: logoBankOfChina,
    sizeClass: 'w-[126px] sm:w-[154px]',
  },
  {
    name: 'WeChat Pay',
    logo: logoWechatPay,
    sizeClass: 'w-[136px] sm:w-[168px]',
  },
  {
    name: '1688',
    logo: logo1688,
    sizeClass: 'w-[96px] sm:w-[118px]',
  },
  {
    name: 'Taobao',
    logo: logoTaobao,
    sizeClass: 'w-[118px] sm:w-[148px]',
  },
  {
    name: 'Alibaba.com',
    logo: logoAlibaba,
    sizeClass: 'w-[116px] sm:w-[138px]',
  },
] as const
</script>

<template>
  <section
    id="rmb-transfer-reach"
    aria-labelledby="rmb-transfer-reach-title"
    class="bg-bg-0 py-14 sm:py-16"
  >
    <UiContainer>
      <h2
        id="rmb-transfer-reach-title"
        class="text-center text-[24px] font-bold leading-tight text-primary-500 lg:text-[32px] lg:font-semibold"
      >
        Our Reach
      </h2>

      <div class="reach-marquee -mx-4 mt-10 overflow-hidden sm:hidden">
        <div class="reach-track">
          <ul
            v-for="copy in 2"
            :key="copy"
            class="reach-group"
            :aria-hidden="copy === 2 ? 'true' : undefined"
            :aria-label="copy === 1 ? 'Jangkauan metode transfer RMB' : undefined"
          >
            <li
              v-for="channel in paymentChannels"
              :key="channel.name"
              class="flex h-16 w-40 shrink-0 items-center justify-center"
            >
              <img
                :src="channel.logo"
                :alt="copy === 1 ? channel.name : ''"
                loading="lazy"
                decoding="async"
                class="h-auto max-h-full max-w-full object-contain"
                :class="channel.sizeClass"
              >
            </li>
          </ul>
        </div>
      </div>

      <ul class="mx-auto mt-10 hidden max-w-[620px] grid-cols-3 gap-x-8 gap-y-7 sm:grid">
        <li
          v-for="channel in paymentChannels"
          :key="channel.name"
          class="flex h-16 items-center justify-center sm:h-20"
        >
          <img
            :src="channel.logo"
            :alt="channel.name"
            loading="lazy"
            decoding="async"
            class="h-auto max-h-full max-w-full object-contain"
            :class="channel.sizeClass"
          >
        </li>
      </ul>

      <p class="mx-auto mt-10 max-w-[800px] text-center text-[14px] font-normal leading-[1.5] text-text-secondary lg:text-[18px]">
        Transfer RMB ke berbagai platform pembayaran dan marketplace China dengan proses cepat, aman, dan transparan untuk mendukung kebutuhan transaksi bisnis Anda.
      </p>
    </UiContainer>
  </section>
</template>

<style scoped>
.reach-track {
  display: flex;
  width: max-content;
  animation: reach-scroll 26s linear infinite;
}

.reach-group {
  display: flex;
  flex: none;
  align-items: center;
  gap: 1.5rem;
  padding-right: 1.5rem;
}

.reach-marquee:hover .reach-track {
  animation-play-state: paused;
}

@keyframes reach-scroll {
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .reach-marquee {
    overflow-x: auto;
  }

  .reach-track {
    animation: none;
  }

  .reach-group[aria-hidden="true"] {
    display: none;
  }
}
</style>
