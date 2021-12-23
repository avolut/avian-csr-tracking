import{d as z}from"./chunk-55V4HHK3.js";import{B as W,D as _,b as N,j as v,q as L,r as S}from"./chunk-FTDH4D5C.js";import"./chunk-SR5OL73C.js";import{i as w}from"./chunk-LO6GVN5M.js";import"./chunk-SD5ULMK3.js";import{mb as h}from"./chunk-Y5EMNB45.js";import"./chunk-UMBFZAT7.js";import"./chunk-R42GCTHV.js";import{a as H}from"./chunk-WJABE3AS.js";import"./chunk-IA5P3YQN.js";import{a as g}from"./chunk-ZUGU5IHP.js";import{a as x}from"./chunk-NXH6K27G.js";import"./chunk-4Y2NHA3G.js";import"./chunk-IHSADOYH.js";import"./chunk-HP25GDQW.js";import{a as I}from"./chunk-2OZ4JKVY.js";import{b as R}from"./chunk-IRKXFVRU.js";import{a as u,e as b}from"./chunk-SDY2POXP.js";var E=b(I());var y=b(R());var i=b(I());var F=b(H()),C=b(R());var V=u(({ctx:c})=>{let e=(0,C.useRef)({el:{calloutBoxDiv:null,filterBtn:null},picker:!1,show:"",splitSize:50,container:null,orderedColumns:[],get visibleFilters(){return e.orderedColumns.filter(t=>o.filter.instances[t].visible||(0,F.default)(o.filter,`alter.${t}.visible`)===!0)},renderedFilters:[]}).current,o=(0,C.useContext)(c),m=g();(0,C.useEffect)(()=>{e.orderedColumns=[];for(let t of o.filter.columns){let a=typeof t=="string"?t:t[0];a.indexOf("__")!=0&&((0,F.default)(o.filter.instances[a],"value")?e.orderedColumns.unshift(a):e.orderedColumns.push(a))}l()},[]);let l=u(()=>{e.renderedFilters=e.visibleFilters.map((t,a)=>(0,i.jsx)(_,{key:a,filter:t,ctx:c,onSubmit:()=>{e.show="",l()}},({ValueLabel:p,FilterInput:d,filter:s,submit:$,operators:k,def:P,name:f})=>s.type==="tab"?(0,i.jsx)(d,{...s}):(0,i.jsx)("div",{className:"filter-item flex items-stretch"},e.show===f&&(0,i.jsx)(v,{target:e.el[f],isBeakVisible:!1,onDismiss:()=>{e.show="",l()}},(0,i.jsx)("div",{className:"p-2 flex flex-col items-stretch"},k.length>1&&(0,i.jsx)("div",{css:i.css`
                            .pure-select {
                              margin: -5px 0px 2px 0px;
                              > i {
                                font-size: 12px;
                                font-weight: bold;
                                padding: 0px;
                                margin: 7px 4px;
                              }

                              .ms-TextField-fieldGroup {
                                border: 0px;
                                &::after {
                                  display: none;
                                }
                                input {
                                  font-size: 13px;
                                  font-weight: 600;
                                  padding: 0px;
                                }
                              }
                            }
                          `},(0,i.jsx)(z,{value:s.operator,onChange:n=>{s.operator=n,l()},items:k.map(n=>({label:n.label,value:n.value}))})),(0,i.jsx)("div",{className:"flex flex-row",ref:n=>{n&&(e.el.calloutBoxDiv=n)}},(0,i.jsx)(d,{...s}),(0,i.jsx)(S,{css:i.css`
                            font-size: 12px;
                            margin-left: 5px;
                            min-width: 30px;
                          `,onClick:()=>{$()}},"Go")))),(0,i.jsx)("div",{ref:n=>{e.el[f]=n},onClick:()=>{e.show=f,l(),x(()=>e.el.calloutBoxDiv).then(()=>{let n=e.el.calloutBoxDiv.querySelector("input");n&&n.focus()})},className:"flex flex-row ms-Button select-none",css:i.css`
                    padding: 0px 10px;
                    min-width: 0px;
                    margin-left: 5px;
                    height: 30px;
                    align-items: center;
                    border: 1px solid #ddd;
                    overflow: hidden;
                    border-radius: 2px;
                    cursor: pointer !important;
                    outline: none !important;

                    &:hover {
                      border: 1px solid #0d4e98 !important;
                    }

                    ${!!s.value&&i.css`
                      border: 1px solid #0d4e98 !important;
                      background: rgb(255, 255, 255);
                      background: linear-gradient(
                        0deg,
                        rgba(255, 255, 255, 1) 30%,
                        #e4edf5 100%
                      );
                    `}
                    .ms-Button {
                      border: 0px;
                    }

                    > .ms-Dropdown-container > .ms-Dropdown-title {
                      background: transparent;
                    }

                    .ms-Label {
                      cursor: pointer !important;
                      white-space: nowrap;
                      font-weight: normal;
                      font-size: 14px;
                      color: ${s.value?"#0D4E98":"#666"};
                    }
                    .filter-label {
                      margin-left: 5px;
                      font-weight: 600;
                    }
                  `},(0,i.jsx)(h,null,P.title,s.value?":":""),s.value&&(0,i.jsx)(p,null)),!!s.value&&(0,i.jsx)("div",{onClick:async()=>{s.value=void 0,l(),await o.db.query("filter submit"),l()},className:"flex items-center rounded-sm border cursor-pointer",css:i.css`
                      margin-left: -2px;
                      border-top-left-radius: 0px;
                      border-bottom-left-radius: 0px;
                      padding: 0px 8px 0px 8px;
                      border-color: #bebebe;
                      background: rgb(255, 255, 255);
                      background: linear-gradient(
                        0deg,
                        rgba(255, 255, 255, 1) 30%,
                        #e4edf5 100%
                      );

                      &:hover {
                        background: linear-gradient(
                          0deg,
                          rgba(255, 255, 255, 1) 30%,
                          #f5e4e4 100%
                        );
                        i {
                          color: #ff5101;
                        }
                      }
                    `},(0,i.jsx)(w,{iconName:"ChromeClose",css:i.css`
                        color: #718cac;
                        font-weight: 600;
                        font-size: 9px;
                        padding-top: 2px;
                      `}))))),m()},"renderFilters");return(0,i.jsx)("div",{className:"flex flex-1 flex-row justify-between"},(0,i.jsx)("div",{className:"flex items-start relative",css:i.css``},(0,F.default)(o,"filter.web.selector")&&(0,i.jsx)("div",{ref:t=>{t&&(e.el.filterBtn=t)}},(0,i.jsx)(L,{iconProps:{iconName:"BacklogList"},onClick:()=>{e.picker=!0,l()},css:i.css`
                padding: 0px 8px 0px 5px;
                color: #555;
                border-color: #ccc;
                height: 30px;
                min-width: unset;
                border-top-left-radius: 0px;
                border-bottom-left-radius: 0px;
                border-left: 0px;
                .ms-Button-textContainer {
                  display: flex;
                  align-self: stretch;
                  align-items: center;
                }
                .ms-Button-label {
                  display: flex;
                  font-size: 13px;
                  align-items: center;
                  padding: 0px 0px 2px 0px;
                  margin: 0px;
                }
              `},e.visibleFilters.length<=0&&"Filter")),e.picker&&(0,i.jsx)(v,{onDismiss:()=>{e.picker=!e.picker,l()},directionalHint:N.bottomLeftEdge,isBeakVisible:!1,target:e.el.filterBtn},(0,i.jsx)("div",{css:i.css`
                min-width: 200px;
              `},e.orderedColumns.map((t,a)=>{let p=(0,F.default)(o.filter,`alter.${t}.visible`);return typeof p!="undefined"&&p!=="auto"?null:(0,i.jsx)(h,{key:a,className:"px-2 py-1 select-none cursor-pointer border-gray-300 border-b flex items-center",onClick:()=>{o.filter.instances[t].visible=!o.filter.instances[t].visible;let d=`filter-visible-${window.cms_id}.${o.tree.getPath()}.${t}`;o.filter.instances[t].visible?localStorage[d]="y":localStorage.removeItem(d),l()}},(0,i.jsx)(w,{iconName:o.filter.instances[t].visible?"CheckboxCompositeReversed":"Checkbox",className:"mr-2"}),(0,i.jsx)("span",null,o.filter.instances[t].title))}))),e.renderedFilters),(0,i.jsx)("div",{className:"flex flex-1 items-center justify-end",ref:t=>{t&&e.container!==t&&(e.container=t,x(()=>e.container&&e.container.offsetWidth>0).then(l))}},e.container&&e.container.offsetWidth>0&&(0,i.jsx)(W,{width:e.container.offsetWidth,state:o,action:o.header?.action})))},"BaseFilterSideLeft");var r=b(I());var D=b(H()),B=b(R());var q=u(({ctx:c})=>{let e=(0,B.useRef)({el:{calloutBoxDiv:null,filterBtn:null},picker:!1,show:"",splitSize:50,container:null,orderedColumns:[],get visibleFilters(){return e.orderedColumns.filter(t=>o.filter.instances[t].visible||(0,D.default)(o.filter,`alter.${t}.visible`)===!0)},renderedFilters:[]}).current,o=(0,B.useContext)(c),m=g();(0,B.useEffect)(()=>{e.orderedColumns=[];for(let t of o.filter.columns){let a=typeof t=="string"?t:t[0];a.indexOf("__")!=0&&((0,D.default)(o.filter.instances[a],"value")?e.orderedColumns.unshift(a):e.orderedColumns.push(a))}l()},[]);let l=u(()=>{e.renderedFilters=e.visibleFilters.map((t,a)=>(0,r.jsx)(_,{key:a,filter:t,ctx:c,onSubmit:()=>{e.show="",l()}},({ValueLabel:p,FilterInput:d,filter:s,submit:$,operators:k,def:P,name:f})=>s.type==="tab"?(0,r.jsx)(d,{...s}):(0,r.jsx)("div",{className:"filter-item flex items-stretch"},e.show===f&&(0,r.jsx)(v,{target:e.el[f],isBeakVisible:!1,onDismiss:()=>{e.show="",l()}},(0,r.jsx)("div",{className:"p-2 flex flex-col items-stretch"},k.length>1&&(0,r.jsx)("div",{css:r.css`
                            .pure-select {
                              margin: -5px 0px 2px 0px;
                              > i {
                                font-size: 12px;
                                font-weight: bold;
                                padding: 0px;
                                margin: 7px 4px;
                              }

                              .ms-TextField-fieldGroup {
                                border: 0px;
                                &::after {
                                  display: none;
                                }
                                input {
                                  font-size: 13px;
                                  font-weight: 600;
                                  padding: 0px;
                                }
                              }
                            }
                          `},(0,r.jsx)(z,{value:s.operator,onChange:n=>{s.operator=n,l()},items:k.map(n=>({label:n.label,value:n.value}))})),(0,r.jsx)("div",{className:"flex flex-row",ref:n=>{n&&(e.el.calloutBoxDiv=n)}},(0,r.jsx)(d,{...s}),(0,r.jsx)(S,{css:r.css`
                            font-size: 12px;
                            margin-left: 5px;
                            min-width: 30px;
                          `,onClick:()=>{$()}},"Go")))),(0,r.jsx)("div",{ref:n=>{e.el[f]=n},onClick:()=>{e.show=f,l(),x(()=>e.el.calloutBoxDiv).then(()=>{let n=e.el.calloutBoxDiv.querySelector("input");n&&n.focus()})},className:"flex flex-row ms-Button select-none",css:r.css`
                    padding: 0px 10px;
                    min-width: 0px;
                    margin-left: 5px;
                    height: 30px;
                    align-items: center;
                    border: 1px solid #ddd;
                    overflow: hidden;
                    border-radius: 2px;
                    cursor: pointer !important;
                    outline: none !important;

                    &:hover {
                      border: 1px solid #0d4e98 !important;
                    }

                    ${!!s.value&&r.css`
                      border: 1px solid #0d4e98 !important;
                      background: rgb(255, 255, 255);
                      background: linear-gradient(
                        0deg,
                        rgba(255, 255, 255, 1) 30%,
                        #e4edf5 100%
                      );
                    `}
                    .ms-Button {
                      border: 0px;
                    }

                    > .ms-Dropdown-container > .ms-Dropdown-title {
                      background: transparent;
                    }

                    .ms-Label {
                      cursor: pointer !important;
                      white-space: nowrap;
                      font-weight: normal;
                      font-size: 14px;
                      color: ${s.value?"#0D4E98":"#666"};
                    }
                    .filter-label {
                      margin-left: 5px;
                      font-weight: 600;
                    }
                  `},(0,r.jsx)(h,null,P.title,s.value?":":""),s.value&&(0,r.jsx)(p,null)),!!s.value&&(0,r.jsx)("div",{onClick:async()=>{s.value=void 0,l(),await o.db.query("filter submit"),l()},className:"flex items-center rounded-sm border cursor-pointer",css:r.css`
                      margin-left: -2px;
                      border-top-left-radius: 0px;
                      border-bottom-left-radius: 0px;
                      padding: 0px 8px 0px 8px;
                      border-color: #bebebe;
                      background: rgb(255, 255, 255);
                      background: linear-gradient(
                        0deg,
                        rgba(255, 255, 255, 1) 30%,
                        #e4edf5 100%
                      );

                      &:hover {
                        background: linear-gradient(
                          0deg,
                          rgba(255, 255, 255, 1) 30%,
                          #f5e4e4 100%
                        );
                        i {
                          color: #ff5101;
                        }
                      }
                    `},(0,r.jsx)(w,{iconName:"ChromeClose",css:r.css`
                        color: #718cac;
                        font-weight: 600;
                        font-size: 9px;
                        padding-top: 2px;
                      `}))))),m()},"renderFilters");return(0,r.jsx)("div",{className:"flex flex-1 flex-row justify-between"},(0,r.jsx)("div",{className:"flex items-center relative"},(0,D.default)(o,"filter.web.selector")&&(0,r.jsx)("div",{ref:t=>{t&&(e.el.filterBtn=t)}},(0,r.jsx)(L,{iconProps:{iconName:"BacklogList"},onClick:()=>{e.picker=!0,l()},css:r.css`
                padding: 0px 8px 0px 5px;
                color: #555;
                border-color: #ccc;
                height: 30px;
                min-width: unset;
                border-top-left-radius: 0px;
                border-bottom-left-radius: 0px;
                border-left: 0px;
                .ms-Button-textContainer {
                  display: flex;
                  align-self: stretch;
                  align-items: center;
                }
                .ms-Button-label {
                  display: flex;
                  font-size: 13px;
                  align-items: center;
                  padding: 0px 0px 2px 0px;
                  margin: 0px;
                }
              `},e.visibleFilters.length<=0&&"Filter")),e.picker&&(0,r.jsx)(v,{onDismiss:()=>{e.picker=!e.picker,l()},directionalHint:N.bottomLeftEdge,isBeakVisible:!1,target:e.el.filterBtn},(0,r.jsx)("div",{css:r.css`
                min-width: 200px;
              `},e.orderedColumns.map((t,a)=>{let p=(0,D.default)(o.filter,`alter.${t}.visible`);return typeof p!="undefined"&&p!=="auto"?null:(0,r.jsx)(h,{key:a,className:"px-2 py-1 select-none cursor-pointer border-gray-300 border-b flex items-center",onClick:()=>{o.filter.instances[t].visible=!o.filter.instances[t].visible;let d=`filter-visible-${window.cms_id}.${o.tree.getPath()}.${t}`;o.filter.instances[t].visible?localStorage[d]="y":localStorage.removeItem(d),l()}},(0,r.jsx)(w,{iconName:o.filter.instances[t].visible?"CheckboxCompositeReversed":"Checkbox",className:"mr-2"}),(0,r.jsx)("span",null,o.filter.instances[t].title))}))),e.renderedFilters),(0,r.jsx)("div",{className:"flex flex-1 items-center justify-end",ref:t=>{t&&e.container!==t&&(e.container=t,x(()=>e.container&&e.container.offsetWidth>0).then(l))}},e.container&&e.container.offsetWidth>0&&(0,r.jsx)(W,{width:e.container.offsetWidth,state:o,action:o.header?.action})))},"BaseFilterTopBar");var de=u(({ctx:c})=>{let e=(0,y.useRef)({init:!1}).current,o=g();(0,y.useEffect)(()=>{(async()=>{await x(()=>m.filter.columns),e.init=!0,m.filter.render=o,o()})()},[]);let m=(0,y.useContext)(c);return e.init?m.filter.web.mode==="topbar"?(0,E.jsx)(q,{ctx:c}):m.filter.web.mode==="sideleft"?(0,E.jsx)(V,{ctx:c}):null:null},"BaseFilterWeb");export{de as BaseFilterWeb};
//# sourceMappingURL=BaseFilterWeb-GJQBBS6J.js.map
