import{d as s}from"./chunk-NXH6K27G.js";import{a as r}from"./chunk-SDY2POXP.js";var d=r((n,m,t)=>{let{window:i}=s(),o=i.cms_components[n];if(!o)return{render:"jsx('div', {})",extract:t};if(o.template.code){let c=[];for(let e of Object.keys(t))e=e.trim(),e&&c.push(`const ${e} = _component.extract["${e}"];`);return{render:`  const _component = this;
  ${c.join(`
  `)}
  const params = _component.extract.params || {};

  ${o.template.code}
  const finalResult = ccx_component(_component.extract);
  window.cms_components['${n}'].cache = ccx_component

  return finalResult;
`,extract:t}}else console.error(`[ERROR] Failed to load component <${n} />, code not found.`);return{render:"jsx('div', {})",extract:t}},"useComponent");export{d as a};
//# sourceMappingURL=chunk-VEHFODSI.js.map
