import { Component, HostListener, OnInit } from '@angular/core';
import { SharedService } from './components/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  innerWidth!: number;
  listView: boolean | undefined
  constructor(private sharedService: SharedService) { }
  
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;

    if (this.innerWidth < 1000) {
      this.listView = true;
    } else {
      this.listView = undefined;
    }
  }

  
  ngOnInit(): void {
    this.onResize();
    if (this.listView != undefined) {
      this.sharedService.showActiveComponent.subscribe((showComp: boolean) => {
        if (showComp != null && (showComp==true || showComp==false)) {
          this.listView = showComp;
        }
      });
    }
  }
}
