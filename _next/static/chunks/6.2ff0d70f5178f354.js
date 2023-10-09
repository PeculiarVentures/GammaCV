(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[6],{2684:function(e){var t;e.exports=(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},function(e){var s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;if("function"!=typeof e)throw Error("Callback is not a function");if("number"!=typeof s||isNaN(s)||s<0||s===1/0)throw Error("refreshRate should be a positive number! e.g. 2 (fps)");var a=-1,r=0,i=void 0,o=0,n=0,l=("undefined"==typeof performance?"undefined":t(performance))==="object"&&"now"in performance?performance.now.bind(performance):Date.now.bind(Date);return function(){if(a>=r){var t=l();void 0===i&&(i=t);var c=t-i;if(c>0){var p=a>0?1e3/(c/a):0;n=Math.abs(o-p),s>0?(r=.5*r+p/s*.5)<0&&(r=0):r=0;var h={fps:p,jitter:n,elapsed:c,frames:a,trigger:r};i=t,o=p,a=0,e(h)}else r*=2}a++}})},7006:function(e,t,s){"use strict";s.r(t),s.d(t,{default:function(){return ExamplePage}});var a=s(5893),r=s(7294),i=s(8995),o=s(1664),n=s.n(o),l=s(4184),c=s.n(l),p=s(2684),h=s.n(p),_=s(5697),m=s.n(_),d=s(6243),u=class{cancel(){this.timeout&&clearTimeout(this.timeout)}activate(){for(var e=arguments.length,t=Array(e),s=0;s<e;s++)t[s]=arguments[s];this.cancel(),this.timeout=setTimeout(()=>{this.callback&&this.callback(...t)},this.delay)}constructor(e,t){this.timeout=null,this.delay=e,this.callback=t}};let getDeviceInfo=()=>{let{innerWidth:e,innerHeight:t}=window,s="desktop";return e<=1024&&e>768&&t>375?s="tablet":(e<=768||e<=812&&t<=375)&&(s="mobile"),{type:s,width:e,height:t}};var x=s(3411),g=s.n(x);let ParamsWrapper=class ParamsWrapper extends r.Component{render(){let{params:e,onReset:t,isMobile:s,isParamsChanged:r}=this.props,{intl:o}=this.context;if(e){let n=Object.keys(e);return(0,a.jsxs)(i.xu,{borderRadius:s?0:8,stroke:s?"":"grey_2",fill:s?"black":"",fillOpacity:s?.7:1,className:g().controller_wrapper,children:[(0,a.jsxs)(i.xu,{stroke:s?"light_grey":"grey_2",strokeType:"bottom",strokeOpacity:s?.19:1,className:g().controller_header_wrapper,children:[(0,a.jsx)(i.ZT,{type:"h4",className:g().controller_header_title,children:o.getText("example.params")}),(0,a.jsxs)(i.zx,{onClick:t,bgType:"clear",size:"small",className:g().reset,disabled:!r,children:[(0,a.jsx)("div",{className:g().reset_icon,children:s?this.icons.resetMobile:this.icons.reset}),(0,a.jsx)(i.ZT,{type:"b1",color:"grey",className:g().reset_text,children:o.getText("example.reset")})]})]}),(0,a.jsx)("div",{className:g().params_block,children:n.map(t=>{let r=this.getParamName(e[t]);return(0,a.jsxs)(i.xu,{stroke:s?"":"grey_2",strokeType:"bottom",className:g().params_block_section,children:[(0,a.jsx)(i.ZT,{type:"c1",color:"grey",className:g().params_title,children:r}),this.renderParam(t)]},t)})})]})}return null}constructor(...e){super(...e),this.icons={constant:(0,a.jsx)("img",{src:"/static/images/constant_icon.svg",alt:"Constant icon"}),uniform:(0,a.jsx)("img",{src:"/static/images/uniform_icon.svg",alt:"Uniform icon"}),reset:(0,a.jsx)("img",{src:"/static/images/reset_icon.svg",alt:"Reset icon"}),resetMobile:(0,a.jsx)("img",{src:"/static/images/reset_icon_mobile.svg",alt:"Reset icon"})},this.getParamName=e=>{let{params:t}=this.props;if(e.name)return e.name;let s=Object.keys(t);return s[0]},this.renderParam=e=>{let t=[],{params:s,paramsValue:r,handleChangeState:o,isMobile:n}=this.props,l=s[e],c=r[e],p=Object.keys(l);return p.forEach(s=>{if("name"===s)return null;let r=l[s],{name:p,type:h}=r;if("values"in r){let{values:l}=r;t.push((0,a.jsxs)("div",{className:g().params_block_select_wrapper,children:[(0,a.jsx)("div",{className:g().params_block_icon,children:this.icons[h]}),(0,a.jsx)(i.ZT,{type:"b3",color:n?"white":"dark",className:g().params_block_title,children:p}),(0,a.jsx)("div",{className:g().params_block_select,children:(0,a.jsx)(i.Ph,{bgType:"fill",color:"light_grey",textColor:"dark",value:c[s],onChange:t=>o(e,s,t.target.value),defaultValue:l[0].value,options:l.map(e=>{let{name:t,value:s}=e;return{label:t,value:s}})})})]},p))}else{let{step:l,min:_,max:m,default:d}=r,u=n?"white":"dark_grey";t.push((0,a.jsxs)("div",{className:g().params_block_wrapper,children:[(0,a.jsx)("div",{className:g().params_block_icon,children:this.icons[h]}),(0,a.jsx)(i.ZT,{type:"b3",color:u,className:g().params_block_title,children:p}),(0,a.jsx)("div",{className:g().params_block_slider,children:(0,a.jsx)(i.iR,{progressColor:"dark_grey",color:"dark_grey",value:+c[s],step:l,defaultValue:d,min:_,max:m,onChange:(t,a)=>o(e,s,a)})}),(0,a.jsx)(i.ZT,{type:"h5",color:u,className:g().params_block_count,children:c[s]})]},p))}return null}),t}}};ParamsWrapper.contextTypes={intl:m().shape({getText:m().func})};var f=s(2702),b=s.n(f);let ExamplePage=class ExamplePage extends r.Component{UNSAFE_componentWillMount(){try{navigator.mediaDevices.getUserMedia({video:!0}).then(()=>this.setState({isCameraAccess:!0})).catch(()=>this.setState({error:"PermissionDenied"}))}catch(e){this.setState({error:"PermissionDenied"})}}componentDidMount(){window.addEventListener("resize",this.onResize);let{error:e}=this.state;e||this.start()}componentWillUnmount(){window.removeEventListener("resize",this.onResize);let{error:e}=this.state;e||this.stop()}handlePrepareParams(){let e={},{data:t}=this.props,{params:s}=t;if(!s)return e;let a=Object.keys(s);for(let t=0;t<a.length;t+=1){let r=a[t],i=s[r],o=Object.keys(i);for(let t=0;t<o.length;t+=1){let s=o[t],a=i[s];if("name"!==s){let t=a.default;"number"!=typeof t&&(t=a.values[0].value),e[r]={...e[r],[s]:t}}}}return e}renderStartStopButton(){let{isPlaying:e}=this.state,t=e?(0,a.jsx)("img",{src:"/static/images/pause_icon.svg",alt:"Pause icon"}):(0,a.jsx)("img",{src:"/static/images/play_icon.svg",alt:"Play icon"});return(0,a.jsx)("span",{ref:this.refStopStartButton,className:b().stop_play_button,children:(0,a.jsx)("div",{className:c()(b().stop_play_icon,{[b().m_visible]:!e}),children:t})})}render(){let{exampleName:e,data:t}=this.props,{error:s,isCameraAccess:r,canvas:o,params:n,isPlaying:l,isLoading:p,showParams:h,isParamsChanged:_,device:m}=this.state,{intl:d}=this.context,u="mobile"===m.type;if(!s&&!r)return(0,a.jsx)("div",{className:b().root_example,children:(0,a.jsx)(i.D8,{size:40,className:b().loading})});if(u&&m.height<m.width)return(0,a.jsx)(i.xu,{fill:"primary",className:b().to_portrait,children:(0,a.jsx)(i.ZT,{type:"h4",color:"light_grey",children:d.getText("example.toPortrait")})});if(s){let e=(0,a.jsx)("img",{src:"/static/images/error_icon.svg",alt:"Error icon"});return(0,a.jsx)("div",{className:b().root_example,children:(0,a.jsxs)("div",{className:b().error_wrapper,children:[(0,a.jsx)("div",{className:b().error_icon,children:e}),"NotSupported"===s?this.renderNotSupportedCase():this.renderNoAccessCase()]})})}return(0,a.jsx)("div",{className:b().root_example,children:(0,a.jsxs)("div",{className:b().example_wrapper,children:[(!u||!h)&&(0,a.jsxs)("div",{className:b().top_title_wrapper,children:[(0,a.jsx)(i.ZT,{type:u?"h4":"h3",color:"black",className:b().top_title_text,children:d.getText("operations",void 0,e)}),(0,a.jsxs)(i.ZT,{type:u?"h4":"h3",color:"grey",className:c()({[b().top_title_fps]:!0,[b().hidden_fps]:!l}),children:["FPS:"," ",(0,a.jsx)("span",{ref:this.refFps})]})]}),(0,a.jsxs)("div",{className:b().content_wrapper,children:[(0,a.jsxs)(i.xu,{borderRadius:u?0:8,stroke:u?"":"grey_2",fill:u?"":"light_grey",className:b().canvas_wrapper,children:[(0,a.jsx)("canvas",{ref:this.canvasRef,width:o.width,height:o.height,className:b().canvas}),(0,a.jsx)("div",{className:c()({[b().loading_wrapper]:!0,[b().show_loading]:p}),children:(0,a.jsx)(i.D8,{size:40,className:b().loading})}),(0,a.jsx)("button",{type:"button","aria-label":"Overlay",onClick:this.handleStartStop,onMouseEnter:()=>{this.refStopStartButton.current.style.visibility="visible"},onMouseLeave:()=>{this.refStopStartButton.current.style.visibility="hidden"},className:c()(b().canvas_overlay,"fill_black")}),this.renderStartStopButton()]}),u&&t.params&&(0,a.jsxs)(i.zx,{onClick:()=>this.setState({showParams:!h}),bgType:"clear",size:"small",className:b().show_params,children:[(0,a.jsx)("div",{className:b().show_params_icon,children:h?(0,a.jsx)("img",{src:"/static/images/cross_icon.svg",alt:"Cross icon",className:b().cross_icon}):(0,a.jsx)("img",{src:"/static/images/params_icon.svg",alt:"Params icon",className:b().params_icon})}),(0,a.jsx)(i.ZT,{type:"b1",color:"light_grey",className:b().show_params_text,children:h?d.getText("example.close"):d.getText("example.params")})]}),h&&(0,a.jsx)(ParamsWrapper,{params:t.params,onReset:this.handleReset,handleChangeState:this.handleChangeState,paramsValue:{...n},isMobile:u,isParamsChanged:_})]})]})})}constructor(e){var t;super(e),t=this,this.timeout=null,this.timeoutRequestAnimation=null,this.canvasRef=r.createRef(),this.refFps=r.createRef(),this.refStopStartButton=r.createRef(),this.onResize=()=>{let{error:e}=this.state,t=getDeviceInfo();this.setState({device:t,showParams:"mobile"!==t.type}),e||this.lazyUpdate.activate()},this.onResizeEnd=()=>{this.stop(!1),this.setState({canvas:this.getSize()},()=>{this.init(this.props),this.start()})},this.getSize=()=>{let{type:e,width:t,height:s}=getDeviceInfo();if("mobile"===e){let e=function(e,t,s){if(t){let a=t/e;if(a<=s)return{height:a,width:t}}return{width:e*s,height:s}}(t/(s-60),Math.min(t,600),Math.min(s,600));return{width:Math.floor(e.width),height:Math.floor(e.height)}}return{width:500,height:384}},this.init=e=>{let{canvas:t}=this.state,{width:s,height:a}=t;try{if(this.imgInput=new d.es("uint8",[a,s,4]),this.sess=new d.z_,this.stream=new d.U8(s,a),e.data.init&&(this.opContext=e.data.init(this.op,this.sess,this.params)),this.op=e.data.op(this.imgInput,this.params,this.opContext),!(this.op instanceof d.OX))throw Error("Error in ".concat(e.exampleName," example: function <op> must return Operation"));this.sess.init(this.op),this.outputTensor=d.He(this.op)}catch(e){this.setState({error:"NotSupported"})}},this.tick=e=>{this.sess.runOp(this.op,e,this.outputTensor),this.canvasRef.current&&d.t4(this.canvasRef.current,this.outputTensor)},this.start=()=>{try{this.stream.start().catch(()=>{this.stop(),this.setState({error:"PermissionDenied"})}),this.timeoutRequestAnimation=window.requestAnimationFrame(this.tick),this.setState({isPlaying:!0}),!this.loading&&this.checkRerender(this.stream.getImageBuffer("uint8"))&&(this.setState({isLoading:!0}),this.loading=!0)}catch(e){this.stop(),this.setState({error:"NotSupported"})}},this.stop=function(){let e=!(arguments.length>0)||void 0===arguments[0]||arguments[0];t.stream&&t.stream.stop();let{isPlaying:s}=t.state;e&&s&&t.sess.destroy(),window.cancelAnimationFrame(t.timeoutRequestAnimation),t.setState({isPlaying:!1})},this.checkRerender=e=>{let t=!0;for(let s=0;s<e.length;s+=16)0!==e[s]&&(t=!1);return t},this.onChangeParams=()=>{let{params:e}=this.state;this.params=e,this.stop(!1),this.init(this.props),this.start()},this.handleStartStop=()=>{let{isPlaying:e,params:t}=this.state;e?this.stop(!1):(this.params=t,this.start())},this.trottleUpdate=()=>{clearTimeout(this.timeout),this.timeout=setTimeout(()=>{this.onChangeParams()},1e3)},this.handleChangeState=(e,t,s)=>{this.setState(a=>{let{params:r}=a;return{params:{...r,[e]:{...r[e],[t]:s}},isParamsChanged:!0}});let{data:a}=this.props,{type:r}=a.params[e][t];if("constant"===r)this.trottleUpdate();else{let{params:e}=this.state,{operation:a}=this.sess,r=Object.keys(a);this.params=e;for(let e=0;e<r.length;e+=1){let i=r[e];if(a[i].uniform){let e=Object.keys(a[i].uniform);for(let r=0;r<e.length;r+=1){let o=e[r];o===t&&a[i].uniform[o].set(s)}}}}},this.handleReset=()=>{this.setState({params:this.handlePrepareParams(),isParamsChanged:!1},this.onChangeParams)},this.renderNoAccessCase=()=>{let{device:e}=this.state,{intl:t}=this.context,s="mobile"===e.type;return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)("div",{className:b().error_text,children:(0,a.jsx)(i.ZT,{type:s?"h4":"h3",color:"black",align:"center",children:t.getText("example.noAccess")})}),(0,a.jsx)(i.zx,{href:window.location.href,size:"large",color:"primary",className:b().error_button,children:t.getText("example.tryAgain")})]})},this.renderNotSupportedCase=()=>{let{device:e}=this.state,{intl:t}=this.context,s="mobile"===e.type;return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)("div",{className:b().error_text,children:(0,a.jsx)(i.ZT,{type:s?"h4":"h3",color:"black",align:"center",children:t.getText("example.dontSupport")})}),(0,a.jsx)(n(),{href:"/examples",legacyBehavior:!0,children:(0,a.jsx)(i.zx,{size:"large",color:"primary",className:b().error_button,children:t.getText("example.tryAnother")})})]})},this.params=this.handlePrepareParams();let s=getDeviceInfo();this.state={isPlaying:!1,exampleInitialized:!1,canvas:this.getSize(),params:this.params,error:"",isCameraAccess:!1,isLoading:!0,showParams:"mobile"!==s.type,isParamsChanged:!1,device:s},this.lazyUpdate=new u(500,this.onResizeEnd),this.init(e),this.frame=0,this.loading=!1;let o=h()(e=>{this.refFps.current&&(this.refFps.current.innerHTML=e.fps.toFixed(0))},3),l="function"==typeof e.data.tick?e.data.tick:this.tick;this.tick=()=>{o();let{exampleInitialized:e}=this.state;if(e||this.setState({exampleInitialized:!0}),this.stream.getImageBuffer(this.imgInput),this.loading&&!this.checkRerender(this.imgInput.data))this.setState({isLoading:!1}),this.loading=!1;else if(!this.loading&&this.canvasRef.current){try{l.apply(this,[this.frame,{canvas:this.canvasRef.current,params:this.params,operation:this.op,session:this.sess,input:this.imgInput,output:this.outputTensor,context:this.opContext}])}catch(e){this.stop(),this.setState({error:"NotSupported"})}this.frame+=1}this.timeoutRequestAnimation=window.requestAnimationFrame(this.tick)}}};ExamplePage.contextTypes={intl:m().shape({getText:m().func})}},2702:function(e){e.exports={root_example:"example_root_example__2JqSx",example_wrapper:"example_example_wrapper__Y_Ujd",top_title_wrapper:"example_top_title_wrapper__MIe_S",top_title_text:"example_top_title_text__KXCnC",top_title_fps:"example_top_title_fps__5pfKk",hidden_fps:"example_hidden_fps__6T6I_",content_wrapper:"example_content_wrapper__gzLOI",canvas_wrapper:"example_canvas_wrapper__ztLvd",canvas:"example_canvas__A_fgb",canvas_overlay:"example_canvas_overlay__9Fw2N",loading_wrapper:"example_loading_wrapper__pO9LX",stop_play_button:"example_stop_play_button___oaou",stop_play_icon:"example_stop_play_icon__Z7D7Y",to_portrait:"example_to_portrait__u_oo4",error_wrapper:"example_error_wrapper__bQ3CS",error_icon:"example_error_icon__nsJa_",error_text:"example_error_text__emZin",error_button:"example_error_button__oit4e",loading:"example_loading__wf1Gf",show_loading:"example_show_loading__e_Ryw",show_params:"example_show_params__XaIOJ",show_params_icon:"example_show_params_icon__LGTvz",show_params_text:"example_show_params_text__gctCk",params_icon:"example_params_icon__wjLsc",cross_icon:"example_cross_icon__UFqX7",m_visible:"example_m_visible__U0Hp1"}},3411:function(e){e.exports={controller_wrapper:"params_controller_wrapper__FrVxo",controller_header_wrapper:"params_controller_header_wrapper__L7bVA",reset:"params_reset__iOvp4",reset_icon:"params_reset_icon__lAgeo",reset_text:"params_reset_text__WuWy9",params_title:"params_params_title__oXjX7",params_block:"params_params_block__9zVMZ",params_block_wrapper:"params_params_block_wrapper__oa4Cf",params_block_select_wrapper:"params_params_block_select_wrapper__f3XSd",params_block_section:"params_params_block_section__lVn8O",params_block_icon:"params_params_block_icon__HWkrJ",params_block_title:"params_params_block_title__JofTZ",params_block_slider:"params_params_block_slider__VT209",params_block_select:"params_params_block_select___1wZN",params_block_count:"params_params_block_count__nvv12",controller_header_title:"params_controller_header_title__RtL1u"}}}]);