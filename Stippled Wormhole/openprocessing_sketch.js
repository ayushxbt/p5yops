$OP = window.$OP ?? {};
$OP.init = function () {
	// the max length of nest objects displayed in console
	this.CONSOLE_OBJECT_NEST_LENGTH = 5;

	//flag that is set if the sketch is a looping sketch
	this.OP_ISLOOPINGSKETCH = null;

	//define if OP is served on OpenProcessing
	this.isOnOP = location.hostname.slice(-18) == 'openprocessing.org';

	let self = this;

	if (!this.isOnOP) {
		return;
	}

	//unhandledrejection default handler. This is overridden when stacktrace is later.
	window.addEventListener("unhandledrejection", function (err) {
		window.onerror("Uncaught error, most likely a file couldn't be loaded. Check the spelling of the filenames.", '', '', '', err);
	});

	//add keyboard shortcut support
	self.addScript($OP.baseURL("assets/js/vendor/mousetrap-master/mousetrap.min.js"), function () {
		//wait until load so that keyboardshortcuts and mousetrap is loaded
		self.addScript($OP.baseURL("assets/js/sketch/sketch_keyboardShortcuts.mjs?version=1234"), function (res) {
			self.setupKeys();
		}, true);
	});

	// }
	//add loop protect
	self.addScript('/assets/js/vendor/loop-protect-v1.0.1.min.js');

	//add stacktrace, then error handling
	self.addScript('/assets/js/vendor/node_modules/stacktrace-js/dist/stacktrace.min.js', function () {
		window.addEventListener("unhandledrejection", function (err) {
			try {
				StackTrace.fromError(err.reason)
					.then(function (stackArray) {
						// console.log(err.reason.message, stackArray);
						$OP.throwCustomError(err.reason.message, stackArray)
					})
					.catch(function () {
						$OP.throwCustomError("Uncaught error, most likely a file couldn't be loaded. Check the spelling of the filenames.")
					});
			} catch (err) {
				window.onerror("Uncaught error, most likely a file couldn't be loaded. Check the spelling of the filenames.", '', '', '', err); // call
			}
		});

		window.onerror = function (msg, url, lineNumber, columnNo, error) {
			let simpleError = [];
			if (typeof $OP.sketchConfig != 'undefined') {
				//see if a simple error that can directly be operated on
				//eg. typing "if*" throws unexpected identifier error, which stacktrace doesn't trace for some reason
				simpleError = $OP.sketchConfig.codeObjects.filter(function (co) {
					return co.url && co.url.indexOf(url) > -1 //is URL in the provided code?
				});
			}
			if (simpleError.length > 0) {
				$OP.throwCustomError(msg, [
					{
						'fileName': url,
						'columnNumber': columnNo,
						'lineNumber': lineNumber
					}
				]);
			} else { //last option
				StackTrace.fromError(error)
					.then(function (stackArray) {
						// console.log(msg, url, lineNumber, columnNo, error, error.stack, stackArray);
						$OP.throwCustomError(msg, stackArray)
					})
					.catch(function (err) {
						// stack couldn't be generated, simply display the message.
						$OP.throwCustomError(msg, [{
							'fileName': url,
							'columnNumber': columnNo,
							'lineNumber': lineNumber
						}]);
					});
			}
		}
	});

	$OP.setupMessages();

	//relay console functions to OP console
	$OP.hijackConsole();

	//prevent bounce on touch devices
	window.document.ontouchmove = function (event) {
		event.preventDefault();
	}
	window.addEventListener("load", function () {
		$OP.callParentFunction('sketchReady');
	});

}

