(this["webpackJsonpproject-portfolio"]=this["webpackJsonpproject-portfolio"]||[]).push([[0],{46:function(e,c,s){},47:function(e,c,s){},48:function(e,c,s){},51:function(e,c,s){},52:function(e,c,s){},53:function(e,c,s){},54:function(e,c,s){},55:function(e,c,s){},56:function(e,c,s){},60:function(e,c,s){},61:function(e,c,s){},62:function(e,c,s){},63:function(e,c,s){"use strict";s.r(c);var t=s(2),i=s.n(t),a=s(16),n=s.n(a),r=(s(45),s(46),s(47),s(48),s(38)),j=s(25),l=s(29),o=s.n(l),d=s(39),b=s(7),O=s.p+"static/media/portfolio-icon.31a21d70.svg",x=s.p+"static/media/contacrme.0aea53dd.svg",h=s.p+"static/media/map-icon.064480cc.svg",m=s.p+"static/media/skills.957a1f5e.svg",u=s.p+"static/media/personalinfo-icon.9440fdb2.svg",v=s.p+"static/media/portfolio-submenu.84eb50e2.webp",p=s.p+"static/media/pesonalsubmenuImage.71b39f90.webp",N=s.p+"static/media/Skillssubmenu.fe64e273.webp",f=s.p+"static/media/findmesubmenu.62e30488.webp",g=[{id:1,title:"portfolio",icon:O,img:v},{id:2,title:"About Me",icon:u,img:p},{id:3,title:"contact me",icon:x,img:s.p+"static/media/contactmesupmenu.46966260.webp"},{id:4,title:"skills",icon:m,img:N},{id:5,title:"find me",icon:h,img:f}],w=s(1),k=i.a.createContext(),C=function(e){var c=e.children,s=Object(t.useState)(!0),i=Object(b.a)(s,2),a=i[0],n=i[1],l=Object(t.useState)(!1),O=Object(b.a)(l,2),x=O[0],h=O[1],m=Object(t.useState)(!1),u=Object(b.a)(m,2),v=u[0],p=u[1],N=Object(t.useState)([]),f=Object(b.a)(N,2),C=f[0],I=f[1],S=Object(t.useState)(!1),y=Object(b.a)(S,2),M=y[0],A=y[1],L=Object(t.useState)(!1),D=Object(b.a)(L,2),E=D[0],T=D[1],F=Object(t.useState)(!1),P=Object(b.a)(F,2),U=P[0],B=P[1],J=Object(t.useState)(!1),Z=Object(b.a)(J,2),G=Z[0],_=Z[1],W=Object(t.useState)(!1),R=Object(b.a)(W,2),z=R[0],H=R[1],Y=Object(t.useState)(!1),K=Object(b.a)(Y,2),q=K[0],V=K[1],X=Object(t.useState)({}),Q=Object(b.a)(X,2),$=Q[0],ee=Q[1],ce=Object(t.useState)({title:"",img:""}),se=Object(b.a)(ce,2),te=se[0],ie=se[1],ae=Object(t.useState)([]),ne=Object(b.a)(ae,2),re=ne[0],je=ne[1],le=function(){var e=Object(d.a)(o.a.mark((function e(){var c,s;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("https://api.npoint.io/ad5ab4de7dbf6595e1e2");case 2:return c=e.sent,e.next=5,c.json();case 5:s=e.sent,je(s);case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();Object(t.useEffect)((function(){le(),window.addEventListener("load",(function(){n(!1)}))}),[]);var oe,de=function(){A(!1),T(!1),B(!1),_(!1),H(!1)},be=[],Oe=new Map,xe=Object(r.a)(C);try{for(xe.s();!(oe=xe.n()).done;){var he=oe.value;Oe.has(he.id)||(Oe.set(he.id,!0),be.push({id:he.id,title:he.title,icon:he.icon}))}}catch(me){xe.e(me)}finally{xe.f()}return Object(w.jsx)(k.Provider,{value:{isLoading:a,setIsLoading:n,isLogin:x,setIsLogin:h,isSidebar:v,setIsSidebar:p,taskparicons:C,setTaskparicons:I,isPortfolioActive:M,setIsPortfolioActive:A,isPersonalActive:E,setIsPersonalActive:T,isContactActive:U,setIsContactActive:B,isSkillsActive:G,setIsSkillsActive:_,isFindActive:z,setIsFindActive:H,result:be,activeFromTaskBar:function(e){1===e&&(de(),A(!M)),2===e&&(de(),T(!E)),3===e&&(de(),B(!U)),4===e&&(de(),_(!G)),5===e&&(de(),H(!z))},windowOpen:function(e){1!==e||M||A(!0),2!==e||E||T(!0),3!==e||U||B(!0),4!==e||G||_(!0),5!==e||z||H(!0)},IconShow:function(e,c,s){var t={id:e,title:c,icon:s};I([].concat(Object(j.a)(C),[t]))},isSubmenuActive:q,setIsSubmenuActive:V,openSubmenu:function(e,c){ee(c);var s=g.find((function(c){return c.title===e}));ie(s),V(!0)},location:$,submenu:te,closeFromSubmenu:function(e){if(1===e){A(!1);var c=C.filter((function(e){return 1!==e.id}));I(c),V(!1)}if(2===e){T(!1);var s=C.filter((function(e){return 2!==e.id}));I(s),V(!1)}if(3===e){B(!1);var t=C.filter((function(e){return 3!==e.id}));I(t),V(!1)}if(4===e){_(!1);var i=C.filter((function(e){return 4!==e.id}));I(i),V(!1)}if(5===e){H(!1);var a=C.filter((function(e){return 5!==e.id}));I(a),V(!1)}},data:re},children:c})},I=function(){return Object(t.useContext)(k)},S=function(){var e=I().isLoading;return Object(w.jsx)("div",{className:"".concat(e?"loading-Component":"loading-Component smooth-hide"),children:Object(w.jsxs)("div",{children:[Object(w.jsxs)("div",{className:"lds-roller",children:[Object(w.jsx)("div",{}),Object(w.jsx)("div",{}),Object(w.jsx)("div",{}),Object(w.jsx)("div",{}),Object(w.jsx)("div",{}),Object(w.jsx)("div",{}),Object(w.jsx)("div",{}),Object(w.jsx)("div",{})]}),Object(w.jsx)("h3",{children:"please wait"})]})})},y=(s(51),s.p+"static/media/login-img.afa19b23.webp"),M=s.p+"static/media/background-img.690cb960.webp",A=function(){var e=I(),c=e.isLogin,s=e.setIsLogin;return Object(w.jsxs)("div",{className:"".concat(c?"login-container smooth-hide-top":"login-container"),children:[Object(w.jsx)("div",{className:"blur-background",children:Object(w.jsx)("img",{src:M,alt:"background"})}),Object(w.jsxs)("div",{className:"login-info-container",children:[Object(w.jsx)("div",{className:"img-container",children:Object(w.jsx)("img",{rel:"preload",src:y,alt:""})}),Object(w.jsx)("div",{className:"login-button-container",children:Object(w.jsx)("button",{onClick:function(){return s(!0)},className:"btn login-btn",children:"login"})})]})]})},L=s(4),D=s(22),E=s(3),T=s.p+"static/media/desktop-background.c7196e64.webp",F=(s(52),function(){var e=I(),c=e.isSidebar,s=e.activeFromTaskBar,t=e.setIsSidebar,i=e.IconShow;return Object(w.jsxs)("div",{className:"".concat(c?"sidebar-container active-sidebar":"sidebar-container"),children:[Object(w.jsxs)("div",{className:"sidebar-header",children:[Object(w.jsx)("div",{className:"sidebarImgContainer",children:Object(w.jsx)("img",{src:y,alt:"MyImage"})}),Object(w.jsxs)("div",{className:"userDetails",children:[Object(w.jsx)("h4",{children:"Mostafa Tarek Mostafa"}),Object(w.jsx)("h5",{children:"Front-End Web Developer"})]})]}),Object(w.jsx)("div",{className:"line"}),Object(w.jsxs)("div",{className:"linksContainer",children:[Object(w.jsx)("ul",{children:g.map((function(e){var c=e.id,a=e.title,n=e.icon;return Object(w.jsx)("li",{onClick:function(){s(c),i(c,a,n),t(!1)},children:Object(w.jsxs)("button",{children:[Object(w.jsx)("img",{src:n,alt:a}),a]})},c)}))}),Object(w.jsx)("div",{className:"social-links",children:Object(w.jsxs)("div",{className:"social-container",children:[Object(w.jsx)("a",{href:"https://www.facebook.com/mostafatarekaioup/",target:"_blanck",children:Object(w.jsx)(E.i,{})}),Object(w.jsx)("a",{href:"https://github.com/MostafaTarekAioup",target:"_blanck",children:Object(w.jsx)(E.j,{})}),Object(w.jsx)("a",{href:"https://www.linkedin.com/in/mostafa-tarek-050936193",target:"_blanck",children:Object(w.jsx)(E.p,{})})]})})]})]})}),P=function(e){var c=e.id,s=e.title,t=e.icon,i=I(),a=i.windowOpen,n=i.IconShow;return Object(w.jsx)(w.Fragment,{children:Object(w.jsxs)("div",{className:"single-icon",onClick:function(){n(c,s,t),a(c)},children:[Object(w.jsxs)("button",{children:[" ",Object(w.jsx)("img",{src:t,alt:s})]}),Object(w.jsx)("br",{}),Object(w.jsx)("p",{children:s})]})})},U=(s(53),function(){var e=I(),c=e.setIsPortfolioActive,s=e.isPortfolioActive,t=e.taskparicons,i=e.setTaskparicons,a=e.data,n=Object(j.a)(a).reverse();return Object(w.jsxs)("div",{className:"".concat(s?"window-container active":"window-container"),children:[Object(w.jsx)("div",{className:"header",children:Object(w.jsxs)("div",{className:"headerbuttons",children:[Object(w.jsx)("button",{className:" heder-icon",onClick:function(){return c(!1)},children:Object(w.jsx)(E.u,{})}),Object(w.jsx)("button",{className:" heder-icon",onClick:function(){return function(){var e=t.filter((function(e){return 1!==e.id}));i(e),c(!1)}()},children:Object(w.jsx)(E.w,{})})]})}),Object(w.jsxs)("div",{className:"portfolio-container",children:[Object(w.jsxs)("div",{className:"portfolio-header",children:[Object(w.jsx)("h2",{children:"Portfolio"}),Object(w.jsx)("svg",{className:"waves",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 1440 320",children:Object(w.jsx)("path",{fill:"#0099ff",fillOpacity:"1",d:"M0,32L60,48C120,64,240,96,360,106.7C480,117,600,107,720,90.7C840,75,960,53,1080,53.3C1200,53,1320,75,1380,85.3L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"})})]}),Object(w.jsx)("div",{className:"content",children:n.map((function(e){var c=e.id,s=e.title,t=e.img,i=e.link;return Object(w.jsx)("div",{className:"project-container",children:Object(w.jsx)("a",{className:"project-link",href:i,target:s,children:Object(w.jsxs)("div",{className:"project",children:[Object(w.jsx)("img",{src:t,alt:s}),Object(w.jsx)("footer",{id:"project-id",children:Object(w.jsx)("p",{children:s})})]})})},c)}))}),Object(w.jsx)("br",{}),Object(w.jsx)("br",{}),Object(w.jsx)("br",{}),Object(w.jsx)("br",{})]})]})}),B=(s(54),s.p+"static/media/MyPersonalImage.3e794c05.webp"),J=s.p+"static/media/Mostafa Tarek_Aioup_CV.30af61f2.pdf",Z=function(){var e=I(),c=e.isPersonalActive,s=e.setIsPersonalActive,i=e.taskparicons,a=e.setTaskparicons,n=Object(t.useState)(!1),r=Object(b.a)(n,2),j=r[0],l=r[1];return Object(w.jsxs)("div",{className:"".concat(c?"window-container active":"window-container"),children:[Object(w.jsx)("div",{className:"header",children:Object(w.jsxs)("div",{className:"headerbuttons",children:[Object(w.jsx)("button",{className:" heder-icon",onClick:function(){return s(!1)},children:Object(w.jsx)(E.u,{})}),Object(w.jsx)("button",{className:" heder-icon",onClick:function(){return function(){var e=i.filter((function(e){return 2!==e.id}));a(e),s(!1)}()},children:Object(w.jsx)(E.w,{})})]})}),Object(w.jsxs)("div",{className:"personal-content",children:[Object(w.jsx)("div",{className:"introduce-container",children:Object(w.jsxs)("div",{className:"information",children:[Object(w.jsx)("h2",{children:"Hi There"}),Object(w.jsx)("h3",{children:"Iam Mostafa Tarek "}),Object(w.jsxs)("div",{className:"jop-wrapper",children:[Object(w.jsx)("div",{className:"jop j1",children:" a Front-End Developer"}),Object(w.jsx)("div",{className:"jop j2",children:" a React Developer"}),Object(w.jsx)("div",{className:"jop j3",children:" a Web Designer"}),Object(w.jsx)("div",{className:"jop j4",children:" a Freelancer"})]})]})}),Object(w.jsxs)("div",{className:"apout-me-container",children:[Object(w.jsx)("div",{className:"personal-image-container",children:Object(w.jsx)("div",{className:"myImage",children:Object(w.jsx)("img",{src:B,alt:"Mostafa Tarek"})})}),Object(w.jsx)("div",{className:"myPersonalInfo",children:Object(w.jsxs)("div",{className:"fullName",children:[Object(w.jsx)("h2",{children:"Mostafa tarek mostafa"}),Object(w.jsx)("h3",{children:"Front-End React Developer"}),Object(w.jsxs)("div",{className:"biography",children:[Object(w.jsxs)("h4",{className:"show-bio",onClick:function(){return l(!j)},children:["My Bio ",j?Object(w.jsx)(E.c,{className:"arrow"}):Object(w.jsx)(E.b,{className:"arrow"})]}),Object(w.jsx)("p",{className:"".concat(j?"active-bio":" bio-details "),children:"Hi I'am Mostafa Tarek , I work as a Front-End Web Developer using React Framework , I'am Fresh Graduated from Zagazig University faculty of science Computer science department , Have a Front-End Web Developer NanoDegree certificate from Udacity , I'm passionate about keeping up with everything new in technology trends, I have my personal touch at my work. you can keen on me for any project you need to do. "})]}),Object(w.jsxs)("div",{className:"more-info",children:[Object(w.jsx)("h3",{children:"More apout me"}),Object(w.jsx)("div",{className:"infoline"})]}),Object(w.jsxs)("div",{className:"moreDetails",children:[Object(w.jsxs)("p",{children:[Object(w.jsx)(E.a,{className:"detailsIcon"})," Birthday : 11 / 11 /1996"]}),Object(w.jsxs)("p",{children:[" ",Object(w.jsx)(E.a,{className:"detailsIcon"})," Age : 24"]}),Object(w.jsxs)("p",{children:[" ",Object(w.jsx)(E.a,{className:"detailsIcon"})," Degree : Computer Science"]}),Object(w.jsxs)("p",{children:[" ",Object(w.jsx)(E.a,{className:"detailsIcon"})," Phone : 01094855028"]}),Object(w.jsxs)("p",{children:[" ",Object(w.jsx)(E.a,{className:"detailsIcon"})," Experience : 1 Year"]}),Object(w.jsxs)("p",{children:[" ",Object(w.jsx)(E.a,{className:"detailsIcon"})," Graduation year : 8 / 2020"]}),Object(w.jsxs)("p",{children:[" ",Object(w.jsx)(E.a,{className:"detailsIcon"})," Military Service: exempt"]}),Object(w.jsxs)("p",{children:[" ",Object(w.jsx)(E.a,{className:"detailsIcon"}),"  City : Cairo , Egypt"]})]}),Object(w.jsxs)("div",{className:"more-info",children:[Object(w.jsx)("h3",{children:"Courses & Education "}),Object(w.jsx)("div",{className:"infoline"})]}),Object(w.jsxs)("div",{className:"time-line-container",children:[Object(w.jsxs)("div",{className:" course first-course",children:[Object(w.jsx)("div",{className:"first-icon course-icon",children:Object(w.jsx)(E.l,{})}),Object(w.jsx)("h3",{children:"Computer Science"}),Object(w.jsx)("h4",{children:"2015-2020"}),Object(w.jsx)("p",{children:"Faculity of Science Zagaig University Computer Science Department"}),Object(w.jsx)("h4",{children:"Courses"}),Object(w.jsxs)("div",{className:"moreDetails",children:[Object(w.jsxs)("p",{children:[Object(w.jsx)(E.a,{className:"detailsIcon"})," database"]}),Object(w.jsxs)("p",{children:[" ",Object(w.jsx)(E.a,{className:"detailsIcon"})," artificial intelligence"]}),Object(w.jsxs)("p",{children:[" ",Object(w.jsx)(E.a,{className:"detailsIcon"})," algorithm"]}),Object(w.jsxs)("p",{children:[" ",Object(w.jsx)(E.a,{className:"detailsIcon"})," computer network"]}),Object(w.jsxs)("p",{children:[" ",Object(w.jsx)(E.a,{className:"detailsIcon"})," operating system"]}),Object(w.jsxs)("p",{children:[" ",Object(w.jsx)(E.a,{className:"detailsIcon"})," c++ programming"]}),Object(w.jsxs)("p",{children:[" ",Object(w.jsx)(E.a,{className:"detailsIcon"})," wireless network"]}),Object(w.jsxs)("p",{children:[" ",Object(w.jsx)(E.a,{className:"detailsIcon"}),"  formal language"]})]})]}),Object(w.jsxs)("div",{className:" course first-course",children:[Object(w.jsx)("div",{className:"  course-icon",children:Object(w.jsx)(E.d,{})}),Object(w.jsx)("h3",{children:"Udacity Nanodegree"}),Object(w.jsx)("h4",{children:"7-2019 / 9-2019"}),Object(w.jsx)("p",{children:"Front-End Web Developer Nanodegree"}),Object(w.jsxs)("p",{children:[" ",Object(w.jsx)("a",{className:"certificate",href:"https://confirm.udacity.com/R4EJP6MK",target:"Udacity",children:"Certificate"})," "]}),Object(w.jsx)("h4",{children:"Courses"}),Object(w.jsxs)("div",{className:"moreDetails",children:[Object(w.jsxs)("p",{children:[Object(w.jsx)(E.a,{className:"detailsIcon"})," Html"]}),Object(w.jsxs)("p",{children:[" ",Object(w.jsx)(E.a,{className:"detailsIcon"})," Css"]}),Object(w.jsxs)("p",{children:[" ",Object(w.jsx)(E.a,{className:"detailsIcon"})," Responsive"]}),Object(w.jsxs)("p",{children:[" ",Object(w.jsx)(E.a,{className:"detailsIcon"}),"  Markdown"]}),Object(w.jsxs)("p",{children:[" ",Object(w.jsx)(E.a,{className:"detailsIcon"})," Javascript"]}),Object(w.jsxs)("p",{children:[" ",Object(w.jsx)(E.a,{className:"detailsIcon"})," Js Dom"]}),Object(w.jsxs)("p",{children:[" ",Object(w.jsx)(E.a,{className:"detailsIcon"})," Js OOP"]}),Object(w.jsxs)("p",{children:[" ",Object(w.jsx)(E.a,{className:"detailsIcon"}),"  Web Accessibility"]}),Object(w.jsxs)("p",{children:[" ",Object(w.jsx)(E.a,{className:"detailsIcon"}),"  Js Design Pattern"]}),Object(w.jsxs)("p",{children:[" ",Object(w.jsx)(E.a,{className:"detailsIcon"}),"  Js Promises"]}),Object(w.jsxs)("p",{children:[" ",Object(w.jsx)(E.a,{className:"detailsIcon"}),"  Service Worker"]})]})]}),Object(w.jsx)("div",{className:"cv-download",children:Object(w.jsx)("a",{href:J,download:"Mostafa Tarek CV",children:Object(w.jsx)("button",{className:"cv-button",children:"Download My CV"})})})]})]})})]})]}),Object(w.jsx)("br",{}),Object(w.jsx)("br",{}),Object(w.jsx)("br",{})]})},G=(s(55),function(){var e=I(),c=e.isContactActive,s=e.setIsContactActive,i=e.taskparicons,a=e.setTaskparicons,n=Object(t.useState)(""),r=Object(b.a)(n,2),j=r[0],l=r[1],o=Object(t.useState)(""),d=Object(b.a)(o,2),O=d[0],x=d[1],h=Object(t.useState)(""),m=Object(b.a)(h,2),u=m[0],v=m[1];return Object(w.jsxs)("div",{className:"".concat(c?"window-container skills-window active":"window-container"),children:[Object(w.jsx)("div",{className:"header",children:Object(w.jsxs)("div",{className:"headerbuttons",children:[Object(w.jsx)("button",{className:" heder-icon",onClick:function(){return s(!1)},children:Object(w.jsx)(E.u,{})}),Object(w.jsx)("button",{className:" heder-icon",onClick:function(){return function(){var e=i.filter((function(e){return 3!==e.id}));a(e),s(!1)}()},children:Object(w.jsx)(E.w,{})})]})}),Object(w.jsxs)("div",{className:"portfolio-header",children:[Object(w.jsx)("h2",{children:"Contact Me"}),Object(w.jsx)("svg",{className:"waves",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 1440 320",children:Object(w.jsx)("path",{fill:"#0099ff",fillOpacity:"1",d:"M0,32L60,48C120,64,240,96,360,106.7C480,117,600,107,720,90.7C840,75,960,53,1080,53.3C1200,53,1320,75,1380,85.3L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"})})]}),Object(w.jsxs)("div",{className:"contact-me-container",children:[Object(w.jsx)("div",{className:"contact-image-container",children:Object(w.jsx)("img",{src:B,alt:"Mostafa Tarek"})}),Object(w.jsxs)("div",{className:"contact-data-container",children:[Object(w.jsxs)("div",{className:"emailphone",children:[Object(w.jsxs)("p",{className:"single-detail-item",children:[Object(w.jsx)(E.t,{className:"detailsIcon "})," mostafatarekaioup@gmail.com"]}),Object(w.jsxs)("p",{className:"single-detail-item",children:[" ",Object(w.jsx)(E.r,{className:"detailsIcon"})," +201094855028"]})]}),Object(w.jsxs)("div",{className:"more-info",children:[Object(w.jsx)("h3",{className:"contact-line",children:"Social Media"}),Object(w.jsx)("div",{className:"infoline"})]}),Object(w.jsx)("div",{className:"contact-social-links",children:Object(w.jsxs)("ul",{children:[Object(w.jsx)("li",{children:Object(w.jsx)("a",{href:"https://www.facebook.com/mostafatarekaioup/",target:"facebook",children:Object(w.jsx)(E.h,{})})}),Object(w.jsx)("li",{children:Object(w.jsx)("a",{href:"https://github.com/MostafaTarekAioup",target:"github",children:Object(w.jsx)(E.j,{})})}),Object(w.jsx)("li",{children:Object(w.jsx)("a",{href:"https://www.linkedin.com/in/mostafa-tarek-050936193/",target:"linkedin",children:Object(w.jsx)(E.p,{})})})]})}),Object(w.jsxs)("div",{className:"more-info",children:[Object(w.jsx)("h3",{className:"contact-line",children:"Send Me a Message"}),Object(w.jsx)("div",{className:"infoline"})]}),Object(w.jsx)("div",{className:"contact-form-container",children:Object(w.jsxs)("form",{action:"Post",onSubmit:function(e){e.preventDefault(),l(""),x(""),v(""),alert("Thanks For your Message")},children:[Object(w.jsxs)("div",{className:"input-group",children:[Object(w.jsx)("input",{type:"text",name:"Client Name",id:"client",value:j,onChange:function(e){return l(e.target.value)},"aria-details":"Client Name",placeholder:"Name",required:!0}),Object(w.jsx)("input",{type:"email",name:"Client Name",id:"Email",value:O,onChange:function(e){return x(e.target.value)},"aria-details":"Client Email",placeholder:"Email",required:!0})]}),Object(w.jsx)("div",{className:"text-area",children:Object(w.jsx)("textarea",{value:u,onChange:function(e){return v(e.target.value)},id:"message",name:"message",rows:"6",cols:"50",required:!0})}),Object(w.jsx)("div",{className:"submit-button",children:Object(w.jsx)("button",{className:"submit",type:"submit",children:"Send Message"})})]})})]})]}),Object(w.jsx)("br",{}),Object(w.jsx)("br",{}),Object(w.jsx)("br",{}),Object(w.jsx)("br",{})]})}),_=(s(56),function(){var e=I(),c=e.isSkillsActive,s=e.setIsSkillsActive,t=e.taskparicons,i=e.setTaskparicons;return Object(w.jsxs)("div",{className:"".concat(c?"window-container skills-window active":"window-container "),children:[Object(w.jsx)("div",{className:"header",children:Object(w.jsxs)("div",{className:"headerbuttons",children:[Object(w.jsx)("button",{className:" heder-icon",onClick:function(){return s(!1)},children:Object(w.jsx)(E.u,{})}),Object(w.jsx)("button",{className:" heder-icon",onClick:function(){return function(){var e=t.filter((function(e){return 4!==e.id}));i(e),s(!1)}()},children:Object(w.jsx)(E.w,{})})]})}),Object(w.jsxs)("div",{className:"portfolio-header",children:[Object(w.jsx)("h2",{children:"My Skills"}),Object(w.jsx)("svg",{className:"waves",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 1440 320",children:Object(w.jsx)("path",{fill:"#0099ff",fillOpacity:"1",d:"M0,32L60,48C120,64,240,96,360,106.7C480,117,600,107,720,90.7C840,75,960,53,1080,53.3C1200,53,1320,75,1380,85.3L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"})})]}),Object(w.jsxs)("div",{className:"time-line-container",children:[Object(w.jsx)("h3",{className:"skill-flag",children:"Programming Skills"}),Object(w.jsxs)("div",{className:" course first-course",children:[Object(w.jsx)("div",{className:"first-icon course-icon",children:Object(w.jsx)(E.m,{})}),Object(w.jsx)("div",{className:"course-detail",children:Object(w.jsx)("h3",{children:"HTML"})}),Object(w.jsx)("h4",{children:"Sources"}),Object(w.jsxs)("div",{className:"moreDetails",children:[Object(w.jsxs)("p",{children:[Object(w.jsx)(E.a,{className:"detailsIcon"})," Udacity"]}),Object(w.jsxs)("p",{children:[" ",Object(w.jsx)(E.a,{className:"detailsIcon"})," El-Zero Youtube Channel"]})]})]}),Object(w.jsxs)("div",{className:" course first-course",children:[Object(w.jsx)("div",{className:"  course-icon",children:Object(w.jsx)(E.g,{})}),Object(w.jsx)("div",{className:"course-detail",children:Object(w.jsx)("h3",{children:"Css"})}),Object(w.jsx)("h4",{children:"Sourses"}),Object(w.jsxs)("div",{className:"moreDetails",children:[Object(w.jsxs)("p",{children:[Object(w.jsx)(E.a,{className:"detailsIcon"})," Udacity"]}),Object(w.jsxs)("p",{children:[" ",Object(w.jsx)(E.a,{className:"detailsIcon"})," El-Zero Youtube Channel"]})]})]}),Object(w.jsxs)("div",{className:" course first-course",children:[Object(w.jsx)("div",{className:"  course-icon",children:Object(w.jsx)(E.n,{})}),Object(w.jsx)("div",{className:"course-detail",children:Object(w.jsx)("h3",{children:"JavaScript"})}),Object(w.jsx)("h4",{children:"Sourses"}),Object(w.jsx)("div",{className:"moreDetails",children:Object(w.jsxs)("p",{children:[Object(w.jsx)(E.a,{className:"detailsIcon"})," Udacity"]})})]}),Object(w.jsxs)("div",{className:" course first-course",children:[Object(w.jsx)("div",{className:"  course-icon",children:Object(w.jsx)(E.e,{})}),Object(w.jsx)("div",{className:"course-detail",children:Object(w.jsx)("h3",{children:"Bootstrap 4/5"})}),Object(w.jsx)("h4",{children:"Sourses"}),Object(w.jsx)("div",{className:"moreDetails",children:Object(w.jsxs)("p",{children:[Object(w.jsx)(E.a,{className:"detailsIcon"})," Bootstrap Documintation"]})})]}),Object(w.jsxs)("div",{className:" course first-course",children:[Object(w.jsx)("div",{className:"  course-icon",children:Object(w.jsx)(E.n,{})}),Object(w.jsx)("div",{className:"course-detail",children:Object(w.jsx)("h3",{children:"Js Dom"})}),Object(w.jsx)("h4",{children:"Sourses"}),Object(w.jsx)("div",{className:"moreDetails",children:Object(w.jsxs)("p",{children:[Object(w.jsx)(E.a,{className:"detailsIcon"})," Udacity"]})})]}),Object(w.jsxs)("div",{className:" course first-course",children:[Object(w.jsx)("div",{className:"  course-icon",children:Object(w.jsx)(E.n,{})}),Object(w.jsx)("div",{className:"course-detail",children:Object(w.jsx)("h3",{children:"Js Bom"})}),Object(w.jsx)("h4",{children:"Sourses"}),Object(w.jsx)("div",{className:"moreDetails",children:Object(w.jsxs)("p",{children:[Object(w.jsx)(E.a,{className:"detailsIcon"})," El-Zero Youtube Channel"]})})]}),Object(w.jsxs)("div",{className:" course first-course",children:[Object(w.jsx)("div",{className:"  course-icon",children:Object(w.jsx)(E.n,{})}),Object(w.jsx)("div",{className:"course-detail",children:Object(w.jsx)("h3",{children:"JSON & AJAX"})}),Object(w.jsx)("h4",{children:"Sourses"}),Object(w.jsx)("div",{className:"moreDetails",children:Object(w.jsxs)("p",{children:[Object(w.jsx)(E.a,{className:"detailsIcon"})," Udacity"]})})]}),Object(w.jsxs)("div",{className:" course first-course",children:[Object(w.jsx)("div",{className:"  course-icon",children:Object(w.jsx)(E.n,{})}),Object(w.jsx)("div",{className:"course-detail",children:Object(w.jsx)("h3",{children:"ES 6"})}),Object(w.jsx)("h4",{children:"Sourses"}),Object(w.jsx)("div",{className:"moreDetails",children:Object(w.jsxs)("p",{children:[Object(w.jsx)(E.a,{className:"detailsIcon"})," Udacity"]})})]}),Object(w.jsxs)("div",{className:" course first-course",children:[Object(w.jsx)("div",{className:"  course-icon",children:Object(w.jsx)(E.k,{})}),Object(w.jsx)("div",{className:"course-detail",children:Object(w.jsx)("h3",{children:"Git/Github"})}),Object(w.jsx)("h4",{children:"Sourses"}),Object(w.jsx)("div",{className:"moreDetails",children:Object(w.jsxs)("p",{children:[Object(w.jsx)(E.a,{className:"detailsIcon"})," El-Zero Youtube Channel"]})})]}),Object(w.jsxs)("div",{className:" course first-course",children:[Object(w.jsx)("div",{className:"  course-icon",children:Object(w.jsx)(E.s,{})}),Object(w.jsx)("div",{className:"course-detail",children:Object(w.jsx)("h3",{children:"React.js"})}),Object(w.jsx)("h4",{children:"Sourses"}),Object(w.jsx)("div",{className:"moreDetails",children:Object(w.jsxs)("p",{children:[Object(w.jsx)(E.a,{className:"detailsIcon"})," John Smilga React Course Udemy"]})})]}),Object(w.jsxs)("div",{className:" course first-course",children:[Object(w.jsx)("div",{className:"  course-icon",children:Object(w.jsx)(E.n,{})}),Object(w.jsx)("div",{className:"course-detail",children:Object(w.jsx)("h3",{children:"Service Worker For Offline"})}),Object(w.jsx)("h4",{children:"Sourses"}),Object(w.jsx)("div",{className:"moreDetails",children:Object(w.jsxs)("p",{children:[Object(w.jsx)(E.a,{className:"detailsIcon"})," Udacity"]})})]}),Object(w.jsxs)("div",{className:" course first-course",children:[Object(w.jsx)("div",{className:"  course-icon",children:Object(w.jsx)(E.n,{})}),Object(w.jsx)("div",{className:"course-detail",children:Object(w.jsx)("h3",{children:"Js OOP & Js Promises "})}),Object(w.jsx)("h4",{children:"Sourses"}),Object(w.jsxs)("div",{className:"moreDetails",children:[Object(w.jsxs)("p",{children:[Object(w.jsx)(E.a,{className:"detailsIcon"})," Udacity"]}),Object(w.jsxs)("p",{children:[Object(w.jsx)(E.a,{className:"detailsIcon"})," El-Zero Youtube Channel"]})]})]}),Object(w.jsxs)("div",{className:" course first-course",children:[Object(w.jsx)("div",{className:"  course-icon",children:Object(w.jsx)(E.q,{})}),Object(w.jsx)("div",{className:"course-detail",children:Object(w.jsx)("h3",{children:"Mapbox & Leaflet.js"})}),Object(w.jsx)("h4",{children:"Sourses"}),Object(w.jsxs)("div",{className:"moreDetails",children:[Object(w.jsxs)("p",{children:[Object(w.jsx)(E.a,{className:"detailsIcon"})," Mapbox Documintation"]}),Object(w.jsxs)("p",{children:[Object(w.jsx)(E.a,{className:"detailsIcon"})," Leaflet.js Documintation"]})]})]}),Object(w.jsxs)("div",{className:" course first-course",children:[Object(w.jsx)("div",{className:"  course-icon",children:Object(w.jsx)(D.a,{})}),Object(w.jsx)("div",{className:"course-detail",children:Object(w.jsx)("h3",{children:"Redux & Redux-ToolKite"})}),Object(w.jsx)("h4",{children:"Sourses"}),Object(w.jsxs)("div",{className:"moreDetails",children:[Object(w.jsxs)("p",{children:[Object(w.jsx)(E.a,{className:"detailsIcon"})," Udemy : Maximilian Schwarzm\xfcller Course"]}),Object(w.jsxs)("p",{children:[Object(w.jsx)(E.a,{className:"detailsIcon"})," Udemy : John Smilga Course"]})]})]}),Object(w.jsxs)("div",{className:" course first-course",children:[Object(w.jsx)("div",{className:"  course-icon",children:Object(w.jsx)(D.b,{})}),Object(w.jsx)("div",{className:"course-detail",children:Object(w.jsx)("h3",{children:"Sass"})}),Object(w.jsx)("h4",{children:"Sourses"}),Object(w.jsx)("div",{className:"moreDetails",children:Object(w.jsxs)("p",{children:[Object(w.jsx)(E.a,{className:"detailsIcon"})," Elzero Web School : Sass Course"]})})]}),Object(w.jsx)("h3",{className:"skill-flag",children:"SOFT SKILLS"}),Object(w.jsxs)("div",{className:" course first-course",children:[Object(w.jsx)("div",{className:"  course-icon",children:Object(w.jsx)(E.f,{})}),Object(w.jsx)("div",{className:"course-detail",children:Object(w.jsx)("h3",{children:"COMMUNICATION SKILLS"})})]}),Object(w.jsxs)("div",{className:" course first-course",children:[Object(w.jsx)("div",{className:"  course-icon",children:Object(w.jsx)(E.v,{})}),Object(w.jsx)("div",{className:"course-detail",children:Object(w.jsx)("h3",{children:"MOTIVATED"})})]}),Object(w.jsxs)("div",{className:" course first-course",children:[Object(w.jsx)("div",{className:"  course-icon",children:Object(w.jsx)(E.y,{})}),Object(w.jsx)("div",{className:"course-detail",children:Object(w.jsx)("h3",{children:"CAN WORK IN TEAMS"})})]}),Object(w.jsxs)("div",{className:" course first-course",children:[Object(w.jsx)("div",{className:"  course-icon",children:Object(w.jsx)(E.x,{})}),Object(w.jsx)("div",{className:"course-detail",children:Object(w.jsx)("h3",{children:"Problem Solving"})})]}),Object(w.jsx)("h3",{className:"skill-flag",children:"LANGUAGES"}),Object(w.jsxs)("div",{className:" course first-course",children:[Object(w.jsx)("div",{className:"  course-icon",children:Object(w.jsx)(E.o,{})}),Object(w.jsx)("div",{className:"course-detail",children:Object(w.jsx)("h3",{children:"Arabic"})}),Object(w.jsx)("div",{className:"moreDetails",children:Object(w.jsxs)("p",{children:[Object(w.jsx)(E.a,{className:"detailsIcon"})," Mother Language"]})})]}),Object(w.jsxs)("div",{className:" course first-course",children:[Object(w.jsx)("div",{className:"  course-icon",children:Object(w.jsx)(E.o,{})}),Object(w.jsx)("div",{className:"course-detail",children:Object(w.jsx)("h3",{children:"ENGLISH"})}),Object(w.jsx)("div",{className:"moreDetails",children:Object(w.jsxs)("p",{children:[Object(w.jsx)(E.a,{className:"detailsIcon"})," Professional Working Proficiency"]})})]})]}),Object(w.jsx)("br",{}),Object(w.jsx)("br",{}),Object(w.jsx)("br",{})]})}),W=s(40),R=s.n(W),z=s(33),H=s(32),Y=s(36),K=s(31),q=s(34),V=s(35),X=(s(60),function(){var e=I(),c=e.isFindActive,s=e.setIsFindActive,t=e.taskparicons,i=e.setTaskparicons,a={fillColor:"blue"};return Object(w.jsxs)("div",{className:"".concat(c?"window-container skills-window active":"window-container"),children:[Object(w.jsx)("div",{className:"header",children:Object(w.jsxs)("div",{className:"headerbuttons",children:[Object(w.jsx)("button",{className:" heder-icon",onClick:function(){return s(!1)},children:Object(w.jsx)(E.u,{})}),Object(w.jsx)("button",{className:" heder-icon",onClick:function(){return function(){var e=t.filter((function(e){return 5!==e.id}));i(e),s(!1)}()},children:Object(w.jsx)(E.w,{})})]})}),Object(w.jsxs)("div",{className:"portfolio-header",children:[Object(w.jsx)("h2",{children:"Find Me"}),Object(w.jsx)("svg",{className:"waves",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 1440 320",children:Object(w.jsx)("path",{fill:"#0099ff",fillOpacity:"1",d:"M0,32L60,48C120,64,240,96,360,106.7C480,117,600,107,720,90.7C840,75,960,53,1080,53.3C1200,53,1320,75,1380,85.3L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"})})]}),Object(w.jsx)("div",{className:"map-container",children:Object(w.jsxs)(z.a,{center:[30.04442,31.235712],zoom:9,scrollWheelZoom:!0,children:[Object(w.jsxs)(H.a,{position:"topright",children:[Object(w.jsx)(H.a.BaseLayer,{checked:!0,name:"Open Street Map",children:Object(w.jsx)(Y.a,{attribution:'\xa9 <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"})}),Object(w.jsx)(H.a.BaseLayer,{name:"Satalite Map",children:Object(w.jsx)(Y.a,{attribution:"Tiles \xa9 Esri \u2014 Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",url:"https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"})})]}),Object(w.jsx)(K.a,{center:[30.04442,31.235712],pathOptions:a,radius:2e4}),Object(w.jsx)(K.a,{center:[30.5852132,31.4994808],pathOptions:a,radius:1e4}),Object(w.jsx)(K.a,{center:[30.3062216,31.742574],pathOptions:a,radius:1e4}),Object(w.jsx)(q.a,{position:[30.04442,31.235712],children:Object(w.jsxs)(V.a,{children:["I Can Work in Cairo ",Object(w.jsx)("br",{}),Object(w.jsx)("br",{}),Object(w.jsx)("div",{className:"popup-image-container",children:Object(w.jsx)("img",{className:"popubImage",src:"https://images.kidzapp.com/media/CACHE/images/venues/b6380a06-56bf-11e9-b41b-960e731c160b/e37b6dbcc6fd5e39139aeeb4f4ca8b44.jpg",alt:"Zagazig"})})]})}),Object(w.jsx)(q.a,{position:[30.5852132,31.4994808],children:Object(w.jsxs)(V.a,{children:["I can work in Zagazig ",Object(w.jsx)("br",{}),Object(w.jsx)("br",{}),Object(w.jsx)("div",{className:"popup-image-container",children:Object(w.jsx)("img",{className:"popubImage",src:"https://i.pinimg.com/originals/95/70/47/957047ca36228305c5c5f3c8127455da.png",alt:"Zagazig"})})]})}),Object(w.jsx)(q.a,{position:[30.3062216,31.742574],children:Object(w.jsxs)(V.a,{children:["I Live Here ",Object(w.jsx)("br",{}),Object(w.jsx)("br",{}),Object(w.jsx)("div",{className:"popup-image-container",children:Object(w.jsx)("img",{className:"popubImage",src:"https://media.gemini.media/img/large/2019/10/16/2019_10_16_9_29_39_560.jpg",alt:"Zagazig"})})]})}),Object(w.jsx)(R.a,Object(L.a)({eventHandlers:{}},{position:"topleft",title:"Show me the fullscreen !",titleCancel:"Exit fullscreen mode",content:null,forceSeparateButton:!0,forcePseudoFullscreen:!0,fullscreenElement:!1}))]})})]})}),Q=(s(61),function(){var e=I(),c=e.isSidebar,s=e.setIsSidebar,t=e.result,i=e.activeFromTaskBar,a=e.setIsSubmenuActive,n=e.openSubmenu,r=function(e){var c=e.target.name,s=e.target.getBoundingClientRect(),t=(s.left+s.right)/2-100,i=s.top-170;n(c,{centerMenu:t,topMenu:i})};return Object(w.jsxs)("div",{className:"desktop-container",children:[Object(w.jsx)("div",{className:"desktop-background",children:Object(w.jsx)("img",{src:T,alt:""})}),Object(w.jsx)(F,{}),Object(w.jsx)(U,{}),Object(w.jsx)(Z,{}),Object(w.jsx)(G,{}),Object(w.jsx)(_,{}),Object(w.jsx)(X,{}),Object(w.jsx)("div",{className:"allicon-container",children:g.map((function(e){return Object(w.jsx)(P,Object(L.a)({},e),e.id)}))}),Object(w.jsx)("footer",{children:Object(w.jsxs)("div",{className:"navagation-icons",children:[Object(w.jsx)("button",{"aria-label":"sidebar",onBlur:function(){return s(!1)},onClick:function(){return s(!c)},className:"icon-btn main-icon",children:Object(w.jsx)(D.c,{className:"icon"})}),Object(w.jsx)("button",{"aria-label":"facebook",className:"icon-btn main-icon",children:Object(w.jsx)("a",{"aria-label":"facebook",target:"_blanck",href:"https://www.facebook.com/mostafatarekaioup/",children:Object(w.jsx)(E.i,{className:"icon"})})}),Object(w.jsx)("button",{"aria-label":"github",className:"icon-btn main-icon",children:Object(w.jsx)("a",{"aria-label":"github",target:"_blanck",href:"https://github.com/MostafaTarekAioup",children:Object(w.jsx)(E.j,{className:"icon"})})}),Object(w.jsx)("button",{"aria-label":"linkedin",className:"icon-btn main-icon",children:Object(w.jsx)("a",{"aria-label":"linkedin",target:"_blanck",href:"https://www.linkedin.com/in/mostafa-tarek-050936193",children:Object(w.jsx)(E.p,{className:"icon"})})}),t.map((function(e){var c=e.id,s=e.icon,t=e.title;return Object(w.jsx)("button",{"aria-label":t,name:t,onMouseLeave:function(){return a(!1)},onMouseOver:r,onClick:function(){return i(c)},className:"icon-btn active-icon main-icon ",children:Object(w.jsx)("img",{name:t,className:"icon",src:s,alt:t})},c)}))]})})]})}),$=(s(62),function(){var e=I(),c=e.isSubmenuActive,s=e.setIsSubmenuActive,i=e.location,a=e.submenu,n=a.id,r=a.title,j=a.img,l=e.closeFromSubmenu,o=Object(t.useRef)(null);return Object(t.useEffect)((function(){var e=o.current,c=i.centerMenu,s=i.topMenu;e.style.left="".concat(c,"px"),e.style.top="".concat(s,"px")}),[i]),Object(w.jsxs)("div",{ref:o,onMouseLeave:function(){return s(!1)},onMouseEnter:function(){return s(!0)},className:"".concat(c?"show-submenu submenu-container":"submenu-container"),children:[Object(w.jsxs)("div",{className:"mini-header",children:[Object(w.jsx)("div",{children:Object(w.jsx)("p",{className:"mini-header-title",children:r})}),Object(w.jsx)("div",{className:"headerbuttons",children:Object(w.jsx)("button",{className:"mini-heder-icon",onClick:function(){return l(n)},children:Object(w.jsx)(E.w,{})})})]}),Object(w.jsx)("div",{className:"submenu-img",children:Object(w.jsx)("img",{src:j,alt:r})})]})});var ee=function(){return Object(w.jsx)(w.Fragment,{children:Object(w.jsxs)("main",{children:[Object(w.jsx)(S,{}),Object(w.jsx)(A,{}),Object(w.jsx)(Q,{}),Object(w.jsx)($,{})]})})},ce=function(e){e&&e instanceof Function&&s.e(3).then(s.bind(null,64)).then((function(c){var s=c.getCLS,t=c.getFID,i=c.getFCP,a=c.getLCP,n=c.getTTFB;s(e),t(e),i(e),a(e),n(e)}))};n.a.render(Object(w.jsx)(i.a.StrictMode,{children:Object(w.jsx)(C,{children:Object(w.jsx)(ee,{})})}),document.getElementById("root")),ce()}},[[63,1,2]]]);
//# sourceMappingURL=main.2d977dce.chunk.js.map