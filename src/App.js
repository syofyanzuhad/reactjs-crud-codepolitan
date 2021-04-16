import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import Members from './components/Members/Members';
import Form from './components/Form/Form';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      members: [],
      first_name: '',
      last_name : '',
      buttonDisabled : false,
      formStatus    : 'create',
      memberIdSelected: null,
    }
  }

  componentDidMount() {
    axios.get('https://reqres.in/api/users?page=1')
      .then(response => {
          this.setState({ members: response.data.data })
      })
      .catch(error => {
          console.log('error', error)
      })
  }

  inputOnchangeHandler = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }


  addMember = (url, payload) => {
    axios.post(url, payload)
      .then(response => {
        var members = [...this.state.members]
        members.push(response.data)
        this.setState({ members, buttonDisabled: false, first_name: '', last_name: '' })
      })
      .catch(error => {
        console.log(error)
      })
  }
  
  editMember = (url, payload) => {
    axios.put(url, payload)
      .then(response => {
        var members     = [...this.state.members]
        var indexMember = members.findIndex(member => member.id === this.state.memberIdSelected)

        // mengganti data yang ada dalam state members dan index yang sesuai
        members[indexMember].first_name = response.data.first_name
        members[indexMember].last_name  = response.data.last_name
        this.setState({ 
          members, 
          buttonDisabled: false, 
          first_name: '', 
          last_name: '',
          formStatus: 'create' 
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  onSubmitHandler = (e) => {
    console.log('form di submit')
    e.preventDefault()
    this.setState({ buttonDisabled: true })
    var payload = {
      first_name: this.state.first_name,
      last_name: this.state.last_name
    }

    var url = 'https://reqres.in/api/users'
    if (this.state.formStatus == 'create') {
      this.addMember(url, payload)
    } else {
      // url untuk form edit
      url = `https://reqres.in/api/users/${this.state.memberIdSelected}`
      this.editMember(url, payload)
    }
  }

  editButtonHandler = (member) => {
    this.setState({
        first_name  : member.first_name,
        last_name   : member.last_name, 
        formStatus  : 'edit',
        memberIdSelected: member.id,
    })
  }

  deleteButtonHandler = (id) => {
    var url = `https://reqres.in/api/users/${id}`
    axios.delete(url)
      .then(response => {
        if(response.status === 204) {
          var members = [...this.state.members]
          var index = members.findIndex(member => member.id === id)
          members.splice(index, 1)
          this.setState({ members })
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  render() {
    return (
      <div className="container">
        <h1>Codepolitan DevSchool</h1>
        <div className="row">
          <div className="col-md-6" style={{ border: '1px solid black'}}>
            <h2>Member</h2>
            <Members
              members={this.state.members}
              editButtonClick={(member) => this.editButtonHandler(member)}  
              deleteButtonClick={(id) => this.deleteButtonHandler(id)}
            />
          </div>
          <div className="col-md-6" style={{ border: '1px solid black'}}>
            <h2>Form {this.state.formStatus}</h2>
            <Form
              onSubmitForm={this.onSubmitHandler}
              onChange={this.inputOnchangeHandler}
              first_name={this.state.first_name}
              last_name={this.state.last_name}
              buttonDisabled={this.state.buttonDisabled}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default App;