$OP.setupMessages = function () {
	window.addEventListener("message", function (event) {
		let messageType = event.data.messageType;
		let data = null;
		try {
			data = JSON.parse(event.data.message);
		} catch (error) {
			data = null;
		}
		switch (messageType) {
			case 'OPC_update':
				if (typeof OPC !== 'undefined') {
					OPC.set(data.name, data.value);
				}
				break;
			case 'OPC_buttonPressed':
				if (typeof OPC !== 'undefined') {
					OPC.buttonPressed(data.name, data.value);
				}
				break;
			case 'OPC_buttonReleased':
				if (typeof OPC !== 'undefined') {
					OPC.buttonReleased(data.name, data.value);
				}
				break;
			case 'reload':
				window.location.reload();
				break;
			case 'muteSketch':
				let audioCtx = window.getAudioContext ? window.getAudioContext() : false;
				if (audioCtx && data == false) {
					audioCtx.resume();
				} else if (audioCtx && data == true) {
					audioCtx.suspend();
				}
				break;
			case 'giveSketchFocus':
				$OP.giveSketchFocus();
				break;
			case 'pauseSketch':
				$OP.pauseSketch(data);
				break;
			case 'keepAudioOff':
				$OP.keepAudioOff();
				break;
			case 'takeScreenshot':
				if (window.Mousetrap && $OP && $OP.keyboardShortcuts)
					Mousetrap.unbind($OP.keyboardShortcuts.takeScreenshot.bind);
				$OP.takeScreenshot();
				break;
			case 'prepScreenshot':
				//prepping r key
				if (window.Mousetrap && $OP && $OP.keyboardShortcuts) {
					Mousetrap.bind($OP.keyboardShortcuts.takeScreenshot.bind, function (e) {
						$OP.takeScreenshot();
						Mousetrap.unbind($OP.keyboardShortcuts.takeScreenshot.bind);
						return false;
					});
				}
				break;
			case 'prepRecording':
				if (window.Mousetrap && $OP && $OP.keyboardShortcuts){
					Mousetrap(window).bind($OP.keyboardShortcuts.takeScreenshot.bind, function (e) {
						//e.preventDefault();
						$OP.callParentFunction('toggleGIF', null);
						return true;
					});
				}			
				break;
			case 'userAuthorized':
				if (typeof $OP.userInfoAuthorized == 'function') { //legacy
					$OP.userInfoAuthorized(data);
				} else {
					OpenProcessing.userAuthorized(data); //resolves the promise
				}
				break;
			case 'recordGIF':
				$OP.recordGIF();
				break;
			case 'recordVideo':
				$OP.recordVideo(data.mime, data.extension, data.quality);
				break;
			case 'stopRecording':
				$OP.stopRecording(data);
				break;
			case 'updateDeviceOrientation':
				try { //on sketch reload, event is sent while p5 and instand still not created. 
					OpenProcessing.deviceMotionAuthorized(data); //resolve promise
					p5.instance._ondeviceorientation(data);
				} catch (error) {
					//probably p5 is not ready yet.
				}
				break;
			case 'updateDeviceMotion':
				try { //on sketch reload, event is sent while p5 and instand still not created. 
					OpenProcessing.deviceMotionAuthorized(data); //resolve promise
					p5.instance._ondevicemotion(data);
				} catch (error) {
					//probably p5 is not ready yet.
				}
				break;
			default:
				break;
		}
	});
}


//quick script added
$OP.addScript = function (url, onloadF = function () { }, module = false) {
	//order below is important
	let sc = document.createElement('script')
	sc.setAttribute("type", "text/javascript")
	sc.setAttribute("crossorigin", "anonymous")
	sc.setAttribute("language", "javascript")
	if (module) sc.setAttribute("type", "module");
	document.getElementsByTagName("head")[0].appendChild(sc);
	sc.onload = onloadF;
	sc.setAttribute("src", url);
}

//uses sidekick.js to ask for user info
$OP.askUserInfo = function (data) {
	this.addScript("https://cdn.jsdelivr.net/gh/msawired/OpenProcessing-Sidekick@latest/sidekick.js", function () {
		window.OpenProcessing.requestUserInfo(data);
	})
}

