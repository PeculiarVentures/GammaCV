"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[377],{4377:function(t,e,a){a.r(e);var s=a(6243);e.default={op:(t,e)=>{let a=t;return a=s.se(t),a=s.T4(a,e.HOG.step,"visualize")},tick(t,e){let{canvas:a,params:l,operation:r,output:n,session:p}=e,o=r.shape[1],f=r.shape[0],{step:h}=l.HOG,u=l.HOG.step/2;p.runOp(r,t,n),s.qX(a,"rgb(0, 0, 0)");for(let t=0;t<o/3;t+=1)for(let e=0;e<f/3;e+=1){let l=Infinity,r=-1/0;for(let a=0;a<9;a+=1){let s=Math.floor(a/3),p=a-3*s,o=n.get(3*e+s,3*t+p,0);o<l&&(l=o),o>r&&(r=o)}for(let p=0;p<9;p+=1){let o=Math.floor(p/3),f=p-3*o,c=(n.get(3*e+o,3*t+f,0)-l)/(r-l),i=n.get(3*e+o,3*t+f,1)+Math.PI/20,g=Math.sin(i),k=Math.cos(i),H=t*h+u,M=e*h+u,O=t*h-H,b=e*h+u-M,m=(t+1)*h-H,G=(e+1)*h-u-M,_=O*k-b*g+H,d=m*g+G*k+M,v=m*k-G*g+H,w=O*g+b*k+M;s.dH(a,[v,w,_,d],"rgba(255, 255, 255, ".concat(c/4,")"))}}},params:{HOG:{step:{name:"Step",type:"constant",min:1,max:30,step:1,default:20}}}}}}]);