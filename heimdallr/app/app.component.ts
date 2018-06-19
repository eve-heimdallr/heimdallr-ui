import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import * as jwt from 'jsonwebtoken';
import {map, filter} from 'rxjs/operators';

@Component({
    selector: 'ng2app',
    template: require('./app.component.html'),
    styles: [require('./app.component.scss')],
})
export class AppComponent {
    constructor(
        private route: ActivatedRoute,
    ) {}

    private token$ = this.route.paramMap.pipe(
        map(params => params.get('token')),
    );

    private tokenIsSet$ = this.token$.pipe(
        map(token => !!token),
    )

    private decodedToken$ = this.token$.pipe(
        filter(token => !!token),
        map(token => <{[k:string]: string}>jwt.decode(token)),
    );

    private characterName$ = this.decodedToken$.pipe(
        map(token => token['cn']),
    )
}