$OP.hijackConsole = function () {
	let self = this;
	let _log = console.log,
		_error = console.error,
		_clear = console.clear;

	console.log = function () {
		for (let i = 0; i < arguments.length; i++) {
			$OP.callParentFunction('showMessage', {
				'msg': arguments[i],
				'noLineBreak': false, //line break only on the last one
				'class': 'log'
			});
		}

		return _log.apply(console, arguments);
	};
	console.info = function () {
		for (let i = 0; i < arguments.length; i++) {
			$OP.callParentFunction('showMessage', {
				'msg': arguments[i],
				'noLineBreak': false, //line break only on the last one
				'class': 'info'
			});
		}

		return _log.apply(console, arguments);
	};
	console.warn = function () {
		for (let i = 0; i < arguments.length; i++) {
			$OP.callParentFunction('showMessage', {
				'msg': arguments[i],
				'noLineBreak': false, //line break only on the last one
				'class': 'warning'
			});
		}

		return _log.apply(console, arguments);
	};



	var callback = function (stackframes) {
		// not sure if below is working...
		$OP.throwCustomError(stackframes);
	};

	console.error = function () {
		for (let i = 0; i < arguments.length; i++) {
			let arg = arguments[i];
			StackTrace.get()
				.then(function (stackArray) {
					$OP.throwCustomError(arg, stackArray)
				})
				.catch(self.throwCustomError);
		}
		return _error.apply(console, arguments);
	};
	console.clear = function () {
		$OP.callParentFunction('clearConsole');
		return _clear.apply(console, arguments);
	};
}

$OP.getEchoServerURL = function (roomID = 0) {
	return `//echo.openprocessing.org:30000?sketch=${roomID}`;
}

$OP.makeTransmittable = function (obj, nestCounter = 0) {
	//go through object values and make them transmittable to parent
	switch (typeof obj) {
		case 'object':
			if (nestCounter == $OP.CONSOLE_OBJECT_NEST_LENGTH) {
				return 'Object (too many nested objects, can not display)';
			} else {
				//typeof null == 'object' so check for null first
				if (obj == null) {
					return null
				};

				//create shallow copy of the object/array, to prevent any updated attributes by nesting effecting parent objects.
				//e.g. jane.self = jane;
				obj = Array.isArray(obj) ? Array.from(obj) : Object.assign({}, obj);

				// iterate over object attributes
				nestCounter++;
				let keys = Object.keys(obj);
				for (let key in keys) {
					obj[keys[key]] = $OP.makeTransmittable(obj[keys[key]], nestCounter);
				}
				return obj;
			}
			break;
		case 'function':
			return obj.toString().substring(0, 25) + '…';
			break;
		default:
			return obj;
			break;

	}


}
OP_makeTransmittable = $OP.makeTransmittable; //fallback support for old OPC versions.

$OP.setupAudioContext = function () {
	let audioCtxInterval = window.setInterval(function () {
		let audioCtx = window.getAudioContext ? window.getAudioContext() : false;

		if (audioCtx) {
			audioCtx.onstatechange = function () {
				// console.log('Audio state change', this.state);
				switch (this.state) {
					case "suspended":
						$OP.callParentFunction('showSpeaker', false);
						break;

					case "closed":
						$OP.callParentFunction('hideSpeaker', true);
						break;

					default:
						$OP.callParentFunction('showSpeaker', true);
						break;
				}
			}
			audioCtx.onstatechange();
			window.clearInterval(audioCtxInterval);
		}
	},
		1000);
}();

$OP.callParentFunction = function (functionName, arg = {}) {
	//this.console.log(arg);
	// below might fail if arg can not be cloned to be sent over.
	// console.profile('callParentFunction');
	try {
		//try sending as is
		window.parent.postMessage({
			'messageType': functionName,
			'message': $OP.makeTransmittable(arg, 0)
		}, '*');

	} catch (error) {
		// console.log('datacloneerror?', error);
		let lineNumber = null;
		if (error.stack && error.stack.split('about:srcdoc:').length > 1) {
			lineNumber = error.stack.split('about:srcdoc:')[1].split(':')[0];
		}
		// console.log(error);
		let err = {
			'msg': '' + error,
			'url': null,
			'lineNumber': lineNumber,
			'columnNo': null,
			'error': ''//JSON.stringify(error)
		}
		$OP.callParentFunction('showError', err);
	}
	// console.profileEnd('callParentFunction');

}

