import { Component, NgZone, OnInit } from '@angular/core';
import { Series } from '../interfaces';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  editBool: boolean = false;
  editId: number = -1;
  primaryShow: string = "";
  series: Series[];
  show;

  constructor(private dataService: DataService, private http: HttpClient, private zone: NgZone) {
    this.show = {
      id: '',
      show: '',
      seasons: '',
      type: ''
    };
  }

  ngOnInit() {
    this.refreshTheList();
  }
  // Gets all the series and refreshes the list
  refreshTheList() {
    console.log("Refreshig the list.");
    this.dataService.getAllSeries().subscribe((series: Series[]) => {
      this.series = series;
      /* Log the result of the getAllSeries() */
      console.log(series);
    });
  }

  // Removes a specific show passed as a parameter
  removeShow(show) {
    this.dataService.removeShow(show).subscribe(res => {
      console.log(res)
    }, err => {
      console.log(err);
    });
    this.refreshTheList();
  }

  // Adds a new show to the DB
  addShow() {
    if (this.show.show.trim() != "") this.dataService.addShow(this.show)
      .subscribe(res => {
        console.log(res);
      },
      err => {
        console.log(err);
      }
      );
    this.refreshTheList();
  }

  
  editShow(i, show) {
    this.editBool = true;
    this.editId = i;
    this.primaryShow = show;
  }

  // Updates a show document in the DB
  saveShow(s) {
    this.editBool = false;
    this.editId = -1;
    this.dataService.updateShow(s, this.primaryShow).subscribe(res => {
      console.log(res);
    },
      err => {
        console.log(err);
      });
      this.primaryShow = "";
  }
}
