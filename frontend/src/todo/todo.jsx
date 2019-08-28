import React, { Component } from 'react'
import PageHeader from '../template/pageHeader'
import TodoForm from './todoForm'
import TodoList from './todoList'
import axios from 'axios';

const URL = 'http://localhost:3003/api/todos'

export default class Todo extends Component {


    constructor(props) {
        super(props)
        this.state = { description: '', list: [] }

        this.handleAdd = this.handleAdd.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.handleMarkAsDone = this.handleMarkAsDone.bind(this)
        this.handleMarkAsPending = this.handleMarkAsPending.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.handleClear = this.handleClear.bind(this)
        this.refresh()
    }

    refresh(description = '') {
        const search = description ? `&description__regex=/${description}/` : ''
        axios.get(`${URL}?sort=-createdAt${search}`)
            .then(resp => this.setState({...this.state, description, list: resp.data}))
    }

    handleSearch(){
        this.refresh(this.state.description)
    }
    handleAdd() {
        const description = this.state.description
        axios.post(URL, { description })
            .then((resp) => {
                console.log('Post description done')
                this.refresh()

            })
    }

    handleChange(e) {
        this.setState({ ...this.state, description: e.target.value })
    }

    handleRemove(todo) {
        axios.delete(`${URL}/${todo._id}`)
            .then(res => this.refresh(this.state.description))
    }

    handleMarkAsDone(todo) {
        axios.put(`${URL}/${todo._id}`, { ...todo, done: true })
            .then(res => this.refresh(this.state.description))
    }

    handleMarkAsPending(todo) {
        axios.put(`${URL}/${todo._id}`, { ...todo, done: false })
            .then(res => this.refresh(this.state.description))
    }


    handleClear(){
        this.refresh();
    }
    render() {
        return (
            <div>
                <PageHeader name='Tarefas' small='Cadastro'></PageHeader>
                <TodoForm 
                    description={this.state.description}
                    handleSearch = {this.handleSearch}
                    handleChange={this.handleChange}
                    handleAdd={this.handleAdd}
                    handleClear={this.handleClear}
                />
                <TodoList 
                    handleMarkAsDone={this.handleMarkAsDone} 
                    handleMarkAsPending={this.handleMarkAsPending} 
                    handleRemove={this.handleRemove} 
                    list={this.state.list} />
            </div>
        )
    }
}