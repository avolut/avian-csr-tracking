/** @jsx jsx */
import { useWindow } from 'libs'
import { useEffect } from 'react'

export const useComponent = (
  name: string,
  _fileName: string,
  passthrough: Record<string, any>
) => {
  const { window } = useWindow()
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
  window.cms_components['${name}'].cache = ccx_component

  return finalResult;
`,
      extract: passthrough,
    }
  } else {
    console.error(
      `[ERROR] Failed to load component <${name} />, code not found.`
    )
  }

  return {
    render: `jsx('div', {})`,
    extract: passthrough,
  }
}
