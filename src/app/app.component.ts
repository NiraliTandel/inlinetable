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
  userData: User[] = [];

  Country: any = [
    { name: "Russia" },
    { name: "Canada" },
    { name: "United States" },
    { name: "China" },
    { name: "Brazil" },
    { name: "Australia" },
    { name: "India" },
    { name: "Argentina" },
    { name: "Kazakhstan" },
    { name: "Sudan" }
  ]

  State: any = [
    { name: "Adygea", country: "Russia" },
    { name: "Altai", country: "Russia" },
    { name: "British Columbia", country: "Canada" },
    { name: "Washington", country: "United States" },
    { name: "New York", country: "United States" },
    { name: "Qinghai", country: "China" },
    { name: "Acre", country: "Brazil" },
    { name: "Amazonas", country: "Brazil" },
    { name: "Victoria", country: "Australia" },
    { name: "Queensland", country: "Australia" },
    { name: "Gujarat", country: "India" },
    { name: "Maharastra", country: "India" },
    { name: "Rajasthan", country: "India" },
    { name: "San Justo", country: "Argentina" },
    { name: "Karaganda", country: "Kazakhstan" },
    { name: "Kassala", country: "Sudan" },
    { name: "Gezira", country: "Sudan" }
  ]

  constructor(private fb: FormBuilder, private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit(): void {
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

  dropdownState: any = [];

  dropdownStateList(value: any) {
    this.dropdownState = this.State.filter((i: any) => i.country == value.target.value);
  }

}
