"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[747],{7747:function(a,e,s){s.r(e);var u=s(6243);e.default={op:function(a,e){return"sqsum"===e.SUMMED_AREA_TABLE.squared?u.sh(a,2):u.gm(a,2)},tick:function(a,e){var s=e.canvas,t=e.operation,n=e.output,p=e.session;u.UN(s),p.runOp(t,a,n);for(var r=Math.max(n.get(n.shape[0]-1,n.shape[1]-1,0),n.get(n.shape[0]-1,n.shape[1]-1,1),n.get(n.shape[0]-1,n.shape[1]-1,2)),m=n.data,h=0;h<n.size;h+=4)m[h]/=r,m[h+1]/=r,m[h+2]/=r,m[h+3]=255;u.t4(s,n)},params:{SUMMED_AREA_TABLE:{name:"Summed Area Table",squared:{name:"Type",type:"constant",values:[{name:"Sum",value:"sum"},{name:"Squared sum",value:"sqsum"}]}}}}}}]);