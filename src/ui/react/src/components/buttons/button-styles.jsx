(function () {
    'use strict';

    /**
     * The ButtonStyles class provides functionality for styling a selection with a list of
     * configurable and customizable styles. The allowed styles follow CKEDITOR.Style configuration
     * (http://docs.ckeditor.com/#!/api/CKEDITOR.style)
     *
     * @class ButtonStyles
     */
    var ButtonStyles = React.createClass({
        // Allows validating props being passed to the component.
        propTypes: {
            /**
             * The editor instance where the component is being used.
             *
             * @property {Object} editor
             */
            editor: React.PropTypes.object.isRequired,

            /**
             * Indicates whether the styles list is expanded or not.
             *
             * @property {Boolean} expanded
             */
            expanded: React.PropTypes.bool,

            /**
             * The label that should be used for accessibility purposes.
             *
             * @property {String} label
             */
            label: React.PropTypes.string,

            /**
             * List of the styles the button is able to handle.
             *
             * @property {Array} styles
             */
            styles: React.PropTypes.arrayOf(React.PropTypes.object),

            /**
             * The tabIndex of the button in its toolbar current state. A value other than -1
             * means that the button has focus and is the active element.
             *
             * @property {Number} tabIndex
             */
            tabIndex: React.PropTypes.number,

            /**
             * Callback provided by the button host to notify when the styles list has been expanded.
             *
             * @property {Function} toggleDropdown
             */
            toggleDropdown: React.PropTypes.func
        },

        // Lifecycle. Provides static properties to the widget.
        statics: {
            /**
             * The name which will be used as an alias of the button in the configuration.
             *
             * @static
             * @property {String} key
             * @default styles
             */
            key: 'styles'
        },

        /**
         * Lifecycle. Returns the default values of the properties used in the widget.
         *
         * @method getDefaultProps
         * @return {Object} The default properties.
         */
        getDefaultProps: function () {
            return {
                label: AlloyEditor.Strings.styles,
                styles: [
                    {
                        name: AlloyEditor.Strings.h1,
                        style: {
                            element: 'h1'
                        }
                    },
                    {
                        name: AlloyEditor.Strings.h2,
                        style: {
                            element: 'h2'
                        }
                    },
                    {
                        name: AlloyEditor.Strings.formatted,
                        style: {
                            element: 'pre'
                        }
                    },
                    {
                        name: AlloyEditor.Strings.cite,
                        style: {
                            element: 'cite'
                        }
                    },
                    {
                        name: AlloyEditor.Strings.code,
                        style: {
                            element: 'code'
                        }
                    }
                ]
            };
        },

        /**
         * Lifecycle. Renders the UI of the button.
         *
         * @method render
         * @return {Object} The content which should be rendered.
         */
        render: function() {
            var activeStyle = AlloyEditor.Strings.normal;

            this.props.styles.forEach(function(item) {
                if (this._checkActive(item.style)) {
                    activeStyle = item.name;
                }
            }.bind(this));

            var buttonStylesList;

            if (this.props.expanded) {
                buttonStylesList = <AlloyEditor.ButtonStylesList editor={this.props.editor} onDismiss={this.props.toggleDropdown} styles={this.props.styles} />
            }

            return (
                <div className="alloy-editor-container-styles alloy-editor-has-dropdown">
                    <button aria-expanded={this.props.expanded} aria-label={this.props.label + ' ' + activeStyle} className="alloy-editor-toolbar-element" onClick={this.props.toggleDropdown} role="combobox" tabIndex={this.props.tabIndex} title={this.props.label + ' ' + activeStyle}>
                        <div className="alloy-editor-container">
                            <span className="alloy-editor-selected-style">{activeStyle}</span>
                            <span className="alloy-editor-icon-arrow"></span>
                        </div>
                    </button>
                    {buttonStylesList}
                </div>
            );
        },

        /**
         * Checks if the given style definition is applied to the current selection in the editor.
         *
         * @protected
         * @method _checkActive
         * @param {Object} styleConfig Style definition as per http://docs.ckeditor.com/#!/api/CKEDITOR.style.
         * @return {Boolean} Returns true if the style is applied to the selection, false otherwise.
         */
        _checkActive: function(styleConfig) {
            var nativeEditor = this.props.editor.get('nativeEditor');

            // Styles with wildcard element (*) won't be considered active by CKEditor. Defaulting
            // to a 'span' element works for most of those cases with no defined element.
            styleConfig = CKEDITOR.tools.merge({element: 'span'}, styleConfig);

            var style = new CKEDITOR.style(styleConfig);

            return style.checkActive(nativeEditor.elementPath(), nativeEditor);
        }
    });

    AlloyEditor.Buttons[ButtonStyles.key] = AlloyEditor.ButtonStyles = ButtonStyles;
}());