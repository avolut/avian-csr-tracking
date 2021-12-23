import{b as G}from"./chunk-DSQ3UL7H.js";import"./chunk-55V4HHK3.js";import{C as se,E as fe,I as ce,Q as de,a as ne,x as le,y as N}from"./chunk-FTDH4D5C.js";import{a as S}from"./chunk-SR5OL73C.js";import"./chunk-LO6GVN5M.js";import"./chunk-SD5ULMK3.js";import"./chunk-Y5EMNB45.js";import"./chunk-UMBFZAT7.js";import"./chunk-R42GCTHV.js";import{a as Ie}from"./chunk-WJABE3AS.js";import{a as oe}from"./chunk-IA5P3YQN.js";import{a as k}from"./chunk-ZUGU5IHP.js";import{b as $e,e as Y}from"./chunk-NXH6K27G.js";import"./chunk-4Y2NHA3G.js";import{Z,ka as H,ma as P,na as F,oa as x,qa as V,sa as W,ua as ae,va as re,za as ie}from"./chunk-IHSADOYH.js";import"./chunk-HP25GDQW.js";import{a as I}from"./chunk-2OZ4JKVY.js";import{b as $}from"./chunk-IRKXFVRU.js";import{a as v,e as u}from"./chunk-SDY2POXP.js";var h=u(I());var j=u($e()),A=u(Ie()),ee=u(S()),T=u($()),me=u(oe());var pe=v(r=>{let s=k(),e=(0,T.useRef)({loading:!1,items:[],params:null,opened:!1,value:0,labelLoaded:!1,labelLoading:!1,async queryLabel(){if(!e.labelLoading&&(e.labelLoading=!0,!e.labelLoaded)){if(e.value=(0,A.default)(o.db.data,c),!(0,j.default)(e.items,{value:e.value})&&!e.loading&&!!e.value&&n){let g=(0,A.default)(o,`__belongsToLabelCache.${m}.${p}.${e.value}`);if(g){e.items=[...e.items,{value:e.value,label:g}];return}if(!e.loading){e.loading=!0,s();let y=(await Y[n.modelClass].findMany({where:{[p]:e.value}})).map(z=>G({e:z,alter:a,to:p}));e.items=[...e.items,y[0]],(0,ee.default)(o,`__belongsToLabelCache.${m}.${p}.${e.value}`,y[0].label)}}e.loading=!1,e.labelLoading=!1,e.labelLoaded=!0,s()}},getParams(){let b={},g=o.config.alter[r.name];return g&&(typeof g.params=="function"?b=g.params(o.db.data,o):typeof g.params=="object"&&(b={...g.params})),b},async query(){if(n){e.value=o.db.data[c];let b=o.config.alter[r.name];e.loading=!0,s(),e.items=(await Y[n.modelClass].findMany(this.params)).map(g=>{let y=G({e:g,alter:b,to:p});return g[p]===e.value&&(0,ee.default)(o,`__belongsToLabelCache.${m}.${p}.${e.value}`,y.label),y}),e.loading=!1,s()}}}).current,o=(0,T.useContext)(r.ctx),a=o.config.alter[r.name],m=(r.name.indexOf(".")>0?r.name.split(".").shift():r.name)||r.name,t=(o.config.fields[r.name]||{}).state,n=o.db.definition?.rels[m];if(!n&&(0,A.default)(t,"items.table")){let b=t.items;typeof b=="object"&&!Array.isArray(b)&&b.table&&(n={join:{from:"",to:""},relation:"Model.BelongsToOneRelation",modelClass:b.table})}let p=n?.join.to.split(".").pop()||"",c=n?.join.from.split(".").pop()||"",l=N({definer:t.required,args:[{state:o,row:o.db.data,col:name}],render:s,default:!1}),f=(0,j.default)(e.items,{value:e.value})||{label:""},L={class:`bt-${o.tree.getPath().replace(/\W+/gi,"-")}-${r.name.replace(/\W+/gi,"-")}`,title:typeof t.title=="string"?t.title:ne(r.name)};if((0,T.useEffect)(()=>{e.labelLoaded||e.queryLabel()},[]),!n||!e.labelLoaded)return null;let w={title:L.title,onLoad:b=>{e.items=b.map(g=>G({e:g,alter:a,to:p}))},table:{swipeout:(b,{Edit:g,Delete:y})=>(0,h.jsx)(React.Fragment,null,(0,h.jsx)(g,null),(0,h.jsx)(y,null))},params:e.getParams()};ce(w,t.list||{}),w.table.onRowClick=(b,g,y)=>{let z=(0,A.default)(t,"list.table.onRowClick");if(typeof z=="function"&&z(b,g,y))return;if(g<0||y&&y.mode==="edit")return!0;let U=b[p];t.value||(t.value={}),typeof t.onChange=="function"&&t.onChange(U,{state:o,row:o.db.data,col:r.name}),typeof o.db.data[m]=="object"&&(o.db.data[m][p]=U),o.db.data[c]=U,e.value=U,r.internalChange(U),e.opened=!1,s()};let M=t.form||void 0,R=(0,h.jsx)(ie,{opened:e.opened,css:h.css`
        display: ${e.opened?"none":"flex"};
        flex-direction: column;
        height: 90vh;

        > .sheet-modal-inner {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
      `,onSheetClosed:()=>{e.opened=!1,s()},swipeToClose:!0,className:`${L.class} h-full`,swipeHandler:`.${L.class} .form-title`},(0,h.jsx)("div",{className:"block-title form-title"},L.title),e.opened&&n&&(0,h.jsx)(de,{content:{[L.title]:{table:n.modelClass,list:w,form:M}}}));return(0,h.jsx)(React.Fragment,null,(0,h.jsx)(x,{className:`${l?"required":""} flex flex-col `,mediaList:!0,css:h.css`
          .item-text {
            font-size: var(--f7-input-info-font-size);
            position: relative;
            margin-top: -8px;
          }
          .item-title {
            font-size: var(--f7-label-font-size) !important;
            font-weight: var(--f7-label-font-weight) !important;
            line-height: var(--f7-label-line-height) !important;
            color: var(--f7-label-text-color) !important;
          }
          .item-subtitle {
            height: var(--f7-input-height);
            color: var(--f7-input-text-color);
            font-size: var(--f7-input-font-size);
            background-color: var(--f7-input-bg-color, transparent);
            padding-left: var(--f7-input-padding-left);
            padding-right: var(--f7-input-padding-right);
            display: flex;
            align-items: center;
          }
        `},(0,h.jsx)(F,{link:"#",title:t.title,className:`${t.error?"pb-4":""}`,subtitle:f.label||"\u2014",text:t.info,chevronCenter:!0,disabled:t.readonly,onClick:()=>{e.opened=!0,s()}}),t.error&&(0,h.jsx)("div",{className:"block item-input-error-message",css:h.css`
              margin-top: -23px !important;
            `},t.error)),(0,me.createPortal)(R,document.getElementById("framework7-root")))},"MBelongsTo");var _=u(I());var ue=u(S()),X=u($()),ge=u(oe());var ve=v(({ctx:r,internalChange:s,name:i})=>{let o=(0,X.useRef)({open:!1}).current,a=(0,X.useContext)(r),m=a.config.fields[i],t=k();if(!m)return null;let n=m.state,p=N({definer:n.required,args:[{state:a,row:a.db.data,col:i}],render:t,default:!1}),c=n.popup;return c?(0,_.jsx)(React.Fragment,null,(0,_.jsx)(x,{className:`${p?"required":""} `,mediaList:!0,css:css`
            .item-text {
              font-size: var(--f7-input-info-font-size);
              position: relative;
              margin-top: -8px;
            }
            .item-title {
              font-size: var(--f7-label-font-size) !important;
              font-weight: var(--f7-label-font-weight) !important;
              line-height: var(--f7-label-line-height) !important;
              color: var(--f7-label-text-color) !important;
            }
            .item-subtitle {
              height: var(--f7-input-height);
              color: var(--f7-input-text-color);
              font-size: var(--f7-input-font-size);
              background-color: var(--f7-input-bg-color, transparent);
              padding-left: var(--f7-input-padding-left);
              padding-right: var(--f7-input-padding-right);
              display: flex;
              align-items: center;
            }
          `},(0,_.jsx)(F,{link:"#",title:c.title,className:`${n.error?"pb-4":""}`,subtitle:c.value({state:n})||"\u2014",chevronCenter:!0,disabled:n.readonly,onClick:()=>{o.open=!0,t()}})),o.open&&(0,ge.createPortal)((0,_.jsx)("div",{className:"fixed inset-0 flex flex-1 flex-col bg-white",css:css`
                z-index: 100000;
              `},(0,_.jsx)(W,{backLinkShowText:!0,backLink:"Back",onBackClick:()=>{o.open=!1,t()},title:n.title},(0,_.jsx)(V,null,(0,_.jsx)(H,{onClick:()=>{o.open=!1,t()}},"OK"))),(0,_.jsx)("div",{className:"flex flex-1 overflow-auto items-stretch flex-col"},c.children({state:n,onChange:l=>{(0,ue.default)(a.db.data,i,l),n&&typeof n.onChange=="function"&&n.onChange(l,{state:a,row:a.db.data,col:i}),s(l)}}))),document.getElementById("framework7-root"))):null},"MCustomPopup");var te=u(I());var be=u(S()),D=u($());var he=v(({ctx:r,internalChange:s,name:i})=>{let o=(0,D.useRef)({init:!1,value:null}).current,a=(0,D.useContext)(r),m=a.config.fields[i],t=m.state,n=k();(0,D.useEffect)(()=>{o.value=!!t.value&&!(t.value instanceof Date)?new Date(t.value):t.value,o.init=!0,n()},[]);let p=N({definer:t.required,args:[{state:a,row:a.db.data,col:i}],render:n,default:!1});return!m||!o.init?null:(0,te.jsx)(x,{className:`cal-1 ${p?"required":""} ${t.readonly?"pointer-events-none":""}`},(0,te.jsx)(P,{label:t.title,placeholder:t.placeholder,type:"datepicker",required:p,value:o.value?[o.value]:void 0,clearButton:!p&&!t.readonly,calendarParams:{backdrop:!0,closeOnSelect:!0,header:!0,openIn:"popover",locale:"id-ID",dateFormat:"dd M yyyy",on:{change:function(c,l){let f=l[0]?l[0]:null;try{!!f&&f instanceof Date&&(o.value=f,(0,be.default)(a.db.data,i,f),typeof t.onChange=="function"&&t.onChange(f,{state:a,row:a.db.data,col:i}),s(f))}catch{o.value=new Date,n()}}}}}))},"MDate");var d=u(I());var ye=u(S()),E=u($());var we=v(({ctx:r,internalChange:s,name:i})=>{let o=(0,E.useRef)({loading:!1,progress:0,value:null,init:!1,get isImage(){return!!(o.value&&typeof o.value=="string"&&o.value.match(/[^/]+(jpg|png|gif|jpeg|svg)$/))},get ext(){return this.value.split(".").pop()},get name(){return this.value.split("/").pop()},get path(){let l=this.value.split("/").filter(f=>f);return l.pop(),l[0]==="upload"&&l.shift(),l.join("/")}}).current,a=(0,E.useContext)(r),t=a.config.fields[i].state,n=k(),p=N({definer:t.required,args:[{state:a,row:a.db.data,col:i}],render:n,default:!1});if((0,E.useEffect)(()=>{o.init=!0,o.value=t.value,n()},[t.value]),!o.init)return null;let c=t.readonly?null:(0,d.jsx)("div",{className:" relative flex-1"},(0,d.jsx)(Z,{fill:!0,bgColor:"blue",className:"capitalize"},o.value?"UNGGAH FILE BARU \u2191":"UNGGAH FILE \u2191"),(0,d.jsx)("input",{type:"file",onChange:async l=>{if(l.target.files?.length){let f=l.target.files,L=f[0].name.split(".").pop(),w="public";a.db.definition.db.name&&(w=`${a.db.definition.db.name}/${i}`);let M=new File([f[0].slice(0,f[0].size,f[0].type)],`${Ce()}.${L}`,{type:f[0].type}),R=`/upload/${w}/${M.name}`,b=new FormData;b.append(w,M),o.loading=!0,n(),await Pe("/__upload",{method:"POST",headers:{Accept:"application/json","Access-Control-Allow-Origin":"*"},body:b},y=>{let z=y.loaded/y.total*100;o.progress=z,n()}),o.loading=!1,o.value=R;let g=o.value;(0,ye.default)(a.db.data,i,g),typeof t.onChange=="function"&&t.onChange(g,{state:a,row:a.db.data,col:i}),s(g)}},className:"absolute inset-0 opacity-0 z-10"}));return(0,d.jsx)("div",{className:`list ${p?"required":""} `},(0,d.jsx)("ul",null,(0,d.jsx)("div",{className:`item-content item-input ${t.error?"item-input-with-error-message item-input-invalid":""}`},(0,d.jsx)("div",{className:"item-inner",css:d.css`
              &:after {
                display: none !important;
              }
            `},(0,d.jsx)("div",{className:"item-title item-label"},t.title),(0,d.jsx)("div",{className:"item-input-wrap "},o.loading?(0,d.jsx)(re,{progress:o.progress,className:"my-7"}):(0,d.jsx)(React.Fragment,null,o.value?(0,d.jsx)("div",{className:"flex flex-row my-1 flex-1 items-center",css:d.css`
                        margin-left: -8px;
                      `},o.value&&(0,d.jsx)(ze,{ext:o.ext,path:o.path,name:o.name,hideImage:!0}),(0,d.jsx)("div",{className:"flex space-y-2 flex-col flex-1 items-start justify-center"},(0,d.jsx)(Z,{onClick:()=>{window.capacitor&&window.capacitor.Browser?window.capacitor.Browser.open({url:o.value}):location.href=o.value},outline:!0},"Unduh file \u2193"),c)):(0,d.jsx)("div",{className:"my-4"},c)),t.info&&(0,d.jsx)("div",{className:"item-input-info"},t.info),t.error&&(0,d.jsx)("div",{className:"item-input-error-message"},t.error))))))},"MFile");function Pe(r,s={},i){return new Promise((e,o)=>{let a=new XMLHttpRequest;a.open(s.method||"get",r,!0),Object.keys(s.headers||{}).forEach(m=>{a.setRequestHeader(m,s.headers[m])}),a.onload=m=>e(m.target.responseText),a.onerror=o,a.upload&&i&&(a.upload.onprogress=i),a.send(s.body)})}v(Pe,"request");var Ce=v((r="")=>r?((Number(r)^Math.random()*16)>>Number(r)/4).toString(16):`${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`.replace(/[018]/g,Ce),"getUuid"),Re=v(r=>r.join("/").replace(/\/+/g,"/").replace(/\/+$/,""),"join"),qe=v((r,s,i)=>r.indexOf("http")===0?r:Re(["/upload/",r,s])+(i||""),"fixPath"),ze=v(r=>{let{ext:s,path:i,name:e,hideImage:o}=r;return!o&&["jpg","svg","jpeg","png","gif"].indexOf(s)>=0?(0,d.jsx)(React.Fragment,null,(0,d.jsx)("img",{className:"rounded-md select-none",src:`${qe(i,e)}?h=150`}),(0,d.jsx)("img",{css:d.css`
          pointer-events: none;
          height: 40px;
          position: absolute;
          bottom: -5px;
          right: -5px;
        `,src:`/__ext/icons/${s}.png`})):(0,d.jsx)("img",{css:d.css`
        pointer-events: none;
        height: 70px;
      `,src:`/__ext/icons/${s}.png`,onError:a=>{a.target.attributes.src.value="/__ext/icons/txt.png"},className:"m-2"})},"FilePreview");var J=u(I()),Le=u($()),ke=v(({ctx:r,name:s})=>{let e=(0,Le.useContext)(r).config.fields[s];if(!e)return null;let o=e.state;return(0,J.jsx)("div",{className:"block-title form-section",css:J.css`
        width: 100%;
        background: white;
        margin: 0px;
        padding: 36px 16px 10px 16px;
      `},o.title)},"MSection");var C=u(I());var K=u(S()),Q=u($());var xe=v(({ctx:r,internalChange:s,name:i})=>{let e=(0,Q.useContext)(r),o=e.config.fields[i],m=(0,Q.useRef)({list:{open:!1}}).current;if(!o)return null;let t=o.state,n=k(),p=N({definer:t.required,args:[{state:e,row:e.db.data,col:i}],render:n,default:!1}),c=get(t,"items.table")?"db":"array",l=c==="db"?t.items:null;return(0,C.jsx)(React.Fragment,null,(0,C.jsx)(x,{className:`${p?"required":""} `,mediaList:c==="db",css:c==="db"&&css`
            .item-text {
              font-size: var(--f7-input-info-font-size);
              position: relative;
              margin-top: -8px;
            }
            .item-title {
              font-size: var(--f7-label-font-size) !important;
              font-weight: var(--f7-label-font-weight) !important;
              line-height: var(--f7-label-line-height) !important;
              color: var(--f7-label-text-color) !important;
            }
            .item-subtitle {
              height: var(--f7-input-height);
              color: var(--f7-input-text-color);
              font-size: var(--f7-input-font-size);
              background-color: var(--f7-input-bg-color, transparent);
              padding-left: var(--f7-input-padding-left);
              padding-right: var(--f7-input-padding-right);
              display: flex;
              align-items: center;
            }
          `},c==="array"?(0,C.jsx)(P,{label:t.title,placeholder:t.placeholder,required:p,value:t.value||"",type:"select",ref:f=>{if(f){let w=f.el.querySelector("select");w&&w.getAttribute("event-set")!=="y"&&(w.setAttribute("event-set","y"),w.addEventListener("change",M=>{let R=M.target.value;(0,K.default)(e.db.data,i,R),typeof t.onChange=="function"&&t.onChange(R,{state:e,row:e.db.data,col:i}),s(R)}))}}},Array.isArray(t.items)&&t.items.map((f,L)=>(0,C.jsx)("option",{value:typeof f=="object"?f.value:f,key:L},typeof f=="object"?f.label:f))):(0,C.jsx)(F,{link:"#",title:t.title,className:`${t.error?"pb-4":""}`,subtitle:t.value||"\u2014",chevronCenter:!0,disabled:t.readonly,onClick:()=>{m.list.open=!0,n()}})),l&&(0,C.jsx)("div",{className:"hidden"},(0,C.jsx)(ae,{opened:m.list.open,css:css`
              z-index: 99999999;

              .list > ul {
                ::before,
                ::after {
                  display: none;
                }
              }
            `},(0,C.jsx)("div",{className:"flex flex-1 w-full h-full flex-col"},(0,C.jsx)(W,{backLinkShowText:!0,backLink:"Back",onBackClick:()=>{m.list.open=!1,n()},title:t.title},(0,C.jsx)(V,null,(0,C.jsx)(H,{onClick:()=>{let f=null;l.onSelect&&l.onSelect(null),m.list.open=!1,(0,K.default)(e.db.data,i,f),t&&typeof t.onChange=="function"&&t.onChange(f,{state:e,row:e.db.data,col:i}),s(f)}},"Clear"))),m.list.open&&(0,C.jsx)(fe,{title:t.title,table:l.table,header:{action:{create:!1}},onRowClick:(f,L,w)=>{m.list.open=!1,l.onSelect&&l.onSelect(f);let M=l.label(f);(0,K.default)(e.db.data,i,M),t&&typeof t.onChange=="function"&&t.onChange(M,{state:e,row:e.db.data,detail:f,col:i}),s(M)},...l.list||{}})))))},"MSelect");var O=u(I());var Ne=u(S()),Me=u($());var q=v(({ctx:r,internalChange:s,name:i})=>{let e=(0,Me.useContext)(r),o=e.config.fields[i],a=o.state,m=k(),t=N({definer:a.required,args:[{state:e,row:e.db.data,col:i}],render:m,default:!1});if(!o)return null;let n=a.value,p="text";return a.type==="multiline"?p="textarea":a.type==="password"&&(p="password"),(0,O.jsx)(x,{className:`${t?"required":""} `,css:O.css`
        .list textarea {
          height: var(--f7-input-height);
        }
      `},(0,O.jsx)(P,{label:a.title,placeholder:a.placeholder,required:t,type:p,value:n||"",readonly:a.readonly,onFocus:p==="money"?c=>{c.target.value=c.target.value.replace(/[\W_]+/g,"")}:void 0,onBlur:p==="money"?c=>{setTimeout(()=>{c.target.value=c.target.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g,".")})}:void 0,resizable:a.type==="multiline",onChange:c=>{let l=c.target.value;["number","money"].indexOf(a.type)>=0&&(l=parseInt(l.replace(/\D/g,""))),(0,Ne.default)(e.db.data,i,l),typeof a.onChange=="function"&&a.onChange(l,{state:e,row:e.db.data,col:i}),s(l)},errorMessageForce:!0,errorMessage:a.error,ref:c=>{if(a.type==="money"&&c&&c.el){let l=c.el.querySelector("input");l&&document.activeElement!==l&&(l.value=l.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g,"."))}}}))},"MText");var B=u(I());var Be=u($());var _e=v(({ctx:r,name:s})=>{let e=(0,Be.useContext)(r).config.fields[s];if(!e)return null;let o=e.state;return(0,B.jsx)(x,null,(0,B.jsx)(P,{label:(0,B.jsx)("div",{className:"flex flex-row"},(0,B.jsx)("svg",{height:16,viewBox:"0 0 128 128",width:16,xmlns:"http://www.w3.org/2000/svg"},(0,B.jsx)("path",{d:"M119.31 116.78H8.69a6.93 6.93 0 01-5.933-10.509l55.309-91.7a6.93 6.93 0 0111.868 0l55.309 91.7a6.93 6.93 0 01-5.933 10.509z",fill:"#f4d844"}),(0,B.jsx)("path",{d:"M14.128 106.779L64 24.096l49.872 82.683z",fill:"#de6246"}),(0,B.jsx)("g",{fill:"#eaeaf0"},(0,B.jsx)("path",{d:"M60 51.45h8v30.219h-8zM60 90.208h8v7.219h-8z"}))),(0,B.jsx)("span",{className:"text-red-700 px-1"},"[",o.type,"]")," ",o.title),value:JSON.stringify(o.value,se())}))},"MUnknown");var _t={unknown:_e,info:le,section:ke,money:q,text:q,number:q,password:q,multiline:q,string:q,select:xe,"custom-popup":ve,date:he,file:we,"belongs-to":pe};export{_t as default};
//# sourceMappingURL=fields-2J7NRF4W.js.map
