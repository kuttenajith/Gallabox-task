// Redux:
const ADD = 'ADD';
const EDIT = 'EDIT';
const DELETE = 'DELETE';

const createMessage = message => {
  return {
    type: ADD,
    message: message
  };

};
const editMessage = (index, message) => {
  return {
    type: EDIT,
    index: index,
    message: message
  };

};
const deleteMessage = index => {
  return {
    type: DELETE,
    index: index
  };

};

const stuffReducer = (state = [], action) => {
  let copyState = [...state];
  switch (action.type) {
    case ADD:
      return [...state, action.message];
      break;
    case EDIT:
      copyState[action.index] = action.message;
      return copyState;
      break;
    case DELETE:
      copyState.splice(action.index, 1);
      return copyState;
      break;
    default:
      return state;
  }

};

const store = Redux.createStore(stuffReducer);
class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.submitMessage = this.submitMessage.bind(this);
  }

  handleChange(event) {
    this.setState({
      input: event.target.value
    });

  }
  handleKeyPress(event) {
    if (event.key === "Enter") {
      this.submitMessage();
    }
  }
  submitMessage() {
    if (this.state.input === "") {
      return;
    }
    this.props.submitNewMessage(this.state.input);
    this.setState({
      input: ''
    });

  }

  render() {
    return (
      React.createElement("div", { id: "task" },
        React.createElement("label", { id: "taskTitle", for: "basic-input" },
          React.createElement("h2", { className: "taskheader" }, "Add and play with the some stuffs here...")),

        React.createElement("div", { id: "taskCreate", className: "input-group" },
          React.createElement("input", {
            id: "basic-input", className: "form-control", type: "text",
            placeholder: "Enter some stuff here...",
            value: this.state.input,
            onChange: this.handleChange,
            onKeyPress: this.handleKeyPress
          }),
          React.createElement("div", { className: "input-group-append" },
            React.createElement("button", {
              className: "btn btn-outline-primary",
              onClick: this.submitMessage
            }, "Create"))),
        this.props.messages.length > 0 ?
          React.createElement(List, {
            messages: this.props.messages,
            editExistingMessage: this.props.editExistingMessage,
            deleteExistingMessage: this.props.deleteExistingMessage
          }) :
          React.createElement(NoList, null)));
  }
};
const List = props => {
  return (
    React.createElement("div", { id: "toDoList" },
      React.createElement("label", { for: "basic-input" },
        React.createElement("span", { className: "stuffList" }, "Stuffs you created")),
      React.createElement("div", { className: "list-group" },
        props.messages.map((x, i) => {
          let rand = Math.floor(Math.random() * 10000 + 1);
          let key = "id" + i + "" + rand;
          return (
            React.createElement(ListItem, {
              key: key, text: x, index: i,
              edit: props.editExistingMessage,
              delete: props.deleteExistingMessage
            }));
        }))));
};

const NoList = () => {
  return (
    React.createElement("div", { id: "toDoList", className: "d-flex align-items-center justify-content-center" },
      React.createElement("p", { className: "text-muted text-monospace mt-5 col-12 text-center" }, "Make your stack full!")));
};

class ListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemInput: this.props.text
    };

    this.itemInputChange = this.itemInputChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.editItem = this.editItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }

  handleKeyPress(event) {
    if (event.key === "Enter") {
      this.editItem();
    }
  }


  itemInputChange(event) {
    this.setState({
      itemInput: event.target.textContent
    });

  }

  editItem() {
    if (this.state.itemInput === "") {
      this.setState({
        itemInput: this.props.text
      });

      return;
    }
    this.props.edit(this.props.index, this.state.itemInput);
  }

  deleteItem() {
    this.props.delete(this.props.index);
  }


  render() {
    return (
      React.createElement("a", {
        className: "list-group-item list-group-item-action d-flex justify-content-between",
        href: "#", draggable: "false"
      },
        React.createElement("span", {
          contenteditable: "true",
          value: this.state.itemInput,
          onInput: this.itemInputChange,
          onKeyPress: this.handleKeyPress
        },
          this.props.text),

        React.createElement("div", { className: "btn-group btn-group-sm d-flex col-4", role: "group" },
          React.createElement("button", {
            className: "btn btn-primary", type: "button",
            onClick: this.editItem
          }, "Edit"),


          React.createElement("button", {
            className: "btn btn-primary", type: "button",
            onClick: this.deleteItem
          }, "Delete"))));
  }
}

const mapStateToProps = state => {
  let _state = localStorage.state ? localStorage.state : state;
  return { messages: _state };
};

const mapDispatchToProps = dispatch => {
  return {
    submitNewMessage: message => {
      dispatch(createMessage(message));
    },
    editExistingMessage: (index, message) => {
      dispatch(editMessage(index, message));
    },
    deleteExistingMessage: index => {
      dispatch(deleteMessage(index));
    }
  };

};

const Provider = ReactRedux.Provider;
const connect = ReactRedux.connect;

const Container = connect(mapStateToProps, mapDispatchToProps)(Task);

class App extends React.Component {
  render() {
    return (
      React.createElement(Provider, { store: store },
        React.createElement(Container, null)));
  }
};

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));