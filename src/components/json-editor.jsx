import React from 'react';
import MonacoEditor from 'react-monaco-editor';

const minify = (text) => JSON.stringify(JSON.parse(text));
const prettify = (text) => JSON.stringify(JSON.parse(text), null, 2);

export class JsonEditor extends React.Component {
    constructor(props) {
        super(props);

        this.state = this.getDerivedStateFromProps(props, {
            error: false,
            content: false
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState(this.getDerivedStateFromProps(nextProps, this.state));
    }

    getDerivedStateFromProps(nextProps, prevState) {
        try {
            const minifiedCurrentContent = prevState.content && minify(prevState.content);

            if (minifiedCurrentContent !== nextProps.children) {
                return {
                    error: false,
                    content: prettify(nextProps.children)
                };
            } else {
                return {};
            }
        } catch (e) {
            return {
                error: true,
                content: nextProps.children
            };
        }
    }

    saveAndMaybeAnnounceChange = (newContent) => {
        this.setState({ content: newContent });

        try {
            newContent = minify(newContent);
        } catch (e) {
            this.setState({
                error: true
            });
            return;
        }

        if (newContent !== this.props.children) {
            this.props.onChange(newContent);
        }
    }

    shouldComponentUpdate(newProps, newState) {
        if (newState.error !== this.state.error) return true;
        if (newState.content !== this.state.content) return true;

        return false;
    }

    onEditorWillMount = (monaco) => {
        this.monaco = monaco;
    }

    onEditorDidMount = (editor) => {
        this.editor = editor;
    }

    render() {
        const options = {
            fontSize: 20,
            minimap: { enabled: false }
        };

        return <MonacoEditor
            language="json"
            value={this.state.content}
            options={options}
            requireConfig={{ url: '/vs/loader.js' }}
            onChange={this.saveAndMaybeAnnounceChange}
            editorWillMount={this.onEditorWillMount}
            editorDidMount={this.onEditorDidMount}
        />;
    }
}