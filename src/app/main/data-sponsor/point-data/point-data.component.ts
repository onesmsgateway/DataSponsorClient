import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from "ngx-bootstrap";

@Component({
  selector: 'app-point-data',
  templateUrl: './point-data.component.html',
  styleUrls: ['./point-data.component.css']
})
export class PointDataComponent implements OnInit {
  @ViewChild('createDataCimastModalDetail2', { static: false }) public createDataCimastModalDetail2: ModalDirective;

  constructor() { }

  ngOnInit() {
  }

}
