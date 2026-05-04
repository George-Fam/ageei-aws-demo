import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FAQCategoryInterface } from './faq.interface';
import { FaqService } from './faq.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  standalone: false,
})
export class FaqComponent implements OnInit {
  faqCategories: FAQCategoryInterface[] = [];
  selectedCategory: FAQCategoryInterface | null = null;
  isLoading = true;
  hasError = false;
  private faqService = inject(FaqService);

  constructor() {
    inject(Title).setTitle('AGEEI - FAQ');
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.hasError = false;
    this.faqService.getFaqs().subscribe({
      next: (categories) => {
        this.faqCategories = categories;
        this.selectedCategory = categories[0] ?? null;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.hasError = true;
      },
    });
  }

  selectCategory(category: FAQCategoryInterface): void {
    this.selectedCategory = category;
  }
}
