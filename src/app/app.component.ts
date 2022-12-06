import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User } from './model/user.model';
import { UserService } from './service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'inline-table';
  userForm!: FormGroup;
  control!: FormArray;
  id!: number;
  userData: User[] = [];

  constructor(private fb: FormBuilder, private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.userForm = this.fb.group({
      users: this.fb.array([])
    });
    this.getUserData();
  }

  ngAfterOnInit() {
    this.control = this.userForm.get('users') as FormArray;
  }

  initiateForm(): FormGroup {
    return this.fb.group({
      id: [undefined],
      name: [''],
      country: [''],
      state: [''],
      isEditable: [true]
    });
  }

  get usersData() {
    const control = this.userForm.get('users') as FormArray;
    return control;
  }

  getUserData() {
    const control = this.userForm.get('users') as FormArray;
    this.userService.getUserList().subscribe(
      (result) => {
        this.userForm = this.fb.group({
          users: this.fb.array([])
        });
        this.userData = result
        result.forEach(res => {
          this.add();
        });
        this.userForm.patchValue({ users: result })
      },
      (error) => {
        console.log('Something went wrong');
      }
    );
    return control;
  }

  add() {
    const control = this.userForm.get('users') as FormArray;
    control.push(this.initiateForm());
  }

  save(group: any) {
    group.get('isEditable').setValue(false);
    if (group.value.id == undefined) {
      this.userService.createUser(group.value).subscribe(
        (result) => {
          alert('Data saved successfully');
          this.getUserData();
        },
        (error) => {
          alert('Something went wrong');
          this.getUserData();
        }
      );
    }
    else {
      this.userService.updateUser(group.value.id, group.value).subscribe(
        (result) => {
          alert('Data updated successfully');
          this.getUserData();
        },
        (error) => {
          alert('Something went wrong');
          this.getUserData();
        }
      );
    }
  }

  edit(group: any) {
    group.get('isEditable').setValue(true);
  }

  delete(id: number) {
    const control = this.userForm.get('users') as FormArray;
    control.removeAt(id);
    this.userService.deleteUser(id).subscribe(
      () => {
        alert('User Deleted');
        this.getUserData();
      },
      (error) => {
        alert('Something went wrong');
      }
    );
  }

}
