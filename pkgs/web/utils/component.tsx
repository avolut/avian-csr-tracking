/** @jsx jsx */
import { BaseWindow } from 'web-init/src/window'

declare const window: BaseWindow
export const useComponent = (
  name: string,
  _fileName: string,
  passthrough: Record<string, any>
) => {
  const def = window.cms_components[name]

  if (!def) {
    return {
      render: `jsx('div', {})`,
      extract: passthrough,
    }
  }
  if (def.template.code) {
    let extract: string[] = []
    for (let k of Object.keys(passthrough)) {
      k = k.trim()
      if (k) {
        extract.push(`const ${k} = _component.extract["${k}"];`)
      }
    }

    return {
      render: `\
  const _component = this;
  ${extract.join('\n  ')}
  const params = _component.extract.params || {};
  ${def.template.code}
  const finalResult = ccx_component(_component.extract);
  return finalResult;
`,
      extract: passthrough,
    }
  } else {
    console.error(`[ERROR] Failed to load component <${name} />, code not found.`)
  }

  return {
    render: `jsx('div', {})`,
    extract: passthrough,
  }
}
