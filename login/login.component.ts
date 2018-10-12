import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email   : ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login(value) {
    this.authService.doLogin(value)
      .then(() => {
        this.router.navigate(['/admin']);
      }, err => {
        this.errorMessage = err.message;
      });
  }
}
