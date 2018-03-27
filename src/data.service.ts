import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map, catchError } from 'rxjs/operators';
import { Series } from './interfaces';

@Injectable()
export class DataService {
    constructor(private http: HttpClient) {}

    /* Retrieve all series in our database */
    getAllSeries(): Observable<Series[]> {
        return this.http.get<Series[]>('/api/get')
            .pipe(
                map(series => {
                    return series as Series[];
        }));
    }
    addShow(show){
        return this.http.post('/api/post', show);
    }
    removeShow(show) {
        // console.log("Remove show clicked!");
        return this.http.get("/api/delete/"+ show.show);
    }

    updateShow(show, primaryShow){
        return this.http.post('/api/update/' + primaryShow, show);
    }

    private handleError(error: HttpErrorResponse) {
        console.error('Error: ', error);
        if (error.error instanceof Error) {
            return Observable.throw(error.error.message);
        }
        return Observable.throw(error || 'Node error');
    }
}
