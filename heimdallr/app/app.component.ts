import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of as ObservableOf } from 'rxjs';

import * as jwt from 'jsonwebtoken';
import {map, filter} from 'rxjs/operators';
import { DummyService } from './dummy.service';

@Component({
    selector: 'ng2app',
    templateUrl: './app.component.html',
    styles: [require('./app.component.scss')],
})
export class AppComponent {
    constructor(
        // private router: Router,
        // private route: ActivatedRoute,
        private dummy: DummyService,
    ) {}

    // private token$ = this.route.queryParams.pipe(
    //     map(params => params.get('token')),
    // );

    private token$: Observable<string> = ObservableOf('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaWQiOjkwNjAyNzkyLCJjbiI6IlZpZGR5aSBEdWtpbWEiLCJzaWQiOiJVWjY5Qnc0Q2JBcEx0cm9IWC8vOFczbGRqQzg5NmNndnYyZ2l6SGNORE5aek1uZmE5L1loUXE2MDJWcC8rMTdnVEF5bjYzbEdaeWkzVGUrZDNadEU0QT09IiwiZXhwIjoxNTI5NTA5OTE1LCJpYXQiOjE1Mjk0MjM1MTUsImlzcyI6ImhlaW1kYWxsckAwLjAuMSJ9.awYP0Pd4u_jZIktJ7YQgCbteEw2PYJA0r5ch5PFiLkY');

    private tokenIsSet$ = this.token$.pipe(
        map(token => !!token),
    );

    private decodedToken$ = this.token$.pipe(
        filter(token => !!token),
        map(token => <{[k:string]: string}>jwt.decode(token)),
    );

    private characterName$ = this.decodedToken$.pipe(
        map(token => token['cn']),
    );

    ngOnInit() {
        this.token$.subscribe(t => console.log('token$', t));
        this.tokenIsSet$.subscribe(t => console.log('tokenIsSet$', t));
        this.decodedToken$.subscribe(t => console.log('decodedToken$', t));
        this.characterName$.subscribe(t => console.log('characterName$', t));
    }
}