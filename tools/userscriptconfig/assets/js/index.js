import{j as e,M as F,S as b,I as f,B as y,m as C,T as I,u as N,A as P,F as _,R as h,a as K,c as T}from"./vendor.js";import"./common.js";(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function i(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(r){if(r.ep)return;r.ep=!0;const o=i(r);fetch(r.href,o)}})();const A=({menuKey:t,setMenuKey:n})=>{const[i,s]=React.useState([{label:"Index ",key:"index"},{label:"About",key:"about",className:"menu-about"}]);React.useEffect(()=>{if(window.userscript!=null){let o=[...Object.keys(window.userscript)].map(x=>({label:x,key:x}));const a=[...i,...o];console.log(a),s(a)}},[]);const r=o=>{n(o.key)};return e.jsx(F,{onClick:r,selectedKeys:[t],mode:"vertical",items:i})},L=t=>e.jsx("hr",{id:t.id.substring(t.id.startsWith("#")),className:"line"}),O=t=>{const[n,i]=React.useState(""),[s,r]=React.useState(""),[o,a]=React.useState(""),x=(d,p)=>{if(d.trim()===""){C.error("值不可为空!!");return}t.value.includes(p)?t.onChange(t.value.replace(p,`${p}${d}
`)):t.onChange(`${t.value}
${p}${d}
`),C.success("添加成功!")},g=()=>{x(n,`#name
`),i("")},j=()=>{x(s,`#bio
`),r("")},k=()=>{x(o,`#text
`),a("")};return e.jsx(e.Fragment,{children:e.jsxs(b,{direction:"vertical",size:"middle",children:[e.jsxs(b.Compact,{children:[e.jsx(f,{defaultValue:"",placeholder:"用户名屏蔽词",value:n,onChange:d=>i(d.target.value)}),e.jsx(y,{type:"primary",onClick:g,children:"添加用户名屏蔽词"})]}),e.jsxs(b.Compact,{children:[e.jsx(f,{defaultValue:"",placeholder:"用户介绍Bio屏蔽词",value:s,onChange:d=>r(d.target.value)}),e.jsx(y,{type:"primary",onClick:j,children:"添加用户介绍Bio屏蔽词"})]}),e.jsxs(b.Compact,{children:[e.jsx(f,{defaultValue:"",placeholder:"推文屏蔽词",value:o,onChange:d=>a(d.target.value)}),e.jsx(y,{type:"primary",onClick:k,children:"添加推文屏蔽词"})]}),e.jsx(f.TextArea,{autoSize:!0,value:t.value,onChange:d=>t.onChange(d.target.value)})]})})},$=[{key:"#csdn-toolbar",title:"头部工具栏toolbar",children:[{key:"#csdn-toolbar .toolbar-container-left",title:"左边部分",children:[{key:"#csdn-toolbar .toolbar-logo",title:"CSDN LOGO"},{key:"#csdn-toolbar .toolbar-menus",title:"菜单"}]},{key:"#csdn-toolbar .toolbar-container-middle",title:"中间部分",children:[{key:"#csdn-toolbar .toolbar-search",title:"搜索",children:[{key:"#toolbar-search-button",title:"搜索按钮"}]}]},{key:"#csdn-toolbar .toolbar-container-right",title:"右边部分",children:[{key:"#csdn-toolbar .toolbar-btn-login",title:"登录"},{key:"#csdn-toolbar .toolbar-btn-vip",title:"会员中心"},{key:"#csdn-toolbar .toolbar-btn-msg",title:"消息"},{key:"#csdn-toolbar .toolbar-btn-collect",title:"历史"},{key:"#csdn-toolbar .toolbar-btn-mp",title:"创作中心"},{key:"#csdn-toolbar .toolbar-btn-write",title:"发布"}]}]},{key:"#mainBox",title:"主内容",children:[{key:"#mainBox .blog_container_aside",title:"左侧边栏",children:[{key:"#asideProfile",title:"用户档案",children:[{key:"#asideProfile .profile-intro",title:"头像及名称"},{key:"#asideProfile .data-info",title:"数据信息"},{key:"#asideProfile .item-rank",title:"item-rank"},{key:"#asideProfile .aside-box-footer",title:"徽章"},{key:"#asideProfile .profile-intro-name-boxOpration",title:"私信及关注按钮"}]},{key:"#footerRightAds",title:"广告"},{key:"#asideWriteGuide",title:"创作推广"},{key:"#asideSearchArticle",title:"搜索博主文章"},{key:"#asideHotArticle",title:"热门文章"},{key:"#asideCategory",title:"分类专栏"},{key:"#asideNewComments",title:"最新评论"},{key:"#asideNewNps",title:"您愿意向朋友推荐“博客详情页”吗？"},{key:"#asideArchive",title:"最新文章"},{key:"#asidedirectory",title:"目录"}]},{key:"main .blog-content-box",title:"文章主体",children:[{key:"main .article-header-box",title:"头部",children:[{key:"main .article-title-box",title:"标题"},{key:"main .article-info-box",title:"信息",children:[{key:"main .article-bar-top",title:"bar top",children:[{key:"main .article-title-box .article-type-img",title:"图标"}]},{key:"main .blog-tags-box",title:"标签"}]}]},{key:"main .baidu_pl",title:"文章",children:[{key:"#article_content",title:"文章内容"},{key:"#treeSkill",title:"文章知识点与官方知识档案匹配，可进一步学习相关知识"},{key:"#blogVoteBox",title:"投票"}]},{key:".recommend-box",title:"推荐",children:[{key:".first-recommend-box",title:"第一条推荐"},{key:".second-recommend-box",title:"第二条推荐"},{key:".insert-baidu-box.recommend-box-style",title:"其他推荐"}]},{key:"#recommendNps",title:"“相关推荐”对你有帮助么？"},{key:"#commentBox",title:"评论Box"},{key:"#pcCommentBox",title:"pc评论Box"}]},{key:"#toolBarBox",title:"底部工具栏"},{key:".blog-footer-bottom",title:"页脚(版权/备案)"}]},{key:"#rightAside",title:"右侧边栏(登录后才有)",children:[{key:"#groupfile",title:"目录"},{key:"#rightAside .kind_person",title:"分类"}]},{key:".csdn-side-toolbar",title:"侧边工具栏",children:[{key:".sidetool-writeguide-box",title:"创作话题"},{key:".option-box[data-type=guide]",title:"新手引导"},{key:".option-box[data-type=cs]",title:"客服"},{key:".option-box[data-type=report]",title:"举报"},{key:".option-box[data-type=gotop]",title:"返回顶部"}]},{key:".passport-container-mini-tip",title:"右下角登录提示"}],E=t=>{const[n,i]=React.useState(t.value),[s,r]=React.useState(t.value),o=a=>{i(a),t.onChange(a)};return e.jsx(e.Fragment,{children:e.jsxs("div",{style:{width:"100%",backgroundColor:"white",padding:"2px",borderRadius:"4px"},children:[e.jsx("h3",{style:{margin:"4px"},children:"❗勾选要⌊隐藏⌉的部分❗"}),t.disabled&&e.jsx("h3",{style:{margin:"3px 5px"},children:" 仅当UI净化预设为自定义时启用"}),e.jsx(I,{disabled:t.disabled,blockNode:!0,checkable:!0,showLine:!0,defaultExpandParent:!0,checkedKeys:n,expandedKeys:s,onExpand:r,treeData:$,onCheck:o,style:{width:"100%",padding:"10px"}})]})})},z=({menuKey:t})=>{var w;const n=N();let i={};const[s,r]=React.useState({}),[o,a]=React.useState([]),[x,g]=React.useState(2),[j,k]=React.useState("column"),d=u=>{const l=u.target.value;s.column=l,n.setSchema(s,!0),g(l)},p=u=>{const l=u.target.value;s.displayType=l,n.setSchema(s,!0),k(l)};(w=window.userscript)!=null&&w[t]&&(i=window.userscript[t].props),React.useEffect(()=>{var m,v;const u={};Object.keys(i).forEach(c=>{u[c]={type:"string",widget:"input",title:c,...i[c],default:window.userscript[t].get(`${t}_${c}`,i[c].default),extra:`default: ${i[c].default}`},i[c].extra&&(u[c].widget=="line"?u[c].extra=i[c].extra:u[c].extra=i[c].extra+` default: ${i[c].default??i[c].defaultValue??""}`)});const l={type:"object",column:window.innerWidth>720?2:1,properties:u};console.log(l),r(l),a([{key:"top",href:"#top",title:"Top"}].concat(((v=(m=window.userscript)==null?void 0:m[t])==null?void 0:v.anchors)||[]))},[t]);const S=u=>{console.log("formData:",u);for(const l of Object.keys(u)){if(l.startsWith(".")||l.startsWith("#"))continue;const m=u[l];m!=s.properties[l].default&&window.userscript[t].set(`${t}_${l}`,m),location.reload()}},B=()=>n.submit(),R=()=>location.reload();return e.jsxs(e.Fragment,{children:[e.jsx("div",{id:"top",style:{padding:"0 0 18px 0",margin:"-2px"},children:e.jsx("div",{style:{backgroundColor:"#FCFCFC",padding:"8px",borderRadius:"8px"},children:e.jsx(P,{direction:"horizontal",items:o,affix:!0,offsetTop:"16px"})})}),e.jsx("div",{children:e.jsxs(_.Item,{label:"表单排版",style:{margin:"0px 1px 24px"},children:[e.jsxs(h.Group,{value:j,onChange:p,style:{margin:"0px 6px"},children:[e.jsx(h.Button,{value:"row",children:"row"}),e.jsx(h.Button,{value:"column",children:"column"}),e.jsx(h.Button,{value:"inline",disabled:!0,children:"Inline"})]}),e.jsxs(h.Group,{value:x,onChange:d,style:{margin:"0px 6px"},children:[e.jsx(h.Button,{value:1,children:"一列"}),e.jsx(h.Button,{value:2,children:"两列"}),e.jsx(h.Button,{value:3,children:"三列"}),e.jsx(h.Button,{value:4,children:"四列"})]})]})}),e.jsx(K,{form:n,schema:s,widgets:{Line:L,Twitter_user_rule_editor:O,CSDN_UI_editor:E},onFinish:S,maxWidth:360,footer:!1}),e.jsxs("div",{style:{position:"fixed",bottom:"18px",right:"24px",zIndex:999,fontSize:"18px",width:"auto",height:"auto"},children:[e.jsx(y,{onClick:R,type:"default",size:"large",style:{position:"relative",border:"1px solid #4ea1db",margin:"8px"},children:"取消"}),e.jsx(y,{onClick:B,type:"primary",size:"large",style:{position:"relative",border:"1px solid #4ea1db",margin:"8px",boxShadow:"1px 1px 14px #4ea1db"},children:"保存"})]})]})};function D(){const t=new URLSearchParams(window.location.search),n=t.get("iniframe")!==null,[i,s]=React.useState(t.get("key")||t.get("menuKey")||"index");return React.useEffect(()=>{const r=new URLSearchParams(window.location.search);r.get("key")!==i&&(i=="index"?r.delete("key"):r.set("key",i),r.get("menuKey")&&r.delete("menuKey"),window.history.pushState(null,"",r.toString()===""?".":`?${r.toString()}`))},[i]),e.jsxs(e.Fragment,{children:[!n&&e.jsx("div",{className:"menu",children:e.jsx(A,{menuKey:i,setMenuKey:s})}),e.jsxs("div",{className:"main",children:[i!=="index"&&i!=="about"&&e.jsx(z,{menuKey:i}),i==="index"&&n&&e.jsxs(e.Fragment,{children:[e.jsx("h2",{children:"请访问外部链接(三选一)"}),e.jsx("br",{}),e.jsx("a",{href:"https://yuhanawa.github.io/tools/userscriptconfig/",target:"_blank",rel:"noopener noreferrer",children:"https://yuhanawa.github.io/tools/userscriptconfig/"}),e.jsx("br",{}),e.jsx("a",{href:"https://user-script-config-form.vercel.app",target:"_blank",rel:"noopener noreferrer",children:"https://user-script-config-form.vercel.app"}),e.jsx("br",{}),e.jsx("a",{href:"https://yuhan-script-config.netlify.app",target:"_blank",rel:"noopener noreferrer",children:"https://yuhan-script-config.netlify.app"}),e.jsx("br",{})]}),i==="index"&&!n&&e.jsxs(e.Fragment,{children:[e.jsx("h2",{children:" 点击左测标签栏选择脚本 "}),e.jsxs("div",{children:[e.jsx("br",{}),e.jsx("br",{}),e.jsx("br",{}),e.jsx("br",{}),e.jsx("a",{href:"https://github.com/yuhanawa/UserScript",children:"GITHUB"})]})]}),i==="about"&&e.jsxs(e.Fragment,{children:[e.jsx("h4",{children:"其他脚本: "}),e.jsxs("div",{children:[e.jsx("br",{}),e.jsx("a",{href:"https://greasyfork.org/zh-CN/scripts/471069",children:"哔哩哔哩 BILIBILI 美化|增强|自定义背景|评论过滤等"})]}),e.jsxs("div",{children:[e.jsx("br",{}),e.jsx("a",{href:"https://greasyfork.org/zh-CN/scripts/471071",children:"CSDN-优化美化极简化-沉浸式阅读-免登录复制-去广告等"})]}),e.jsxs("div",{children:[e.jsx("br",{}),e.jsx("br",{}),e.jsx("br",{}),e.jsx("br",{}),e.jsx("a",{href:"https://github.com/yuhanawa/UserScript",children:"GITHUB"})]})]})]})]})}T.createRoot(document.getElementById("root")).render(e.jsx(React.StrictMode,{children:e.jsx(D,{})}));
