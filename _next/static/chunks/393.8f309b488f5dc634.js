"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[393],{393:function(e,t,i){i.r(t);var h=i(6243);t.default={op:function(e,t){return h.KX(e,t.HISTOGRAM.layers)},params:{HISTOGRAM:{layers:{name:"Number of Layers",type:"constant",min:1,max:5,step:1,default:2}}},tick:function(e,t){var i=t.canvas,a=t.operation,l=t.output,n=t.session,o=t.input;n.runOp(a,e,l),h.t4(i,o);var r=i.getContext("2d");r.beginPath();var g=new Path2D,s=new Path2D,f=new Path2D;g.moveTo(0,i.height),s.moveTo(0,i.height),f.moveTo(0,i.height);for(var u=1/(i.width*i.height)*i.height*10,c=0;c<256;c+=1){var w=l.get(0,c,0)*u,p=l.get(0,c,1)*u,T=l.get(0,c,2)*u;g.lineTo(c/255*i.width,i.height-w),s.lineTo(c/255*i.width,i.height-p),f.lineTo(c/255*i.width,i.height-T)}g.lineTo(i.width,i.height),s.lineTo(i.width,i.height),f.lineTo(i.width,i.height),g.closePath(),s.closePath(),f.closePath(),r.fillStyle="rgba(255, 0, 0, 0.25)",r.fill(g),r.fillStyle="rgba(0, 255, 0, 0.25)",r.fill(s),r.fillStyle="rgba(0, 0, 255, 0.25)",r.fill(f)}}}}]);