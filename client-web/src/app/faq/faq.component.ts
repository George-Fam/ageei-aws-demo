import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FAQCategory } from './faq-category';
import { faqs } from './faqs';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent {
  faqCategories: FAQCategory[];
  selectedCategory: FAQCategory;

  constructor(titleService: Title) {
    titleService.setTitle('AGEEI - FAQ');
    this.faqCategories = faqs;
    this.selectedCategory = this.faqCategories[0];
  }

  selectCategory(category: FAQCategory): void {
    this.selectedCategory = category;
  }
}
