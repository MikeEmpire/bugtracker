import axios from 'axios';

class BugFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "",
      priority: ""
    }

    this.submit = this.submit.bind(this);
    this.onChangePriority = this.onChangePriority.bind(this);
    this.onChangeStatus = this.onChangeStatus.bind(this);
  }

  submit(e) {
    this.props.submitHandler({priority: this.state.priority, status: this.state.status});
  }
  onChangeStatus(e) {
    this.setState({status: e.target.value});
  }
  onChangePriority(e) {
    this.setState({priority: e.target.value});
  }

  render() {
    return (
      <div>
       <h3>Filter</h3>
        Status:
        <select value={this.state.status} onChange={this.onChangeStatus}>
          <option value="">(Any)</option>
          <option value="New">New</option>
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>
        <br/>
        Priority:
        <select value={this.state.priority} onChange={this.onChangePriority}>
          <option value="">(Any)</option>
          <option value="P1">P1</option>
          <option value="P2">P2</option>
          <option value="P3">P3</option>
        </select>
        <br/>
        <button onClick={this.submit}>Apply</button>
      </div>
    )
  }
}

class BugTable extends React.Component {
  render() {
    var bugRows = this.props.bugs.map(function(bug) {
      return <BugRow key={bug._id} bug={bug} />
    });
    return (
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Owner</th>
            <th>Title</th>
          </tr>
        </thead>
        <tbody>
          {bugRows}
        </tbody>
      </table>
    )
  }
}

class BugAdd extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.bugAdd;
    this.props.addNewBug({owner: form.owner.value, title: form.title.value, status: 'New', priority: 'P1'});
    form.owner.value = "";
    form.title.value = "";
  }
  render() {
    return (
      <div>
        <form name="bugAdd">
          <input type="text" name="owner" placeholder="Owner" />
          <input type="text" name="title" placeholder="Title" />
          <button onClick={this.handleSubmit}>Add Bug</button>
        </form>
      </div>
    )
  }
}

class BugRow extends React.Component {
  render() {
    return (
      <tr>
        <td>{this.props.bug._id}</td>
        <td>{this.props.bug.status}</td>
        <td>{this.props.bug.priority}</td>
        <td>{this.props.bug.owner}</td>
        <td>{this.props.bug.title}</td>
      </tr>
    )
  }
}

class BugList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bugs: []
    }
    this.addNewBug = this.addNewBug.bind(this);
    this.loadData = this.loadData.bind(this);
  }
  componentDidMount() {
    // axios.get(`http://localhost:3000/api/bugs`)
    //   .then(res => {
    //     this.setState({ bugs: res.data })
    //   });
    this.loadData({});
  }

  loadData(filter) {
    console.log(filter);
    axios.get(`http://localhost:3000/api/bugs?priority=${filter.priority}&status=${filter.status}`, {data: filter})
      .then(data => {
        let refinedData = data.data;
        console.log(refinedData);
        this.setState({ bugs: refinedData })
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  addNewBug(bug) {
    let bugsModified = this.state.bugs.slice();
    bug.id = this.state.bugs.length + 1;
    console.log(bug);

    axios.post('http://localhost:3000/api/bugs', {
      id: bug.id,
      priority: bug.priority,
      status: bug.status,
      owner: bug.owner,
      title: bug.title
    })
    .then(response => {
      console.log(response)
    })
    .catch(error => {
      console.log(error);
    });

    bugsModified.push(bug);
    this.setState({ bugs: bugsModified });
  }
  render() {
    return (
      <div>
        <h1>Bug Tracker</h1>
        <BugFilter submitHandler={this.loadData}/>
        <hr />
        <BugTable bugs={this.state.bugs}/>
        <hr />
        <BugAdd addNewBug={this.addNewBug}/>
      </div>
    )
  }
}

// var bugData = [
//   {id: 1, priority: 'P1', status:'Open', owner:'Ravan', title:'App crashes on open'},
//   {id: 2, priority: 'P2', status:'New', owner:'Eddie', title:'Misaligned border on panel'},
// ];

ReactDOM.render(
  <BugList/>, document.getElementById('main'));