$OP.getCanvas = function () {
	let canvas = document.getElementById('pjsCanvas');
	if (!canvas) {
		canvas = document.getElementsByClassName('p5Canvas');
		canvas = canvas.length > 0 ? canvas[0] : false;
	}
	if (!canvas) {
		//just take the first one if still not found. e.g. custom canvas implementations like /sketch/776984
		canvas = document.getElementsByTagName('canvas');
		canvas = canvas.length > 0 ? canvas[0] : false;
	}
	return canvas;
}


$OP.takeScreenshot = function () {
	//try pjs first
	let canvas = $OP.getCanvas();
	try {
		let context = canvas.getContext('2d');
		let imageData;

		if (context) { //paint background to white in case it is transparent
			// from: https://stackoverflow.com/questions/32160098/change-html-canvas-black-background-to-white-background-when-creating-jpg-image

			//cache height and width        
			let w = canvas.width;
			let h = canvas.height;

			//get the current ImageData for the canvas.
			let data = context.getImageData(0, 0, w, h);

			//store the current globalCompositeOperation
			let compositeOperation = context.globalCompositeOperation;

			//set to draw behind current content
			context.globalCompositeOperation = "destination-over";

			//set background color
			context.fillStyle = '#FFFFFF';

			//draw background / rect on entire canvas
			context.fillRect(0, 0, w, h);

			//get the image data from the canvas
			// imageData = canvas.toDataURL("image/jpeg", 0.9);
			imageData = canvas.toDataURL("image/jpeg", 0.9);


			//clear the canvas
			context.clearRect(0, 0, w, h);

			//restore it with original / cached ImageData
			context.putImageData(data, 0, 0);

			//reset the globalCompositeOperation to what it was
			context.globalCompositeOperation = compositeOperation;

		} else {
			imageData = canvas.toDataURL("image/jpeg", 0.9);
		}
		$OP.callParentFunction('updateScreenshot', imageData);
	} catch (e) {
		// console.error(e); //dont do this, it prints to sketchConsole.
		//TODO: ask user to upload manually instead.
	}
}
$OP.pauseSketch = function (bool = null) {
	try {
		if (typeof p5 != 'undefined') {
			if (bool === false) {
				//unpause only if it is originally a looping sketch
				if (OP_ISLOOPINGSKETCH && !p5.instance.isLooping()) {
					p5.instance.loop();
				}
			} else { //pause sketch, either on bool = true or bool = null
				if (p5.instance.isLooping()) {
					OP_ISLOOPINGSKETCH = true;
					p5.instance.noLoop();
				}

				//stop audio
				try {
					if (p5.instance.getAudioContext().state == 'running') {
						p5.instance.getAudioContext().close();
					}
				} catch (e) {
					//ignore
				}
			}

		}
		if (typeof Processing != 'undefined') {
			bool === true ? Processing.getInstanceById('pjsCanvas').noLoop() : Processing.getInstanceById('pjsCanvas').loop();
		}

	} catch (e) {

	}
}

$OP.keepAudioOff = function () {
	window.setInterval(function () {
		//stop audio
		try {
			if (p5.instance.getAudioContext().state == 'running') {
				p5.instance.getAudioContext().close();
			}
		} catch (e) {
			//ignore
		}
	}, 1000);

}


$OP.scriptLoadError = function (el) {
	$OP.throwCustomError(el.src + ' can not be loaded. Please make sure resource exists and it supports cross-domain requests.');
}
//add onerror to existing scripts before they load
let scripts = document.getElementsByTagName('script');
for (const sc of scripts) {
	sc.onerror = $OP.scriptLoadError;
	sc.setAttribute("onerror", "$OP.scriptLoadError(this)")
}

