// 远程配置选项
export const REMOTE_CONFIGS = [
  {
    label: 'Aethersailor',
    options: [
      {
        label: 'Aethersailor 标准版（推荐）大多数用户使用',
        value: 'https://api.asailor.org/Custom_OpenClash_Rules/main/cfg/Custom_Clash.ini'
      },
      {
        label: 'Aethersailor 大陆优化版 大陆网络环境 特殊场景使用',
        value: 'https://api.asailor.org/Custom_OpenClash_Rules/main/cfg/Custom_Clash_Mainland.ini'
      },
      {
        label: 'Aethersailor GFW 精简模板 基础代理分流 极简规则使用',
        value: 'https://api.asailor.org/Custom_OpenClash_Rules/main/cfg/Custom_Clash_GFW.ini'
      },
      {
        label: 'Aethersailor 轻量模板 低性能路由器 精简分流使用',
        value: 'https://api.asailor.org/Custom_OpenClash_Rules/main/cfg/Custom_Clash_Lite.ini'
      },
      {
        label: 'Aethersailor 全分组模板 重度用户 精细化分流使用',
        value: 'https://api.asailor.org/Custom_OpenClash_Rules/main/cfg/Custom_Clash_Full.ini'
      }
    ]
  },
  {
    label: 'ACL4SSR',
    options: [
      {
        label: 'ACL4SSR_Online 默认版 分组比较全',
        value:
          'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online.ini'
      },
      {
        label: 'ACL4SSR_Online_AdblockPlus 更多去广告',
        value:
          'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_AdblockPlus.ini'
      },
      {
        label: 'ACL4SSR_Online_NoAuto 无自动测速',
        value:
          'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_NoAuto.ini'
      },
      {
        label: 'ACL4SSR_Online_NoReject 无广告拦截规则',
        value:
          'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_NoReject.ini'
      },
      {
        label: 'ACL4SSR_Online_MultiCountry 多国家地区分组',
        value:
          'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_MultiCountry.ini'
      },
      {
        label: 'ACL4SSR_Online_Mini 精简版',
        value:
          'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini.ini'
      },
      {
        label: 'ACL4SSR_Online_Mini_AdblockPlus.ini 精简版 更多去广告',
        value:
          'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_AdblockPlus.ini'
      },
      {
        label: 'ACL4SSR_Online_Mini_Ai.ini 精简版 AI 分流',
        value:
          'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_Ai.ini'
      },
      {
        label: 'ACL4SSR_Online_Mini_NoAuto.ini 精简版 不带自动测速',
        value:
          'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_NoAuto.ini'
      },
      {
        label: 'ACL4SSR_Online_Mini_Fallback.ini 精简版 带故障转移',
        value:
          'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_Fallback.ini'
      },
      {
        label: 'ACL4SSR_Online_Mini_MultiMode.ini 精简版 自动测速、故障转移、负载均衡',
        value:
          'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_MultiMode.ini'
      },
      {
        label: 'ACL4SSR_Online_Mini_MultiCountry.ini 精简版 多国家地区分组',
        value:
          'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_MultiCountry.ini'
      },
      {
        label: 'ACL4SSR_Online_Full 全分组 重度用户使用',
        value:
          'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full.ini'
      },
      {
        label: 'ACL4SSR_Online_Full_NoAuto.ini 全分组 无自动测速 重度用户使用',
        value:
          'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_NoAuto.ini'
      },
      {
        label: 'ACL4SSR_Online_Full_AdblockPlus 全分组 重度用户使用 更多去广告',
        value:
          'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_AdblockPlus.ini'
      },
      {
        label: 'ACL4SSR_Online_Full_Google 全分组 重度用户使用 谷歌全量',
        value:
          'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_Google.ini'
      },
      {
        label: 'ACL4SSR_Online_Full_Netflix 全分组 重度用户使用 奈飞全量',
        value:
          'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_Netflix.ini'
      },
      {
        label: 'ACL4SSR_Online_Full_MultiMode 全分组 重度用户使用 自动测速、故障转移、负载均衡',
        value:
          'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_MultiMode.ini'
      },
      {
        label: 'ACL4SSR 本地 默认版 分组比较全',
        value: 'config/ACL4SSR.ini'
      },
      {
        label: 'ACL4SSR_Mini 本地 精简版',
        value: 'config/ACL4SSR_Mini.ini'
      },
      {
        label: 'ACL4SSR_Mini_NoAuto.ini 本地 精简版+无自动测速',
        value: 'config/ACL4SSR_Mini_NoAuto.ini'
      },
      {
        label: 'ACL4SSR_Mini_Fallback.ini 本地 精简版+fallback',
        value: 'config/ACL4SSR_Mini_Fallback.ini'
      },
      {
        label: 'ACL4SSR_BackCN 本地 回国',
        value: 'config/ACL4SSR_BackCN.ini'
      },
      {
        label: 'ACL4SSR_NoApple 本地 无苹果分流',
        value: 'config/ACL4SSR_NoApple.ini'
      },
      {
        label: 'ACL4SSR_NoAuto 本地 无自动测速 ',
        value: 'config/ACL4SSR_NoAuto.ini'
      },
      {
        label: 'ACL4SSR_NoAuto_NoApple 本地 无自动测速&无苹果分流',
        value: 'config/ACL4SSR_NoAuto_NoApple.ini'
      },
      {
        label: 'ACL4SSR_NoMicrosoft 本地 无微软分流',
        value: 'config/ACL4SSR_NoMicrosoft.ini'
      },
      {
        label: 'ACL4SSR_WithGFW 本地 GFW列表',
        value: 'config/ACL4SSR_WithGFW.ini'
      }
    ]
  },
  {
    label: 'universal',
    options: [
      {
        label: 'No-Urltest',
        value:
          'https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/universal/no-urltest.ini'
      },
      {
        label: 'Urltest',
        value:
          'https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/universal/urltest.ini'
      }
    ]
  },
  {
    label: 'customized',
    options: [
      {
        label: 'Maying',
        value:
          'https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/customized/maying.ini'
      },
      {
        label: 'Ytoo',
        value:
          'https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/customized/ytoo.ini'
      },
      {
        label: 'FlowerCloud',
        value:
          'https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/customized/flowercloud.ini'
      },
      {
        label: 'Nexitally',
        value:
          'https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/customized/nexitally.ini'
      },
      {
        label: 'SoCloud',
        value:
          'https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/customized/socloud.ini'
      },
      {
        label: 'ARK',
        value:
          'https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/customized/ark.ini'
      },
      {
        label: 'ssrCloud',
        value:
          'https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/customized/ssrcloud.ini'
      }
    ]
  },
  {
    label: 'Special',
    options: [
      {
        label: 'NeteaseUnblock(仅规则，No-Urltest)',
        value:
          'https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/special/netease.ini'
      },
      {
        label: 'Basic(仅GEOIP CN + Final)',
        value:
          'https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/special/basic.ini'
      }
    ]
  }
]
