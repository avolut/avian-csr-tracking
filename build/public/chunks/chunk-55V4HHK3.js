import{E,j as k,w as W}from"./chunk-FTDH4D5C.js";import{a as $}from"./chunk-SR5OL73C.js";import{i as D,j as L}from"./chunk-LO6GVN5M.js";import{b as P}from"./chunk-SD5ULMK3.js";import{mb as v}from"./chunk-Y5EMNB45.js";import{a as B}from"./chunk-ZUGU5IHP.js";import{a as N}from"./chunk-NXH6K27G.js";import{a as C}from"./chunk-2OZ4JKVY.js";import{b as w}from"./chunk-IRKXFVRU.js";import{a as c,e as g}from"./chunk-SDY2POXP.js";var m=g(C()),R=g(w());var M=c(({ctx:l,name:i})=>{let f=(0,R.useContext)(l).config.fields[i];if(!f)return null;let s=f.state;return(0,m.jsx)(h,{disabled:!0},typeof s.value=="object"?(0,m.jsx)(W,{value:s.value}):s.value)},"WInfo"),h=c(({children:l,className:i,disabled:r})=>(0,m.jsx)("div",{className:`${i} flex flex-1 items-center border rounded-sm text-xs p-2
      ${r?"border-gray-300 bg-gray-50":"border-gray-700 bg-white"}
      `,css:m.css`
        height: 32px;
      `},l),"WBox");var n=g(C());var d=g(w());var S=g($()),J=c(({name:l,internalChange:i,ctx:r})=>{let f=(0,d.useContext)(r),s=f.config.fields[l];if(!s)return null;let u=s.state;return(0,n.jsx)(F,{items:u.items||[],value:u.value,onChange:a=>{(0,S.default)(f.db.data,l,a),typeof u.onChange=="function"&&u.onChange(a,{state:f,row:f.db.data,col:l}),i(a)}})},"WSelect"),y=c(l=>typeof l=="object"?l.el:null,"getEl"),b=c(l=>(typeof l=="object"?l.label||l.text:l)+"","getLabel"),I=c(l=>(typeof l=="object"?l.value||l.key:l)+"","getValue"),F=c(l=>{let{items:i,value:r,loading:f,onDropDown:s,onChange:u}=l,a=B(),e=(0,d.useRef)({init:!1,label:"",el:null,open:!1,picked:!1,items:[],selectedIndex:-1,ref:null,popout:null}).current;if((0,d.useEffect)(()=>{e.items=i;let t=!1;for(let[o,p]of Object.entries(i))if(I(p)==r){e.selectedIndex=parseInt(o),e.label=b(p),e.el=y(p),t=!0;break}if(t||(e.el=null,e.label=""),a(),e.init=!0,e.open&&e.ref){let o=e.ref.querySelector("input");o&&(o.focus(),o.setSelectionRange(0,o.value.length))}},[i,r]),!e.init)return null;let x=c(()=>{N(()=>e.popout).then(()=>{if(e.popout){let t=e.popout.querySelector(".active");t&&t.scrollIntoView()}})},"focusSelected");if(f)return(0,n.jsx)(h,{className:"pure-select"},(0,n.jsx)("div",{className:"flex items-center"},(0,n.jsx)(P,null),(0,n.jsx)(v,{className:"text-xs text-blue-300 ml-2"},"Loading...")));let _=e.items.map(t=>typeof t=="object"?{el:t.el||null,value:t.value||t.key,label:t.label||t.text}:{el:null,value:t,label:t});return(0,n.jsx)("div",{ref:t=>{t&&(e.ref=t)},className:`${l.className||""} pure-select flex flex-1  relative items-stretch`,css:n.css`
        > div {
          flex: 1;
        }
        input {
          cursor: pointer;
        }
      `},(0,n.jsx)(React.Fragment,null,(0,n.jsx)(D,{iconName:"ChevronDown",className:"absolute bg-white bottom-0 top-0 flex items-center justify-center right-0 m-1 pointer-events-none z-10",css:n.css`
            padding: 1px 8px;
          `}),e.el&&(0,n.jsx)("div",{className:"absolute inset-0 z-10 pointer-events-none flex bg-white",css:n.css`
              right: 40px;
              margin: 2px;
              label {
                font-size: 14px;
              }
            `},(0,n.jsx)(v,{className:"flex-1 flex self-stretch items-center px-2"},e.el)),(0,n.jsx)(L,{value:e.label||"",spellCheck:!1,autoComplete:"off",onFocus:t=>{t.target.setSelectionRange(0,t.target.value.length),e.el=null,a()},onBlur:()=>{setTimeout(()=>{if(!e.el&&!e.picked){e.picked=!1;let t="";for(let o of i)I(o)==r&&(t=o);e.open=!1,t&&b(t)!==e.label?(e.items!==i&&(e.items=i),e.label=b(t),e.el=y(t),a()):(e.el=y(t),a())}},500)},onKeyDown:t=>{if(t.key==="ArrowUp")e.open||(e.open=!0,s&&s(r)),t.preventDefault(),t.stopPropagation(),e.selectedIndex=e.selectedIndex<=0?e.items.length-1:e.selectedIndex-1,a(),x();else if(t.key==="ArrowDown")e.open||(e.open=!0),t.preventDefault(),t.stopPropagation(),e.selectedIndex=e.selectedIndex<e.items.length-1?e.selectedIndex+1:0,a(),x();else if(t.key==="Enter"){if(t.preventDefault(),t.stopPropagation(),!e.open)e.open=!0,s&&s(r);else{e.open=!1;let o=e.items[e.selectedIndex];o||(o=e.items[0]),o&&(u&&u(I(o)),e.label=b(o))}a()}},onChange:(t,o)=>{typeof o=="string"&&(e.open=!0,s&&s(r),e.label=o,e.el=null,e.items=o.length>0?i.filter(p=>z(e.label,b(p))):i,a())},onClick:()=>{e.open=!0,s&&s(r),a(),setTimeout(()=>{x()},300)}})),e.open&&e.ref&&(0,n.jsx)(k,{isBeakVisible:!1,target:e.ref,minPagePadding:2,onDismiss:()=>{e.open=!1,a()}},(0,n.jsx)("div",{ref:t=>{t&&(e.popout=t)},className:"flex items-stretch flex-1",css:n.css`
              width: ${e.ref.offsetWidth}px;
              min-width: 170px;
              max-height: 300px;
              ${e.items.length===0?n.css`
                    min-height: 80px;
                  `:n.css`
                    height: ${e.items.length*32}px;
                  `}
            `},(0,n.jsx)(E,{filter:!1,columns:({row:t,index:o})=>(0,n.jsx)(v,{onClick:()=>{e.open=!1,e.picked=!0;let p=t.value;u&&u(p),e.label=t.label,e.el=t.el,a()},className:`flex flex-1 self-stretch px-2 cursor-pointer ${e.selectedIndex===o?"active":""}`,css:n.css`
                      &.active {
                        background-color: #f0faf3;
                        &::after {
                          content: '✓';
                          background: white;
                          border-radius: 5px;
                          border-top-right-radius: 0px;
                          border-bottom-right-radius: 0px;
                          color: green;
                          padding: 0px 10px;
                          position: absolute;
                          right: 0px;
                        }
                      }
                      &:hover {
                        background-color: #e7f3fd;
                      }
                    `},t.el||t.label),list:_}))))},"PureSelect"),z=c(function(l,i){if(l===""||i==="")return!0;l=l.toLowerCase().replace(/ /g,""),i=i.toLowerCase();for(var r=0,f=0;f<l.length;f++)for(;l[f]!==i[r];)if(r++,r===i.length)return!1;return!0},"fuzzyMatch");export{M as a,h as b,J as c,F as d};
//# sourceMappingURL=chunk-55V4HHK3.js.map
