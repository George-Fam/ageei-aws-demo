import { Component, OnInit } from '@angular/core';
import { FAQCategory } from './faq-category';
import { faqs } from './faqs';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent implements OnInit {
  faqCategories: FAQCategory[];
  selectedCategory: FAQCategory;

  constructor() {
    this.faqCategories = faqs;
    this.selectedCategory = this.faqCategories[0];
  }

  ngOnInit(): void {}

  selectCategory(category: FAQCategory): void {
    this.selectedCategory = category;
  }
}
