import {Injectable} from '@angular/core';

@Injectable()
export class DummyService {
    dummy() {
        console.log('dummy called');
    }
}