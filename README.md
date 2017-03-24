# React Inject Change Events
This plugin allows for injecting other nodeNames into the React ChangeEventPlugin.

In other words, you can finally use onChange in your custom elements and Polymer components.

Built and tested on React 15.1.0

## Install

    npm install clubajax/react-inject-change-events --save
    
## Usage
   
Note that in the usage below, the value is accessed via `event.target.value`. React reuses an internal event and
does not by default expose the native event. 
    
    import injector from 'react-inject-change-events';
    
    // add all custom elements that have a change event
    injector(['my-custom-drop-down', 'my-custom-input']);

    onChange (event) {
        value = event.target.value
    }
    
    render(
        <my-custom-drop-down onChange={this.onChange}>
            <option value="change">Change</option>
            <option value="events">Events</option>
        </my-custom-drop-down>
    );
    
## IMPORTANT NOTE
This plugin overwrites (copies) much of the functionality of the `ChangeEventPlugin`, with the exception of
the < IE 11.0 specic code, since those browsers are deprecated.

This plugin is unofficial, and there is no guarantee that the React team won't render this useless in a future release.
In particular, the plugin it injects could be made immutable.

However, there may not be a need for this plugin in the future as the React team has this on their radar: 
[Track upcoming DOM technology upgrades #2836](https://github.com/facebook/react/issues/2836).

##LICENSE
This code is provided as-is, via the [MIT License](./LICENSE)
