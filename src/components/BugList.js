import BugFilter from './BugFilter';
import BugAdd from './BugAdd';
import axios from 'axios';

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

export default class BugList extends React.Component {
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
