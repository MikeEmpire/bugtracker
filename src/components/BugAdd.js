export default class BugAdd extends React.Component {
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
