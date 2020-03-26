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
/******/ 	var hotCurrentHash = "790fd45b473a3ff37932"; // eslint-disable-line no-unused-vars
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
        var parsed = this.replaceAscii(val);
        parsed = this.replaceAliases(parsed);
        if (parsed !== val) {
          var sel = parsed.length - (val.length - this.$ti[0].selectionEnd);
          this.$ti.val(parsed);
          this.$ti[0].setSelectionRange(sel, sel);
          this.textSel = { start: sel, end: sel };
          this.$ti.focus().trigger(this.o.inputEvent);
        }
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
        } else if (e.nodeType === 3) {
          // text node
          // replace unicodes
          var parsed = e.nodeValue;

          if (_this.o.type !== 'unicode') {
            //convert existing unicodes
            parsed = _this.replaceUnicodes(parsed);
          }

          parsed = _this.replaceAscii(parsed);
          parsed = _this.replaceAliases(parsed);

          if (parsed !== e.nodeValue) {
            var isSelected = _this.htmlSel && _this.htmlSel.endContainer === e;
            var range = isSelected ? _this.htmlSel : document.createRange();
            var caret = _this.htmlSel ? e.nodeValue.length - _this.htmlSel.endOffset : 0;
            var next = e.nextSibling;
            range.selectNode(e);
            _this.replaceSelection(parsed, range, null);
            if (isSelected) {
              if (next.previousSibling) {
                var inserted = next.previousSibling;
                range.setStart(inserted, inserted.length - caret);
                range.setEnd(inserted, inserted.length - caret);
                //this.htmlSel.setStartAfter(content[content.length - 1]);
                //this.htmlSel.collapse(false);
              } else {
                range.setStartBefore(_this.$e[0].lastChild);
                range.setEndBefore(_this.$e[0].lastChild);
              }
            }
          }
        }
      });
    }
  }, {
    key: 'replaceUnicodes',
    value: function replaceUnicodes(text) {
      var _this2 = this;

      return text.replace(this.o.unicodeRegex, function (match, unicode) {
        return _EmojiUtil2.default.checkUnicode(unicode) ? EmojiArea.createEmoji(null, _this2.o, unicode) : unicode;
      });
    }
  }, {
    key: 'replaceAscii',
    value: function replaceAscii(text) {
      var _this3 = this;

      return text.replace(this.o.asciiRegex, function (match, ascii) {
        if (_EmojiUtil2.default.checkAscii(ascii)) {
          var alias = _EmojiUtil2.default.aliasFromAscii(ascii);
          if (alias) {
            return EmojiArea.createEmoji(alias, _this3.o);
          }
        }
        return ascii + ' ';
      });
    }
  }, {
    key: 'replaceAliases',
    value: function replaceAliases(text) {
      var _this4 = this;

      return text.replace(this.o.aliasRegex, function (match, alias) {
        return _EmojiUtil2.default.checkAlias(alias) ? EmojiArea.createEmoji(alias, _this4.o) : ':' + alias + ':';
      });
    }
  }, {
    key: 'togglePicker',
    value: function togglePicker() {
      var delegate = this.picker || _EmojiPicker2.default;
      if (!delegate.isVisible()) {
        this.picker = delegate.show(this.insert.bind(this), this.$b, this.o);
      } else {
        delegate.hide();
      }
      return false;
    }
  }, {
    key: 'insert',
    value: function insert(alias) {
      var content = EmojiArea.createEmoji(alias, this.o);
      if (!this.replaceSelection(content)) {
        this.$e.append(content).focus().trigger(this.o.inputEvent);
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
      alias = alias || _EmojiUtil2.default.aliasFromUnicode(unicode);
      unicode = unicode || _EmojiUtil2.default.unicodeFromAlias(alias);
      return unicode ? unicode : alias;
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
  heightSmall: 110,
  heightBig: 243,
  pickerWidth: 210,
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
      //-----------------------------------------------------------------------------
      //    let DB = await(await fetch('./../../../emoji/emoji.en_GB.json')).json();
      //    console.log(DB); 
      //      var path = document.location;
      //       var path = unescape(document.location);
      //   alert(path);   
      //   $.get('./../../../emoji/emoji.en_GB.json')
      //	.done(data => {
      //		let parseData;
      //		try 	{
      //			parseData = JSON.parse(data);
      //            console.log(parseData);
      //		}	catch (err) {
      //			parseData = {};
      //		}
      //	});

      /*      .getJSON('ajax/test.json', function(data) {
        var items = [];
      
      //          parseData = JSON.parse(data);
      //          var obj = jQuery.parseJSON(data); 
      
        $.each(data, function(key, val) {
          items.push('<li id="' + key + '">' + val + '</li>');
        });
      
        $('<ul/>', {
          'class': 'my-new-list',
          html: items.join('')
        }).appendTo('body');
      });
      http://dev.cooladmin.net/admin/en/user.responder/free-reply/5167   */
      //-----------------------------------------------------------------------------
      var path = document.location;
      var curLang = document.documentElement.lang;
      if (curLang.length == 2) {
        curLang = 'en_US';
      }
      debugger;
      //    var fullPath = path.origin+'/emoji/emoji.'+curLang+'.json';
      var fullPath = path.origin.concat('/emoji/emo-ji.', curLang, '.json');
      var myLog = new File(fullPath);
      if (!myLog.exists()) {
        alert(fullPath);
        fullPath = path.origin.concat('/emoji/emoji.en_US.json');
      }
      $.getJSON(fullPath, function (data) {
        var k = 0,
            parseData,
            obj;

        obj = data.emoji;
        //          alert(data.emodji.value);
        $.each(obj, function (key, value) {

          //                alert(key);
          //                alert(value.n);
          //                alert(value.k);
        });
      });
      //-----------------------------------------------------------------------------     
      var dataKeys = Object.keys(EmojiUtil.data);
      for (var e = 0; e < dataKeys.length; e++) {
        var key = dataKeys[e];
        var emojiData = EmojiUtil.data[key];
        if (emojiData) {
          var code = emojiData[EmojiUtil.EMOJI_UNICODE][0];

          EmojiUtil.aliases[emojiData[EmojiUtil.EMOJI_ALIASES]] = key;
          EmojiUtil.unicodes[code] = key;
        }
      }
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
/*
EmojiUtil.data = Data.data;
EmojiUtil.groups = Data.groups;
EmojiUtil.ascii = Data.ascii;

EmojiUtil.EMOJI_UNICODE = 0;
EmojiUtil.EMOJI_ALIASES = 1; */

exports.default = EmojiUtil;
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
    setTimeout(this.loadEmojis.bind(this, tabs), 100);
  }

  _createClass(EmojiPicker, [{
    key: 'loadPicker',
    value: function loadPicker(options) {
      var _this2 = this;

      var ul = (0, _jquery2.default)('<ul>').addClass('emoji-selector nav nav-tabs');
      var tabs = (0, _jquery2.default)('<div>').addClass('tab-content');

      var _loop = function _loop(g) {
        var group = _EmojiUtil2.default.groups[g];
        var id = 'group_' + group.name;
        var gid = '#' + id;

        var a = (0, _jquery2.default)('<a>').html(_EmojiArea2.default.createEmoji(group.name, _this2.o)).data('toggle', 'tab').attr('href', gid);

        ul.append((0, _jquery2.default)('<li>').append(a));

        var tab = (0, _jquery2.default)('<div>').attr('id', id).addClass('emoji-group tab-pane active') //#31768 Add active class to all firstly
        .data('group', group.name);

        a.on('click', function (e) {
          (0, _jquery2.default)('.tab-pane').not(tab).hide().removeClass('active');
          //       if (options.pickerShrink){
          //           tab.css({  
          //              height: options.tabPaneSmall + "px",      
          //            });      
          //        }  
          tab.addClass('active').show();
          e.preventDefault();
        });
        tabs.append(tab);
      };

      for (var g = 0; g < _EmojiUtil2.default.groups.length; g++) {
        _loop(g);
      }

      tabs.find('.tab-pane').not(':first-child').hide().removeClass('active');

      this.$p.append(ul).append(tabs);
      return tabs.children();
    }
  }, {
    key: 'loadEmojis',
    value: function loadEmojis(tabs) {
      var _this3 = this;

      for (var g = 0; g < _EmojiUtil2.default.groups.length; g++) {
        var group = _EmojiUtil2.default.groups[g];
        var _tab = tabs[g];
        for (var e = 0; e < group.items.length; e++) {
          var emojiId = group.items[e];
          if (_EmojiUtil2.default.data.hasOwnProperty(emojiId)) {
            (function () {
              var word = _EmojiUtil2.default.data[emojiId][_EmojiUtil2.default.EMOJI_ALIASES] || '';
              var emojiElem = (0, _jquery2.default)('<a>').data('emoji', word).html(_EmojiArea2.default.createEmoji(word, _this3.o)).on('click', function () {
                _this3.insertEmoji(word, _this3.o);
              });
              (0, _jquery2.default)(_tab).append(emojiElem);
            })();
          }
        }
      }
    }
  }, {
    key: 'insertEmoji',
    value: function insertEmoji(emoji, options) {
      if (typeof this.cb === 'function') this.cb(emoji, options);
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

      var pickerTop = targetTop + targetH - emojwrapOFF.top;

      if (emojwrapOFF.left < pickerW) {
        pickerLeft = -emojwrapOFF.left;
      }

      var toBottom = winH - targetH - targetTop;
      if (toBottom < pickerH) {
        if (toBottom < pickerh) {
          pickerTop = -pickerh - (emojwrapOFF.top - targetTop);
        }
        options.pickerShrink = true;
      }

      this.$p.css({
        top: pickerTop.toFixed(0) + "px",
        left: pickerLeft.toFixed(0) + "px"
      });
      if (options.pickerShrink) {
        this.$p.css({
          height: options.heightSmall + "px"
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
          height: options.tabPaneSmall + "px"
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