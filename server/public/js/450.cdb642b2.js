"use strict";(self["webpackChunkvue2"]=self["webpackChunkvue2"]||[]).push([[450],{232:function(t,e,s){s.r(e),s.d(e,{default:function(){return I}});var r=s(7314),a=s(3698),o=s(2938),i=s(4414),n=s(3449),c=s(4679),l=s(9991),d=s(6930),u=s(2756),h=s(4312),m=s(7150),p=s(1034),g=s(7112),f=function(){var t=this,e=t._self._c;return e(n.A,[e(u.A,[e(i.A,[e(a.A,[e(o.ri,{staticClass:"d-flex justify-space-between align-center"},[t._v(" Courses "),e(r.A,{attrs:{color:"primary"},on:{click:function(e){return t.openDialog()}}},[e(d.A,{attrs:{left:""}},[t._v("mdi-plus")]),t._v(" Add Course ")],1)],1),e(c.A,{attrs:{headers:t.headers,items:t.courses,loading:t.loading,search:t.search},scopedSlots:t._u([{key:"top",fn:function(){return[e(g.A,{staticClass:"mx-4",attrs:{label:"Search","prepend-icon":"mdi-magnify"},model:{value:t.search,callback:function(e){t.search=e},expression:"search"}})]},proxy:!0},{key:"item.actions",fn:function({item:s}){return[e(d.A,{staticClass:"mr-2",attrs:{small:""},on:{click:function(e){return t.editItem(s)}}},[t._v(" mdi-pencil ")]),e(d.A,{attrs:{small:""},on:{click:function(e){return t.deleteItem(s)}}},[t._v(" mdi-delete ")])]}}],null,!0)})],1)],1)],1),e(l.A,{attrs:{"max-width":"500px"},model:{value:t.dialog,callback:function(e){t.dialog=e},expression:"dialog"}},[e(a.A,[e(o.ri,[e("span",{staticClass:"headline"},[t._v(t._s(t.formTitle))])]),e(o.OQ,[e(n.A,[e(u.A,[e(i.A,{attrs:{cols:"12"}},[e(g.A,{attrs:{label:"Course Name"},model:{value:t.editedItem.courseName,callback:function(e){t.$set(t.editedItem,"courseName",e)},expression:"editedItem.courseName"}})],1),e(i.A,{attrs:{cols:"12"}},[e(g.A,{attrs:{label:"Course Code"},model:{value:t.editedItem.courseCode,callback:function(e){t.$set(t.editedItem,"courseCode",e)},expression:"editedItem.courseCode"}})],1),e(i.A,{attrs:{cols:"12"}},[e(g.A,{attrs:{label:"Credits",type:"number"},model:{value:t.editedItem.credits,callback:function(e){t.$set(t.editedItem,"credits",e)},expression:"editedItem.credits"}})],1),e(i.A,{attrs:{cols:"12"}},[e(h.A,{attrs:{items:t.programs,"item-text":"program","item-value":"_id",label:"Select Program"},model:{value:t.editedItem.programId,callback:function(e){t.$set(t.editedItem,"programId",e)},expression:"editedItem.programId"}})],1)],1)],1)],1),e(o.SL,[e(p.A),e(r.A,{attrs:{color:"blue darken-1",text:""},on:{click:t.close}},[t._v("Cancel")]),e(r.A,{attrs:{color:"blue darken-1",text:""},on:{click:t.save}},[t._v("Save")])],1)],1)],1),e(m.A,{attrs:{color:t.snackbarColor,timeout:3e3},scopedSlots:t._u([{key:"action",fn:function({attrs:s}){return[e(r.A,t._b({attrs:{text:""},on:{click:function(e){t.snackbar=!1}}},"v-btn",s,!1),[t._v("Close")])]}}]),model:{value:t.snackbar,callback:function(e){t.snackbar=e},expression:"snackbar"}},[t._v(" "+t._s(t.snackbarText)+" ")])],1)},v=[],b=s(1250),k=s(7114),y=s.n(k),A={data:()=>({dialog:!1,search:"",loading:!1,snackbar:!1,snackbarText:"",snackbarColor:"",headers:[{text:"Course Name",align:"start",sortable:!0,value:"courseName"},{text:"Course Code",align:"start",sortable:!0,value:"courseCode"},{text:"Credits",align:"start",sortable:!0,value:"credits"},{text:"Program",align:"start",sortable:!0,value:"programId.program"},{text:"Actions",value:"actions",sortable:!1}],courses:[],programs:[],editedIndex:-1,editedItem:{courseName:"",courseCode:"",credits:"",degreeId:""},defaultItem:{courseName:"",courseCode:"",credits:"",degreeId:""}}),computed:{formTitle(){return-1===this.editedIndex?"New Course":"Edit Course"}},watch:{dialog(t){t||this.close()}},created(){this.fetchCourses(),this.fetchPrograms()},methods:{async fetchCourses(){this.loading=!0;try{const t=await b.A.get(`${y().url}/course`);t.data&&t.data.data&&Array.isArray(t.data.data.items)?this.courses=t.data.data.items:(console.error("Unexpected response structure:",t.data),this.showSnackbar("Error fetching courses: Unexpected data structure","error"))}catch(t){console.error("Error fetching courses:",t),this.showSnackbar("Error fetching courses","error")}finally{this.loading=!1}},async fetchPrograms(){try{const t=await b.A.get(`${y().url}/program`);console.log(t),t.data&&t.data.data&&Array.isArray(t.data.data.items)?this.programs=t.data.data.items:(console.error("Unexpected response structure:",t.data),this.showSnackbar("Error fetching programs: Unexpected data structure","error"))}catch(t){console.error("Error fetching programs:",t),this.showSnackbar("Error fetching programs","error")}},editItem(t){this.editedIndex=this.courses.indexOf(t),this.editedItem=Object.assign({},t),this.dialog=!0},async deleteItem(t){if(!t||!t._id)return console.error("Invalid item for deletion:",t),void this.showSnackbar("Error: Invalid item for deletion","error");const e=this.courses.indexOf(t);if(confirm("Are you sure you want to delete this course?"))try{const s=await b.A.delete(`${y().url}/course/${t._id}`);204===s.status?(this.courses.splice(e,1),this.showSnackbar("Course deleted","success")):(console.error("Unexpected response status:",s.status),this.showSnackbar("Error deleting course: Unexpected response","error"))}catch(s){console.error("Error deleting course:",s),this.showSnackbar("Error deleting course","error")}},close(){this.dialog=!1,this.$nextTick((()=>{this.editedItem=Object.assign({},this.defaultItem),this.editedIndex=-1}))},async save(){try{if(this.editedIndex>-1){if(!this.editedItem||!this.editedItem._id)return console.error("Invalid item for update:",this.editedItem),void this.showSnackbar("Error: Invalid item for update","error");const t=await b.A.put(`${y().url}/course/${this.editedItem._id}`,this.editedItem);if(t.data&&t.data.data&&t.data.data.item){const e=t.data.data.item;Object.assign(this.courses[this.editedIndex],e),this.showSnackbar("Course updated","success")}else console.error("Unexpected response structure:",t.data),this.showSnackbar("Error updating course: Unexpected data structure","error")}else{const t=await b.A.post(`${y().url}/course`,this.editedItem);t.data&&t.data.data&&t.data.data.item?(this.fetchCourses(),this.showSnackbar("Course added","success")):(console.error("Unexpected response structure:",t.data),this.showSnackbar("Error adding course: Unexpected data structure","error"))}}catch(t){console.error("Error saving course:",t),this.showSnackbar("Error saving course","error")}finally{this.close()}},openDialog(){this.dialog=!0},showSnackbar(t,e){this.snackbarText=t,this.snackbarColor=e,this.snackbar=!0}}},C=A,x=s(1656),w=(0,x.A)(C,f,v,!1,null,"10df1557",null),I=w.exports},4414:function(t,e,s){s(4114),s(125);var r=s(5471),a=s(8041),o=s(4152);const i=["sm","md","lg","xl"],n=(()=>i.reduce(((t,e)=>(t[e]={type:[Boolean,String,Number],default:!1},t)),{}))(),c=(()=>i.reduce(((t,e)=>(t["offset"+(0,o.Zb)(e)]={type:[String,Number],default:null},t)),{}))(),l=(()=>i.reduce(((t,e)=>(t["order"+(0,o.Zb)(e)]={type:[String,Number],default:null},t)),{}))(),d={col:Object.keys(n),offset:Object.keys(c),order:Object.keys(l)};function u(t,e,s){let r=t;if(null!=s&&!1!==s){if(e){const s=e.replace(t,"");r+=`-${s}`}return"col"!==t||""!==s&&!0!==s?(r+=`-${s}`,r.toLowerCase()):r.toLowerCase()}}const h=new Map;e.A=r.Ay.extend({name:"v-col",functional:!0,props:{cols:{type:[Boolean,String,Number],default:!1},...n,offset:{type:[String,Number],default:null},...c,order:{type:[String,Number],default:null},...l,alignSelf:{type:String,default:null,validator:t=>["auto","start","end","center","baseline","stretch"].includes(t)},tag:{type:String,default:"div"}},render(t,{props:e,data:s,children:r,parent:o}){let i="";for(const a in e)i+=String(e[a]);let n=h.get(i);if(!n){let t;for(t in n=[],d)d[t].forEach((s=>{const r=e[s],a=u(t,s,r);a&&n.push(a)}));const s=n.some((t=>t.startsWith("col-")));n.push({col:!s||!e.cols,[`col-${e.cols}`]:e.cols,[`offset-${e.offset}`]:e.offset,[`order-${e.order}`]:e.order,[`align-self-${e.alignSelf}`]:e.alignSelf}),h.set(i,n)}return t(e.tag,(0,a.Ay)(s,{class:n}),r)}})},2756:function(t,e,s){s(4114),s(125);var r=s(5471),a=s(8041),o=s(4152);const i=["sm","md","lg","xl"],n=["start","end","center"];function c(t,e){return i.reduce(((s,r)=>(s[t+(0,o.Zb)(r)]=e(),s)),{})}const l=t=>[...n,"baseline","stretch"].includes(t),d=c("align",(()=>({type:String,default:null,validator:l}))),u=t=>[...n,"space-between","space-around"].includes(t),h=c("justify",(()=>({type:String,default:null,validator:u}))),m=t=>[...n,"space-between","space-around","stretch"].includes(t),p=c("alignContent",(()=>({type:String,default:null,validator:m}))),g={align:Object.keys(d),justify:Object.keys(h),alignContent:Object.keys(p)},f={align:"align",justify:"justify",alignContent:"align-content"};function v(t,e,s){let r=f[t];if(null!=s){if(e){const s=e.replace(t,"");r+=`-${s}`}return r+=`-${s}`,r.toLowerCase()}}const b=new Map;e.A=r.Ay.extend({name:"v-row",functional:!0,props:{tag:{type:String,default:"div"},dense:Boolean,noGutters:Boolean,align:{type:String,default:null,validator:l},...d,justify:{type:String,default:null,validator:u},...h,alignContent:{type:String,default:null,validator:m},...p},render(t,{props:e,data:s,children:r}){let o="";for(const a in e)o+=String(e[a]);let i=b.get(o);if(!i){let t;for(t in i=[],g)g[t].forEach((s=>{const r=e[s],a=v(t,s,r);a&&i.push(a)}));i.push({"no-gutters":e.noGutters,"row--dense":e.dense,[`align-${e.align}`]:e.align,[`justify-${e.justify}`]:e.justify,[`align-content-${e.alignContent}`]:e.alignContent}),b.set(o,i)}return t(e.tag,(0,a.Ay)(s,{staticClass:"row",class:i}),r)}})},7150:function(t,e,s){s.d(e,{A:function(){return u}});var r=s(8184),a=s(8743),o=s(3381),i=s(428),n=s(6763),c=s(5803),l=s(4152),d=s(6988),u=(0,c.A)(r.A,a.A,i.A,(0,n.P)(["absolute","bottom","left","right","top"])).extend({name:"v-snackbar",props:{app:Boolean,centered:Boolean,contentClass:{type:String,default:""},multiLine:Boolean,text:Boolean,timeout:{type:[Number,String],default:5e3},transition:{type:[Boolean,String],default:"v-snack-transition",validator:t=>"string"===typeof t||!1===t},vertical:Boolean},data:()=>({activeTimeout:-1}),computed:{classes(){return{"v-snack--absolute":this.absolute,"v-snack--active":this.isActive,"v-snack--bottom":this.bottom||!this.top,"v-snack--centered":this.centered,"v-snack--has-background":this.hasBackground,"v-snack--left":this.left,"v-snack--multi-line":this.multiLine&&!this.vertical,"v-snack--right":this.right,"v-snack--text":this.text,"v-snack--top":this.top,"v-snack--vertical":this.vertical}},hasBackground(){return!this.text&&!this.outlined},isDark(){return this.hasBackground?!this.light:o.A.options.computed.isDark.call(this)},styles(){if(this.absolute||!this.app)return{};const{bar:t,bottom:e,footer:s,insetFooter:r,left:a,right:o,top:i}=this.$vuetify.application;return{paddingBottom:(0,l.Dg)(e+s+r),paddingLeft:(0,l.Dg)(a),paddingRight:(0,l.Dg)(o),paddingTop:(0,l.Dg)(t+i)}}},watch:{isActive:"setTimeout",timeout:"setTimeout"},mounted(){this.isActive&&this.setTimeout()},created(){this.$attrs.hasOwnProperty("auto-height")&&(0,d.rq)("auto-height",this),0==this.timeout&&(0,d.CI)('timeout="0"',"-1",this)},methods:{genActions(){return this.$createElement("div",{staticClass:"v-snack__action "},[(0,l.$c)(this,"action",{attrs:{class:"v-snack__btn"}})])},genContent(){return this.$createElement("div",{staticClass:"v-snack__content",class:{[this.contentClass]:!0},attrs:{role:"status","aria-live":"polite"}},[(0,l.$c)(this)])},genWrapper(){const t=this.hasBackground?this.setBackgroundColor:this.setTextColor,e=t(this.color,{staticClass:"v-snack__wrapper",class:r.A.options.computed.classes.call(this),style:r.A.options.computed.styles.call(this),directives:[{name:"show",value:this.isActive}],on:{pointerenter:()=>window.clearTimeout(this.activeTimeout),pointerleave:this.setTimeout}});return this.$createElement("div",e,[this.genContent(),this.genActions()])},genTransition(){return this.$createElement("transition",{props:{name:this.transition}},[this.genWrapper()])},setTimeout(){window.clearTimeout(this.activeTimeout);const t=Number(this.timeout);this.isActive&&![0,-1].includes(t)&&(this.activeTimeout=window.setTimeout((()=>{this.isActive=!1}),t))}},render(t){return t("div",{staticClass:"v-snack",class:this.classes,style:this.styles},[!1!==this.transition?this.genTransition():this.genWrapper()])}})}}]);
//# sourceMappingURL=450.cdb642b2.js.map