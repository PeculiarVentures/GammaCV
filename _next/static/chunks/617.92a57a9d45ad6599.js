"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[617],{2617:function(e,t,a){a.r(t);var n=a(6243);function drawText(e,t,a,n,l){e.fillStyle=n,e.fillText("".concat(t,": ").concat(a),e.canvas.width-10,e.canvas.height-10-28*l)}t.default={op:(e,t)=>n.DV(e,t.MEAN_STD.layers),params:{MEAN_STD:{name:"MEAN STD",layers:{name:"Number of Layers",type:"constant",min:1,max:10,step:1,default:2}}},tick(e,t){let{canvas:a,operation:l,output:r,session:d,input:c}=t;d.runOp(l,e,r),n.t4(a,c);let o=a.getContext("2d");o.textAlign="right",o.font="bold ".concat(18,"px ").concat(getComputedStyle(document.body).fontFamily),o.fillStyle="#fff",o.textBaseline="middle",drawText(o,"Mean R",r.get(0,0,0),"red",1),drawText(o,"Mean G",r.get(0,0,1),"green",2),drawText(o,"Mean B",r.get(0,0,2),"blue",3),drawText(o,"STD R",r.get(1,0,0),"red",4),drawText(o,"STD G",r.get(1,0,1),"green",5),drawText(o,"STD B",r.get(1,0,2),"blue",6)}}}}]);