webpackJsonp([4],{742:function(e,a,n){"use strict";function t(e){return function(a,n){return new Promise(function(n,t){var o={serviceName:"google",accessToken:e.accessToken,idToken:e.tokenId,expiresIn:200};m.a.post("/login",o).then(function(e){localStorage.setItem("authToken",e.data.data.authToken),localStorage.setItem("user",e.data.data.userId),a({type:N,payload:"none"}),g.browserHistory.push("/")},function(e){a({type:h,payload:!0,message:"An error occurred"})}),n()})}}function o(){return function(e,a){e(a().login.password==a().login.password2?{type:CHANGE_INDEX,payload:1}:{type:E,payload:!0,message:"The password does not match!"})}}function l(){var e=void 0!==window.pageXOffset,a="CSS1Compat"===(document.compatMode||""),n={x:e?window.pageXOffset:a?document.documentElement.scrollLeft:document.body.scrollLeft,y:e?window.pageYOffset:a?document.documentElement.scrollTop:document.body.scrollTop};return function(e,a){Object.assign({},a().login);n.y>0?e({type:v,payload:"block"}):0==n.y&&e({type:v,payload:"none"})}}function r(){return function(e,a){return new Promise(function(n,t){e({type:f,payload:"flex"});var o={name:a().login.name,email:a().login.email,password:a().login.password,password2:a().login.password2};m.a.post("/register",o).then(function(a){localStorage.setItem("authToken",a.data.token),localStorage.setItem("user",JSON.stringify(a.data.user)),e({type:N,payload:"none"}),window.location.href="/"}).catch(function(a){e({type:E,payload:!0,message:a.response.data.message})}),n()})}}function i(){return function(e,a){return new Promise(function(n,t){e({type:f,payload:"flex"});var o={email:a().login.username_log,password:a().login.password_log};m.a.post("/login",o).then(function(a){localStorage.setItem("authToken",a.data.token),a.data.user.status=!0,localStorage.setItem("user",JSON.stringify(a.data.user)),e({type:N,payload:"none"}),window.location.href="/"}).catch(function(a){e({type:h,payload:!0,message:a.response.data.message})}),n()})}}function s(e,a){return{type:y,payload:a,key:e}}function c(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:O,a=arguments[1],n=L[a.type];return n?n(e,a):e}Object.defineProperty(a,"__esModule",{value:!0}),n.d(a,"PROGRESS",function(){return f}),n.d(a,"LOGIN_FALSE",function(){return h}),n.d(a,"SIGNUP_FAILED",function(){return E}),n.d(a,"MAKE_STATE_LOGIN",function(){return y}),n.d(a,"ICON_CHANGE",function(){return v}),n.d(a,"SIGNUP_CLICK",function(){return S}),n.d(a,"SIGNUP_CANCEL",function(){return w}),n.d(a,"CLOSE_DIALOG",function(){return k}),n.d(a,"LOAD_SUCCESS",function(){return N}),a.loginGoogle=t,a.changeIndex=o,a.handleScroll=l,a.handleSignup=r,a.handleLogin=i,a.makeState=s,n.d(a,"closeDialog",function(){return C}),n.d(a,"signupClick",function(){return b}),n.d(a,"signupCancel",function(){return _}),a.default=c;var u,d=n(80),p=n.n(d),m=n(52),g=n(23),f="PROGRESS",h="LOGIN_FALSE",E="SIGNUP_FAILED",y="MAKE_STATE_LOGIN",v="ICON_CHANGE",S="SIGNUP_CLICK",w="SIGNUP_CANCEL",k="CLOSE_DIALOG",N="LOAD_SUCCESS",C=function(){return{type:k,payload:!1}},b=function(){return{type:S,payload:"block"}},_=function(){return{type:w,payload:"none"}},O={display:"none",message:"",dialog:!1,icon:"none",block:"none",name:"",email:"",password:"",password2:""},L=(u={},p()(u,v,function(e,a){return Object.assign({},e,{icon:a.payload})}),p()(u,k,function(e,a){return Object.assign({},e,{dialog:a.payload,block:"none"})}),p()(u,S,function(e,a){return Object.assign({},e,{display:a.payload})}),p()(u,w,function(e,a){return Object.assign({},e,{display:a.payload})}),p()(u,N,function(e,a){return Object.assign({},e,{block:a.payload,display:"none"})}),p()(u,h,function(e,a){return Object.assign({},e,{dialog:a.payload,message:a.message,block:"none"})}),p()(u,E,function(e,a){return Object.assign({},e,{dialog:a.payload,message:a.message,block:"none"})}),p()(u,y,function(e,a){return Object.assign({},e,p()({},a.key,a.payload))}),p()(u,f,function(e,a){return Object.assign({},e,{block:a.payload})}),u)},748:function(e,a,n){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var t=n(96),o=n(742),l=n(765),r={handleLogin:o.handleLogin,makeState:o.makeState,handleSignup:o.handleSignup,handleScroll:o.handleScroll,closeDialog:o.closeDialog,signupClick:o.signupClick,signupCancel:o.signupCancel,loginGoogle:o.loginGoogle},i=function(e){return{login:e.login}};a.default=n.i(t.connect)(i,r)(l.a)},757:function(e,a){},765:function(e,a,n){"use strict";var t=n(0),o=n.n(t),l=n(1),r=n.n(l),i=n(757),s=(n.n(i),n(325)),c=n(767),u=n(766),d=function(e){var a=e.login,n=e.handleLogin,t=e.makeState,l=e.handleSignup,r=e.handleScroll,i=e.closeDialog,d=e.signupClick,p=e.signupCancel,m=e.loginGoogle;return o.a.createElement("div",{style:{margin:"0px!important",padding:"0px!important"}},o.a.createElement(s.a,{display:a.block}),o.a.createElement(c.a,{display:a.display,onCancel:p,handleSignup:l,makeState:t,login:a}),o.a.createElement("div",{className:"nav-bar col-12"},o.a.createElement("ul",null,o.a.createElement("li",null,o.a.createElement("a",{className:"activex",onClick:d},"Sign Up")),o.a.createElement("li",null,o.a.createElement("a",{className:"mess",style:{display:a.icon},href:"#"},'"Cut Air"')),o.a.createElement("li",null,o.a.createElement("a",{className:"mess-icon",style:{display:a.icon},href:"#"})))),o.a.createElement("div",{className:"page-1 col-12"},o.a.createElement(u.a,{closeDialog:i,handleLogin:n,message:a.message,dialog:a.dialog,handleScroll:r,makeState:t,loginGoogle:m}),o.a.createElement("div",{className:"devices-img col-7"})),o.a.createElement("div",{className:"page-2 col-12"},o.a.createElement("div",{className:"page-2-img col-3"}),o.a.createElement("div",{className:"page-2-txt col-3"},o.a.createElement("h1",null,'Introducing video calling in "Cut Air".'),o.a.createElement("p",null,"Now you can have face-to-face conversations with friends and family. It’s fast and easy to make video calls anywhere in the world."),o.a.createElement("a",{className:"btn_learnMore",href:"#"},"LERN MORE"))),o.a.createElement("div",{className:"page-3 col-12"},o.a.createElement("h1",null,"Texting and so much more."),o.a.createElement("p",null,"Check out all you can do in Messenger."),o.a.createElement("div",{className:"page-3-content col-8"},o.a.createElement("div",{className:"content-child col-2"},o.a.createElement("a",{href:""},o.a.createElement("div",{id:"Aa"}),o.a.createElement("h3",null,"Know when people have seen your texts."))),o.a.createElement("div",{className:"content-child col-2"},o.a.createElement("a",{href:""},o.a.createElement("div",{id:"phone_icon"}),o.a.createElement("h3",null,"Make HD calls anywhere in the world."))),o.a.createElement("div",{className:"content-child col-2"},o.a.createElement("a",{href:""},o.a.createElement("div",{id:"camera_icon"}),o.a.createElement("h3",null,"Snap photos and shoot videos.")))),o.a.createElement("div",{className:"page-3-content col-8"},o.a.createElement("div",{className:"content-child col-2"},o.a.createElement("a",{href:""},o.a.createElement("div",{id:"smile"}),o.a.createElement("h3",null,"Choose from thousands of stickers."))),o.a.createElement("div",{className:"content-child col-2"},o.a.createElement("a",{href:""},o.a.createElement("div",{id:"record"}),o.a.createElement("h3",null,"Record voice messages."))),o.a.createElement("div",{className:"content-child col-2"},o.a.createElement("a",{href:""},o.a.createElement("div",{id:"three_somes"}),o.a.createElement("h3",null,"Chat with your favorite groups.")))),o.a.createElement("a",{id:"explore",href:"#"},"EXPLORE")),o.a.createElement("div",{className:"footer col-12"},o.a.createElement("p",null,"The Facebook, Apple, Google Play, and Windows logos are trademarks of their respective owners.")))};d.propTypes={login:r.a.object.isRequired,handleLogin:r.a.func.isRequired,handleSignup:r.a.func.isRequired,handleScroll:r.a.func.isRequired,closeDialog:r.a.func.isRequired,signupClick:r.a.func.isRequired,signupCancel:r.a.func.isRequired,loginGoogle:r.a.func.isRequired},a.a=d},766:function(e,a,n){"use strict";var t=n(75),o=n.n(t),l=n(76),r=n.n(l),i=n(78),s=n.n(i),c=n(77),u=n.n(c),d=n(0),p=n.n(d),m=n(757),g=(n.n(m),n(324)),f=function(e){function a(e){return o()(this,a),s()(this,(a.__proto__||Object.getPrototypeOf(a)).call(this,e))}return u()(a,e),r()(a,[{key:"componentDidMount",value:function(){window.addEventListener("scroll",this.props.handleScroll)}},{key:"componentWillUnmount",value:function(){window.removeEventListener("scroll",this.props.handleScroll)}},{key:"render",value:function(){var e=this;return p.a.createElement("div",{className:"login-field col-5"},p.a.createElement("div",{className:"icon2x"}),p.a.createElement("h1",null,'"Cut Air"'),p.a.createElement("p",null,"Login in With Cut-air"),p.a.createElement("form",{onSubmit:function(a){a.preventDefault(),e.props.handleLogin()}},p.a.createElement("input",{type:"email",onChange:function(a){e.props.makeState("username_log",a.target.value)},name:"username",placeholder:"Email",required:!0}),p.a.createElement("input",{type:"password",onChange:function(a){e.props.makeState("password_log",a.target.value)},name:"password",placeholder:"Password",required:!0}),p.a.createElement("button",{type:"submit"},"Login in"),p.a.createElement("div",{className:"form-group remember-me"},p.a.createElement("div",{className:"fb-login-button","data-width":"320px","data-max-rows":"1","data-size":"large","data-button-type":"login_with","data-show-faces":"false","data-auto-logout-link":"false","data-use-continue-as":"true",onClick:function(){return p.a.createElement("script",null,"checkLoginState()")}}))),p.a.createElement(g.a,{dialog:this.props.dialog,message:this.props.message,closeDialog:this.props.closeDialog}))}}]),a}(p.a.Component);a.a=f},767:function(e,a,n){"use strict";var t=n(75),o=n.n(t),l=n(76),r=n.n(l),i=n(78),s=n.n(i),c=n(77),u=n.n(c),d=n(0),p=n.n(d),m=n(757),g=(n.n(m),function(e){function a(e){return o()(this,a),s()(this,(a.__proto__||Object.getPrototypeOf(a)).call(this,e))}return u()(a,e),r()(a,[{key:"render",value:function(){var e=this;return p.a.createElement("div",{className:"sign-up col-12",style:{display:this.props.display}},p.a.createElement("div",{className:"signup-popup col-4"},p.a.createElement("div",{className:"signup-label"},p.a.createElement("label",null,"Sign Up")),p.a.createElement("form",{onSubmit:function(a){a.preventDefault(),e.props.handleSignup()}},p.a.createElement("input",{type:"text",onChange:function(a){e.props.makeState("name",a.target.value)},name:"name",placeholder:"Name",required:!0,value:this.props.login.name}),p.a.createElement("input",{type:"email",onChange:function(a){e.props.makeState("email",a.target.value)},name:"email",placeholder:"Email",required:!0,value:this.props.login.email}),p.a.createElement("input",{type:"password",onChange:function(a){e.props.makeState("password",a.target.value)},name:"password",placeholder:"Password",required:!0,value:this.props.login.password}),p.a.createElement("input",{type:"password",onChange:function(a){e.props.makeState("password2",a.target.value)},name:"re-password",placeholder:"Re-Password",required:!0,value:this.props.login.password2}),p.a.createElement("div",{className:"btn_form"},p.a.createElement("input",{type:"submit",className:"signup-submit",value:"Register"}),p.a.createElement("input",{type:"button",onClick:this.props.onCancel,className:"signup-cancel",value:"Back to Login"})))))}}]),a}(p.a.Component));a.a=g}});
//# sourceMappingURL=4.2335f935ce2e399841b1.js.map