(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{8312:function(e,t,a){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return a(1854)}])},1854:function(e,t,a){"use strict";a.r(t);var s=a(5409);t.default=s.hE},5409:function(e,t,a){"use strict";a.d(t,{kO:function(){return O},p4:function(){return w},hE:function(){return m}});var s=a(5893),n=a(7294),i=a(5697),c=a.n(i),r=a(9353),_=a(5361),l=a.n(_);let o=[{name:"compact",icon:"/static/images/compact_icon.svg",iconHeight:39},{name:"fast",icon:"/static/images/fast_icon.svg",iconHeight:27},{name:"cross_platform",icon:"/static/images/cross_platform_icon.svg",iconHeight:33}],m=(e,t)=>{let{intl:a}=t;return(0,s.jsxs)("main",{className:l().root,children:[(0,s.jsx)(r.xu,{className:l().preview,fill:"black",children:(0,s.jsx)("div",{className:l().m_width,children:(0,s.jsxs)("div",{className:l().preview_content,children:[(0,s.jsx)(r.ZT,{type:"h1",color:"light_grey",className:l().preview_title,children:a.getText("main.preview.title")}),(0,s.jsx)(r.ZT,{type:"b1",color:"light_grey",children:a.getText("main.preview.text")})]})})}),(0,s.jsx)("div",{className:l().facts,children:(0,s.jsx)("div",{className:l().m_width,children:(0,s.jsx)("ul",{className:l().facts_list,children:o.map(e=>(0,s.jsxs)("li",{className:l().facts_item,children:[(0,s.jsx)("div",{className:l().facts_icon_container,children:(0,s.jsx)("img",{src:e.icon,alt:a.getText("main.facts.".concat(e.name,".title")),className:l().facts_icon,style:{height:e.iconHeight}})}),(0,s.jsx)(r.ZT,{type:"h4",className:l().facts_title,children:a.getText("main.facts.".concat(e.name,".title"))}),(0,s.jsx)(r.ZT,{type:"b2",color:"dark_grey",children:a.getText("main.facts.".concat(e.name,".text"))})]},e.name))})})})]})};m.contextTypes={intl:c().shape({getText:c().func})};var d=a(7825),h=a.n(d);let p=e=>{let{name:t,children:a}=e;return(0,s.jsxs)("div",{className:h().root,children:[(0,s.jsx)(r.ZT,{type:"c1",color:"grey",className:h().group_name,children:t}),(0,s.jsx)("div",{className:h().list,children:a})]})};var x=a(1664),u=a.n(x),g=a(687),f=a(3259),v=a.n(f);let j=e=>{let{name:t,type:a,path:n,style:i,searchValue:c}=e;return(0,s.jsx)(u(),{href:"/examples/".concat(n),legacyBehavior:!0,children:(0,s.jsxs)("a",{style:i,className:v().root,children:[(0,s.jsx)(r.ZT,{type:"c1",color:"grey",children:a}),(0,s.jsx)(r.ZT,{type:"b2",color:"dark_grey",children:(0,s.jsx)(g.y$,{text:t,searchValue:c})})]})})};var y=a(1103),N=a.n(y);let w=(e,t)=>{let{config:a}=e,{intl:i}=t,[c,_]=(0,n.useState)(""),l=e=>({animationDelay:"".concat(e/20,"s")}),o=a;return c&&(o=a.map(e=>({...e,examples:e.examples.filter(e=>i.getText("operations",void 0,e.path).toLowerCase().includes(c.toLowerCase()))}))),(0,s.jsx)("div",{className:N().root,children:(0,s.jsxs)("div",{className:N().m_width,children:[(0,s.jsxs)(r.xu,{className:N().header,stroke:"grey",strokeOpacity:.15,strokeType:"bottom",children:[(0,s.jsx)(r.ZT,{type:"h3",children:i.getText("actions.examples")}),(0,s.jsx)(r.nv,{placeholder:i.getText("actions.search"),className:N().search_field,onChange:e=>{_(e.target.value)}})]}),(0,s.jsx)("div",{className:N().items_wrapper,children:(()=>{let e=!1,t=o.map(t=>t.examples.length?(e=!0,(0,s.jsx)(p,{name:t.name,children:t.examples.map((e,t)=>(0,s.jsx)(j,{name:i.getText("operations",void 0,e.path),type:i.getText("type",void 0,e.type),path:e.path,style:l(t),searchValue:c},e.path))},t.key)):null);return e?t:null})()||(0,s.jsx)(r.ZT,{type:"h5",align:"center",className:N().not_found,children:i.getText("actions.nothingFound")})})]})})};w.contextTypes={intl:c().shape({getText:c().func})};var T=a(724),k=a.n(T),b=a(43),E=a.n(b),Z=a(4490),C=a.n(Z),H=a(4184),L=a.n(H),R=a(5453),B=a.n(R);let O=e=>{let{data:t,id:a}=e;return(0,s.jsxs)("main",{className:B().main,children:[(0,s.jsx)("div",{className:B().m_width,children:(0,s.jsx)("div",{className:L()(B().doc,"b1","text_black"),children:(0,s.jsx)(k(),{allowDangerousHtml:!0,children:t,plugins:[E(),C()],renderers:{code:e=>{let{value:t,language:a}=e;return(0,s.jsx)(r.TU,{lang:a,children:t})},heading:e=>{let{level:t,children:i,node:c}=e,{value:r,children:_}=c.children.find(e=>{let{type:t}=e;return"text"===t||"strong"===t}),l=r||_[0].value;return 6===t?(0,s.jsx)("h6",{className:L()("text_grey","c1",B()[l.toLowerCase()]),children:i}):n.createElement("h".concat(t),{},(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)("a",{className:B().anchor_link,id:l.replace(/ /g,"")}),(0,s.jsx)(u(),{legacyBehavior:!0,href:{hash:l.replace(/ /g,""),pathname:"/docs/[id]",query:{id:a}},children:(0,s.jsx)("a",{"aria-hidden":!0,"aria-label":"anchor",className:B().anchor_link_style,children:(0,s.jsx)("img",{src:"/static/images/anchor.svg"})})}),i]}))},tableHead:()=>null,link:e=>{let{href:t,children:a}=e;return(0,s.jsx)(u(),{href:t,legacyBehavior:!0,children:(0,s.jsx)("a",{className:"text_primary",children:a})})},inlineCode:e=>{let{children:t}=e;return(0,s.jsx)("code",{className:L()("fill_light_grey",B().doc_code),children:t})}}})})}),(0,s.jsx)(g.$_,{})]})};O.contextTypes={intl:c().shape({getText:c().func})}},5453:function(e){e.exports={main:"docs_main__aONER",m_width:"docs_m_width__Lvhe1",anchor_link:"docs_anchor_link__1tZrt",anchor_link_style:"docs_anchor_link_style__uRvtv",doc:"docs_doc__HB0hL",doc_code:"docs_doc_code__926_U",params:"docs_params__beB_9",methods:"docs_methods__AVdgC",description:"docs_description__0gKUd",example:"docs_example__RWNEb"}},3259:function(e){e.exports={root:"example_item_root__pz2QL",opacity:"example_item_opacity__1sciR"}},7825:function(e){e.exports={root:"group_item_root__pQv_R",group_name:"group_item_group_name__na5Fd",list:"group_item_list__yv6lU"}},1103:function(e){e.exports={root:"examples_root__aylQs",m_width:"examples_m_width__DrPqV",items_wrapper:"examples_items_wrapper__5j5f_",header:"examples_header__GZ6Ed",not_found:"examples_not_found__BNWde",search_field:"examples_search_field__Maxkj"}},5361:function(e){e.exports={root:"main_root__K1hvP",preview:"main_preview__Ez_Ka","reverse-pulse-opacity":"main_reverse-pulse-opacity__ItkaT","pulse-opacity":"main_pulse-opacity__3tFeX",preview_content:"main_preview_content___RNhF",preview_title:"main_preview_title__CsahM",m_width:"main_m_width___1DR_",facts:"main_facts__x5G2r",facts_list:"main_facts_list__m0LgO",facts_item:"main_facts_item__4LkRY",facts_icon_container:"main_facts_icon_container__Y5P2v",facts_icon:"main_facts_icon__MHCZ4",facts_title:"main_facts_title__8QV48"}}},function(e){e.O(0,[42,888,774,179],function(){return e(e.s=8312)}),_N_E=e.O()}]);