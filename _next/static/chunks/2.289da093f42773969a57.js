"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[2],{4002:function(a,e,u){u.r(e);var t=u(6243);e.default={op:function(a,e){var u=a;return"mult"===e.MATH.type&&(u=t.Mm(u,e.MATH.uScalar)),"div"===e.MATH.type&&(u=t.Bf(u,e.MATH.uScalar)),"add"===e.MATH.type&&(u=t.sc(u,e.MATH.uScalar)),"sub"===e.MATH.type&&(u=t.ZT(u,e.MATH.uScalar)),u},tick:function(a,e){var u=e.canvas,n=e.operation,l=e.output,p=e.session;t.UN(u),p.runOp(n,a,l),t.t4(u,l)},params:{MATH:{uScalar:{name:"Value",type:"uniform",min:0,max:1,step:.1,default:.5},type:{name:"Operation",type:"constant",values:[{name:"Mult",value:"mult"},{name:"Div",value:"div"},{name:"Add",value:"add"},{name:"Sub",value:"sub"}]}}}}}}]);