'use strict';
var EventPluginRegistry = require('react/lib/EventPluginRegistry');
var isTextInputElement = require('react/lib/isTextInputElement');
var SyntheticEvent = require('react/lib/SyntheticEvent');
var EventPropagators = require('react/lib/EventPropagators');
var ReactDOMComponentTree = require('react/lib/ReactDOMComponentTree');
var EventConstants = require('react/lib/EventConstants');
var topLevelTypes = EventConstants.topLevelTypes;
var keyOf = require('fbjs/lib/keyOf');
var eventTypes = {
    change: {
        phasedRegistrationNames: {
            bubbled: keyOf({ onChange: null }),
            captured: keyOf({ onChangeCapture: null })
        },
        dependencies: [topLevelTypes.topBlur, topLevelTypes.topChange, topLevelTypes.topClick, topLevelTypes.topFocus, topLevelTypes.topInput, topLevelTypes.topKeyDown, topLevelTypes.topKeyUp, topLevelTypes.topSelectionChange]
    }
};

var acceptedNodeNames = {
    'select': true
};

function injectChangeEvents (nodeNameArray) {
    nodeNameArray.forEach(function (nodeName) {
        acceptedNodeNames[nodeName] = true;
    });
}

function shouldUseChangeEvent(elem) {
    var nodeName = elem.nodeName && elem.nodeName.toLowerCase();
    return acceptedNodeNames[nodeName] || nodeName === 'input' && elem.type === 'file';
}

function shouldUseClickEvent(elem) {
    // Use the `click` event to detect changes to checkbox and radio inputs.
    // This approach works across all browsers, whereas `change` does not fire
    // until `blur` in IE8.
    return elem.nodeName && elem.nodeName.toLowerCase() === 'input' && (elem.type === 'checkbox' || elem.type === 'radio');
}

function getTargetInstForChangeEvent(topLevelType, targetInst) {
    if (topLevelType === topLevelTypes.topChange) {
        return targetInst;
    }
}

function getTargetInstForInputEvent(topLevelType, targetInst) {
    if (topLevelType === topLevelTypes.topInput) {
        // In modern browsers (i.e., not IE8 or IE9), the input event is exactly
        // what we want so fall through here and trigger an abstract event
        return targetInst;
    }
}

function getTargetInstForClickEvent(topLevelType, targetInst) {
    if (topLevelType === topLevelTypes.topClick) {
        return targetInst;
    }
}

function extractEvents (topLevelType, targetInst, nativeEvent, nativeEventTarget) {
    var targetNode = targetInst ? ReactDOMComponentTree.getNodeFromInstance(targetInst) : window;

    var getTargetInstFunc, handleEventFunc;
    if (shouldUseChangeEvent(targetNode)) {
        getTargetInstFunc = getTargetInstForChangeEvent;

    } else if (isTextInputElement(targetNode)) {
        getTargetInstFunc = getTargetInstForInputEvent;

    } else if (shouldUseClickEvent(targetNode)) {
        getTargetInstFunc = getTargetInstForClickEvent;
    }

    if (getTargetInstFunc) {
        var inst = getTargetInstFunc(topLevelType, targetInst);
        if (inst) {
            var event = SyntheticEvent.getPooled(eventTypes.change, inst, nativeEvent, nativeEventTarget);
            event.type = 'change';
            EventPropagators.accumulateTwoPhaseDispatches(event);
            return event;
        }
    }
}
EventPluginRegistry.plugins[4].extractEvents = extractEvents;

module.exports = injectChangeEvents;