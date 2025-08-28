import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  todos: Todo[] = [];
  newTodoTitle: string = '';
  isLoading: boolean = false;

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.loadTodos();
  }

  // Load danh sách Todo
  loadTodos(): void {
    this.isLoading = true;
    this.todoService.getAllTodos().subscribe({
      next: (todos) => {
        this.todos = todos;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading todos:', error);
        this.isLoading = false;
      }
    });
  }

  // Thêm mới Todo
  addTodo(): void {
    if (this.newTodoTitle.trim()) {
      const newTodo = {
        title: this.newTodoTitle.trim(),
        isDone: false
      };

      this.todoService.createTodo(newTodo).subscribe({
        next: (todo) => {
          this.todos.push(todo);
          this.newTodoTitle = '';
        },
        error: (error) => {
          console.error('Error creating todo:', error);
        }
      });
    }
  }

  // Toggle trạng thái hoàn thành
  toggleTodo(todo: Todo): void {
    const updatedTodo = { ...todo, isDone: !todo.isDone };

    this.todoService.updateTodo(todo.id, updatedTodo).subscribe({
      next: (updated) => {
        const index = this.todos.findIndex(t => t.id === todo.id);
        if (index !== -1) {
          this.todos[index] = updated;
        }
      },
      error: (error) => {
        console.error('Error updating todo:', error);
      }
    });
  }

  // Xóa Todo
  deleteTodo(id: number): void {
    this.todoService.deleteTodo(id).subscribe({
      next: () => {
        this.todos = this.todos.filter(todo => todo.id !== id);
      },
      error: (error) => {
        console.error('Error deleting todo:', error);
      }
    });
  }

  // Đếm số task chưa hoàn thành
  get pendingTodos(): number {
    return this.todos.filter(todo => !todo.isDone).length;
  }

  // TrackBy function để tối ưu performance
  trackByTodo(index: number, todo: Todo): number {
    return todo.id;
  }
}