var SmartEmoji =
/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdateSmartEmoji"];
/******/ 	window["webpackHotUpdateSmartEmoji"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "1a4fb1e8ed224607ba43"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(3)(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * This EmojiArea is rewritten from ground up an based on the code from Brian Reavis <brian@diy.org>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Wolfgang Stöttinger
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _EmojiPicker = __webpack_require__(5);

var _EmojiPicker2 = _interopRequireDefault(_EmojiPicker);

var _EmojiUtil = __webpack_require__(2);

var _EmojiUtil2 = _interopRequireDefault(_EmojiUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EmojiArea = function () {
  function EmojiArea(emojiArea, options) {
    _classCallCheck(this, EmojiArea);

    this.o = _jquery2.default.extend({}, EmojiArea.DEFAULTS, options);
    this.$ea = (0, _jquery2.default)(emojiArea);

    var $emojitarget = (0, _jquery2.default)(options.input); /* #31768 */
    this.$ti = $emojitarget; /* #31768 */

    this.$b = this.$ea.find(options.buttonSelector).on('click', this.togglePicker.bind(this));

    this.$e = this.$ti;
    this.$ti.on(options.inputEvent, this.processTextContent.bind(this));

    this.processTextContent();

    var v = this.$ti.val();
    // console.log(this.$ti,options.input);
    this.$ti[0].setSelectionRange(v.length, v.length);
    this.textSel = { start: v.length, end: v.length };

    this.$e.focusout(this.saveSelection.bind(this)).focus(this.restoreSelection.bind(this));
    // $(document.body).on('mousedown', this.saveSelection.bind(this));
  }

  //
  // Clipboard handling
  //

  // noinspection JSMethodCanBeStatic


  _createClass(EmojiArea, [{
    key: 'clipboardCopy',
    value: function clipboardCopy(e) {
      // only allow plain text copy:
      var cbd = e.originalEvent.clipboardData || window.clipboardData;
      var content = window.getSelection().toString();
      window.clipboardData ? cbd.setData('text', content) : cbd.setData('text/plain', content);
      e.preventDefault();
    }
  }, {
    key: 'clipboardPaste',
    value: function clipboardPaste(e) {
      // only allow to paste plain text
      var cbd = e.originalEvent.clipboardData || window.clipboardData;
      var content = window.clipboardData ? cbd.getData('text') : cbd.getData('text/plain');

      if (!document.execCommand('insertText', false, content)) {
        this.saveSelection();
        var range = this.htmlSel;
        var insert = document.createTextNode(content);
        range.deleteContents();
        range.insertNode(insert);
        range.setStartAfter(insert);
        range.setEndAfter(insert);
        setTimeout(this.onInput.bind(this), 0);
      }
      e.preventDefault();
    }

    //
    // Selection handling
    //

  }, {
    key: 'saveSelection',
    value: function saveSelection() {
      var e = this.$e[0];
      // for unicode mode, the textarea itself:
      if (this.$e === this.$ti && e.selectionStart && e.selectionEnd) {
        this.textSel = { start: e.selectionStart, end: e.selectionEnd };
      } else {
        var sel = window.getSelection();
        if (sel.focusNode && (sel.focusNode === e || sel.focusNode.parentNode === e)) {
          this.htmlSel = sel.getRangeAt(0);
        }
      }
    }
  }, {
    key: 'restoreSelection',
    value: function restoreSelection(event) {
      var hSel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.htmlSel;
      var tSel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.textSel;

      if (hSel) {
        var s = window.getSelection();
        s.removeAllRanges();
        s.addRange(hSel);
      } else if (tSel) {
        if (!event || event.type !== 'focus') {
          this.$ti[0].focus();
        }
        this.$ti[0].setSelectionRange(tSel.start, tSel.end);
      }
    }
  }, {
    key: 'replaceSelection',
    value: function replaceSelection(content) {
      var hSel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.htmlSel;
      var tSel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.textSel;

      this.restoreSelection(null, hSel, tSel);
      if (hSel) {
        if (!document.execCommand('insertHTML', false, content)) {
          // let insert = $.parseHTML(content)[0];
          // insert = document.importNode(insert, true); // this is necessary for IE
          hSel.deleteContents();
          var insert = hSel.createContextualFragment(content);
          hSel.insertNode(insert);
          hSel.collapse(false);
          // hSel.setStartAfter(insert.lastChild);
          // hSel.setEndAfter(insert.lastChild);
          return insert;
        }
        return true;
      } else if (tSel) {
        if (!document.execCommand('insertText', false, content)) {
          var val = this.$e.val();
          this.$e.val(val.slice(0, tSel.start) + content + val.slice(tSel.end));
          tSel.start = tSel.end = tSel.start + content.length;
          this.$ti[0].setSelectionRange(tSel.start, tSel.end);
        }
        return true;
      }
      return false;
    }
  }, {
    key: 'onInput',
    value: function onInput(event) {
      if (!event || event.originalEvent && event.originalEvent.inputType !== 'historyUndo') {
        this.processContent();
        this.updateInput();
      }
    }
  }, {
    key: 'onKey',
    value: function onKey(e) {
      if (e.originalEvent.keyCode === 13) {
        // catch enter and just insert <br>
        this.saveSelection();
        this.replaceSelection('<br>');

        if (this.$e[0].lastChild.nodeName !== 'BR') {
          this.$e.append('<br>'); // this is necessary to render correctly.
        }

        e.stopPropagation();
        return false;
      }
    }
  }, {
    key: 'updateInput',
    value: function updateInput() {
      this.$ti.val(this.$e[0].innerText || this.$e[0].textContent);
      this.$ti.trigger(this.o.inputEvent);
    }
  }, {
    key: 'processTextContent',
    value: function processTextContent(event) {
      if (!event || event.originalEvent && event.originalEvent.inputType !== 'historyUndo') {
        var val = this.$ti.val();
        //    let parsed = this.replaceAscii(val);
        //    parsed = this.replaceAliases(parsed);
        //    if (parsed !== val) {
        //      const sel = parsed.length - (val.length - this.$ti[0].selectionEnd);
        //      this.$ti.val(parsed);
        //      this.$ti[0].setSelectionRange(sel, sel);
        //      this.textSel = { start: sel, end: sel };
        //      this.$ti
        //        .focus()
        //        .trigger(this.o.inputEvent);
        //    }
      }
    }
  }, {
    key: 'processContent',
    value: function processContent() {
      this.saveSelection();
      this._processElement(this.$e);
      if (this.$e[0].lastChild.nodeName !== 'BR') {
        this.$e.append('<br>'); // this is necessary to render correctly.
      }
    }
  }, {
    key: '_processElement',
    value: function _processElement() {
      var _this = this;

      var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.$e;

      // this is a bit more complex because
      //  a) only text nodes should be replaced
      //  b) the cursor position should be kept after an alias is replaced

      element.contents().each(function (i, e) {
        if (e.nodeType === 1 || e.nodeType === 11) {
          // element or document fragment
          var $e = (0, _jquery2.default)(e);
          if (!$e.is('.emoji')) // skip emoji
            {
              _this._processElement($e);
            }
        } else if (e.nodeType === 3) {// text node
          // replace unicodes
          //       let parsed = e.nodeValue;

          //       if (this.o.type !== 'unicode') { //convert existing unicodes
          //         parsed = this.replaceUnicodes(parsed);
          //       }

          //       parsed = this.replaceAscii(parsed);
          //       parsed = this.replaceAliases(parsed);

          //       if (parsed !== e.nodeValue) {
          //         const isSelected = (this.htmlSel && this.htmlSel.endContainer === e);
          //         const range = isSelected ? this.htmlSel : document.createRange();
          //         const caret = this.htmlSel ? e.nodeValue.length - this.htmlSel.endOffset : 0;
          //         const next = e.nextSibling;
          //         range.selectNode(e);
          //         this.replaceSelection(parsed, range, null);
          //         if (isSelected) {
          //           if (next.previousSibling) {
          //             const inserted = next.previousSibling;
          //             range.setStart(inserted, inserted.length - caret);
          //             range.setEnd(inserted, inserted.length - caret);
          //this.htmlSel.setStartAfter(content[content.length - 1]);
          //this.htmlSel.collapse(false);
          //           }
          //           else {
          //             range.setStartBefore(this.$e[0].lastChild);
          //             range.setEndBefore(this.$e[0].lastChild);
          //           }
          //         }
          //       }
        }
      });
    }

    //replaceUnicodes(text) {
    //  return text.replace(this.o.unicodeRegex, (match, unicode) => {
    //    return Emoji.checkUnicode(unicode)
    //      ? EmojiArea.createEmoji(null, this.o, unicode)
    //      : unicode;
    //  });
    //}

    //replaceAscii(text) {
    //  return text.replace(this.o.asciiRegex, (match, ascii) => {
    //    if (Emoji.checkAscii(ascii)) {
    //      const alias = Emoji.aliasFromAscii(ascii);
    //      if (alias) {
    //        return EmojiArea.createEmoji(alias, this.o);
    //      }
    //    }
    //    return ascii + ' ';
    //  });
    //}

    //replaceAliases(text) {
    //  return text.replace(this.o.aliasRegex, (match, alias) => {
    //    return Emoji.checkAlias(alias)
    //      ? EmojiArea.createEmoji(alias, this.o)
    //      : ':' + alias + ':';
    //  });
    //}

  }, {
    key: 'togglePicker',
    value: function togglePicker() {
      var delegate = this.picker || _EmojiPicker2.default;
      if (!delegate.isVisible()) {
        var cbtest = 1;
        //      this.picker = delegate.show(cbtest, this.$b, this.o);  //ERROR
        this.picker = delegate.show(this.insert.bind(this), this.$b, this.o); //ERROR
      } else {
        delegate.hide();
      }
      return false;
    }
  }, {
    key: 'insert',
    value: function insert(alias) {
      //    const content = EmojiArea.createEmoji(alias, this.o);
      if (!this.replaceSelection(alias)) {
        this.$e.append(alias).focus().trigger(this.o.inputEvent);
      }
    }
  }], [{
    key: 'createEmoji',
    value: function createEmoji(alias) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EmojiArea.DEFAULTS;
      var unicode = arguments[2];

      if (!alias && !unicode) {
        return;
      }
      return alias;
      //   alias = alias || Emoji.aliasFromUnicode(unicode);
      //   unicode = unicode || Emoji.unicodeFromAlias(alias);
      //   return unicode
      //     ? unicode
      //     : alias;
    }
  }, {
    key: 'generateEmojiTag',
    value: function generateEmojiTag(unicode, alias) {
      throw new Error('CSS emoji are not supported.');
      return '<i class="emoji emoji-' + alias + '" contenteditable="false">' + unicode + '</i>';
    }
  }, {
    key: 'generateEmojiImg',
    value: function generateEmojiImg(unicode, alias) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EmojiArea.DEFAULTS;

      throw new Error('Image emoji are not supported.');
    }
  }]);

  return EmojiArea;
}();

exports.default = EmojiArea;


EmojiArea.DEFAULTS = {
  aliasRegex: /:([a-z0-9_]+?):/g, //deprecated, colon aliased not supported in unicode mode
  asciiRegex: /([\/<:;=8>(][()D3opPy*>\/\\|-]+) /g,
  unicodeRegex: /((?:[\xA9\xAE\u2122\u23E9-\u23EF\u23F3\u23F8-\u23FA\u24C2\u25B6\u2600-\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDE51\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F\uDE80-\uDEFF]|\uD83E[\uDD00-\uDDFF]))/g,
  inputSelector: 'input:text, textarea',
  buttonSelector: '>.emoji-button',
  inputEvent: /Trident/.test(navigator.userAgent) ? 'textinput' : 'input',
  keyEvent: 'keypress',
  anchorAlignment: 'left', // can be left|right
  anchorOffsetX: -5,
  anchorOffsetY: 5,
  type: 'unicode', // deprecated, unicode is the only supported mode
  iconSize: 25, // deprecated, not supported in unicode mode
  assetPath: '', // deprecated, not supported in unicode mode
  textClipboard: true,
  globalPicker: true,
  hideOnSelect: true,
  place: "auto",
  pickerShrink: false,
  heightSmall: 122,
  heightBig: 202,
  pickerWidth: 280,
  tabPaneSmall: 67
};

EmojiArea.AUTOINIT = true;
EmojiArea.INJECT_STYLES = false; // only makes sense when EmojiArea.type != 'unicode'

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * The EmojiUtil contains all functionality for handling emoji data and groups, but no html specific stuff.
 *
 * @author Wolfgang Stöttinger
 */

//import Data from 'EmojiData';

var EmojiUtil = function () {
  function EmojiUtil() {
    _classCallCheck(this, EmojiUtil);
  }

  /**
   *
   */


  _createClass(EmojiUtil, null, [{
    key: 'initialize',
    value: function initialize() {
      EmojiUtil.aliases = {};
      EmojiUtil.unicodes = {};
      EmojiUtil.groups = {};
      EmojiUtil.filters = {};
      EmojiUtil.keywords = {};
      EmojiUtil.mode = {};
      EmojiUtil.arrfil = [];
      var path = document.location;
      var curLang = document.documentElement.lang;
      if (curLang.length === 2) {
        curLang = 'en-US';
      }

      if (path.origin.indexOf('admin') + 1) {
        var fullPath = './../../../../../emoji/groups.'; //    for CA
      } else if (path.origin.indexOf('localhost') + 1) {
        var fullPath = './groups.'; //    for stand-alone
      } else {
        var fullPath = './../../../emoji/groups.'; //    for MA
      }

      EmojiUtil.syncJSON(fullPath + curLang + '.json', function (msg) {
        EmojiUtil.groups = msg.groups;
        EmojiUtil.filters = msg.filters;
        EmojiUtil.mode = msg.mode;
      });
    }
  }, {
    key: 'syncJSON',
    value: function syncJSON(url, callback) {
      $.ajax({
        type: "GET",
        async: false,
        url: url,
        contentType: "application/json",
        dataType: "json",
        success: function success(msg) {
          callback(msg);
        },
        error: function error(msg) {
          alert('error : reading JSON file!!!!');
        }
      });
    }
  }, {
    key: 'checkAlias',
    value: function checkAlias(alias) {
      return EmojiUtil.aliases.hasOwnProperty(alias);
    }
  }, {
    key: 'checkUnicode',
    value: function checkUnicode(alias) {
      return EmojiUtil.unicodes.hasOwnProperty(alias);
    }
  }, {
    key: 'checkAscii',
    value: function checkAscii(ascii) {
      return EmojiUtil.ascii.hasOwnProperty(ascii);
    }

    /**
     * @param alias
     * @param groupData if true returns an array including groupId, Col# and Row# of the Emoji
     * @returns {*}
     */

  }, {
    key: 'dataFromAlias',
    value: function dataFromAlias(alias) {
      var groupData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var key = EmojiUtil.aliases[alias];
      var data = EmojiUtil.data[key];
      if (!groupData || data[2]) // if group is set
        return data;

      for (var g = 0; g < EmojiUtil.groups.length; g++) {
        var group = EmojiUtil.groups[g];
        var d = group.dimensions;
        var pos = $.inArray(key, group.items);
        if (pos >= 0) {
          data[2] = g; // group
          data[3] = pos % d[0]; // column
          data[4] = pos / d[0] | 0; // row
          data[5] = d; // sprite dimensions
          return data;
        }
      }
      return data;
    }

    /**
     *
     * @param alias
     * @returns {*}
     */

  }, {
    key: 'unicodeFromAlias',
    value: function unicodeFromAlias(alias) {
      if (alias) {
        var key = EmojiUtil.aliases[alias];
        var emojiData = EmojiUtil.data[key];
        if (emojiData && emojiData[EmojiUtil.EMOJI_UNICODE]) return emojiData[EmojiUtil.EMOJI_UNICODE][0];
      }
      return null;
    }
  }, {
    key: 'unicodeFromAscii',
    value: function unicodeFromAscii(ascii) {
      return EmojiUtil.unicodeFromAlias(EmojiUtil.aliasFromAscii(ascii));
    }
  }, {
    key: 'aliasFromUnicode',
    value: function aliasFromUnicode(unicode) {
      if (unicode) {
        var key = EmojiUtil.unicodes[unicode];
        var emojiData = EmojiUtil.data[key];
        if (emojiData && emojiData[EmojiUtil.EMOJI_ALIASES]) return emojiData[EmojiUtil.EMOJI_ALIASES];
      }
      return null;
    }
  }, {
    key: 'aliasFromAscii',
    value: function aliasFromAscii(ascii) {
      return EmojiUtil.ascii[ascii] || null;
    }
  }]);

  return EmojiUtil;
}();

exports.default = EmojiUtil;


EmojiUtil.EMOJI_ICON = 'i';
EmojiUtil.EMOJI_NAME = 'n';
EmojiUtil.EMOJI_MODIFIER = 'm';
EmojiUtil.EMOJI_KEYWORD = 'k';
EmojiUtil.EMOJI_LIST = 'l';
EmojiUtil.FILTER_BUTTON = '99999';
EmojiUtil.FILTER_BASKET = '00000';

//-----------------------------------------------------------------------------------------

EmojiUtil.initialize();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _generatePlugin = __webpack_require__(4);

var _generatePlugin2 = _interopRequireDefault(_generatePlugin);

var _EmojiArea = __webpack_require__(1);

var _EmojiArea2 = _interopRequireDefault(_EmojiArea);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _generatePlugin2.default)('smartemoji', _EmojiArea2.default);

/**
 * call auto initialization.
 */
/**
 * This is the entry point for the library
 *
 * @author Wolfgang Stöttinger
 */

(0, _jquery2.default)(function () {
  //noinspection JSUnresolvedFunction
  (0, _jquery2.default)('[data-emojiarea]').smartemoji();
});

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = generatePlugin;

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Generate a jQuery plugin
 * @param pluginName [string] Plugin name
 * @param className [object] Class of the plugin
 * @param shortHand [bool] Generate a shorthand as $.pluginName
 *
 * @example
 * import plugin from 'plugin';
 *
 * class MyPlugin {
 *     constructor(element, options) {
 *         // ...
 *     }
 * }
 *
 * MyPlugin.DEFAULTS = {};
 *
 * plugin('myPlugin', MyPlugin');
 */
function generatePlugin(pluginName, className) {
  var shortHand = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var instanceName = '__' + pluginName;
  var old = _jquery2.default.fn[pluginName];

  _jquery2.default.fn[pluginName] = function (option) {
    return this.each(function () {
      var $this = (0, _jquery2.default)(this);
      var instance = $this.data(instanceName);

      if (!instance && option !== 'destroy') {
        var _options = _jquery2.default.extend({}, className.DEFAULTS, $this.data(), (typeof option === 'undefined' ? 'undefined' : _typeof(option)) === 'object' && option);
        $this.data(instanceName, instance = new className(this, _options));
      } else {
        //noinspection JSUnresolvedVariable
        if (typeof instance.configure === 'function') {
          //noinspection JSUnresolvedFunction
          instance.configure(options);
        }
      }

      if (typeof option === 'string') {
        if (option === 'destroy') {
          instance.destroy();
          $this.data(instanceName, false);
        } else {
          instance[option]();
        }
      }
    });
  };

  // - Short hand
  if (shortHand) {
    _jquery2.default[pluginName] = function (options) {
      return (0, _jquery2.default)({})[pluginName](options);
    };
  }

  // - No conflict
  _jquery2.default.fn[pluginName].noConflict = function () {
    return _jquery2.default.fn[pluginName] = old;
  };
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Emoji Picker (Dropdown) can work as global singleton (one dropdown for all inputs on the page)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * or with separate instances (and settings) for each input.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Wolfgang Stöttinger
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _EmojiArea = __webpack_require__(1);

var _EmojiArea2 = _interopRequireDefault(_EmojiArea);

var _EmojiUtil = __webpack_require__(2);

var _EmojiUtil2 = _interopRequireDefault(_EmojiUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EmojiPicker = function () {
  function EmojiPicker() {
    var _this = this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _EmojiArea2.default.DEFAULTS;

    _classCallCheck(this, EmojiPicker);

    this.o = options;
    var $body = (0, _jquery2.default)(document.body);
    $body.on('keydown', function (e) {
      if (e.keyCode === KEY_ESC || e.keyCode === KEY_TAB) _this.hide();
    });
    $body.on('click', function () {
      _this.hide();
    });
    (0, _jquery2.default)(window).on('resize', function () {
      if (_this.$p.is(':visible')) {
        _this.hide();
      }
    });

    var $emojidiv = (0, _jquery2.default)(options.input).parents('form').find('.emoji-wrapper').attr('id'); /* #31768 */
    var ifPickerExist = (0, _jquery2.default)(options.input).parents('form').find('.emoji-picker').attr('class');
    if (!ifPickerExist) {
      this.$p = (0, _jquery2.default)('<div>').addClass('emoji-picker').attr('data-picker-type', options.type) // $.data() here not possible, doesn't change dom
      .on('mouseup click', function (e) {
        return e.stopPropagation() && false;
      }).hide().appendTo('#' + $emojidiv);
    }

    var tabs = this.loadPicker(options);
    setTimeout(this.loadEmojis.bind(this, tabs), 300);
  }

  _createClass(EmojiPicker, [{
    key: 'loadPicker',
    value: function loadPicker(options) {
      var ul = (0, _jquery2.default)('<ul>').addClass('emoji-selector nav nav-tabs');
      var tabs = (0, _jquery2.default)('<div>').addClass('tab-content');

      var _loop = function _loop(g) {
        // g - key of the Emoji.groups
        var group = _EmojiUtil2.default.groups[g];
        var id = 'group_' + g;
        var gid = '#' + id;
        var a = (0, _jquery2.default)('<a>').html(_EmojiUtil2.default.groups[g].i).data('toggle', 'tab').attr('title', group.n).attr('href', gid);
        ul.append((0, _jquery2.default)('<li>').append(a));
        var tab = (0, _jquery2.default)('<div>').attr('id', id).addClass('emoji-group tab-pane active') //#31768 Add active class to all firstly
        .data('group', g);

        a.on('click', function (e) {
          (0, _jquery2.default)('.tab-pane').not(tab).hide().removeClass('active');
          //       if (options.pickerShrink){
          //           tab.css({
          //              height: options.tabPaneSmall + "px",
          //            });
          //        }
          var drop = (0, _jquery2.default)('.emoji-dropup');
          if ('group_people_body' === id) {
            drop.show();
          } else {
            drop.hide();
          }
          tab.addClass('active').show();
          e.preventDefault();
        });
        tabs.append(tab);
      };

      for (var g in _EmojiUtil2.default.groups) {
        _loop(g);
      }
      //  emoji filters------------------------------------------------
      var filters = (0, _jquery2.default)('<div>').addClass('emoji-filters');
      var howmany = 1;
      for (var f in _EmojiUtil2.default.filters) {
        // f - key of the Emoji.filters
        if ('skin' === f || 'gender' === f) {
          howmany = 2;
        } else {
          howmany = 1;
        }

        var _loop2 = function _loop2(i) {
          tmpid = f + i.toString();

          var dropup = (0, _jquery2.default)('<div>').addClass('emoji-dropup').attr('id', tmpid);
          if (i == 1) {
            dropup.css("pointer-events", "none");
          } else {
            dropup.css("pointer-events", "auto");
          }
          var dropbtn = (0, _jquery2.default)('<div>').addClass('emoji-dropbtn').html(_EmojiUtil2.default.filters[f].i).data('mode', _EmojiUtil2.default.FILTER_BUTTON).attr('id', 'd' + tmpid);
          dropup.append(dropbtn);
          var dropcont = (0, _jquery2.default)('<div>').addClass('emoji-dropup-content');
          _EmojiUtil2.default.arrfil[tmpid] = '';

          var _loop3 = function _loop3(em) {
            var a = (0, _jquery2.default)('<a>').html(_EmojiUtil2.default.filters[f][_EmojiUtil2.default.EMOJI_LIST][em].i).attr('title', _EmojiUtil2.default.filters[f][_EmojiUtil2.default.EMOJI_LIST][em].n).data('mode', _EmojiUtil2.default.filters[f][_EmojiUtil2.default.EMOJI_LIST][em].m);
            a.on('click', function (e) {
              if (a.data('mode').indexOf(_EmojiUtil2.default.FILTER_BASKET) + 1) {
                if (dropbtn.data('mode') !== _EmojiUtil2.default.FILTER_BUTTON) dropbtn.html(dropbtn.data('mode'));
                dropbtn.attr('title', '');
                dropbtn.data('mode', _EmojiUtil2.default.FILTER_BUTTON);
              } else {
                if (dropbtn.data('mode') === _EmojiUtil2.default.FILTER_BUTTON) {
                  dropbtn.data('mode', dropbtn.html());
                }
                dropbtn.html(a.html());
                dropbtn.attr('title', a.attr('title'));
              }
              if (a.data('mode') === _EmojiUtil2.default.FILTER_BASKET) {
                _EmojiUtil2.default.arrfil[dropup.attr('id')] = '';
              } else {
                _EmojiUtil2.default.arrfil[dropup.attr('id')] = a.data('mode');
              }
              dropup.mouseover(function () {
                dropcont.show();
              }); //#31769 To show drop-up content
              dropup.mouseout(function () {
                dropcont.hide();
              }); //#31769 To hide drop-up content
              dropup.click(function () {
                dropcont.hide();
              }); //#31769 To hide drop-up content

              switch (dropup.attr('id')) {
                case 'skin0':
                  if (_EmojiUtil2.default.arrfil[dropup.attr('id')] !== '') {
                    (0, _jquery2.default)('#skin1').css("pointer-events", "auto");
                    (0, _jquery2.default)('#hair0').css("pointer-events", "auto");
                    (0, _jquery2.default)('#gender0').css("pointer-events", "none");
                  } else {
                    (0, _jquery2.default)('#skin1').css("pointer-events", "none");
                    (0, _jquery2.default)('#gender0').css("pointer-events", "auto");
                    (0, _jquery2.default)('#hair0').css("pointer-events", "auto");
                    _EmojiUtil2.default.arrfil['skin1'] = '';
                    var butt = (0, _jquery2.default)('#dskin1');
                    if (butt.data('mode') !== _EmojiUtil2.default.FILTER_BUTTON) {
                      butt.html(butt.data('mode'));
                      butt.data('mode', _EmojiUtil2.default.FILTER_BUTTON);
                    }
                  }
                  break;

                case 'skin1':
                  if (_EmojiUtil2.default.arrfil[dropup.attr('id')] !== '') {
                    (0, _jquery2.default)('#hair0').css("pointer-events", "none");
                    (0, _jquery2.default)('#gender0').css("pointer-events", "none");
                    (0, _jquery2.default)('#gender1').css("pointer-events", "none");
                  } else {
                    (0, _jquery2.default)('#hair0').css("pointer-events", "auto");
                  }
                  break;

                case 'hair0':
                  if (_EmojiUtil2.default.arrfil[dropup.attr('id')] !== '') {
                    (0, _jquery2.default)('#skin0').css("pointer-events", "auto");
                    (0, _jquery2.default)('#skin1').css("pointer-events", "none");
                    (0, _jquery2.default)('#gender0').css("pointer-events", "none");
                    (0, _jquery2.default)('#gender1').css("pointer-events", "none");
                  } else {
                    (0, _jquery2.default)('#skin0').css("pointer-events", "auto");
                    if (_EmojiUtil2.default.arrfil["skin0"] !== '') {
                      (0, _jquery2.default)('#gender0').css("pointer-events", "none");
                    } else {
                      (0, _jquery2.default)('#gender0').css("pointer-events", "auto");
                    }
                  }
                  break;

                case 'gender0':
                  if (_EmojiUtil2.default.arrfil[dropup.attr('id')] !== '') {
                    (0, _jquery2.default)('#skin0').css("pointer-events", "none");
                    (0, _jquery2.default)('#skin1').css("pointer-events", "none");
                    (0, _jquery2.default)('#hair0').css("pointer-events", "none");
                    (0, _jquery2.default)('#gender1').css("pointer-events", "auto");
                  } else {
                    (0, _jquery2.default)('#gender1').css("pointer-events", "none");
                    (0, _jquery2.default)('#skin0').css("pointer-events", "auto");
                    (0, _jquery2.default)('#hair0').css("pointer-events", "auto");
                    _EmojiUtil2.default.arrfil['gender1'] = '';
                    var butt = (0, _jquery2.default)('#dgender1');
                    if (butt.data('mode') !== _EmojiUtil2.default.FILTER_BUTTON) {
                      butt.html(butt.data('mode'));
                      butt.data('mode', _EmojiUtil2.default.FILTER_BUTTON);
                    }
                  }
                  break;

                case 'gender1':
                  if (_EmojiUtil2.default.arrfil[dropup.attr('id')] !== '') {
                    (0, _jquery2.default)('#skin0').css("pointer-events", "none");
                    (0, _jquery2.default)('#skin1').css("pointer-events", "none");
                    (0, _jquery2.default)('#hair0').css("pointer-events", "none");
                  } else {
                    (0, _jquery2.default)('#gender1').css("pointer-events", "none");
                    (0, _jquery2.default)('#gender0').css("pointer-events", "auto");
                  }
                  break;
                default:
                  break;
              }

              var template = '';
              if (_EmojiUtil2.default.arrfil['skin0'] !== '') template = template + _EmojiUtil2.default.arrfil['skin0'] + '_';
              if (_EmojiUtil2.default.arrfil['skin1'] !== '') template = template + _EmojiUtil2.default.arrfil['skin1'] + '_';
              if (_EmojiUtil2.default.arrfil['hair0'] !== '') template = template + _EmojiUtil2.default.arrfil['hair0'] + '_';
              if (_EmojiUtil2.default.arrfil['gender0'] !== '') template = template + _EmojiUtil2.default.arrfil['gender0'] + '_';
              if (_EmojiUtil2.default.arrfil['gender1'] !== '') template = template + _EmojiUtil2.default.arrfil['gender1'] + '_';
              template = template.length > 0 ? template.slice(0, template.length - 1) : template;

              (0, _jquery2.default)('#group_people_body a').each(function (i, el) {
                var $el = (0, _jquery2.default)(el);
                var curIcon = $el.html();

                if (!!!$el.data('icon')) {
                  $el.data('icon', curIcon);
                }
                var oldIcon = $el.data('icon');
                if (template !== '') {
                  var curFilters = template.split('_');
                  curFilters.unshift(template);
                  for (var j = 0; j < curFilters.length; j++) {
                    var futureIcon = _EmojiUtil2.default.mode[curFilters[j]][_EmojiUtil2.default.EMOJI_LIST][oldIcon];
                    if (!!futureIcon && futureIcon !== curIcon) {
                      $el.data('filter', curFilters[j]);
                      $el.html(futureIcon);
                      break;
                    } else {
                      if (curFilters[0].indexOf($el.data('filter')) === -1) {
                        $el.data('filter', '');
                        $el.html(oldIcon);
                        break;
                      }
                    }
                  }
                } else {
                  $el.html(oldIcon);
                  $el.data('filter', '');
                }
              });
              e.preventDefault();
            });
            dropcont.append(a);
          };

          for (var em in _EmojiUtil2.default.filters[f][_EmojiUtil2.default.EMOJI_LIST]) {
            _loop3(em);
          }
          dropup.append(dropcont);
          filters.append(dropup);
        };

        for (var i = 0; i < howmany; i++) {
          var tmpid;

          _loop2(i);
        }
      }
      //-----------------------------------------------------------------
      tabs.find('.tab-pane').not(':first-child').hide().removeClass('active');
      this.$p.append(ul).append(tabs).append(filters);
      var drop = (0, _jquery2.default)('.emoji-dropup');
      drop.hide();
      return tabs.children();
    }
  }, {
    key: 'selectItem',
    value: function selectItem(mode) {
      if (typeof this.cb === 'function') {
        alert(mode);
        this.cb(mode);
      }
    }

    // this is to show the emojis directly

  }, {
    key: 'loadEmojis',
    value: function loadEmojis(tabs) {
      var _this2 = this;

      var i = 0;
      for (var g in _EmojiUtil2.default.groups) {
        // g - key of the Emoji.groups
        var group = _EmojiUtil2.default.groups[g];
        var _tab = tabs[i];
        for (var sg in _EmojiUtil2.default.groups[g][_EmojiUtil2.default.EMOJI_LIST]) {
          var _loop4 = function _loop4(emo) {
            var emojiobj = _EmojiUtil2.default.groups[g][_EmojiUtil2.default.EMOJI_LIST][sg][_EmojiUtil2.default.EMOJI_LIST][emo];
            var emojiElem = (0, _jquery2.default)('<a>').data('icon', emo).html(emo).attr('title', emojiobj.n).on('click', function () {
              _this2.insertEmoji(emojiElem, _this2.o);
            });
            //         if (emojiElem.html().length>3){
            //           emojiElem.addClass('double');
            //         }
            (0, _jquery2.default)(_tab).append(emojiElem);
          };

          for (var emo in _EmojiUtil2.default.groups[g][_EmojiUtil2.default.EMOJI_LIST][sg][_EmojiUtil2.default.EMOJI_LIST]) {
            _loop4(emo);
          }
        }
        i++;
      }
    }

    // this is to show the subgroups
    //  loadEmojis(tabs) {
    //    let i=0;
    //    for (let g in Emoji.groups) {   // g - key of the Emoji.groups
    //      let group = Emoji.groups[g];
    //      let tab = tabs[i];
    //      for (let sg in Emoji.groups[g][Emoji.EMOJI_LIST]) {
    //        let subgroup = group[Emoji.EMOJI_LIST][sg];
    //        let emojiElem = $('<a>')
    //          .data('emoji', sg)
    //          .html(Emoji.groups[g][Emoji.EMOJI_LIST][sg].i)
    //          .on('click', () => {this.insertEmoji(sg, this.o)});  // ?????
    //        $(tab).append(emojiElem);
    //      }
    //      i++;
    //    }
    //  }

  }, {
    key: 'insertEmoji',
    value: function insertEmoji(emoji, options) {
      if (typeof this.cb === 'function') this.cb(emoji.html(), options);
      if (options.hideOnSelect) {
        this.hide();
      }
    }
  }, {
    key: 'reposition',
    value: function reposition(anchor, options) {
      if (!anchor || anchor.length === 0) return;

      var $anchor = (0, _jquery2.default)(anchor);
      var pickerH = options.heightBig;
      var pickerh = options.heightSmall;
      var pickerW = options.pickerWidth;
      var $emojwrap = $anchor.parent();
      var emojwrapOFF = $emojwrap.offset();

      var winW = (0, _jquery2.default)(window).width();
      var winH = (0, _jquery2.default)(window).height();

      var $target = (0, _jquery2.default)(options.input);
      var targetOFF = $target.offset();
      var targetW = $target.width();
      var targetH = $target.outerHeight(false);
      var targetLeft = targetOFF.left;
      var targetTop = targetOFF.top;
      var pickerLeft = -pickerW;

      if (options.anchorButton) {
        targetTop = $anchor.offset().top;
        targetH = $anchor.outerHeight(false);
        pickerLeft = ($emojwrap.width() - pickerW) / 2;
      }

      //    if (targetLeft<pickerW){
      pickerLeft = -targetW - 26;
      //       pickerLeft = 0;        //For demo page ONLY! URGENT!!
      //   }else{
      //       pickerLeft = ($emojwrap.width()-pickerW)/2;
      //    }

      switch (options.place) {
        case 'top':
          //        var pickerTop = - pickerh-(emojwrapOFF.top-targetTop)-30;
          var pickerTop = -options.heightBig - 30 - (targetH - $emojwrap.height()) / 2;
          options.pickerShrink = false;
          break;

        case 'bottom':
          var pickerTop = targetTop + targetH - emojwrapOFF.top;
          options.pickerShrink = false;
          break;

        case 'center':
          pickerLeft = ($emojwrap.width() - pickerW) / 2;
          var pickerTop = targetTop + targetH - emojwrapOFF.top;
          var toBottom = winH - targetH - targetTop;
          if (toBottom < pickerH + 32) {
            if (toBottom < pickerh + 32) {
              pickerTop = -pickerh - (emojwrapOFF.top - targetTop) - 30;
            }
            options.pickerShrink = true;
          } else {
            options.pickerShrink = false;
          }
          break;

        default:
          var pickerTop = targetTop + targetH - emojwrapOFF.top;
          var toBottom = winH - targetH - targetTop;
          if (toBottom < pickerH + 32) {
            if (toBottom < pickerh + 32) {
              pickerTop = -pickerh - (emojwrapOFF.top - targetTop) - 30;
            }
            options.pickerShrink = true;
          } else {
            options.pickerShrink = false;
          }
          break;
      }

      this.$p.css({
        top: pickerTop.toFixed(0) + "px",
        left: pickerLeft.toFixed(0) + "px"
      });
      if (options.pickerShrink) {
        this.$p.css({
          height: options.heightSmall + "px"
        });
      } else {
        this.$p.css({
          height: options.heightBig + "px"
        });
      }
    }
  }, {
    key: 'show',
    value: function show(insertCallback, anchor, options) {
      this.cb = insertCallback;
      this.reposition(anchor, options);
      this.$p.attr('data-picker-type', options.type); // $.data() here not possible, doesn't change dom

      if (options.pickerShrink) {
        (0, _jquery2.default)('.tab-pane').css({
          height: options.heightSmall - 32 + "px"
        });
      } else {
        (0, _jquery2.default)('.tab-pane').css({
          height: options.heightBig - 32 + "px"
        });
      }

      this.$p.show();
      return this;
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.$p.hide();
    }
  }, {
    key: 'isVisible',
    value: function isVisible() {
      return this.$p.is(':visible');
    }
  }]);

  return EmojiPicker;
}();

exports.default = EmojiPicker;


EmojiPicker.globalPicker = null;

EmojiPicker.show = function (insertCallback, anchor) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _EmojiArea2.default.DEFAULTS;

  var picker = EmojiPicker.globalPicker;
  if (!options.globalPicker) picker = new EmojiPicker(options);
  if (!picker) picker = EmojiPicker.globalPicker = new EmojiPicker(options);
  picker.show(insertCallback, anchor, options);
  return picker;
};

EmojiPicker.isVisible = function () {
  return EmojiPicker.globalPicker && EmojiPicker.globalPicker.isVisible();
};

EmojiPicker.hide = function () {
  !EmojiPicker.globalPicker || EmojiPicker.globalPicker.hide();
};

var KEY_ESC = 27;
var KEY_TAB = 9;

/***/ })
/******/ ]);
//# sourceMappingURL=jquery.smartemoji.js.map