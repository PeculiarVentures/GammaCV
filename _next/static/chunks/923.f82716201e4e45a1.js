"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[923],{9923:function(e,n,a){a.r(n);var t=a(6243);n.default={init:function(){return{line:new t.x1}},op:function(e,n){var a=e;return a=t.se(a),a=t.DU(a,n.PROCESSING.dCoef),a=t.my(a,3,3),a=t.My(a),a=t.mU(a,.25,.75),a=t.Lb(a,n.PCLINES.layers,2,2)},tick:function(e,n){var a=n.canvas,s=n.input,o=n.session,r=n.operation,u=n.output,p=n.context,i=n.params,f=Math.max(s.shape[0],s.shape[1]),m=[];o.runOp(r,e,u),t.t4(a,s);for(var l=0;l<u.size/4;l+=1){var C=Math.floor(l/u.shape[1]),c=l-C*u.shape[1],S=u.get(C,c,0),h=u.get(C,c,1),E=u.get(C,c,2);S>0&&m.push([S,h,E])}m=(m=m.sort((function(e,n){return n[0]-e[0]}))).slice(0,i.PCLINES.count);for(var N=0;N<m.length;N+=1)p.line.fromParallelCoords(m[N][1]*i.PROCESSING.dCoef,m[N][2]*i.PROCESSING.dCoef,s.shape[1],s.shape[0],f,f/2),t.dH(a,p.line,"rgba(0, 255, 0, 1.0)")},params:{PROCESSING:{name:"PROCESSING",dCoef:{name:"Downsample",type:"constant",min:1,max:4,step:1,default:2}},PCLINES:{name:"PC LINES",count:{name:"Lines Count",type:"uniform",min:1,max:100,step:1,default:10},layers:{name:"Layers Count",type:"constant",min:1,max:5,step:1,default:2}}}}}}]);