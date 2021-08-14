(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[685],{169:function(e){e.exports=function(){"use strict";var e="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};function t(t){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;if("function"!==typeof t)throw new Error("Callback is not a function");if("number"!==typeof r||isNaN(r)||r<0||r===1/0)throw new Error("refreshRate should be a positive number! e.g. 2 (fps)");var a=-1,n=0,s=void 0,o=0,i=0,c="object"===("undefined"===typeof performance?"undefined":e(performance))&&"now"in performance?performance.now.bind(performance):Date.now.bind(Date);return function(){if(a>=n){var e=c();void 0===s&&(s=e);var l=e-s;if(l>0){var p=a>0?1e3/(l/a):0;i=Math.abs(o-p),r>0?(n=.5*n+p/r*.5)<0&&(n=0):n=0;var m={fps:p,jitter:i,elapsed:l,frames:a,trigger:n};s=e,o=p,a=0,t(m)}else n*=2}a++}}return t}()},2685:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return M}});var a=r(5893);function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function s(e,t){for(var r=0;r<t.length;r++){var a=t[r];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}function o(e,t,r){return t&&s(e.prototype,t),r&&s(e,r),e}function i(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function c(e,t){return(c=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function l(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&c(e,t)}function p(e){return(p="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function m(e,t){return!t||"object"!==p(t)&&"function"!==typeof t?i(e):t}function u(e){return(u=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var _=r(2809),f=r(7294),d=r(3404),h=r(1664),v=r(4184),y=r.n(v),x=r(169),g=r.n(x),b=r(5697),w=r.n(b),j=r(6243),k=function(){function e(t,r){n(this,e),(0,_.Z)(this,"delay",void 0),(0,_.Z)(this,"callback",void 0),(0,_.Z)(this,"timeout",null),this.delay=t,this.callback=r}return o(e,[{key:"cancel",value:function(){this.timeout&&clearTimeout(this.timeout)}},{key:"activate",value:function(){for(var e=this,t=arguments.length,r=new Array(t),a=0;a<t;a++)r[a]=arguments[a];this.cancel(),this.timeout=setTimeout((function(){e.callback&&e.callback.apply(e,r)}),this.delay)}}]),e}();function N(e,t){return e*t}function S(e,t){return t/e}var Z=function(){var e=window,t=e.innerWidth,r=e.innerHeight,a="desktop";return t<=1024&&t>768&&r>375?a="tablet":(t<=768||t<=812&&r<=375)&&(a="mobile"),{type:a,width:t,height:r}},P=r(6761),T=r.n(P);function R(e){var t=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,a=u(e);if(t){var n=u(this).constructor;r=Reflect.construct(a,arguments,n)}else r=a.apply(this,arguments);return m(this,r)}}var C=function(e){l(r,e);var t=R(r);function r(){var e;n(this,r);for(var s=arguments.length,o=new Array(s),c=0;c<s;c++)o[c]=arguments[c];return e=t.call.apply(t,[this].concat(o)),(0,_.Z)(i(e),"icons",{constant:(0,a.jsx)("img",{src:"/static/images/constant_icon.svg",alt:"Constant icon"}),uniform:(0,a.jsx)("img",{src:"/static/images/uniform_icon.svg",alt:"Uniform icon"}),reset:(0,a.jsx)("img",{src:"/static/images/reset_icon.svg",alt:"Reset icon"}),resetMobile:(0,a.jsx)("img",{src:"/static/images/reset_icon_mobile.svg",alt:"Reset icon"})}),(0,_.Z)(i(e),"getParamName",(function(t){var r=e.props.params;return t.name?t.name:Object.keys(r)[0]})),(0,_.Z)(i(e),"renderParam",(function(t){var r=[],n=e.props,s=n.params,o=n.paramsValue,i=n.handleChangeState,c=n.isMobile,l=s[t],p=o[t];return Object.keys(l).forEach((function(n){if("name"===n)return null;var s=l[n],o=s.name,m=s.type;if("values"in s){var u=s.values;r.push((0,a.jsxs)("div",{className:T().params_block_select_wrapper,children:[(0,a.jsx)("div",{className:T().params_block_icon,children:e.icons[m]}),(0,a.jsx)(d.ZT,{type:"b3",color:c?"white":"dark",className:T().params_block_title,children:o}),(0,a.jsx)("div",{className:T().params_block_select,children:(0,a.jsx)(d.Ph,{bgType:"fill",color:"light_grey",textColor:"dark",value:p[n],onChange:function(e){return i(t,n,e.target.value)},defaultValue:u[0].value,options:u.map((function(e){return{label:e.name,value:e.value}}))})})]},o))}else{var _=s.step,f=s.min,h=s.max,v=s.default,y=c?"white":"dark_grey";r.push((0,a.jsxs)("div",{className:T().params_block_wrapper,children:[(0,a.jsx)("div",{className:T().params_block_icon,children:e.icons[m]}),(0,a.jsx)(d.ZT,{type:"b3",color:y,className:T().params_block_title,children:o}),(0,a.jsx)("div",{className:T().params_block_slider,children:(0,a.jsx)(d.iR,{progressColor:"dark_grey",color:"dark_grey",value:+p[n],step:_,defaultValue:v,min:f,max:h,onChange:function(e,r){return i(t,n,r)}})}),(0,a.jsx)(d.ZT,{type:"h5",color:y,className:T().params_block_count,children:p[n]})]},o))}return null})),r})),e}return o(r,[{key:"render",value:function(){var e=this,t=this.props,r=t.params,n=t.onReset,s=t.isMobile,o=t.isParamsChanged,i=this.context.intl;if(r){var c=Object.keys(r);return(0,a.jsxs)(d.xu,{borderRadius:s?0:8,stroke:s?"":"grey_2",fill:s?"black":"",fillOpacity:s?.7:1,className:T().controller_wrapper,children:[(0,a.jsxs)(d.xu,{stroke:s?"light_grey":"grey_2",strokeType:"bottom",strokeOpacity:s?.19:1,className:T().controller_header_wrapper,children:[(0,a.jsx)(d.ZT,{type:"h4",className:T().controller_header_title,children:i.getText("example.params")}),(0,a.jsxs)(d.zx,{onClick:n,bgType:"clear",size:"small",className:T().reset,disabled:!o,children:[(0,a.jsx)("div",{className:T().reset_icon,children:s?this.icons.resetMobile:this.icons.reset}),(0,a.jsx)(d.ZT,{type:"b1",color:"grey",className:T().reset_text,children:i.getText("example.reset")})]})]}),(0,a.jsx)("div",{className:T().params_block,children:c.map((function(t){var n=e.getParamName(r[t]);return(0,a.jsxs)(d.xu,{stroke:s?"":"grey_2",strokeType:"bottom",className:T().params_block_section,children:[(0,a.jsx)(d.ZT,{type:"c1",color:"grey",className:T().params_title,children:n}),e.renderParam(t)]},t)}))})]})}return null}}]),r}(f.Component);(0,_.Z)(C,"contextTypes",{intl:w().shape({getText:w().func})});var O=r(7748),z=r.n(O);function E(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function D(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?E(Object(r),!0).forEach((function(t){(0,_.Z)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):E(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function A(e){var t=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,a=u(e);if(t){var n=u(this).constructor;r=Reflect.construct(a,arguments,n)}else r=a.apply(this,arguments);return m(this,r)}}var M=function(e){l(r,e);var t=A(r);function r(e){var s;n(this,r),s=t.call(this,e),(0,_.Z)(i(s),"timeout",null),(0,_.Z)(i(s),"timeoutRequestAnimation",null),(0,_.Z)(i(s),"lazyUpdate",void 0),(0,_.Z)(i(s),"stream",void 0),(0,_.Z)(i(s),"sess",void 0),(0,_.Z)(i(s),"op",void 0),(0,_.Z)(i(s),"imgInput",void 0),(0,_.Z)(i(s),"outputTensor",void 0),(0,_.Z)(i(s),"frame",void 0),(0,_.Z)(i(s),"opContext",void 0),(0,_.Z)(i(s),"loading",void 0),(0,_.Z)(i(s),"params",void 0),(0,_.Z)(i(s),"canvasRef",f.createRef()),(0,_.Z)(i(s),"refFps",f.createRef()),(0,_.Z)(i(s),"refStopStartButton",f.createRef()),(0,_.Z)(i(s),"onResize",(function(){var e=s.state.error,t=Z();s.setState({device:t,showParams:"mobile"!==t.type}),e||s.lazyUpdate.activate()})),(0,_.Z)(i(s),"onResizeEnd",(function(){s.stop(!1),s.setState({canvas:s.getSize()},(function(){s.init(s.props),s.start()}))})),(0,_.Z)(i(s),"getSize",(function(){var e=Z(),t=e.type,r=e.width,a=e.height;if("mobile"===t){var n=function(e,t,r){if(t){var a=S(e,t);if(a<=r)return{height:a,width:t}}return{width:N(e,r),height:r}}(r/(a-60),Math.min(r,600),Math.min(a,600));return{width:Math.floor(n.width),height:Math.floor(n.height)}}return{width:500,height:384}})),(0,_.Z)(i(s),"init",(function(e){var t=s.state.canvas,r=t.width,a=t.height;try{if(s.imgInput=new j.es("uint8",[a,r,4]),s.sess=new j.z_,s.stream=new j.U8(r,a),e.data.init&&(s.opContext=e.data.init(s.op,s.sess,s.params)),s.op=e.data.op(s.imgInput,s.params,s.opContext),!(s.op instanceof j.OX))throw new Error("Error in ".concat(e.exampleName," example: function <op> must return Operation"));s.sess.init(s.op),s.outputTensor=j.He(s.op)}catch(n){s.setState({error:"NotSupported"})}})),(0,_.Z)(i(s),"tick",(function(e){s.sess.runOp(s.op,e,s.outputTensor),s.canvasRef.current&&j.t4(s.canvasRef.current,s.outputTensor)})),(0,_.Z)(i(s),"start",(function(){try{s.stream.start().catch((function(){s.stop(),s.setState({error:"PermissionDenied"})})),s.timeoutRequestAnimation=window.requestAnimationFrame(s.tick),s.setState({isPlaying:!0}),!s.loading&&s.checkRerender(s.stream.getImageBuffer("uint8"))&&(s.setState({isLoading:!0}),s.loading=!0)}catch(e){s.stop(),s.setState({error:"NotSupported"})}})),(0,_.Z)(i(s),"stop",(function(){var e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];s.stream&&s.stream.stop();var t=s.state.isPlaying;e&&t&&s.sess.destroy(),window.cancelAnimationFrame(s.timeoutRequestAnimation),s.setState({isPlaying:!1})})),(0,_.Z)(i(s),"checkRerender",(function(e){for(var t=!0,r=0;r<e.length;r+=16)0!==e[r]&&(t=!1);return t})),(0,_.Z)(i(s),"onChangeParams",(function(){var e=s.state.params;s.params=e,s.stop(!1),s.init(s.props),s.start()})),(0,_.Z)(i(s),"handleStartStop",(function(){var e=s.state,t=e.isPlaying,r=e.params;t?s.stop(!1):(s.params=r,s.start())})),(0,_.Z)(i(s),"trottleUpdate",(function(){clearTimeout(s.timeout),s.timeout=setTimeout((function(){s.onChangeParams()}),1e3)})),(0,_.Z)(i(s),"handleChangeState",(function(e,t,r){if(s.setState((function(a){var n=a.params;return{params:D(D({},n),{},(0,_.Z)({},e,D(D({},n[e]),{},(0,_.Z)({},t,r)))),isParamsChanged:!0}})),"constant"===s.props.data.params[e][t].type)s.trottleUpdate();else{var a=s.state.params,n=s.sess.operation,o=Object.keys(n);s.params=a;for(var i=0;i<o.length;i+=1){var c=o[i];if(n[c].uniform)for(var l=Object.keys(n[c].uniform),p=0;p<l.length;p+=1){var m=l[p];m===t&&n[c].uniform[m].set(r)}}}})),(0,_.Z)(i(s),"handleReset",(function(){s.setState({params:s.handlePrepareParams(),isParamsChanged:!1},s.onChangeParams)})),(0,_.Z)(i(s),"renderNoAccessCase",(function(){var e=s.state.device,t=s.context.intl,r="mobile"===e.type;return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)("div",{className:z().error_text,children:(0,a.jsx)(d.ZT,{type:r?"h4":"h3",color:"black",align:"center",children:t.getText("example.noAccess")})}),(0,a.jsx)(d.zx,{href:window.location.href,size:"large",color:"primary",className:z().error_button,children:t.getText("example.tryAgain")})]})})),(0,_.Z)(i(s),"renderNotSupportedCase",(function(){var e=s.state.device,t=s.context.intl,r="mobile"===e.type;return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)("div",{className:z().error_text,children:(0,a.jsx)(d.ZT,{type:r?"h4":"h3",color:"black",align:"center",children:t.getText("example.dontSupport")})}),(0,a.jsx)(h.default,{href:"/examples",children:(0,a.jsx)(d.zx,{size:"large",color:"primary",className:z().error_button,children:t.getText("example.tryAnother")})})]})})),s.params=s.handlePrepareParams();var o=Z();s.state={isPlaying:!1,exampleInitialized:!1,canvas:s.getSize(),params:s.params,error:"",isCameraAccess:!1,isLoading:!0,showParams:"mobile"!==o.type,isParamsChanged:!1,device:o},s.lazyUpdate=new k(500,s.onResizeEnd),s.init(e),s.frame=0,s.loading=!1;var c=g()((function(e){s.refFps.current&&(s.refFps.current.innerHTML=e.fps.toFixed(0))}),3),l="function"===typeof e.data.tick?e.data.tick:s.tick;return s.tick=function(){if(c(),s.state.exampleInitialized||s.setState({exampleInitialized:!0}),s.stream.getImageBuffer(s.imgInput),s.loading&&!s.checkRerender(s.imgInput.data))s.setState({isLoading:!1}),s.loading=!1;else if(!s.loading&&s.canvasRef.current){try{l.apply(i(s),[s.frame,{canvas:s.canvasRef.current,params:s.params,operation:s.op,session:s.sess,input:s.imgInput,output:s.outputTensor,context:s.opContext}])}catch(e){s.stop(),s.setState({error:"NotSupported"})}s.frame+=1}s.timeoutRequestAnimation=window.requestAnimationFrame(s.tick)},s}return o(r,[{key:"UNSAFE_componentWillMount",value:function(){var e=this;try{navigator.mediaDevices.getUserMedia({video:!0}).then((function(){return e.setState({isCameraAccess:!0})})).catch((function(){return e.setState({error:"PermissionDenied"})}))}catch(t){this.setState({error:"PermissionDenied"})}}},{key:"componentDidMount",value:function(){window.addEventListener("resize",this.onResize),this.state.error||this.start()}},{key:"componentWillUnmount",value:function(){window.removeEventListener("resize",this.onResize),this.state.error||this.stop()}},{key:"handlePrepareParams",value:function(){var e={},t=this.props.data.params;if(!t)return e;for(var r=Object.keys(t),a=0;a<r.length;a+=1)for(var n=r[a],s=t[n],o=Object.keys(s),i=0;i<o.length;i+=1){var c=o[i],l=s[c];if("name"!==c){var p=l.default;"number"!==typeof p&&(p=l.values[0].value),e[n]=D(D({},e[n]),{},(0,_.Z)({},c,p))}}return e}},{key:"renderStartStopButton",value:function(){var e=this.state.isPlaying,t=e?(0,a.jsx)("img",{src:"/static/images/pause_icon.svg",alt:"Pause icon"}):(0,a.jsx)("img",{src:"/static/images/play_icon.svg",alt:"Play icon"});return(0,a.jsx)("span",{ref:this.refStopStartButton,className:z().stop_play_button,children:(0,a.jsx)("div",{className:y()(z().stop_play_icon,(0,_.Z)({},z().m_visible,!e)),children:t})})}},{key:"render",value:function(){var e,t,r=this,n=this.props,s=n.exampleName,o=n.data,i=this.state,c=i.error,l=i.isCameraAccess,p=i.canvas,m=i.params,u=i.isPlaying,f=i.isLoading,h=i.showParams,v=i.isParamsChanged,x=i.device,g=this.context.intl,b="mobile"===x.type;if(!c&&!l)return(0,a.jsx)("div",{className:z().root_example,children:(0,a.jsx)(d.D8,{size:40,className:z().loading})});if(b&&x.height<x.width)return(0,a.jsx)(d.xu,{fill:"primary",className:z().to_portrait,children:(0,a.jsx)(d.ZT,{type:"h4",color:"light_grey",children:g.getText("example.toPortrait")})});if(c){var w=(0,a.jsx)("img",{src:"/static/images/error_icon.svg",alt:"Error icon"});return(0,a.jsx)("div",{className:z().root_example,children:(0,a.jsxs)("div",{className:z().error_wrapper,children:[(0,a.jsx)("div",{className:z().error_icon,children:w}),"NotSupported"===c?this.renderNotSupportedCase():this.renderNoAccessCase()]})})}var j=!b||!h;return(0,a.jsx)("div",{className:z().root_example,children:(0,a.jsxs)("div",{className:z().example_wrapper,children:[j&&(0,a.jsxs)("div",{className:z().top_title_wrapper,children:[(0,a.jsx)(d.ZT,{type:b?"h4":"h3",color:"black",className:z().top_title_text,children:g.getText("operations",void 0,s)}),(0,a.jsxs)(d.ZT,{type:b?"h4":"h3",color:"grey",className:y()((e={},(0,_.Z)(e,z().top_title_fps,!0),(0,_.Z)(e,z().hidden_fps,!u),e)),children:["FPS:"," ",(0,a.jsx)("span",{ref:this.refFps})]})]}),(0,a.jsxs)("div",{className:z().content_wrapper,children:[(0,a.jsxs)(d.xu,{borderRadius:b?0:8,stroke:b?"":"grey_2",fill:b?"":"light_grey",className:z().canvas_wrapper,children:[(0,a.jsx)("canvas",{ref:this.canvasRef,width:p.width,height:p.height,className:z().canvas}),(0,a.jsx)("div",{className:y()((t={},(0,_.Z)(t,z().loading_wrapper,!0),(0,_.Z)(t,z().show_loading,f),t)),children:(0,a.jsx)(d.D8,{size:40,className:z().loading})}),(0,a.jsx)("button",{type:"button","aria-label":"Overlay",onClick:this.handleStartStop,onMouseEnter:function(){r.refStopStartButton.current.style.visibility="visible"},onMouseLeave:function(){r.refStopStartButton.current.style.visibility="hidden"},className:y()(z().canvas_overlay,"fill_black")}),this.renderStartStopButton()]}),b&&o.params&&(0,a.jsxs)(d.zx,{onClick:function(){return r.setState({showParams:!h})},bgType:"clear",size:"small",className:z().show_params,children:[(0,a.jsx)("div",{className:z().show_params_icon,children:h?(0,a.jsx)("img",{src:"/static/images/cross_icon.svg",alt:"Cross icon",className:z().cross_icon}):(0,a.jsx)("img",{src:"/static/images/params_icon.svg",alt:"Params icon",className:z().params_icon})}),(0,a.jsx)(d.ZT,{type:"b1",color:"light_grey",className:z().show_params_text,children:h?g.getText("example.close"):g.getText("example.params")})]}),h&&(0,a.jsx)(C,{params:o.params,onReset:this.handleReset,handleChangeState:this.handleChangeState,paramsValue:D({},m),isMobile:b,isParamsChanged:v})]})]})})}}]),r}(f.Component);(0,_.Z)(M,"contextTypes",{intl:w().shape({getText:w().func})})},7748:function(e){e.exports={root_example:"example_root_example__XsCd0",example_wrapper:"example_example_wrapper__2bHoj",top_title_wrapper:"example_top_title_wrapper__3lfmw",top_title_text:"example_top_title_text__2ETua",top_title_fps:"example_top_title_fps__QkJPa",hidden_fps:"example_hidden_fps__3KuIL",content_wrapper:"example_content_wrapper__2pNLf",canvas_wrapper:"example_canvas_wrapper__2kfqa",canvas:"example_canvas__2un1s",canvas_overlay:"example_canvas_overlay__dEWrz",loading_wrapper:"example_loading_wrapper__261oC",stop_play_button:"example_stop_play_button__13qDG",stop_play_icon:"example_stop_play_icon__3HpEr",to_portrait:"example_to_portrait__2_T-2",error_wrapper:"example_error_wrapper__3n3dD",error_icon:"example_error_icon__2mctP",error_text:"example_error_text__37rdQ",error_button:"example_error_button__2zUl7",loading:"example_loading__1G5Dt",show_loading:"example_show_loading__10OzE",show_params:"example_show_params__1GYgB",show_params_icon:"example_show_params_icon__Xq6RQ",show_params_text:"example_show_params_text__1r-Dv",params_icon:"example_params_icon__loR9K",cross_icon:"example_cross_icon__2erjw",m_visible:"example_m_visible__eo6zI"}},6761:function(e){e.exports={controller_wrapper:"params_controller_wrapper__4Yirx",controller_header_wrapper:"params_controller_header_wrapper__yWKVQ",reset:"params_reset__1CT8O",reset_icon:"params_reset_icon__2M8sB",reset_text:"params_reset_text__2GWyw",params_title:"params_params_title__1s6uX",params_block:"params_params_block__2dMyZ",params_block_wrapper:"params_params_block_wrapper__2RRT2",params_block_select_wrapper:"params_params_block_select_wrapper__1ax0e",params_block_section:"params_params_block_section__3J-9N",params_block_icon:"params_params_block_icon__1LFcx",params_block_title:"params_params_block_title__L2BXI",params_block_slider:"params_params_block_slider__X7Wt7",params_block_select:"params_params_block_select__2rFWb",params_block_count:"params_params_block_count__3dPZ_",controller_header_title:"params_controller_header_title__37QS5"}}}]);