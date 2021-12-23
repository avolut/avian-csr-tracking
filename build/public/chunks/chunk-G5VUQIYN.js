import{a as k}from"./chunk-UMBFZAT7.js";import{a as w}from"./chunk-ZUGU5IHP.js";import{Z as C,xa as g}from"./chunk-IHSADOYH.js";import{a as S}from"./chunk-2OZ4JKVY.js";import{b as y}from"./chunk-IRKXFVRU.js";import{a as b,e as x}from"./chunk-SDY2POXP.js";var t=x(S());var o=x(y());var I=b(({ctx:u})=>{let p=(0,o.useRef)({init:!1}),e=(0,o.useContext)(u),d=p.current,r=w();if((0,o.useEffect)(()=>{let n=e.table.columns[0];if(n){e.db.params||(e.db.params={}),e.db.params.where||(e.db.params.where={});let a=e.db.params.where;a[n]&&a[n].contains&&(e.filter.quickSearch=a[n].contains)}d.init=!0,r()},[]),!d.init)return null;let l=e.header?.action?.create,i=null;return l!==!1&&(typeof l=="function"?i=l({state:e,save:null,data:null}):typeof i=="object"&&((0,o.isValidElement)(l)?i=l:i=(0,t.jsx)(C,{raised:!0,large:!0,onClick:()=>{let n=e.tree.parent;n.crud.setMode("form",{}),n.component.render()},className:"flex flex-row items-center",css:t.css`
              margin: 10px 0px 10px 5px;
              width: 120px;
              border-radius: 5px;
              height: 30px;
              line-height: 30px;
            `,children:(0,t.jsx)(React.Fragment,null,(0,t.jsx)("span",{css:t.css`
                    font-size: 22px;
                    line-height: 0px;
                    margin-top: -4px;
                  `},"+"),(0,t.jsx)("span",{css:t.css`
                    font-size: 14px;
                    text-transform: initial;
                  `},typeof e.header?.action?.create=="string"?e.header.action.create:k("Tambah","id"))),...typeof i=="object"&&!(0,o.isValidElement)(i)?i:{}}))),(0,t.jsx)(React.Fragment,null,(0,t.jsx)(g,{onClickClear:()=>{e.filter.quickSearch="",r(),e.component.render()},value:e.filter.quickSearch||"",searchContainer:".search-list",searchIn:".item-link",placeholder:`${e.filter.quickSearchTitle||"Cari"}`,disableButton:!1,clearButton:!0,css:t.css`
          .searchbar-input-wrap input {
            border-radius: 5px !important;
          }
        `,onChange:n=>{let a=n.target.value,h=e.table.columns[0];if(h){e.db.params.where||(e.db.params.where={});let s={};if(a?s[h]={contains:a,mode:"insensitive",found:!1}:delete s[h],e.table.columns[1]){let c=e.table.columns[1];a?s[c]={contains:a,mode:"insensitive",found:!1}:delete s[c]}let m=e.db.params.where.OR;m||(e.db.params.where.OR=[],m=e.db.params.where.OR);for(let c of m)for(let[f,B]of Object.entries(c))s[f]&&(s[f].found=!0);for(let[c,f]of Object.entries(s))delete f.found,m.push({[c]:f});e.db.paging.reset(),e.filter.quickSearch=a,e.db.query()}else e.filter.quickSearch=a,r(),e.component.render()}},i))},"BaseFilterMobile"),v=b((u,p)=>{let e=!1;for(let[d,r]of Object.entries(u)){if(r&&r.toString&&r.toString().toLowerCase().indexOf(p)>=0){e=!0;break}if(typeof r=="object"&&!!r&&!d.startsWith("_")&&v(r,p)){e=!0;break}}return e},"searchObject");export{I as a,v as b};
//# sourceMappingURL=chunk-G5VUQIYN.js.map