$OP.throwCustomError = function (msg, stackArray = []) {
	// console.log('$OP.throwCustomError', msg, stackArray);


	let OP_error = {
		'msg': msg,
		'stackArray': stackArray, //array of error stack items { 'title': 'mySketch', url: 'as23sser3-...', lineNumber: 2} 
	};

	//filter out internal files
	OP_error.stackArray = OP_error.stackArray.filter(function (st) {
		return st.fileName.indexOf('sketch_preview.js') == -1 && st.fileName.indexOf('stacktrace.min.js') == -1
	})

	//TODO move below to sketch_engine.js and make it work without $OP.sketchConfig
	//find relevant code references in the rest
	OP_error.stackArray.forEach(stackArray => {
		try {
			//see if the stack url is in the provided codeObjects
			let co = $OP.sketchConfig.codeObjects.filter(function (co) {
				return co.url && co.url.indexOf(stackArray.fileName) > -1
			});
			stackArray.title = co.length > 0 ? co[0].title : null;
			stackArray.codeID = co.length > 0 ? co[0].codeID : null;

			//while at it, adjust line number by removing any loopProtect extras
			if (stackArray.codeID !== null) {
				//loopProtect adds two new lines for every two "loopProtect.protect" occurences
				let codeUntilError = co[0].code.split('\n').slice(0, stackArray.lineNumber).join('\n');
				let noOfLoopProtect = (codeUntilError.match(/loopProtect.protect/g) || []).length;
				noOfLoopProtect -= noOfLoopProtect % 2; //make it every other loop
				stackArray.lineNumber -= noOfLoopProtect;
			}
		} catch (error) {
			//ignore
		}

	});

	//note that error is a weird object. May look empty, but error.stack is full.
	$OP.callParentFunction('showError', OP_error);

	console.groupEnd();
}


$OP.giveSketchFocus = function () { //this is run by iframe_giveFocus.js. That js loaded if runSketch(..,true) is called.
	let c = document.getElementsByTagName("canvas");
	// this.console.log(document.activeElement);

	if (c.length > 0) {
		c[0].setAttribute('tabindex', 0);
		c[0].focus();
		if (this.document.activeElement == c[0] && $OP.giveSketchFocusInterval) {
			// this.console.log(document.activeElement);
			window.clearInterval($OP.giveSketchFocusInterval);
		}
	}
	// window.addEventListener("keydown", function (e) {
	// not sure if this helps at all.  !no, it takes focus away from p5.dom input fields
	// c[0].focus();
	// });


}

//below is not used anywhere?
$OP.setupLoopProtection = function () {
	// sketch.loopProtect = sketch.createdOn > "2018-10-08";
	window.loopProtect.hit = function (b) {
		//OP override
		var c = 'Exiting potential infinite loop. To disable loop protection, add "//noprotect" to the end of the line.';
		let error = new Error(c, '', b);
		let err = {
			'msg': c,
			'url': '',
			'lineNumber': b,
			'columnNo': '',
			'error': JSON.stringify(error)
		}
		$OP.callParentFunction('showError', err);
	}
}

$OP.setupKeys = function () {
	if (!window.Mousetrap) {
		console.log('Mousetrap not found. Skipping key setup.');
		return;
	}
	if (!$OP.keyboardShortcuts) {
		console.log('keyboardShortcuts not found. Skipping key setup.');
		return;
	}
	//fullscreen
	Mousetrap.bind($OP.keyboardShortcuts.fullscreen.bind, function (e) {
		$OP.callParentFunction('mousetrap', $OP.keyboardShortcuts.fullscreen.bind);
		return false;
	});
	//save
	Mousetrap.bind($OP.keyboardShortcuts.save.bind, function (e) {
		$OP.callParentFunction('mousetrap', $OP.keyboardShortcuts.save.bind);
		return false;
	});
	//exit fullscreen
	Mousetrap.bind('escape', function (e) {
		$OP.callParentFunction('mousetrap', 'escape');
		return false;
	});

	//play
	Mousetrap.bind($OP.keyboardShortcuts.play.bind, function (e) {
		$OP.callParentFunction('mousetrap', $OP.keyboardShortcuts.play.bind);
		return false;
	});
	//code
	Mousetrap.bind($OP.keyboardShortcuts.code.bind, function (e) {
		$OP.callParentFunction('mousetrap', $OP.keyboardShortcuts.code.bind);
		return false;
	});
	//settings
	Mousetrap.bind($OP.keyboardShortcuts.settings.bind, function (e) {
		$OP.callParentFunction('mousetrap', $OP.keyboardShortcuts.settings.bind);
		return false;
	});
	//layout
	Mousetrap.bind([$OP.keyboardShortcuts.layout.bind], function (e) {
		$OP.callParentFunction('mousetrap', $OP.keyboardShortcuts.layout.bind);
		return false;
	});
	Mousetrap.bind('space', function (e) {
		$OP.callParentFunction('mousetrap', 'space');
	});
}


