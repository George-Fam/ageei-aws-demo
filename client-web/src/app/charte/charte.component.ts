import { Component, HostListener, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CharteService } from './charte.service';
import { GitlabFileResponse } from './gitlab-file-response';

@Component({
  selector: 'app-charte',
  templateUrl: './charte.component.html',
  styleUrls: ['./charte.component.scss'],
  standalone: false,
})
export class CharteComponent implements OnInit {
  private charteService = inject(CharteService);

  charte: string;

  constructor() {
    const titleService = inject(Title);

    titleService.setTitle('AGEEI - Charte');
  }

  ngOnInit(): void {
    this.getCharte();
  }

  getCharte() {
    this.charteService.getCharte().subscribe((data: GitlabFileResponse) => {
      this.charte = this.b64DecodeUnicode(data.content);
    });
  }

  @HostListener('click', ['$event'])
  onClick(event: any): void {
    event.preventDefault();
  }

  /**
   * The atob function doesn't decode unicode caracters correctly.
   * This magic function seems to do the trick.
   * Source : https://stackoverflow.com/a/30106551
   */
  private b64DecodeUnicode(str: string) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(
      atob(str)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
  }
}
