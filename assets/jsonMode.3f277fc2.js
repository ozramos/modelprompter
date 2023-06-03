import{x as Ye}from"./Channel.5882bdd4.js";import"./index.bdc5ec04.js";import"./QInput.5a3f9ba6.js";import"./db.f4492f1e.js";/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.33.0(4b1abad427e58dbedc1215d99a0902ffc885fcd4)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/var $e=Object.defineProperty,Ge=Object.getOwnPropertyDescriptor,Qe=Object.getOwnPropertyNames,Ze=Object.prototype.hasOwnProperty,Ke=(e,n,i,t)=>{if(n&&typeof n=="object"||typeof n=="function")for(let r of Qe(n))!Ze.call(e,r)&&(i||r!=="default")&&$e(e,r,{get:()=>n[r],enumerable:!(t=Ge(n,r))||t.enumerable});return e},l={};Ke(l,Ye);var er=2*60*1e3,rr=class{_defaults;_idleCheckInterval;_lastUsedTime;_configChangeListener;_worker;_client;constructor(e){this._defaults=e,this._worker=null,this._client=null,this._idleCheckInterval=window.setInterval(()=>this._checkIfIdle(),30*1e3),this._lastUsedTime=0,this._configChangeListener=this._defaults.onDidChange(()=>this._stopWorker())}_stopWorker(){this._worker&&(this._worker.dispose(),this._worker=null),this._client=null}dispose(){clearInterval(this._idleCheckInterval),this._configChangeListener.dispose(),this._stopWorker()}_checkIfIdle(){if(!this._worker)return;Date.now()-this._lastUsedTime>er&&this._stopWorker()}_getClient(){return this._lastUsedTime=Date.now(),this._client||(this._worker=l.editor.createWebWorker({moduleId:"vs/language/json/jsonWorker",label:this._defaults.languageId,createData:{languageSettings:this._defaults.diagnosticsOptions,languageId:this._defaults.languageId,enableSchemaRequest:this._defaults.diagnosticsOptions.enableSchemaRequest}}),this._client=this._worker.getProxy()),this._client}getLanguageServiceWorker(...e){let n;return this._getClient().then(i=>{n=i}).then(i=>{if(this._worker)return this._worker.withSyncedResources(e)}).then(i=>n)}},se;(function(e){e.MIN_VALUE=-2147483648,e.MAX_VALUE=2147483647})(se||(se={}));var J;(function(e){e.MIN_VALUE=0,e.MAX_VALUE=2147483647})(J||(J={}));var I;(function(e){function n(t,r){return t===Number.MAX_VALUE&&(t=J.MAX_VALUE),r===Number.MAX_VALUE&&(r=J.MAX_VALUE),{line:t,character:r}}e.create=n;function i(t){var r=t;return o.objectLiteral(r)&&o.uinteger(r.line)&&o.uinteger(r.character)}e.is=i})(I||(I={}));var _;(function(e){function n(t,r,a,s){if(o.uinteger(t)&&o.uinteger(r)&&o.uinteger(a)&&o.uinteger(s))return{start:I.create(t,r),end:I.create(a,s)};if(I.is(t)&&I.is(r))return{start:t,end:r};throw new Error("Range#create called with invalid arguments["+t+", "+r+", "+a+", "+s+"]")}e.create=n;function i(t){var r=t;return o.objectLiteral(r)&&I.is(r.start)&&I.is(r.end)}e.is=i})(_||(_={}));var ee;(function(e){function n(t,r){return{uri:t,range:r}}e.create=n;function i(t){var r=t;return o.defined(r)&&_.is(r.range)&&(o.string(r.uri)||o.undefined(r.uri))}e.is=i})(ee||(ee={}));var oe;(function(e){function n(t,r,a,s){return{targetUri:t,targetRange:r,targetSelectionRange:a,originSelectionRange:s}}e.create=n;function i(t){var r=t;return o.defined(r)&&_.is(r.targetRange)&&o.string(r.targetUri)&&(_.is(r.targetSelectionRange)||o.undefined(r.targetSelectionRange))&&(_.is(r.originSelectionRange)||o.undefined(r.originSelectionRange))}e.is=i})(oe||(oe={}));var re;(function(e){function n(t,r,a,s){return{red:t,green:r,blue:a,alpha:s}}e.create=n;function i(t){var r=t;return o.numberRange(r.red,0,1)&&o.numberRange(r.green,0,1)&&o.numberRange(r.blue,0,1)&&o.numberRange(r.alpha,0,1)}e.is=i})(re||(re={}));var ue;(function(e){function n(t,r){return{range:t,color:r}}e.create=n;function i(t){var r=t;return _.is(r.range)&&re.is(r.color)}e.is=i})(ue||(ue={}));var ce;(function(e){function n(t,r,a){return{label:t,textEdit:r,additionalTextEdits:a}}e.create=n;function i(t){var r=t;return o.string(r.label)&&(o.undefined(r.textEdit)||P.is(r))&&(o.undefined(r.additionalTextEdits)||o.typedArray(r.additionalTextEdits,P.is))}e.is=i})(ce||(ce={}));var F;(function(e){e.Comment="comment",e.Imports="imports",e.Region="region"})(F||(F={}));var de;(function(e){function n(t,r,a,s,u){var c={startLine:t,endLine:r};return o.defined(a)&&(c.startCharacter=a),o.defined(s)&&(c.endCharacter=s),o.defined(u)&&(c.kind=u),c}e.create=n;function i(t){var r=t;return o.uinteger(r.startLine)&&o.uinteger(r.startLine)&&(o.undefined(r.startCharacter)||o.uinteger(r.startCharacter))&&(o.undefined(r.endCharacter)||o.uinteger(r.endCharacter))&&(o.undefined(r.kind)||o.string(r.kind))}e.is=i})(de||(de={}));var te;(function(e){function n(t,r){return{location:t,message:r}}e.create=n;function i(t){var r=t;return o.defined(r)&&ee.is(r.location)&&o.string(r.message)}e.is=i})(te||(te={}));var D;(function(e){e.Error=1,e.Warning=2,e.Information=3,e.Hint=4})(D||(D={}));var fe;(function(e){e.Unnecessary=1,e.Deprecated=2})(fe||(fe={}));var le;(function(e){function n(i){var t=i;return t!=null&&o.string(t.href)}e.is=n})(le||(le={}));var Y;(function(e){function n(t,r,a,s,u,c){var d={range:t,message:r};return o.defined(a)&&(d.severity=a),o.defined(s)&&(d.code=s),o.defined(u)&&(d.source=u),o.defined(c)&&(d.relatedInformation=c),d}e.create=n;function i(t){var r,a=t;return o.defined(a)&&_.is(a.range)&&o.string(a.message)&&(o.number(a.severity)||o.undefined(a.severity))&&(o.integer(a.code)||o.string(a.code)||o.undefined(a.code))&&(o.undefined(a.codeDescription)||o.string((r=a.codeDescription)===null||r===void 0?void 0:r.href))&&(o.string(a.source)||o.undefined(a.source))&&(o.undefined(a.relatedInformation)||o.typedArray(a.relatedInformation,te.is))}e.is=i})(Y||(Y={}));var U;(function(e){function n(t,r){for(var a=[],s=2;s<arguments.length;s++)a[s-2]=arguments[s];var u={title:t,command:r};return o.defined(a)&&a.length>0&&(u.arguments=a),u}e.create=n;function i(t){var r=t;return o.defined(r)&&o.string(r.title)&&o.string(r.command)}e.is=i})(U||(U={}));var P;(function(e){function n(a,s){return{range:a,newText:s}}e.replace=n;function i(a,s){return{range:{start:a,end:a},newText:s}}e.insert=i;function t(a){return{range:a,newText:""}}e.del=t;function r(a){var s=a;return o.objectLiteral(s)&&o.string(s.newText)&&_.is(s.range)}e.is=r})(P||(P={}));var O;(function(e){function n(t,r,a){var s={label:t};return r!==void 0&&(s.needsConfirmation=r),a!==void 0&&(s.description=a),s}e.create=n;function i(t){var r=t;return r!==void 0&&o.objectLiteral(r)&&o.string(r.label)&&(o.boolean(r.needsConfirmation)||r.needsConfirmation===void 0)&&(o.string(r.description)||r.description===void 0)}e.is=i})(O||(O={}));var w;(function(e){function n(i){var t=i;return typeof t=="string"}e.is=n})(w||(w={}));var T;(function(e){function n(a,s,u){return{range:a,newText:s,annotationId:u}}e.replace=n;function i(a,s,u){return{range:{start:a,end:a},newText:s,annotationId:u}}e.insert=i;function t(a,s){return{range:a,newText:"",annotationId:s}}e.del=t;function r(a){var s=a;return P.is(s)&&(O.is(s.annotationId)||w.is(s.annotationId))}e.is=r})(T||(T={}));var $;(function(e){function n(t,r){return{textDocument:t,edits:r}}e.create=n;function i(t){var r=t;return o.defined(r)&&G.is(r.textDocument)&&Array.isArray(r.edits)}e.is=i})($||($={}));var V;(function(e){function n(t,r,a){var s={kind:"create",uri:t};return r!==void 0&&(r.overwrite!==void 0||r.ignoreIfExists!==void 0)&&(s.options=r),a!==void 0&&(s.annotationId=a),s}e.create=n;function i(t){var r=t;return r&&r.kind==="create"&&o.string(r.uri)&&(r.options===void 0||(r.options.overwrite===void 0||o.boolean(r.options.overwrite))&&(r.options.ignoreIfExists===void 0||o.boolean(r.options.ignoreIfExists)))&&(r.annotationId===void 0||w.is(r.annotationId))}e.is=i})(V||(V={}));var H;(function(e){function n(t,r,a,s){var u={kind:"rename",oldUri:t,newUri:r};return a!==void 0&&(a.overwrite!==void 0||a.ignoreIfExists!==void 0)&&(u.options=a),s!==void 0&&(u.annotationId=s),u}e.create=n;function i(t){var r=t;return r&&r.kind==="rename"&&o.string(r.oldUri)&&o.string(r.newUri)&&(r.options===void 0||(r.options.overwrite===void 0||o.boolean(r.options.overwrite))&&(r.options.ignoreIfExists===void 0||o.boolean(r.options.ignoreIfExists)))&&(r.annotationId===void 0||w.is(r.annotationId))}e.is=i})(H||(H={}));var z;(function(e){function n(t,r,a){var s={kind:"delete",uri:t};return r!==void 0&&(r.recursive!==void 0||r.ignoreIfNotExists!==void 0)&&(s.options=r),a!==void 0&&(s.annotationId=a),s}e.create=n;function i(t){var r=t;return r&&r.kind==="delete"&&o.string(r.uri)&&(r.options===void 0||(r.options.recursive===void 0||o.boolean(r.options.recursive))&&(r.options.ignoreIfNotExists===void 0||o.boolean(r.options.ignoreIfNotExists)))&&(r.annotationId===void 0||w.is(r.annotationId))}e.is=i})(z||(z={}));var ne;(function(e){function n(i){var t=i;return t&&(t.changes!==void 0||t.documentChanges!==void 0)&&(t.documentChanges===void 0||t.documentChanges.every(function(r){return o.string(r.kind)?V.is(r)||H.is(r)||z.is(r):$.is(r)}))}e.is=n})(ne||(ne={}));var X=function(){function e(n,i){this.edits=n,this.changeAnnotations=i}return e.prototype.insert=function(n,i,t){var r,a;if(t===void 0?r=P.insert(n,i):w.is(t)?(a=t,r=T.insert(n,i,t)):(this.assertChangeAnnotations(this.changeAnnotations),a=this.changeAnnotations.manage(t),r=T.insert(n,i,a)),this.edits.push(r),a!==void 0)return a},e.prototype.replace=function(n,i,t){var r,a;if(t===void 0?r=P.replace(n,i):w.is(t)?(a=t,r=T.replace(n,i,t)):(this.assertChangeAnnotations(this.changeAnnotations),a=this.changeAnnotations.manage(t),r=T.replace(n,i,a)),this.edits.push(r),a!==void 0)return a},e.prototype.delete=function(n,i){var t,r;if(i===void 0?t=P.del(n):w.is(i)?(r=i,t=T.del(n,i)):(this.assertChangeAnnotations(this.changeAnnotations),r=this.changeAnnotations.manage(i),t=T.del(n,r)),this.edits.push(t),r!==void 0)return r},e.prototype.add=function(n){this.edits.push(n)},e.prototype.all=function(){return this.edits},e.prototype.clear=function(){this.edits.splice(0,this.edits.length)},e.prototype.assertChangeAnnotations=function(n){if(n===void 0)throw new Error("Text edit change is not configured to manage change annotations.")},e}(),ge=function(){function e(n){this._annotations=n===void 0?Object.create(null):n,this._counter=0,this._size=0}return e.prototype.all=function(){return this._annotations},Object.defineProperty(e.prototype,"size",{get:function(){return this._size},enumerable:!1,configurable:!0}),e.prototype.manage=function(n,i){var t;if(w.is(n)?t=n:(t=this.nextId(),i=n),this._annotations[t]!==void 0)throw new Error("Id "+t+" is already in use.");if(i===void 0)throw new Error("No annotation provided for id "+t);return this._annotations[t]=i,this._size++,t},e.prototype.nextId=function(){return this._counter++,this._counter.toString()},e}();(function(){function e(n){var i=this;this._textEditChanges=Object.create(null),n!==void 0?(this._workspaceEdit=n,n.documentChanges?(this._changeAnnotations=new ge(n.changeAnnotations),n.changeAnnotations=this._changeAnnotations.all(),n.documentChanges.forEach(function(t){if($.is(t)){var r=new X(t.edits,i._changeAnnotations);i._textEditChanges[t.textDocument.uri]=r}})):n.changes&&Object.keys(n.changes).forEach(function(t){var r=new X(n.changes[t]);i._textEditChanges[t]=r})):this._workspaceEdit={}}return Object.defineProperty(e.prototype,"edit",{get:function(){return this.initDocumentChanges(),this._changeAnnotations!==void 0&&(this._changeAnnotations.size===0?this._workspaceEdit.changeAnnotations=void 0:this._workspaceEdit.changeAnnotations=this._changeAnnotations.all()),this._workspaceEdit},enumerable:!1,configurable:!0}),e.prototype.getTextEditChange=function(n){if(G.is(n)){if(this.initDocumentChanges(),this._workspaceEdit.documentChanges===void 0)throw new Error("Workspace edit is not configured for document changes.");var i={uri:n.uri,version:n.version},t=this._textEditChanges[i.uri];if(!t){var r=[],a={textDocument:i,edits:r};this._workspaceEdit.documentChanges.push(a),t=new X(r,this._changeAnnotations),this._textEditChanges[i.uri]=t}return t}else{if(this.initChanges(),this._workspaceEdit.changes===void 0)throw new Error("Workspace edit is not configured for normal text edit changes.");var t=this._textEditChanges[n];if(!t){var r=[];this._workspaceEdit.changes[n]=r,t=new X(r),this._textEditChanges[n]=t}return t}},e.prototype.initDocumentChanges=function(){this._workspaceEdit.documentChanges===void 0&&this._workspaceEdit.changes===void 0&&(this._changeAnnotations=new ge,this._workspaceEdit.documentChanges=[],this._workspaceEdit.changeAnnotations=this._changeAnnotations.all())},e.prototype.initChanges=function(){this._workspaceEdit.documentChanges===void 0&&this._workspaceEdit.changes===void 0&&(this._workspaceEdit.changes=Object.create(null))},e.prototype.createFile=function(n,i,t){if(this.initDocumentChanges(),this._workspaceEdit.documentChanges===void 0)throw new Error("Workspace edit is not configured for document changes.");var r;O.is(i)||w.is(i)?r=i:t=i;var a,s;if(r===void 0?a=V.create(n,t):(s=w.is(r)?r:this._changeAnnotations.manage(r),a=V.create(n,t,s)),this._workspaceEdit.documentChanges.push(a),s!==void 0)return s},e.prototype.renameFile=function(n,i,t,r){if(this.initDocumentChanges(),this._workspaceEdit.documentChanges===void 0)throw new Error("Workspace edit is not configured for document changes.");var a;O.is(t)||w.is(t)?a=t:r=t;var s,u;if(a===void 0?s=H.create(n,i,r):(u=w.is(a)?a:this._changeAnnotations.manage(a),s=H.create(n,i,r,u)),this._workspaceEdit.documentChanges.push(s),u!==void 0)return u},e.prototype.deleteFile=function(n,i,t){if(this.initDocumentChanges(),this._workspaceEdit.documentChanges===void 0)throw new Error("Workspace edit is not configured for document changes.");var r;O.is(i)||w.is(i)?r=i:t=i;var a,s;if(r===void 0?a=z.create(n,t):(s=w.is(r)?r:this._changeAnnotations.manage(r),a=z.create(n,t,s)),this._workspaceEdit.documentChanges.push(a),s!==void 0)return s},e})();var he;(function(e){function n(t){return{uri:t}}e.create=n;function i(t){var r=t;return o.defined(r)&&o.string(r.uri)}e.is=i})(he||(he={}));var ve;(function(e){function n(t,r){return{uri:t,version:r}}e.create=n;function i(t){var r=t;return o.defined(r)&&o.string(r.uri)&&o.integer(r.version)}e.is=i})(ve||(ve={}));var G;(function(e){function n(t,r){return{uri:t,version:r}}e.create=n;function i(t){var r=t;return o.defined(r)&&o.string(r.uri)&&(r.version===null||o.integer(r.version))}e.is=i})(G||(G={}));var pe;(function(e){function n(t,r,a,s){return{uri:t,languageId:r,version:a,text:s}}e.create=n;function i(t){var r=t;return o.defined(r)&&o.string(r.uri)&&o.string(r.languageId)&&o.integer(r.version)&&o.string(r.text)}e.is=i})(pe||(pe={}));var B;(function(e){e.PlainText="plaintext",e.Markdown="markdown"})(B||(B={}));(function(e){function n(i){var t=i;return t===e.PlainText||t===e.Markdown}e.is=n})(B||(B={}));var ie;(function(e){function n(i){var t=i;return o.objectLiteral(i)&&B.is(t.kind)&&o.string(t.value)}e.is=n})(ie||(ie={}));var p;(function(e){e.Text=1,e.Method=2,e.Function=3,e.Constructor=4,e.Field=5,e.Variable=6,e.Class=7,e.Interface=8,e.Module=9,e.Property=10,e.Unit=11,e.Value=12,e.Enum=13,e.Keyword=14,e.Snippet=15,e.Color=16,e.File=17,e.Reference=18,e.Folder=19,e.EnumMember=20,e.Constant=21,e.Struct=22,e.Event=23,e.Operator=24,e.TypeParameter=25})(p||(p={}));var ae;(function(e){e.PlainText=1,e.Snippet=2})(ae||(ae={}));var me;(function(e){e.Deprecated=1})(me||(me={}));var _e;(function(e){function n(t,r,a){return{newText:t,insert:r,replace:a}}e.create=n;function i(t){var r=t;return r&&o.string(r.newText)&&_.is(r.insert)&&_.is(r.replace)}e.is=i})(_e||(_e={}));var ke;(function(e){e.asIs=1,e.adjustIndentation=2})(ke||(ke={}));var we;(function(e){function n(i){return{label:i}}e.create=n})(we||(we={}));var be;(function(e){function n(i,t){return{items:i||[],isIncomplete:!!t}}e.create=n})(be||(be={}));var Q;(function(e){function n(t){return t.replace(/[\\`*_{}[\]()#+\-.!]/g,"\\$&")}e.fromPlainText=n;function i(t){var r=t;return o.string(r)||o.objectLiteral(r)&&o.string(r.language)&&o.string(r.value)}e.is=i})(Q||(Q={}));var Ce;(function(e){function n(i){var t=i;return!!t&&o.objectLiteral(t)&&(ie.is(t.contents)||Q.is(t.contents)||o.typedArray(t.contents,Q.is))&&(i.range===void 0||_.is(i.range))}e.is=n})(Ce||(Ce={}));var Ee;(function(e){function n(i,t){return t?{label:i,documentation:t}:{label:i}}e.create=n})(Ee||(Ee={}));var Ae;(function(e){function n(i,t){for(var r=[],a=2;a<arguments.length;a++)r[a-2]=arguments[a];var s={label:i};return o.defined(t)&&(s.documentation=t),o.defined(r)?s.parameters=r:s.parameters=[],s}e.create=n})(Ae||(Ae={}));var W;(function(e){e.Text=1,e.Read=2,e.Write=3})(W||(W={}));var Se;(function(e){function n(i,t){var r={range:i};return o.number(t)&&(r.kind=t),r}e.create=n})(Se||(Se={}));var m;(function(e){e.File=1,e.Module=2,e.Namespace=3,e.Package=4,e.Class=5,e.Method=6,e.Property=7,e.Field=8,e.Constructor=9,e.Enum=10,e.Interface=11,e.Function=12,e.Variable=13,e.Constant=14,e.String=15,e.Number=16,e.Boolean=17,e.Array=18,e.Object=19,e.Key=20,e.Null=21,e.EnumMember=22,e.Struct=23,e.Event=24,e.Operator=25,e.TypeParameter=26})(m||(m={}));var ye;(function(e){e.Deprecated=1})(ye||(ye={}));var Ie;(function(e){function n(i,t,r,a,s){var u={name:i,kind:t,location:{uri:a,range:r}};return s&&(u.containerName=s),u}e.create=n})(Ie||(Ie={}));var Te;(function(e){function n(t,r,a,s,u,c){var d={name:t,detail:r,kind:a,range:s,selectionRange:u};return c!==void 0&&(d.children=c),d}e.create=n;function i(t){var r=t;return r&&o.string(r.name)&&o.number(r.kind)&&_.is(r.range)&&_.is(r.selectionRange)&&(r.detail===void 0||o.string(r.detail))&&(r.deprecated===void 0||o.boolean(r.deprecated))&&(r.children===void 0||Array.isArray(r.children))&&(r.tags===void 0||Array.isArray(r.tags))}e.is=i})(Te||(Te={}));var Pe;(function(e){e.Empty="",e.QuickFix="quickfix",e.Refactor="refactor",e.RefactorExtract="refactor.extract",e.RefactorInline="refactor.inline",e.RefactorRewrite="refactor.rewrite",e.Source="source",e.SourceOrganizeImports="source.organizeImports",e.SourceFixAll="source.fixAll"})(Pe||(Pe={}));var Le;(function(e){function n(t,r){var a={diagnostics:t};return r!=null&&(a.only=r),a}e.create=n;function i(t){var r=t;return o.defined(r)&&o.typedArray(r.diagnostics,Y.is)&&(r.only===void 0||o.typedArray(r.only,o.string))}e.is=i})(Le||(Le={}));var Me;(function(e){function n(t,r,a){var s={title:t},u=!0;return typeof r=="string"?(u=!1,s.kind=r):U.is(r)?s.command=r:s.edit=r,u&&a!==void 0&&(s.kind=a),s}e.create=n;function i(t){var r=t;return r&&o.string(r.title)&&(r.diagnostics===void 0||o.typedArray(r.diagnostics,Y.is))&&(r.kind===void 0||o.string(r.kind))&&(r.edit!==void 0||r.command!==void 0)&&(r.command===void 0||U.is(r.command))&&(r.isPreferred===void 0||o.boolean(r.isPreferred))&&(r.edit===void 0||ne.is(r.edit))}e.is=i})(Me||(Me={}));var Re;(function(e){function n(t,r){var a={range:t};return o.defined(r)&&(a.data=r),a}e.create=n;function i(t){var r=t;return o.defined(r)&&_.is(r.range)&&(o.undefined(r.command)||U.is(r.command))}e.is=i})(Re||(Re={}));var De;(function(e){function n(t,r){return{tabSize:t,insertSpaces:r}}e.create=n;function i(t){var r=t;return o.defined(r)&&o.uinteger(r.tabSize)&&o.boolean(r.insertSpaces)}e.is=i})(De||(De={}));var Ne;(function(e){function n(t,r,a){return{range:t,target:r,data:a}}e.create=n;function i(t){var r=t;return o.defined(r)&&_.is(r.range)&&(o.undefined(r.target)||o.string(r.target))}e.is=i})(Ne||(Ne={}));var Oe;(function(e){function n(t,r){return{range:t,parent:r}}e.create=n;function i(t){var r=t;return r!==void 0&&_.is(r.range)&&(r.parent===void 0||e.is(r.parent))}e.is=i})(Oe||(Oe={}));var xe;(function(e){function n(a,s,u,c){return new tr(a,s,u,c)}e.create=n;function i(a){var s=a;return!!(o.defined(s)&&o.string(s.uri)&&(o.undefined(s.languageId)||o.string(s.languageId))&&o.uinteger(s.lineCount)&&o.func(s.getText)&&o.func(s.positionAt)&&o.func(s.offsetAt))}e.is=i;function t(a,s){for(var u=a.getText(),c=r(s,function(y,M){var x=y.range.start.line-M.range.start.line;return x===0?y.range.start.character-M.range.start.character:x}),d=u.length,v=c.length-1;v>=0;v--){var g=c[v],b=a.offsetAt(g.range.start),h=a.offsetAt(g.range.end);if(h<=d)u=u.substring(0,b)+g.newText+u.substring(h,u.length);else throw new Error("Overlapping edit");d=b}return u}e.applyEdits=t;function r(a,s){if(a.length<=1)return a;var u=a.length/2|0,c=a.slice(0,u),d=a.slice(u);r(c,s),r(d,s);for(var v=0,g=0,b=0;v<c.length&&g<d.length;){var h=s(c[v],d[g]);h<=0?a[b++]=c[v++]:a[b++]=d[g++]}for(;v<c.length;)a[b++]=c[v++];for(;g<d.length;)a[b++]=d[g++];return a}})(xe||(xe={}));var tr=function(){function e(n,i,t,r){this._uri=n,this._languageId=i,this._version=t,this._content=r,this._lineOffsets=void 0}return Object.defineProperty(e.prototype,"uri",{get:function(){return this._uri},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"languageId",{get:function(){return this._languageId},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"version",{get:function(){return this._version},enumerable:!1,configurable:!0}),e.prototype.getText=function(n){if(n){var i=this.offsetAt(n.start),t=this.offsetAt(n.end);return this._content.substring(i,t)}return this._content},e.prototype.update=function(n,i){this._content=n.text,this._version=i,this._lineOffsets=void 0},e.prototype.getLineOffsets=function(){if(this._lineOffsets===void 0){for(var n=[],i=this._content,t=!0,r=0;r<i.length;r++){t&&(n.push(r),t=!1);var a=i.charAt(r);t=a==="\r"||a===`
`,a==="\r"&&r+1<i.length&&i.charAt(r+1)===`
`&&r++}t&&i.length>0&&n.push(i.length),this._lineOffsets=n}return this._lineOffsets},e.prototype.positionAt=function(n){n=Math.max(Math.min(n,this._content.length),0);var i=this.getLineOffsets(),t=0,r=i.length;if(r===0)return I.create(0,n);for(;t<r;){var a=Math.floor((t+r)/2);i[a]>n?r=a:t=a+1}var s=t-1;return I.create(s,n-i[s])},e.prototype.offsetAt=function(n){var i=this.getLineOffsets();if(n.line>=i.length)return this._content.length;if(n.line<0)return 0;var t=i[n.line],r=n.line+1<i.length?i[n.line+1]:this._content.length;return Math.max(Math.min(t+n.character,r),t)},Object.defineProperty(e.prototype,"lineCount",{get:function(){return this.getLineOffsets().length},enumerable:!1,configurable:!0}),e}(),o;(function(e){var n=Object.prototype.toString;function i(h){return typeof h<"u"}e.defined=i;function t(h){return typeof h>"u"}e.undefined=t;function r(h){return h===!0||h===!1}e.boolean=r;function a(h){return n.call(h)==="[object String]"}e.string=a;function s(h){return n.call(h)==="[object Number]"}e.number=s;function u(h,y,M){return n.call(h)==="[object Number]"&&y<=h&&h<=M}e.numberRange=u;function c(h){return n.call(h)==="[object Number]"&&-2147483648<=h&&h<=2147483647}e.integer=c;function d(h){return n.call(h)==="[object Number]"&&0<=h&&h<=2147483647}e.uinteger=d;function v(h){return n.call(h)==="[object Function]"}e.func=v;function g(h){return h!==null&&typeof h=="object"}e.objectLiteral=g;function b(h,y){return Array.isArray(h)&&h.every(y)}e.typedArray=b})(o||(o={}));var nr=class{constructor(e,n,i){this._languageId=e,this._worker=n;const t=a=>{let s=a.getLanguageId();if(s!==this._languageId)return;let u;this._listener[a.uri.toString()]=a.onDidChangeContent(()=>{window.clearTimeout(u),u=window.setTimeout(()=>this._doValidate(a.uri,s),500)}),this._doValidate(a.uri,s)},r=a=>{l.editor.setModelMarkers(a,this._languageId,[]);let s=a.uri.toString(),u=this._listener[s];u&&(u.dispose(),delete this._listener[s])};this._disposables.push(l.editor.onDidCreateModel(t)),this._disposables.push(l.editor.onWillDisposeModel(r)),this._disposables.push(l.editor.onDidChangeModelLanguage(a=>{r(a.model),t(a.model)})),this._disposables.push(i(a=>{l.editor.getModels().forEach(s=>{s.getLanguageId()===this._languageId&&(r(s),t(s))})})),this._disposables.push({dispose:()=>{l.editor.getModels().forEach(r);for(let a in this._listener)this._listener[a].dispose()}}),l.editor.getModels().forEach(t)}_disposables=[];_listener=Object.create(null);dispose(){this._disposables.forEach(e=>e&&e.dispose()),this._disposables.length=0}_doValidate(e,n){this._worker(e).then(i=>i.doValidation(e.toString())).then(i=>{const t=i.map(a=>ar(e,a));let r=l.editor.getModel(e);r&&r.getLanguageId()===n&&l.editor.setModelMarkers(r,n,t)}).then(void 0,i=>{console.error(i)})}};function ir(e){switch(e){case D.Error:return l.MarkerSeverity.Error;case D.Warning:return l.MarkerSeverity.Warning;case D.Information:return l.MarkerSeverity.Info;case D.Hint:return l.MarkerSeverity.Hint;default:return l.MarkerSeverity.Info}}function ar(e,n){let i=typeof n.code=="number"?String(n.code):n.code;return{severity:ir(n.severity),startLineNumber:n.range.start.line+1,startColumn:n.range.start.character+1,endLineNumber:n.range.end.line+1,endColumn:n.range.end.character+1,message:n.message,code:i,source:n.source}}var sr=class{constructor(e,n){this._worker=e,this._triggerCharacters=n}get triggerCharacters(){return this._triggerCharacters}provideCompletionItems(e,n,i,t){const r=e.uri;return this._worker(r).then(a=>a.doComplete(r.toString(),L(n))).then(a=>{if(!a)return;const s=e.getWordUntilPosition(n),u=new l.Range(n.lineNumber,s.startColumn,n.lineNumber,s.endColumn),c=a.items.map(d=>{const v={label:d.label,insertText:d.insertText||d.label,sortText:d.sortText,filterText:d.filterText,documentation:d.documentation,detail:d.detail,command:cr(d.command),range:u,kind:ur(d.kind)};return d.textEdit&&(or(d.textEdit)?v.range={insert:A(d.textEdit.insert),replace:A(d.textEdit.replace)}:v.range=A(d.textEdit.range),v.insertText=d.textEdit.newText),d.additionalTextEdits&&(v.additionalTextEdits=d.additionalTextEdits.map(q)),d.insertTextFormat===ae.Snippet&&(v.insertTextRules=l.languages.CompletionItemInsertTextRule.InsertAsSnippet),v});return{isIncomplete:a.isIncomplete,suggestions:c}})}};function L(e){if(!!e)return{character:e.column-1,line:e.lineNumber-1}}function He(e){if(!!e)return{start:{line:e.startLineNumber-1,character:e.startColumn-1},end:{line:e.endLineNumber-1,character:e.endColumn-1}}}function A(e){if(!!e)return new l.Range(e.start.line+1,e.start.character+1,e.end.line+1,e.end.character+1)}function or(e){return typeof e.insert<"u"&&typeof e.replace<"u"}function ur(e){const n=l.languages.CompletionItemKind;switch(e){case p.Text:return n.Text;case p.Method:return n.Method;case p.Function:return n.Function;case p.Constructor:return n.Constructor;case p.Field:return n.Field;case p.Variable:return n.Variable;case p.Class:return n.Class;case p.Interface:return n.Interface;case p.Module:return n.Module;case p.Property:return n.Property;case p.Unit:return n.Unit;case p.Value:return n.Value;case p.Enum:return n.Enum;case p.Keyword:return n.Keyword;case p.Snippet:return n.Snippet;case p.Color:return n.Color;case p.File:return n.File;case p.Reference:return n.Reference}return n.Property}function q(e){if(!!e)return{range:A(e.range),text:e.newText}}function cr(e){return e&&e.command==="editor.action.triggerSuggest"?{id:e.command,title:e.title,arguments:e.arguments}:void 0}var dr=class{constructor(e){this._worker=e}provideHover(e,n,i){let t=e.uri;return this._worker(t).then(r=>r.doHover(t.toString(),L(n))).then(r=>{if(!!r)return{range:A(r.range),contents:lr(r.contents)}})}};function fr(e){return e&&typeof e=="object"&&typeof e.kind=="string"}function je(e){return typeof e=="string"?{value:e}:fr(e)?e.kind==="plaintext"?{value:e.value.replace(/[\\`*_{}[\]()#+\-.!]/g,"\\$&")}:{value:e.value}:{value:"```"+e.language+`
`+e.value+"\n```\n"}}function lr(e){if(!!e)return Array.isArray(e)?e.map(je):[je(e)]}var Hr=class{constructor(e){this._worker=e}provideDocumentHighlights(e,n,i){const t=e.uri;return this._worker(t).then(r=>r.findDocumentHighlights(t.toString(),L(n))).then(r=>{if(!!r)return r.map(a=>({range:A(a.range),kind:gr(a.kind)}))})}};function gr(e){switch(e){case W.Read:return l.languages.DocumentHighlightKind.Read;case W.Write:return l.languages.DocumentHighlightKind.Write;case W.Text:return l.languages.DocumentHighlightKind.Text}return l.languages.DocumentHighlightKind.Text}var zr=class{constructor(e){this._worker=e}provideDefinition(e,n,i){const t=e.uri;return this._worker(t).then(r=>r.findDefinition(t.toString(),L(n))).then(r=>{if(!!r)return[ze(r)]})}};function ze(e){return{uri:l.Uri.parse(e.uri),range:A(e.range)}}var Br=class{constructor(e){this._worker=e}provideReferences(e,n,i,t){const r=e.uri;return this._worker(r).then(a=>a.findReferences(r.toString(),L(n))).then(a=>{if(!!a)return a.map(ze)})}},qr=class{constructor(e){this._worker=e}provideRenameEdits(e,n,i,t){const r=e.uri;return this._worker(r).then(a=>a.doRename(r.toString(),L(n),i)).then(a=>hr(a))}};function hr(e){if(!e||!e.changes)return;let n=[];for(let i in e.changes){const t=l.Uri.parse(i);for(let r of e.changes[i])n.push({resource:t,edit:{range:A(r.range),text:r.newText}})}return{edits:n}}var vr=class{constructor(e){this._worker=e}provideDocumentSymbols(e,n){const i=e.uri;return this._worker(i).then(t=>t.findDocumentSymbols(i.toString())).then(t=>{if(!!t)return t.map(r=>({name:r.name,detail:"",containerName:r.containerName,kind:pr(r.kind),range:A(r.location.range),selectionRange:A(r.location.range),tags:[]}))})}};function pr(e){let n=l.languages.SymbolKind;switch(e){case m.File:return n.Array;case m.Module:return n.Module;case m.Namespace:return n.Namespace;case m.Package:return n.Package;case m.Class:return n.Class;case m.Method:return n.Method;case m.Property:return n.Property;case m.Field:return n.Field;case m.Constructor:return n.Constructor;case m.Enum:return n.Enum;case m.Interface:return n.Interface;case m.Function:return n.Function;case m.Variable:return n.Variable;case m.Constant:return n.Constant;case m.String:return n.String;case m.Number:return n.Number;case m.Boolean:return n.Boolean;case m.Array:return n.Array}return n.Function}var Xr=class{constructor(e){this._worker=e}provideLinks(e,n){const i=e.uri;return this._worker(i).then(t=>t.findDocumentLinks(i.toString())).then(t=>{if(!!t)return{links:t.map(r=>({range:A(r.range),url:r.target}))}})}},mr=class{constructor(e){this._worker=e}provideDocumentFormattingEdits(e,n,i){const t=e.uri;return this._worker(t).then(r=>r.format(t.toString(),null,Be(n)).then(a=>{if(!(!a||a.length===0))return a.map(q)}))}},_r=class{constructor(e){this._worker=e}provideDocumentRangeFormattingEdits(e,n,i,t){const r=e.uri;return this._worker(r).then(a=>a.format(r.toString(),He(n),Be(i)).then(s=>{if(!(!s||s.length===0))return s.map(q)}))}};function Be(e){return{tabSize:e.tabSize,insertSpaces:e.insertSpaces}}var kr=class{constructor(e){this._worker=e}provideDocumentColors(e,n){const i=e.uri;return this._worker(i).then(t=>t.findDocumentColors(i.toString())).then(t=>{if(!!t)return t.map(r=>({color:r.color,range:A(r.range)}))})}provideColorPresentations(e,n,i){const t=e.uri;return this._worker(t).then(r=>r.getColorPresentations(t.toString(),n.color,He(n.range))).then(r=>{if(!!r)return r.map(a=>{let s={label:a.label};return a.textEdit&&(s.textEdit=q(a.textEdit)),a.additionalTextEdits&&(s.additionalTextEdits=a.additionalTextEdits.map(q)),s})})}},wr=class{constructor(e){this._worker=e}provideFoldingRanges(e,n,i){const t=e.uri;return this._worker(t).then(r=>r.getFoldingRanges(t.toString(),n)).then(r=>{if(!!r)return r.map(a=>{const s={start:a.startLine+1,end:a.endLine+1};return typeof a.kind<"u"&&(s.kind=br(a.kind)),s})})}};function br(e){switch(e){case F.Comment:return l.languages.FoldingRangeKind.Comment;case F.Imports:return l.languages.FoldingRangeKind.Imports;case F.Region:return l.languages.FoldingRangeKind.Region}}var Cr=class{constructor(e){this._worker=e}provideSelectionRanges(e,n,i){const t=e.uri;return this._worker(t).then(r=>r.getSelectionRanges(t.toString(),n.map(L))).then(r=>{if(!!r)return r.map(a=>{const s=[];for(;a;)s.push({range:A(a.range)}),a=a.parent;return s})})}};function Er(e,n){n===void 0&&(n=!1);var i=e.length,t=0,r="",a=0,s=16,u=0,c=0,d=0,v=0,g=0;function b(f,C){for(var S=0,E=0;S<f||!C;){var k=e.charCodeAt(t);if(k>=48&&k<=57)E=E*16+k-48;else if(k>=65&&k<=70)E=E*16+k-65+10;else if(k>=97&&k<=102)E=E*16+k-97+10;else break;t++,S++}return S<f&&(E=-1),E}function h(f){t=f,r="",a=0,s=16,g=0}function y(){var f=t;if(e.charCodeAt(t)===48)t++;else for(t++;t<e.length&&R(e.charCodeAt(t));)t++;if(t<e.length&&e.charCodeAt(t)===46)if(t++,t<e.length&&R(e.charCodeAt(t)))for(t++;t<e.length&&R(e.charCodeAt(t));)t++;else return g=3,e.substring(f,t);var C=t;if(t<e.length&&(e.charCodeAt(t)===69||e.charCodeAt(t)===101))if(t++,(t<e.length&&e.charCodeAt(t)===43||e.charCodeAt(t)===45)&&t++,t<e.length&&R(e.charCodeAt(t))){for(t++;t<e.length&&R(e.charCodeAt(t));)t++;C=t}else g=3;return e.substring(f,C)}function M(){for(var f="",C=t;;){if(t>=i){f+=e.substring(C,t),g=2;break}var S=e.charCodeAt(t);if(S===34){f+=e.substring(C,t),t++;break}if(S===92){if(f+=e.substring(C,t),t++,t>=i){g=2;break}var E=e.charCodeAt(t++);switch(E){case 34:f+='"';break;case 92:f+="\\";break;case 47:f+="/";break;case 98:f+="\b";break;case 102:f+="\f";break;case 110:f+=`
`;break;case 114:f+="\r";break;case 116:f+="	";break;case 117:var k=b(4,!0);k>=0?f+=String.fromCharCode(k):g=4;break;default:g=5}C=t;continue}if(S>=0&&S<=31)if(j(S)){f+=e.substring(C,t),g=2;break}else g=6;t++}return f}function x(){if(r="",g=0,a=t,c=u,v=d,t>=i)return a=i,s=17;var f=e.charCodeAt(t);if(K(f)){do t++,r+=String.fromCharCode(f),f=e.charCodeAt(t);while(K(f));return s=15}if(j(f))return t++,r+=String.fromCharCode(f),f===13&&e.charCodeAt(t)===10&&(t++,r+=`
`),u++,d=t,s=14;switch(f){case 123:return t++,s=1;case 125:return t++,s=2;case 91:return t++,s=3;case 93:return t++,s=4;case 58:return t++,s=6;case 44:return t++,s=5;case 34:return t++,r=M(),s=10;case 47:var C=t-1;if(e.charCodeAt(t+1)===47){for(t+=2;t<i&&!j(e.charCodeAt(t));)t++;return r=e.substring(C,t),s=12}if(e.charCodeAt(t+1)===42){t+=2;for(var S=i-1,E=!1;t<S;){var k=e.charCodeAt(t);if(k===42&&e.charCodeAt(t+1)===47){t+=2,E=!0;break}t++,j(k)&&(k===13&&e.charCodeAt(t)===10&&t++,u++,d=t)}return E||(t++,g=1),r=e.substring(C,t),s=13}return r+=String.fromCharCode(f),t++,s=16;case 45:if(r+=String.fromCharCode(f),t++,t===i||!R(e.charCodeAt(t)))return s=16;case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:return r+=y(),s=11;default:for(;t<i&&Xe(f);)t++,f=e.charCodeAt(t);if(a!==t){switch(r=e.substring(a,t),r){case"true":return s=8;case"false":return s=9;case"null":return s=7}return s=16}return r+=String.fromCharCode(f),t++,s=16}}function Xe(f){if(K(f)||j(f))return!1;switch(f){case 125:case 93:case 123:case 91:case 34:case 58:case 44:case 47:return!1}return!0}function Je(){var f;do f=x();while(f>=12&&f<=15);return f}return{setPosition:h,getPosition:function(){return t},scan:n?Je:x,getToken:function(){return s},getTokenValue:function(){return r},getTokenOffset:function(){return a},getTokenLength:function(){return t-a},getTokenStartLine:function(){return c},getTokenStartCharacter:function(){return a-v},getTokenError:function(){return g}}}function K(e){return e===32||e===9||e===11||e===12||e===160||e===5760||e>=8192&&e<=8203||e===8239||e===8287||e===12288||e===65279}function j(e){return e===10||e===13||e===8232||e===8233}function R(e){return e>=48&&e<=57}var Fe;(function(e){e.DEFAULT={allowTrailingComma:!1}})(Fe||(Fe={}));var Ar=Er;function Sr(e){return{getInitialState:()=>new Z(null,null,!1,null),tokenize:(n,i)=>Or(e,n,i)}}var We="delimiter.bracket.json",Ue="delimiter.array.json",yr="delimiter.colon.json",Ir="delimiter.comma.json",Tr="keyword.json",Pr="keyword.json",Lr="string.value.json",Mr="number.json",Rr="string.key.json",Dr="comment.block.json",Nr="comment.line.json",N=class{constructor(e,n){this.parent=e,this.type=n}static pop(e){return e?e.parent:null}static push(e,n){return new N(e,n)}static equals(e,n){if(!e&&!n)return!0;if(!e||!n)return!1;for(;e&&n;){if(e===n)return!0;if(e.type!==n.type)return!1;e=e.parent,n=n.parent}return!0}},Z=class{_state;scanError;lastWasColon;parents;constructor(e,n,i,t){this._state=e,this.scanError=n,this.lastWasColon=i,this.parents=t}clone(){return new Z(this._state,this.scanError,this.lastWasColon,this.parents)}equals(e){return e===this?!0:!e||!(e instanceof Z)?!1:this.scanError===e.scanError&&this.lastWasColon===e.lastWasColon&&N.equals(this.parents,e.parents)}getStateData(){return this._state}setStateData(e){this._state=e}};function Or(e,n,i,t=0){let r=0,a=!1;switch(i.scanError){case 2:n='"'+n,r=1;break;case 1:n="/*"+n,r=2;break}const s=Ar(n);let u=i.lastWasColon,c=i.parents;const d={tokens:[],endState:i.clone()};for(;;){let v=t+s.getPosition(),g="";const b=s.scan();if(b===17)break;if(v===t+s.getPosition())throw new Error("Scanner did not advance, next 3 characters are: "+n.substr(s.getPosition(),3));switch(a&&(v-=r),a=r>0,b){case 1:c=N.push(c,0),g=We,u=!1;break;case 2:c=N.pop(c),g=We,u=!1;break;case 3:c=N.push(c,1),g=Ue,u=!1;break;case 4:c=N.pop(c),g=Ue,u=!1;break;case 6:g=yr,u=!0;break;case 5:g=Ir,u=!1;break;case 8:case 9:g=Tr,u=!1;break;case 7:g=Pr,u=!1;break;case 10:const y=(c?c.type:0)===1;g=u||y?Lr:Rr,u=!1;break;case 11:g=Mr,u=!1;break}if(e)switch(b){case 12:g=Nr;break;case 13:g=Dr;break}d.endState=new Z(i.getStateData(),s.getTokenError(),u,c),d.tokens.push({startIndex:v,scopes:g})}return d}var xr=class extends nr{constructor(e,n,i){super(e,n,i.onDidChange),this._disposables.push(l.editor.onWillDisposeModel(t=>{this._resetSchema(t.uri)})),this._disposables.push(l.editor.onDidChangeModelLanguage(t=>{this._resetSchema(t.model.uri)}))}_resetSchema(e){this._worker().then(n=>{n.resetSchema(e.toString())})}};function Jr(e){const n=[],i=[],t=new rr(e);n.push(t);const r=(...u)=>t.getLanguageServiceWorker(...u);function a(){const{languageId:u,modeConfiguration:c}=e;qe(i),c.documentFormattingEdits&&i.push(l.languages.registerDocumentFormattingEditProvider(u,new mr(r))),c.documentRangeFormattingEdits&&i.push(l.languages.registerDocumentRangeFormattingEditProvider(u,new _r(r))),c.completionItems&&i.push(l.languages.registerCompletionItemProvider(u,new sr(r,[" ",":",'"']))),c.hovers&&i.push(l.languages.registerHoverProvider(u,new dr(r))),c.documentSymbols&&i.push(l.languages.registerDocumentSymbolProvider(u,new vr(r))),c.tokens&&i.push(l.languages.setTokensProvider(u,Sr(!0))),c.colors&&i.push(l.languages.registerColorProvider(u,new kr(r))),c.foldingRanges&&i.push(l.languages.registerFoldingRangeProvider(u,new wr(r))),c.diagnostics&&i.push(new xr(u,r,e)),c.selectionRanges&&i.push(l.languages.registerSelectionRangeProvider(u,new Cr(r)))}a(),n.push(l.languages.setLanguageConfiguration(e.languageId,jr));let s=e.modeConfiguration;return e.onDidChange(u=>{u.modeConfiguration!==s&&(s=u.modeConfiguration,a())}),n.push(Ve(i)),Ve(n)}function Ve(e){return{dispose:()=>qe(e)}}function qe(e){for(;e.length;)e.pop().dispose()}var jr={wordPattern:/(-?\d*\.\d\w*)|([^\[\{\]\}\:\"\,\s]+)/g,comments:{lineComment:"//",blockComment:["/*","*/"]},brackets:[["{","}"],["[","]"]],autoClosingPairs:[{open:"{",close:"}",notIn:["string"]},{open:"[",close:"]",notIn:["string"]},{open:'"',close:'"',notIn:["string"]}]};export{sr as CompletionAdapter,zr as DefinitionAdapter,nr as DiagnosticsAdapter,kr as DocumentColorAdapter,mr as DocumentFormattingEditProvider,Hr as DocumentHighlightAdapter,Xr as DocumentLinkAdapter,_r as DocumentRangeFormattingEditProvider,vr as DocumentSymbolAdapter,wr as FoldingRangeAdapter,dr as HoverAdapter,Br as ReferenceAdapter,qr as RenameAdapter,Cr as SelectionRangeAdapter,rr as WorkerManager,L as fromPosition,He as fromRange,Jr as setupMode,A as toRange,q as toTextEdit};
