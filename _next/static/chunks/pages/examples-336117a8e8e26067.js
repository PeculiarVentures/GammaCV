(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[560],{5428:function(e,t,a){(window.__NEXT_P=window.__NEXT_P||[]).push(["/examples",function(){return a(9657)}])},9657:function(e,t,a){"use strict";a.r(t),a.d(t,{__N_SSG:function(){return r}});var s=a(5893);a(7294);var n=a(9008),i=a.n(n),c=a(2217),r=!0;t.default=e=>{let{config:t}=e,a="Examples - GammaCV";return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(i(),{children:[(0,s.jsx)("title",{children:a}),(0,s.jsx)("meta",{name:"twitter:title",content:a},"twitter:title"),(0,s.jsx)("meta",{property:"og:title",content:a},"og:title")]}),(0,s.jsx)(c.p4,{config:t})]})}},2217:function(e,t,a){"use strict";a.d(t,{kO:function(){return F},p4:function(){return w},hE:function(){return m}});var s=a(5893),n=a(7294),i=a(5697),c=a.n(i),r=a(8995),l=a(6955),_=a.n(l);let o=[{name:"compact",icon:"/static/images/compact_icon.svg",iconHeight:39},{name:"fast",icon:"/static/images/fast_icon.svg",iconHeight:27},{name:"cross_platform",icon:"/static/images/cross_platform_icon.svg",iconHeight:33}],m=(e,t)=>{let{intl:a}=t;return(0,s.jsxs)("main",{className:_().root,children:[(0,s.jsx)(r.xu,{className:_().preview,fill:"black",children:(0,s.jsx)("div",{className:_().m_width,children:(0,s.jsxs)("div",{className:_().preview_content,children:[(0,s.jsx)(r.ZT,{type:"h1",color:"light_grey",className:_().preview_title,children:a.getText("main.preview.title")}),(0,s.jsx)(r.ZT,{type:"b1",color:"light_grey",children:a.getText("main.preview.text")})]})})}),(0,s.jsx)("div",{className:_().facts,children:(0,s.jsx)("div",{className:_().m_width,children:(0,s.jsx)("ul",{className:_().facts_list,children:o.map(e=>(0,s.jsxs)("li",{className:_().facts_item,children:[(0,s.jsx)("div",{className:_().facts_icon_container,children:(0,s.jsx)("img",{src:e.icon,alt:a.getText("main.facts.".concat(e.name,".title")),className:_().facts_icon,style:{height:e.iconHeight}})}),(0,s.jsx)(r.ZT,{type:"h4",className:_().facts_title,children:a.getText("main.facts.".concat(e.name,".title"))}),(0,s.jsx)(r.ZT,{type:"b2",color:"dark_grey",children:a.getText("main.facts.".concat(e.name,".text"))})]},e.name))})})})]})};m.contextTypes={intl:c().shape({getText:c().func})};var d=a(5209),h=a.n(d);let p=e=>{let{name:t,children:a}=e;return(0,s.jsxs)("div",{className:h().root,children:[(0,s.jsx)(r.ZT,{type:"c1",color:"grey",className:h().group_name,children:t}),(0,s.jsx)("div",{className:h().list,children:a})]})};var x=a(1664),u=a.n(x),g=a(3542),f=a(1689),j=a.n(f);let v=e=>{let{name:t,type:a,path:n,style:i,searchValue:c}=e;return(0,s.jsx)(u(),{href:"/examples/".concat(n),legacyBehavior:!0,children:(0,s.jsxs)("a",{style:i,className:j().root,children:[(0,s.jsx)(r.ZT,{type:"c1",color:"grey",children:a}),(0,s.jsx)(r.ZT,{type:"b2",color:"dark_grey",children:(0,s.jsx)(g.y$,{text:t,searchValue:c})})]})})};var y=a(4422),N=a.n(y);let w=(e,t)=>{let{config:a}=e,{intl:i}=t,[c,l]=(0,n.useState)(""),_=e=>({animationDelay:"".concat(e/20,"s")}),o=a;return c&&(o=a.map(e=>({...e,examples:e.examples.filter(e=>i.getText("operations",void 0,e.path).toLowerCase().includes(c.toLowerCase()))}))),(0,s.jsx)("div",{className:N().root,children:(0,s.jsxs)("div",{className:N().m_width,children:[(0,s.jsxs)(r.xu,{className:N().header,stroke:"grey",strokeOpacity:.15,strokeType:"bottom",children:[(0,s.jsx)(r.ZT,{type:"h3",children:i.getText("actions.examples")}),(0,s.jsx)(r.nv,{placeholder:i.getText("actions.search"),className:N().search_field,onChange:e=>{l(e.target.value)}})]}),(0,s.jsx)("div",{className:N().items_wrapper,children:(()=>{let e=!1,t=o.map(t=>t.examples.length?(e=!0,(0,s.jsx)(p,{name:t.name,children:t.examples.map((e,t)=>(0,s.jsx)(v,{name:i.getText("operations",void 0,e.path),type:i.getText("type",void 0,e.type),path:e.path,style:_(t),searchValue:c},e.path))},t.key)):null);return e?t:null})()||(0,s.jsx)(r.ZT,{type:"h5",align:"center",className:N().not_found,children:i.getText("actions.nothingFound")})})]})})};w.contextTypes={intl:c().shape({getText:c().func})};var T=a(724),k=a.n(T),b=a(43),E=a.n(b),Z=a(4490),C=a.n(Z),H=a(4184),L=a.n(H),R=a(2147),B=a.n(R);let F=e=>{let{data:t,id:a}=e;return(0,s.jsxs)("main",{className:B().main,children:[(0,s.jsx)("div",{className:B().m_width,children:(0,s.jsx)("div",{className:L()(B().doc,"b1","text_black"),children:(0,s.jsx)(k(),{allowDangerousHtml:!0,children:t,plugins:[E(),C()],renderers:{code:e=>{let{value:t,language:a}=e;return(0,s.jsx)(r.TU,{lang:a,children:t})},heading:e=>{let{level:t,children:i,node:c}=e,{value:r,children:l}=c.children.find(e=>{let{type:t}=e;return"text"===t||"strong"===t}),_=r||l[0].value;return 6===t?(0,s.jsx)("h6",{className:L()("text_grey","c1",B()[_.toLowerCase()]),children:i}):n.createElement("h".concat(t),{},(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)("a",{className:B().anchor_link,id:_.replace(/ /g,"")}),(0,s.jsx)(u(),{legacyBehavior:!0,href:{hash:_.replace(/ /g,""),pathname:"/docs/[id]",query:{id:a}},children:(0,s.jsx)("a",{"aria-hidden":!0,"aria-label":"anchor",className:B().anchor_link_style,children:(0,s.jsx)("img",{src:"/static/images/anchor.svg"})})}),i]}))},tableHead:()=>null,link:e=>{let{href:t,children:a}=e;return(0,s.jsx)(u(),{href:t,legacyBehavior:!0,children:(0,s.jsx)("a",{className:"text_primary",children:a})})},inlineCode:e=>{let{children:t}=e;return(0,s.jsx)("code",{className:L()("fill_light_grey",B().doc_code),children:t})}}})})}),(0,s.jsx)(g.$_,{})]})};F.contextTypes={intl:c().shape({getText:c().func})}},2147:function(e){e.exports={main:"docs_main__aONER",m_width:"docs_m_width__Lvhe1",anchor_link:"docs_anchor_link__1tZrt",anchor_link_style:"docs_anchor_link_style__uRvtv",doc:"docs_doc__HB0hL",doc_code:"docs_doc_code__926_U",params:"docs_params__beB_9",methods:"docs_methods__AVdgC",description:"docs_description__0gKUd",example:"docs_example__RWNEb"}},1689:function(e){e.exports={root:"example_item_root__pz2QL",opacity:"example_item_opacity__1sciR"}},5209:function(e){e.exports={root:"group_item_root__pQv_R",group_name:"group_item_group_name__na5Fd",list:"group_item_list__yv6lU"}},4422:function(e){e.exports={root:"examples_root__aylQs",m_width:"examples_m_width__DrPqV",items_wrapper:"examples_items_wrapper__5j5f_",header:"examples_header__GZ6Ed",not_found:"examples_not_found__BNWde",search_field:"examples_search_field__Maxkj"}},6955:function(e){e.exports={root:"main_root__K1hvP",preview:"main_preview__Ez_Ka","reverse-pulse-opacity":"main_reverse-pulse-opacity__ItkaT","pulse-opacity":"main_pulse-opacity__3tFeX",preview_content:"main_preview_content___RNhF",preview_title:"main_preview_title__CsahM",m_width:"main_m_width___1DR_",facts:"main_facts__x5G2r",facts_list:"main_facts_list__m0LgO",facts_item:"main_facts_item__4LkRY",facts_icon_container:"main_facts_icon_container__Y5P2v",facts_icon:"main_facts_icon__MHCZ4",facts_title:"main_facts_title__8QV48"}}},function(e){e.O(0,[42,888,774,179],function(){return e(e.s=5428)}),_N_E=e.O()}]);