import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FAQCategoryInterface } from './faq-category.interface';
import { faqs } from './faqs';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  standalone: false,
})
export class FaqComponent {
  faqCategories: FAQCategoryInterface[];
  selectedCategory: FAQCategoryInterface;

  constructor(titleService: Title) {
    titleService.setTitle('AGEEI - FAQ');
    this.faqCategories = faqs;
    this.selectedCategory = this.faqCategories[0];
  }

  selectCategory(category: FAQCategoryInterface): void {
    this.selectedCategory = category;
  }
}