//---RECORDER FUNCTIONS----
$OP.videoRecorder = null;
$OP.stopRecording = function (type) {
	if (type == 'video' && $OP.videoRecorder) {
		$OP.videoRecorder.stop();
	} else if (type == 'GIF' && window.gif) {
		window.clearInterval(window.GIFframer);
		window.gif.recording = false;
		window.gif.render();
	}
}
$OP.recordGIF = function (fps = 60) {
	// console.log('GIF init');

	window.gif = new GIF({
		workers: 2,
		quality: 8,
		repeat: 0,
		debug: false, //TODO update url below
		workerScript: 'https://preview-local.openprocessing.org/assets/js/vendor/gif.js-master/dist/gif.worker.js'
	});

	window.gif.recording = true;
	window.GIFframer = window.setInterval(function () {
		// console.log('adding frame');
		if (window.gif.recording) {
			window.gif.addFrame($OP.getCanvas(), {
				delay: 1000 / fps,
				copy: true
			});
		}
	}, 1000 / fps);

	window.gif.on('progress', function (p) {
		return $OP.callParentFunction('recordingRenderProgress', p);
	});
	window.gif.on('finished', function (blob) {
		window.clearInterval(window.GIFframer);
		//allow download 
		// let src = URL.createObjectURL(blob);
		//setupEditSketchPanel();
		// updateGIF(src);
		console.log('finished');
		window.uploadRecording(blob, 'gif');
	});
}
$OP.recordVideo = function (mime, extension, quality) { //vps and aps is in MB
	// console.log(mime,extension,quality);
	let vidBPS = 32000000 * quality; //~3.8MB per sec
	// let audBPS = 4000000*quality;
	let fps = quality > 0.5 ? 30 : 25;
	let canvas = $OP.getCanvas();
	var videoStream = canvas.captureStream(fps);
	$OP.videoRecorder = new MediaRecorder(videoStream, {
		mimeType: mime,
		bitsPerSecond: vidBPS
	});

	var chunks = [];
	$OP.videoRecorder.ondataavailable = function (e) {
		chunks.push(e.data);
	};

	$OP.videoRecorder.onstop = function (e) {
		$OP.callParentFunction('videoUploading');
		var blob = new Blob(chunks, {
			mimeType: mime,
			bitsPerSecond: vidBPS
		});
		if (blob.size == 0) {
			$OP.callParentFunction('showAjaxError', {
				'msg': 'Recording is empty. MediaRecorder requires that you have "draw" function that paints something on canvas to be able to record.'
			});
		} else {
			chunks = [];
			$OP.uploadRecording(blob, extension);
		}
	};

	$OP.videoRecorder.start();
}
$OP.uploadRecording = function (blob, extension) {
	//do not use callParentFunction, as it reduces the blob to something else.
	window.parent.postMessage({
		'messageType': 'recordingReady',
		'message': {blob,extension}
	}, '*');
}
$OP.baseURL = function (uri = '') {
	let loc = window.location.hostname;
	//remove preview
	if (loc.includes('openprocessing.org')) {
		loc = loc.replace('preview-', '');
		return `https://${loc}/${uri}`;
	} else {
		return 'https://openprocessing.org/' + uri //set to main domain
	}
}
$OP.init();