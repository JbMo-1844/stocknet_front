import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bid-evaluation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bid-evaluation.component.html',
})
export class BidEvaluationComponent implements OnInit {
  ngOnInit(): void {}
}
