import packageJson from '../../package.json'
import { CONSTANTS } from '@/config/constants'

// 使用 String.raw 保留字符画中的反斜杠，后续调整 ASCII 时无需逐个转义
const ASCII_BANNER = String.raw`
        _        _                  _                     _             _            _
       / /\     /\_\               / /\                  / /\      _   /\ \         / /\
      / /  \   / / /         _    / /  \                / / /    / /\ /  \ \       / /  \
     / / /\ \__\ \ \__      /\_\ / / /\ \              / / /    / / // /\ \ \     / / /\ \
    / / /\ \___\\ \___\    / / // / /\ \ \    ____    / / /_   / / // / /\ \_\   / / /\ \ \
    \ \ \ \/___/ \__  /   / / // / /\ \_\ \ /\____/\ / /_//_/\/ / // /_/_ \/_/  / / /\ \_\ \
     \ \ \       / / /   / / // / /\ \ \___\\/____\// _______/\/ // /____/\    / / /\ \ \___\
 _    \ \ \     / / /   / / // / /  \ \ \__/       / /  \____\  // /\____\/   / / /  \ \ \__/
/_/\__/ / /    / / /___/ / // / /____\_\ \        /_/ /\ \ /\ \// / /______  / / /____\_\ \
\ \/___/ /    / / /____\/ // / /__________\       \_\//_/ /_/ // / /_______\/ / /__________\
 \_____\/     \/_________/ \/_____________/           \_\/\_\/ \/__________/\/_____________/
`.trim()

const styles = {
  logo: 'color: #409eff; font-weight: 700; line-height: 1.2;',
  title: 'color: #67c23a; font-size: 14px; font-weight: 700;',
  label: 'color: #909399; font-weight: 700;',
  value: 'color: #303133;'
}

function getDisplayValue(value, fallback) {
  return value || fallback
}

export function printConsoleBanner() {
  if (typeof console === 'undefined') return

  const projectName = getDisplayValue(CONSTANTS.PROJECT, packageJson.name)
  const appVersion = packageJson.version
  const appMode = import.meta.env.MODE
  const loadedAt = new Date().toLocaleString()

  console.log('%c' + ASCII_BANNER, styles.logo)
  console.log('%c' + projectName + ' v' + appVersion, styles.title)
  console.log('%c项目%c %s', styles.label, styles.value, projectName)
  console.log('%c版本%c %s', styles.label, styles.value, appVersion)
  console.log('%c模式%c %s', styles.label, styles.value, appMode)
  console.log('%c加载时间%c %s', styles.label, styles.value, loadedAt)
}
